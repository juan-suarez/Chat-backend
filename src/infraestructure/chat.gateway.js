import { Server } from 'socket.io';
import { createMessage, getMessages } from '../domain/messages.js';

export const handleWebSocket = (server) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', async (socket) => {
    console.log('a user has connected!');

    socket.on('chat-message', async (message) => {
      let result;
      const completeMessage = `${socket.handshake.auth.username + (socket.handshake.auth.role === "admin"? "(Admin)":"")}: ${message}`
      try {
        result = await createMessage(completeMessage, socket.handshake.auth.username);
      } catch (err) {
        console.log(err);
      }

      io.emit('chat-message', completeMessage, result.lastInsertRowid.toString());
    });

    if (!socket.recovered) {
      try {
        const messages = await getMessages(socket.handshake.auth.serverOffset ?? 0);

        messages.forEach((row) => {
          socket.emit('chat-message', row.content, row.id.toString());
        });
      } catch (err) {
        console.error(err);
      }
    }

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
