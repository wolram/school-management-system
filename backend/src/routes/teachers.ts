import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import {
  createTeacher,
  getAllTeachers,
  getActiveTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  searchTeachers,
  getTeachersByStatus,
} from '../controllers/teacherController';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// TEACHER ROUTES
// All routes require authentication and ADMIN or GERENTE role
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/teachers
 * Create new teacher (ADMIN or GERENTE)
 */
router.post('/', authMiddleware, authorize('ADMIN', 'GERENTE'), createTeacher);

/**
 * GET /api/teachers
 * Get all teachers with pagination (ADMIN or GERENTE)
 */
router.get('/', authMiddleware, authorize('ADMIN', 'GERENTE'), getAllTeachers);

/**
 * GET /api/teachers/active
 * Get only active teachers (ADMIN or GERENTE)
 */
router.get('/active', authMiddleware, authorize('ADMIN', 'GERENTE'), getActiveTeachers);

/**
 * GET /api/teachers/search
 * Search teachers by name, email or specialization (ADMIN or GERENTE)
 */
router.get('/search', authMiddleware, authorize('ADMIN', 'GERENTE'), searchTeachers);

/**
 * GET /api/teachers/status/:status
 * Get teachers by status (ADMIN or GERENTE)
 */
router.get('/status/:status', authMiddleware, authorize('ADMIN', 'GERENTE'), getTeachersByStatus);

/**
 * GET /api/teachers/:id
 * Get teacher by ID (ADMIN or GERENTE)
 */
router.get('/:id', authMiddleware, authorize('ADMIN', 'GERENTE'), getTeacherById);

/**
 * PUT /api/teachers/:id
 * Update teacher (ADMIN or GERENTE)
 */
router.put('/:id', authMiddleware, authorize('ADMIN', 'GERENTE'), updateTeacher);

/**
 * DELETE /api/teachers/:id
 * Delete teacher - soft delete (ADMIN only)
 */
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteTeacher);

export default router;
