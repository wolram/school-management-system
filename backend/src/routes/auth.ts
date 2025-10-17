import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { auditContextMiddleware } from '../middleware/audit';
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
 */
router.post('/login', loginController);

/**
 * POST /api/auth/signup
 * Criar novo usuário
 * @requires ADMIN
 */
router.post('/signup', authMiddleware, authorize('ADMIN'), signUpController);

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
 */
router.post('/change-password', authMiddleware, changePasswordController);

export default router;
