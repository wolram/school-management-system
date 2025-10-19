import { Request, Response } from 'express';
import { segmentService, seriesService, classService } from '../services/academicService';
import { segmentSchema, seriesSchema, classSchema, paginationSchema } from '../utils/validation';
import { ZodError } from 'zod';

// ═══════════════════════════════════════════════════════════════
// SEGMENT CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const createSegment = async (req: Request, res: Response) => {
  try {
    const data = segmentSchema.parse(req.body);
    const segment = await segmentService.createSegment(data);

    res.status(201).json({
      success: true,
      data: segment,
      message: 'Segmento criado com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validação falhou: ${error.errors[0].message}`,
        timestamp: new Date(),
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar segmento',
      timestamp: new Date(),
    });
  }
};

export const getAllSegments = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);
    const result = await segmentService.getAllSegments(page, limit);

    res.json({
      success: true,
      data: result.segments,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar segmentos',
      timestamp: new Date(),
    });
  }
};

export const getSegmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const segment = await segmentService.getSegmentById(id);

    res.json({
      success: true,
      data: segment,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : 'Segmento não encontrado',
      timestamp: new Date(),
    });
  }
};

export const updateSegment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = segmentSchema.partial().parse(req.body);
    const segment = await segmentService.updateSegment(id, data);

    res.json({
      success: true,
      data: segment,
      message: 'Segmento atualizado com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validação falhou: ${error.errors[0].message}`,
        timestamp: new Date(),
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar segmento',
      timestamp: new Date(),
    });
  }
};

export const deleteSegment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await segmentService.deleteSegment(id);

    res.json({
      success: true,
      message: 'Segmento deletado com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar segmento',
      timestamp: new Date(),
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// SERIES CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const createSeries = async (req: Request, res: Response) => {
  try {
    const data = seriesSchema.parse(req.body);
    const series = await seriesService.createSeries(data);

    res.status(201).json({
      success: true,
      data: series,
      message: 'Série criada com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validação falhou: ${error.errors[0].message}`,
        timestamp: new Date(),
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar série',
      timestamp: new Date(),
    });
  }
};

export const getSeriesBySegment = async (req: Request, res: Response) => {
  try {
    const { segmentId } = req.params;
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);
    const result = await seriesService.getSeriesBySegment(segmentId, page, limit);

    res.json({
      success: true,
      data: result.series,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar séries',
      timestamp: new Date(),
    });
  }
};

export const getAllSeries = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);
    const result = await seriesService.getAllSeries(page, limit);

    res.json({
      success: true,
      data: result.series,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar séries',
      timestamp: new Date(),
    });
  }
};

export const getSeriesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const series = await seriesService.getSeriesById(id);

    res.json({
      success: true,
      data: series,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : 'Série não encontrada',
      timestamp: new Date(),
    });
  }
};

export const updateSeries = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = seriesSchema.partial().parse(req.body);
    const series = await seriesService.updateSeries(id, data);

    res.json({
      success: true,
      data: series,
      message: 'Série atualizada com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validação falhou: ${error.errors[0].message}`,
        timestamp: new Date(),
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar série',
      timestamp: new Date(),
    });
  }
};

export const deleteSeries = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await seriesService.deleteSeries(id);

    res.json({
      success: true,
      message: 'Série deletada com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar série',
      timestamp: new Date(),
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// CLASS CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const createClass = async (req: Request, res: Response) => {
  try {
    const data = classSchema.parse(req.body);
    const schoolClass = await classService.createClass(data);

    res.status(201).json({
      success: true,
      data: schoolClass,
      message: 'Turma criada com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validação falhou: ${error.errors[0].message}`,
        timestamp: new Date(),
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar turma',
      timestamp: new Date(),
    });
  }
};

export const getClassesBySeries = async (req: Request, res: Response) => {
  try {
    const { seriesId } = req.params;
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);
    const result = await classService.getClassesBySeries(seriesId, page, limit);

    res.json({
      success: true,
      data: result.classes,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar turmas',
      timestamp: new Date(),
    });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schoolClass = await classService.getClassById(id);

    res.json({
      success: true,
      data: schoolClass,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : 'Turma não encontrada',
      timestamp: new Date(),
    });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = classSchema.partial().parse(req.body);
    const schoolClass = await classService.updateClass(id, data);

    res.json({
      success: true,
      data: schoolClass,
      message: 'Turma atualizada com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: `Validação falhou: ${error.errors[0].message}`,
        timestamp: new Date(),
      });
    }
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar turma',
      timestamp: new Date(),
    });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await classService.deleteClass(id);

    res.json({
      success: true,
      message: 'Turma deletada com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar turma',
      timestamp: new Date(),
    });
  }
};

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 100 } = paginationSchema.parse(req.query);
    const result = await classService.getAllClasses(page, limit);

    res.json({
      success: true,
      data: result.classes,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar turmas',
      timestamp: new Date(),
    });
  }
};
