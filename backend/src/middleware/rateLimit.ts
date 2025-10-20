import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate Limiter personalizado com mensagens em português
 */
const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
  skipSuccessfulRequests = false
) => {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(windowMs / 1000 / 60), // em minutos
        timestamp: new Date(),
      });
    },
  });
};

/**
 * Rate Limiter Geral
 * 100 requests por 15 minutos por IP
 */
export const generalRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  100,
  'Muitas requisições. Tente novamente em alguns minutos.'
);

/**
 * Rate Limiter para Autenticação (Login/Signup)
 * 5 tentativas por 15 minutos por IP
 * Mais restritivo para prevenir brute force attacks
 */
export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  5,
  'Muitas tentativas de login. Tente novamente em 15 minutos.',
  true // Skip contagem em requisições bem-sucedidas
);

/**
 * Rate Limiter para APIs Sensíveis
 * 30 requests por 15 minutos por IP
 * Para rotas que modificam dados críticos (DELETE, UPDATE de usuários, etc)
 */
export const sensitiveApiRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  30,
  'Limite de requisições sensíveis atingido. Tente novamente em alguns minutos.'
);

/**
 * Rate Limiter para Exportação de Relatórios
 * 10 exports por 15 minutos por IP
 * Relatórios consomem mais recursos do servidor
 */
export const exportRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  10,
  'Limite de exportações atingido. Tente novamente em alguns minutos.'
);

/**
 * Rate Limiter para Endpoints de Listagem
 * 200 requests por 15 minutos por IP
 * Mais permissivo para GET requests de listagem
 */
export const listingRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  200,
  'Muitas requisições de listagem. Tente novamente em alguns minutos.'
);

/**
 * Rate Limiter para Cálculos Financeiros
 * 50 requests por 15 minutos por IP
 * Cálculos podem ser computacionalmente intensivos
 */
export const calculationRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  50,
  'Limite de cálculos atingido. Tente novamente em alguns minutos.'
);
