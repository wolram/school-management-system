import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as priceController from '../controllers/priceController';

const router = Router();

// ============================================================
// ROTAS DE PREÇOS
// ============================================================

/**
 * POST /api/prices
 * Criar novo preço
 * Acesso: ADMIN, GERENTE
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'GERENTE']),
  priceController.createPrice
);

/**
 * GET /api/prices
 * Listar todos os preços com filtros
 * Acesso: Todos os perfis autenticados
 */
router.get(
  '/',
  authenticateToken,
  priceController.getAllPrices
);

/**
 * GET /api/prices/active
 * Buscar apenas preços ativos
 * Acesso: Todos os perfis autenticados
 */
router.get(
  '/active',
  authenticateToken,
  priceController.getActivePrices
);

/**
 * GET /api/prices/history
 * Buscar histórico de preços
 * Acesso: Todos os perfis autenticados
 */
router.get(
  '/history',
  authenticateToken,
  priceController.getPriceHistory
);

/**
 * GET /api/prices/series/:seriesId
 * Buscar preços de uma série
 * Acesso: Todos os perfis autenticados
 */
router.get(
  '/series/:seriesId',
  authenticateToken,
  priceController.getPricesBySeries
);

/**
 * GET /api/prices/:id
 * Buscar preço por ID
 * Acesso: Todos os perfis autenticados
 */
router.get(
  '/:id',
  authenticateToken,
  priceController.getPriceById
);

/**
 * PUT /api/prices/:id
 * Atualizar preço
 * Acesso: ADMIN, GERENTE
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'GERENTE']),
  priceController.updatePrice
);

/**
 * DELETE /api/prices/:id
 * Desativar preço (soft delete)
 * Acesso: ADMIN
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN']),
  priceController.deletePrice
);

export default router;
