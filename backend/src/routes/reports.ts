import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { exportRateLimiter } from '../middleware/rateLimit';
import * as reportsController from '../controllers/reportsController';

const router = Router();

// Aplicar rate limiter de exportação a todas as rotas
router.use(exportRateLimiter);

// ============================================================
// ROTAS DE EXPORTAÇÃO DE RELATÓRIOS
// ============================================================

/**
 * GET /api/reports/students/pdf
 * Exportar lista de estudantes em PDF
 * Query: ?status=ATIVO&classId=1&seriesId=2
 * Acesso: Todos os perfis autenticados
 */
router.get('/students/pdf', authMiddleware, reportsController.exportStudentsPDF);

/**
 * GET /api/reports/students/excel
 * Exportar lista de estudantes em Excel
 * Query: ?status=ATIVO&classId=1&seriesId=2
 * Acesso: Todos os perfis autenticados
 */
router.get('/students/excel', authMiddleware, reportsController.exportStudentsExcel);

/**
 * GET /api/reports/student/:id/pdf
 * Exportar relatório detalhado de um estudante em PDF
 * Acesso: Todos os perfis autenticados
 */
router.get('/student/:id/pdf', authMiddleware, reportsController.exportStudentReportPDF);

/**
 * GET /api/reports/financial/pdf
 * Exportar relatório financeiro consolidado em PDF
 * Query: ?month=1&year=2024
 * Acesso: Todos os perfis autenticados
 */
router.get('/financial/pdf', authMiddleware, reportsController.exportFinancialPDF);

/**
 * GET /api/reports/financial/excel
 * Exportar relatório financeiro em Excel
 * Query: ?month=1&year=2024
 * Acesso: Todos os perfis autenticados
 */
router.get('/financial/excel', authMiddleware, reportsController.exportFinancialExcel);

/**
 * GET /api/reports/occupancy/excel
 * Exportar relatório de ocupação de turmas em Excel
 * Acesso: Todos os perfis autenticados
 */
router.get('/occupancy/excel', authMiddleware, reportsController.exportOccupancyExcel);

export default router;
