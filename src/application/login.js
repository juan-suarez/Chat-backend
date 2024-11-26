import bcrypt from 'bcryptjs';
import { db } from "../infraestructure/dbConfig.js";
import jwt from 'jsonwebtoken'

export const login = async (email, password) => {
  try {
    const result = await db.execute({
      sql: `SELECT id, first_name, last_name, age, email, password 
            FROM users 
            WHERE email = :email`,
      args: { email }
    });

    const user = result.rows[0];
    if (!user) {
      throw new Error('Correo electrónico no registrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const token = await jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      }
    )

    return { token };

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw new Error('Error en el inicio de sesión');
  }
};
