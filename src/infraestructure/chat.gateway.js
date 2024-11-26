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

      try {
        result = await createMessage(message, socket.handshake.auth.username);
      } catch (err) {
        console.log(err);
      }

      io.emit('chat-message', `${socket.handshake.auth.username}: ${message}`, result.lastInsertRowid.toString());
    });

    if (!socket.recovered) {
      try {
        const messages = await getMessages(socket.handshake.auth.serverOffset ?? 0);

        messages.forEach((row) => {
          socket.emit('chat-message', `${row.user}: ${row.content}`, row.id.toString());
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
