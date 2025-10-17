import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentsByClass,
  getStudentsBySeries,
  updateStudent,
  changeStudentStatus,
  deleteStudent,
  addContractMatrix,
  getStudentContractMatrix,
  removeContractMatrixEntry,
  getStudentExtraHours,
  calculateExtraHoursPeriod,
  getClassComposition,
  bulkImportStudents,
} from '../controllers/studentController';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// STUDENT CRUD ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/students
 * Create new student enrollment (ADMIN, GERENTE)
 */
router.post('/', authMiddleware, authorize('ADMIN', 'GERENTE'), createStudent);

/**
 * GET /api/students
 * List all students with filters and pagination
 * Query: ?classId=xxx&seriesId=xxx&status=ATIVO&search=name&page=1&limit=50
 */
router.get('/', authMiddleware, getAllStudents);

/**
 * GET /api/students/:id
 * Get student by ID with all relationships
 */
router.get('/:id', authMiddleware, getStudentById);

/**
 * PUT /api/students/:id
 * Update student information
 */
router.put('/:id', authMiddleware, authorize('ADMIN', 'GERENTE'), updateStudent);

/**
 * PATCH /api/students/:id/status
 * Change student status (ATIVO, INATIVO, TRANSFERIDO)
 */
router.patch('/:id/status', authMiddleware, authorize('ADMIN', 'GERENTE'), changeStudentStatus);

/**
 * DELETE /api/students/:id
 * Delete student (soft delete - marks as INATIVO)
 */
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteStudent);

// ═══════════════════════════════════════════════════════════════
// STUDENTS BY CLASS/SERIES
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/classes/:classId/students
 * Get all students in a class
 */
router.get('/class/:classId/list', authMiddleware, getStudentsByClass);

/**
 * GET /api/series/:seriesId/students
 * Get all students in a series
 */
router.get('/series/:seriesId/list', authMiddleware, getStudentsBySeries);

// ═══════════════════════════════════════════════════════════════
// CONTRACT MATRIX (WEEKLY SCHEDULE)
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/students/:studentId/contracts
 * Add or update contract matrix entry (weekly schedule for one day)
 * Body: { dayOfWeek: 0-4, entryTime: "08:00", exitTime: "12:00", services: {...} }
 */
router.post('/:studentId/contracts', authMiddleware, authorize('ADMIN', 'GERENTE'), addContractMatrix);

/**
 * GET /api/students/:studentId/contracts
 * Get student weekly schedule (contract matrix)
 */
router.get('/:studentId/contracts', authMiddleware, getStudentContractMatrix);

/**
 * DELETE /api/students/:studentId/contracts/:dayOfWeek
 * Remove contract entry for specific day
 */
router.delete('/:studentId/contracts/:dayOfWeek', authMiddleware, authorize('ADMIN', 'GERENTE'), removeContractMatrixEntry);

// ═══════════════════════════════════════════════════════════════
// EXTRA HOURS (OVERAGE)
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/students/:studentId/extra-hours
 * Get student extra hours records
 */
router.get('/:studentId/extra-hours', authMiddleware, getStudentExtraHours);

/**
 * POST /api/students/:studentId/extra-hours/calculate
 * Calculate extra hours for a period
 * Body: { startDate: "2024-01-01", endDate: "2024-01-31" }
 */
router.post('/:studentId/extra-hours/calculate', authMiddleware, calculateExtraHoursPeriod);

// ═══════════════════════════════════════════════════════════════
// CLASS COMPOSITION
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/classes/:classId/composition
 * Get class composition with all active students
 */
router.get('/class/:classId/composition', authMiddleware, getClassComposition);

// ═══════════════════════════════════════════════════════════════
// BULK OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/students/bulk/import
 * Bulk import students
 * Body: { students: [{name, dateOfBirth, classId, seriesId, ...}, ...] }
 */
router.post('/bulk/import', authMiddleware, authorize('ADMIN'), bulkImportStudents);

export default router;
