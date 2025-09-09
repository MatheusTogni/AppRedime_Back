import pool from '../config/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'redime_secret';

export async function loginService(login: string, password: string) {
  try {
    const result = await pool.query(
      'SELECT id, login, senha FROM "USUARIOS" WHERE login = $1',
      [login]
    );

    const user = result.rows[0];
    if (!user) {
      return { 
        success: false, 
        error: 'Credenciais inválidas.' 
      };
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.senha);
    
    if (!isPasswordValid) {
      return { 
        success: false, 
        error: 'Credenciais inválidas.' 
      };
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        login: user.login 
      }, 
      JWT_SECRET, 
      { 
        expiresIn: '24h'
      }
    );
    
    return {
      success: true,
      token,
      message: 'Login realizado com sucesso!'
    };

  } catch (error) {
    console.error('Erro no serviço de login:', error);
    return { 
      success: false, 
      error: 'Erro interno do servidor.' 
    };
  }
}