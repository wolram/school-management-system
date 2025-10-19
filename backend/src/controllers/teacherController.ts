import { Request, Response } from 'express';
import { teacherService } from '../services/teacherService';
import { teacherSchema, paginationSchema } from '../utils/validation';
import { ZodError } from 'zod';

// ═══════════════════════════════════════════════════════════════
// TEACHER CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const data = teacherSchema.parse(req.body);
    const teacher = await teacherService.createTeacher(data);

    res.status(201).json({
      success: true,
      data: teacher,
      message: 'Professor criado com sucesso',
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
      error: error instanceof Error ? error.message : 'Erro ao criar professor',
      timestamp: new Date(),
    });
  }
};

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);
    const result = await teacherService.getAllTeachers(page, limit);

    res.json({
      success: true,
      data: result.teachers,
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
      error: error instanceof Error ? error.message : 'Erro ao listar professores',
      timestamp: new Date(),
    });
  }
};

export const getActiveTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await teacherService.getActiveTeachers();

    res.json({
      success: true,
      data: teachers,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar professores ativos',
      timestamp: new Date(),
    });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await teacherService.getTeacherById(id);

    res.json({
      success: true,
      data: teacher,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : 'Professor não encontrado',
      timestamp: new Date(),
    });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = teacherSchema.partial().parse(req.body);
    const teacher = await teacherService.updateTeacher(id, data);

    res.json({
      success: true,
      data: teacher,
      message: 'Professor atualizado com sucesso',
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
      error: error instanceof Error ? error.message : 'Erro ao atualizar professor',
      timestamp: new Date(),
    });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await teacherService.deleteTeacher(id);

    res.json({
      success: true,
      message: 'Professor removido com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao remover professor',
      timestamp: new Date(),
    });
  }
};

export const searchTeachers = async (req: Request, res: Response) => {
  try {
    const { query = '', page = 1, limit = 50 } = req.query as any;
    const { page: p, limit: l } = paginationSchema.parse({ page, limit });
    const result = await teacherService.searchTeachers(query, p, l);

    res.json({
      success: true,
      data: result.teachers,
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
      error: error instanceof Error ? error.message : 'Erro ao buscar professores',
      timestamp: new Date(),
    });
  }
};

export const getTeachersByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);
    const result = await teacherService.getTeachersByStatus(status, page, limit);

    res.json({
      success: true,
      data: result.teachers,
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
      error: error instanceof Error ? error.message : 'Erro ao listar professores por status',
      timestamp: new Date(),
    });
  }
};
