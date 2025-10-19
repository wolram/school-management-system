import { Request, Response } from 'express';
import { calculationService } from '../services/calculationService';
import { z } from 'zod';

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

const calculateExtraHoursSchema = z.object({
  studentId: z.string().min(1, 'ID do aluno é obrigatório'),
  date: z.string().transform((val) => new Date(val)),
  realEntryTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:mm)'),
  realExitTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:mm)'),
});

const monthlyBudgetSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

const simulateContractSchema = z.object({
  studentId: z.string().min(1, 'ID do aluno é obrigatório'),
  contractMatrix: z.record(
    z.string(),
    z.object({
      entryTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      exitTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
      services: z.record(z.boolean()),
    })
  ),
  discounts: z
    .object({
      mensalidade: z.number().min(0).max(100).optional(),
      servicos: z.number().min(0).max(100).optional(),
      horasExtras: z.number().min(0).max(100).optional(),
    })
    .optional(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

// ============================================================
// CONTROLLERS
// ============================================================

/**
 * POST /api/calculations/extra-hours
 * Calcular horas extras de um dia
 */
export const calculateExtraHours = async (req: Request, res: Response) => {
  try {
    // Validar entrada
    const validatedData = calculateExtraHoursSchema.parse(req.body);

    // Calcular horas extras
    const extraHours = await calculationService.calculateExtraHours(validatedData);

    return res.status(200).json({
      success: true,
      data: {
        studentId: validatedData.studentId,
        date: validatedData.date,
        extraHours,
      },
      message: 'Horas extras calculadas com sucesso',
      timestamp: new Date(),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors,
        timestamp: new Date(),
      });
    }

    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao calcular horas extras',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/calculations/budget/:studentId
 * Calcular orçamento mensal
 */
export const getMonthlyBudget = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros "month" e "year" são obrigatórios',
        timestamp: new Date(),
      });
    }

    // Validar mês e ano
    const validatedParams = monthlyBudgetSchema.parse({
      month: parseInt(month as string),
      year: parseInt(year as string),
    });

    // Calcular orçamento
    const budget = await calculationService.calculateMonthlyBudget(
      studentId,
      validatedParams.month,
      validatedParams.year
    );

    return res.status(200).json({
      success: true,
      data: budget,
      timestamp: new Date(),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors,
        timestamp: new Date(),
      });
    }

    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao calcular orçamento mensal',
      timestamp: new Date(),
    });
  }
};

/**
 * POST /api/calculations/simulate
 * Simular contrato com alterações
 */
export const simulateContract = async (req: Request, res: Response) => {
  try {
    // Validar entrada
    const validatedData = simulateContractSchema.parse(req.body);

    // Converter contractMatrix para formato correto
    const contractMatrix: any = {};
    Object.entries(validatedData.contractMatrix).forEach(([key, value]) => {
      contractMatrix[parseInt(key)] = value;
    });

    // Simular
    const simulation = await calculationService.simulateContract({
      ...validatedData,
      contractMatrix,
    });

    return res.status(200).json({
      success: true,
      data: simulation,
      timestamp: new Date(),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors,
        timestamp: new Date(),
      });
    }

    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao simular contrato',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/calculations/history/:studentId
 * Buscar histórico de horas extras
 */
export const getExtraHoursHistory = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros "startDate" e "endDate" são obrigatórios',
        timestamp: new Date(),
      });
    }

    const history = await calculationService.getExtraHoursHistory(
      studentId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    return res.status(200).json({
      success: true,
      data: history,
      count: history.length,
      timestamp: new Date(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar histórico de horas extras',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/calculations/export/:studentId
 * Exportar relatório mensal
 */
export const exportMonthlyReport = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros "month" e "year" são obrigatórios',
        timestamp: new Date(),
      });
    }

    // Validar mês e ano
    const validatedParams = monthlyBudgetSchema.parse({
      month: parseInt(month as string),
      year: parseInt(year as string),
    });

    // Exportar relatório
    const report = await calculationService.exportMonthlyReport(
      studentId,
      validatedParams.month,
      validatedParams.year
    );

    return res.status(200).json({
      success: true,
      data: report,
      timestamp: new Date(),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors,
        timestamp: new Date(),
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao exportar relatório',
      timestamp: new Date(),
    });
  }
};
