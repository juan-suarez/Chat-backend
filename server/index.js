import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import authRoutes from '../src/infraestructure/authRoutes.js';
import { handleWebSocket } from '../src/infraestructure/chat.gateway.js';
import { initDb } from '../src/infraestructure/dbConfig.js';
import cookieParser from 'cookie-parser';
import { authenticateToken } from '../src/infraestructure/authMiddleware.js';
import cors from 'cors'

dotenv.config();
const port = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3001',  
  credentials: true,  
  allowedHeaders: ['Content-Type'],  
};

app.use(cors(corsOptions));

initDb();

app.use('/auth', authRoutes);

const server = createServer(app); //weboscket server
handleWebSocket(server);


app.get('/',authenticateToken, (req, res) => {
  res.send('<h1>app is healthy</h1>');
});

server.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
