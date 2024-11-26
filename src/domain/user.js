import { db } from "../infraestructure/dbConfig.js";
import bcrypt from 'bcryptjs';

export const initDbUsers = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        email text UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error al crear tabla de usuarios:', error);
  }
};

export const createUser = async (first_name, last_name, age, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.execute({
      sql: `INSERT INTO users (first_name, last_name, age, email, password) 
            VALUES(:first_name, :last_name, :age, :email, :password)`,
      args: { first_name, last_name, age, email, password: hashedPassword }
    });
    
    return result.id;
  } catch (error) {
    console.log(error)
    if (error.message.includes('UNIQUE constraint failed: users.email')) {
      throw new Error ('El correo electrónico ya está registrado');
    }

    throw new Error('Error creando usuario');
  }
};

export const getUserById = async (id) => {
  try {
    const results = await db.execute({
      sql: 'SELECT id, first_name, last_name, age, email, password, created_at FROM users WHERE id = :id',
      args: { id }
    });
    return results.rows[0];  // Retorna el primer usuario encontrado o undefined si no se encuentra
  } catch (error) {
    console.error('Error buscando usuario por ID:', error);
    throw new Error('Error buscando usuario por ID');
  }
};

