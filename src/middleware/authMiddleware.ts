import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

// Estendendo a interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        login: string;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acesso requerido.' 
    });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(403).json({ 
      error: 'Token inválido ou expirado.' 
    });
  }

  req.user = {
    id: decoded.id,
    login: decoded.login
  };

  next();
}

// Middleware opcional - continua mesmo sem token
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = {
        id: decoded.id,
        login: decoded.login
      };
    }
  }

  next();
}
