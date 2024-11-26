import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { initDbMessages } from '../domain/messages.js';
import { initDbUsers } from '../domain/user.js';

dotenv.config();

export const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
});


export const initDb = async () => {
  try {

    await initDbMessages();
    await initDbUsers();

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database: ", error);
  }
};