import { db } from "../infraestructure/dbConfig.js";

export const initDbMessages = async () => {
  try{
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        user TEXT
      )
    `);
  }catch(error) {
    console.error('Error al crear tabla de mensajes:', error);
  }
};

export const createMessage = async (content, user) => {
  try {
    const result = await db.execute({
      sql: `INSERT INTO messages (content, user) VALUES(:content, :user)`,
      args: { content, user }
    });
    return result;
  } catch (error) {
    console.error('Error inserting message: ', error);
    throw new Error('Error creating message');
  }
};

export const getMessages = async (offset = 0) => {
  try {
    const results = await db.execute({
      sql: 'SELECT id, content, user FROM messages WHERE id > ?',
      args: [offset]
    });
    return results.rows;
  } catch (error) {
    console.error('Error fetching messages: ', error);
    throw new Error('Error fetching messages');
  }
};
