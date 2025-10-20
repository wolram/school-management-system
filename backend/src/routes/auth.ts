import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { auditContextMiddleware } from '../middleware/audit';
import { authRateLimiter, sensitiveApiRateLimiter } from '../middleware/rateLimit';
import {
  loginController,
  signUpController,
  getMeController,
  listUsersController,
  changePasswordController,
} from '../controllers/authController';

const router = Router();

// Aplicar middleware de contexto de auditoria a todas as rotas
router.use(auditContextMiddleware);

/**
 * POST /api/auth/login
 * Fazer login com email e senha
 * @public
 * Rate limited: 5 tentativas por 15 minutos
 */
router.post('/login', authRateLimiter, loginController);

/**
 * POST /api/auth/signup
 * Criar novo usuário
 * @requires ADMIN
 * Rate limited: 30 requests por 15 minutos (sensitive)
 */
router.post('/signup', sensitiveApiRateLimiter, authMiddleware, authorize('ADMIN'), signUpController);

/**
 * GET /api/auth/me
 * Obter dados do usuário autenticado
 * @requires autenticação
 */
router.get('/me', authMiddleware, getMeController);

/**
 * GET /api/auth/users
 * Listar todos os usuários
 * @requires ADMIN
 */
router.get('/users', authMiddleware, authorize('ADMIN'), listUsersController);

/**
 * POST /api/auth/change-password
 * Alterar senha do usuário autenticado
 * @requires autenticação
 * Rate limited: 30 requests por 15 minutos (sensitive)
 */
router.post('/change-password', sensitiveApiRateLimiter, authMiddleware, changePasswordController);

export default router;
