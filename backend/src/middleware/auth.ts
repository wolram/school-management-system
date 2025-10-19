import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      token?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware de autenticação JWT
 * Valida o token presente no header Authorization
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token não fornecido',
        timestamp: new Date(),
      });
      return;
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expirado',
        timestamp: new Date(),
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
        timestamp: new Date(),
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro na autenticação',
        timestamp: new Date(),
      });
    }
  }
};

/**
 * Middleware para validar se o usuário tem um perfil específico
 */
export const authorize = (...profiles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Não autenticado',
        timestamp: new Date(),
      });
      return;
    }

    if (!profiles.includes(req.user.profile)) {
      res.status(403).json({
        success: false,
        error: 'Acesso negado. Perfil insuficiente.',
        timestamp: new Date(),
      });
      return;
    }

    next();
  };
};

/**
 * Gerar token JWT
 */
export const generateToken = (payload: JWTPayload): string => {
  const expiresIn = process.env.JWT_EXPIRE || '24h';
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verificar token JWT
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

// Aliases para compatibilidade
export const authenticateToken = authMiddleware;
export const requireRole = authorize;
