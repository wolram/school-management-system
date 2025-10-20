import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { calculationRateLimiter, exportRateLimiter } from '../middleware/rateLimit';
import * as calculationController from '../controllers/calculationController';

const router = Router();

// Aplicar rate limiter de cálculos a todas as rotas
router.use(calculationRateLimiter);

// ============================================================
// ROTAS DE CÁLCULOS FINANCEIROS
// ============================================================

/**
 * POST /api/calculations/extra-hours
 * Calcular horas extras de um dia
 * Acesso: ADMIN, GERENTE
 */
router.post(
  '/extra-hours',
  authenticateToken,
  requireRole('ADMIN', 'GERENTE'),
  calculationController.calculateExtraHours
);

/**
 * GET /api/calculations/budget/:studentId
 * Calcular orçamento mensal
 * Acesso: Todos os perfis autenticados
 */
router.get(
  '/budget/:studentId',
  authenticateToken,
  calculationController.getMonthlyBudget
);

/**
 * POST /api/calculations/simulate
 * Simular contrato com alterações
 * Acesso: ADMIN, GERENTE
 */
router.post(
  '/simulate',
  authenticateToken,
  requireRole('ADMIN', 'GERENTE'),
  calculationController.simulateContract
);

/**
 * GET /api/calculations/history/:studentId
 * Buscar histórico de horas extras
 * Acesso: Todos os perfis autenticados
 */
router.get(
  '/history/:studentId',
  authenticateToken,
  calculationController.getExtraHoursHistory
);

/**
 * GET /api/calculations/export/:studentId
 * Exportar relatório mensal
 * Acesso: Todos os perfis autenticados
 * Rate limited: 10 exports por 15 minutos
 */
router.get(
  '/export/:studentId',
  exportRateLimiter,
  authenticateToken,
  calculationController.exportMonthlyReport
);

export default router;
