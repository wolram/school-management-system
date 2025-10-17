import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import {
  // Segments
  createSegment,
  getAllSegments,
  getSegmentById,
  updateSegment,
  deleteSegment,
  // Series
  createSeries,
  getSeriesBySegment,
  getSeriesById,
  updateSeries,
  deleteSeries,
  // Classes
  createClass,
  getClassesBySeries,
  getClassById,
  updateClass,
  deleteClass,
  getAllClasses,
} from '../controllers/academicController';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// SEGMENT ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/academic/segments
 * Create new segment (ADMIN only)
 */
router.post('/segments', authMiddleware, authorize('ADMIN'), createSegment);

/**
 * GET /api/academic/segments
 * Get all segments with pagination
 */
router.get('/segments', authMiddleware, getAllSegments);

/**
 * GET /api/academic/segments/:id
 * Get segment by ID with its series and classes
 */
router.get('/segments/:id', authMiddleware, getSegmentById);

/**
 * PUT /api/academic/segments/:id
 * Update segment (ADMIN only)
 */
router.put('/segments/:id', authMiddleware, authorize('ADMIN'), updateSegment);

/**
 * DELETE /api/academic/segments/:id
 * Delete segment (ADMIN only)
 */
router.delete('/segments/:id', authMiddleware, authorize('ADMIN'), deleteSegment);

// ═══════════════════════════════════════════════════════════════
// SERIES ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/academic/series
 * Create new series (ADMIN or GERENTE)
 */
router.post('/series', authMiddleware, authorize('ADMIN', 'GERENTE'), createSeries);

/**
 * GET /api/academic/segments/:segmentId/series
 * Get all series in a segment with pagination
 */
router.get('/segments/:segmentId/series', authMiddleware, getSeriesBySegment);

/**
 * GET /api/academic/series/:id
 * Get series by ID with its classes
 */
router.get('/series/:id', authMiddleware, getSeriesById);

/**
 * PUT /api/academic/series/:id
 * Update series (ADMIN or GERENTE)
 */
router.put('/series/:id', authMiddleware, authorize('ADMIN', 'GERENTE'), updateSeries);

/**
 * DELETE /api/academic/series/:id
 * Delete series (ADMIN only)
 */
router.delete('/series/:id', authMiddleware, authorize('ADMIN'), deleteSeries);

// ═══════════════════════════════════════════════════════════════
// CLASS ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/academic/classes
 * Create new class (ADMIN or GERENTE)
 */
router.post('/classes', authMiddleware, authorize('ADMIN', 'GERENTE'), createClass);

/**
 * GET /api/academic/series/:seriesId/classes
 * Get all classes in a series with pagination
 */
router.get('/series/:seriesId/classes', authMiddleware, getClassesBySeries);

/**
 * GET /api/academic/classes
 * Get all classes in the system with pagination
 */
router.get('/classes', authMiddleware, getAllClasses);

/**
 * GET /api/academic/classes/:id
 * Get class by ID with its series and segment info
 */
router.get('/classes/:id', authMiddleware, getClassById);

/**
 * PUT /api/academic/classes/:id
 * Update class (ADMIN or GERENTE)
 */
router.put('/classes/:id', authMiddleware, authorize('ADMIN', 'GERENTE'), updateClass);

/**
 * DELETE /api/academic/classes/:id
 * Delete class (ADMIN only)
 */
router.delete('/classes/:id', authMiddleware, authorize('ADMIN'), deleteClass);

export default router;
