import { Request, Response } from 'express';
import { studentService } from '@/services/studentService';
import { createStudentSchema, contractMatrixSchema, paginationSchema } from '@/utils/validation';
import { ZodError } from 'zod';

// ═══════════════════════════════════════════════════════════════
// STUDENT CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const createStudent = async (req: Request, res: Response) => {
  try {
    const data = createStudentSchema.parse(req.body);
    const student = await studentService.createStudent(data);

    res.status(201).json({
      success: true,
      data: student,
      message: 'Aluno matriculado com sucesso',
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
      error: error instanceof Error ? error.message : 'Erro ao matricular aluno',
      timestamp: new Date(),
    });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const filters = {
      classId: req.query.classId as string | undefined,
      seriesId: req.query.seriesId as string | undefined,
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
    };

    const result = await studentService.getAllStudents(
      pagination.page,
      pagination.limit,
      filters
    );

    res.json({
      success: true,
      data: result.students,
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
      error: error instanceof Error ? error.message : 'Erro ao listar alunos',
      timestamp: new Date(),
    });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);

    res.json({
      success: true,
      data: student,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : 'Aluno não encontrado',
      timestamp: new Date(),
    });
  }
};

export const getStudentsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);

    const result = await studentService.getStudentsByClass(classId, page, limit);

    res.json({
      success: true,
      data: result.students,
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
      error: error instanceof Error ? error.message : 'Erro ao listar alunos',
      timestamp: new Date(),
    });
  }
};

export const getStudentsBySeries = async (req: Request, res: Response) => {
  try {
    const { seriesId } = req.params;
    const { page = 1, limit = 50 } = paginationSchema.parse(req.query);

    const result = await studentService.getStudentsBySeries(seriesId, page, limit);

    res.json({
      success: true,
      data: result.students,
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
      error: error instanceof Error ? error.message : 'Erro ao listar alunos',
      timestamp: new Date(),
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = createStudentSchema.partial().parse(req.body);
    const student = await studentService.updateStudent(id, data);

    res.json({
      success: true,
      data: student,
      message: 'Aluno atualizado com sucesso',
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
      error: error instanceof Error ? error.message : 'Erro ao atualizar aluno',
      timestamp: new Date(),
    });
  }
};

export const changeStudentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ATIVO', 'INATIVO', 'TRANSFERIDO'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido. Deve ser: ATIVO, INATIVO ou TRANSFERIDO',
        timestamp: new Date(),
      });
    }

    const student = await studentService.changeStudentStatus(id, status);

    res.json({
      success: true,
      data: student,
      message: `Status do aluno alterado para ${status}`,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao alterar status',
      timestamp: new Date(),
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(id);

    res.json({
      success: true,
      message: 'Aluno removido com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao remover aluno',
      timestamp: new Date(),
    });
  }
};

export const addContractMatrix = async (req: Request, res: Response) => {
  try {
    const data = contractMatrixSchema.parse(req.body);
    const contract = await studentService.addContractMatrix(data);

    res.status(201).json({
      success: true,
      data: contract,
      message: 'Horário adicionado com sucesso',
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
      error: error instanceof Error ? error.message : 'Erro ao adicionar horário',
      timestamp: new Date(),
    });
  }
};

export const getStudentContractMatrix = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const contracts = await studentService.getStudentContractMatrix(studentId);

    res.json({
      success: true,
      data: contracts,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar horários',
      timestamp: new Date(),
    });
  }
};

export const removeContractMatrixEntry = async (req: Request, res: Response) => {
  try {
    const { studentId, dayOfWeek } = req.params;
    await studentService.removeContractMatrixEntry(studentId, parseInt(dayOfWeek));

    res.json({
      success: true,
      message: 'Horário removido com sucesso',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao remover horário',
      timestamp: new Date(),
    });
  }
};

export const getStudentExtraHours = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const extraHours = await studentService.getStudentExtraHours(studentId);

    res.json({
      success: true,
      data: extraHours,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar horas extras',
      timestamp: new Date(),
    });
  }
};

export const calculateExtraHoursPeriod = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate e endDate são obrigatórios',
        timestamp: new Date(),
      });
    }

    const result = await studentService.calculateExtraHoursPeriod(
      studentId,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao calcular horas extras',
      timestamp: new Date(),
    });
  }
};

export const getClassComposition = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const result = await studentService.getClassComposition(classId);

    res.json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar composição da turma',
      timestamp: new Date(),
    });
  }
};

export const bulkImportStudents = async (req: Request, res: Response) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Envie um array de alunos',
        timestamp: new Date(),
      });
    }

    const result = await studentService.bulkImportStudents(students);

    res.status(201).json({
      success: true,
      data: result,
      message: `${result.success} alunos importados com sucesso, ${result.failed} falharam`,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao importar alunos',
      timestamp: new Date(),
    });
  }
};
