import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

dotenv.config()

const port = process.env.PORT ?? 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:3001", // Reemplaza con la URL del frontend
    methods: ["GET", "POST"],
  },
});

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

await db.execute( `
  CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
  )
  `)

io.on('connection', async (socket) => {
  console.log('a user has connected!');

  // Manejar evento de chat
  socket.on('chat-message', async (message) => {
    let result;

    try {
      result= await db.execute({
        sql: ` INSERT INTO messages (content) values(:message)`,
        args: {message}
      }) 
    }catch(err) {
      console.log(err)
    }

    console.log(result.lastInsertRowid.toString())
    io.emit('chat-message', `User: ${message}`, result.lastInsertRowid.toString()); // Difundir el mensaje a todos los clientes
  });

  if (!socket.recovered) { 
    try {
      const results = await db.execute({
        sql: 'SELECT id, content FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })
      console.log(results)
      results.rows.forEach( row => {
        socket.emit('chat-message', `${socket.handshake.auth.username}: ${row.content}`, row.id.toString())
      })

    } catch (err) {
      console.error(err)
    }
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


app.get('/', (req, res) => {
  res.send('<h1>app is health</h1>');
});

server.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
