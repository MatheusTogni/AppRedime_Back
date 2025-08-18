import { Request, Response } from 'express';
import { loginService } from '../services/authService';

export async function loginController(req: Request, res: Response) {
  try {
    const { login, password } = req.body;
    
    const result = await loginService(login, password);
    
    if (!result.success) {
      return res.status(401).json({ 
        error: result.error 
      });
    }

    return res.json({
      success: true,
      token: result.token,
      message: result.message
    });
    
  } catch (error) {
    console.error('Erro no controller de login:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor.' 
    });
  }
}
