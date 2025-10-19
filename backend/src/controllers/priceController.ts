import { Request, Response } from 'express';
import { priceService } from '../services/priceService';
import { z } from 'zod';
import { PriceType } from '@prisma/client';

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

const createPriceSchema = z.object({
  type: z.enum(['MENSALIDADE', 'SERVICO', 'HORA_EXTRA']),
  seriesId: z.string().optional(),
  serviceName: z.string().optional(),
  value: z.number().positive('Valor deve ser maior que zero'),
  valuePerHour: z.number().positive('Valor por hora deve ser maior que zero').optional(),
  effectiveDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
});

const updatePriceSchema = z.object({
  type: z.enum(['MENSALIDADE', 'SERVICO', 'HORA_EXTRA']).optional(),
  seriesId: z.string().optional(),
  serviceName: z.string().optional(),
  value: z.number().positive('Valor deve ser maior que zero').optional(),
  valuePerHour: z.number().positive('Valor por hora deve ser maior que zero').optional(),
  effectiveDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  active: z.boolean().optional(),
});

// ============================================================
// CONTROLLERS
// ============================================================

/**
 * POST /api/prices
 * Criar novo preço
 */
export const createPrice = async (req: Request, res: Response) => {
  try {
    // Validar entrada
    const validatedData = createPriceSchema.parse(req.body);

    // Obter userId do token
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    // Criar preço
    const price = await priceService.createPrice(validatedData, userId);

    return res.status(201).json({
      success: true,
      data: price,
      message: 'Preço criado com sucesso',
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
      error: error.message || 'Erro ao criar preço',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/prices
 * Listar todos os preços com filtros
 */
export const getAllPrices = async (req: Request, res: Response) => {
  try {
    const { type, seriesId, active, serviceName } = req.query;

    const filters: any = {};

    if (type) {
      filters.type = type as PriceType;
    }

    if (seriesId) {
      filters.seriesId = seriesId as string;
    }

    if (active !== undefined) {
      filters.active = active === 'true';
    }

    if (serviceName) {
      filters.serviceName = serviceName as string;
    }

    const prices = await priceService.getAllPrices(filters);

    return res.status(200).json({
      success: true,
      data: prices,
      count: prices.length,
      timestamp: new Date(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar preços',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/prices/active
 * Buscar apenas preços ativos
 */
export const getActivePrices = async (req: Request, res: Response) => {
  try {
    const prices = await priceService.getActivePrices();

    return res.status(200).json({
      success: true,
      data: prices,
      count: prices.length,
      timestamp: new Date(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar preços ativos',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/prices/:id
 * Buscar preço por ID
 */
export const getPriceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const price = await priceService.getPriceById(id);

    return res.status(200).json({
      success: true,
      data: price,
      timestamp: new Date(),
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      error: error.message || 'Preço não encontrado',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/prices/series/:seriesId
 * Buscar preços de uma série
 */
export const getPricesBySeries = async (req: Request, res: Response) => {
  try {
    const { seriesId } = req.params;

    const prices = await priceService.getPricesBySeries(seriesId);

    return res.status(200).json({
      success: true,
      data: prices,
      count: prices.length,
      timestamp: new Date(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar preços da série',
      timestamp: new Date(),
    });
  }
};

/**
 * PUT /api/prices/:id
 * Atualizar preço
 */
export const updatePrice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar entrada
    const validatedData = updatePriceSchema.parse(req.body);

    // Obter userId do token
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    // Atualizar preço
    const price = await priceService.updatePrice(id, validatedData, userId);

    return res.status(200).json({
      success: true,
      data: price,
      message: 'Preço atualizado com sucesso',
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
      error: error.message || 'Erro ao atualizar preço',
      timestamp: new Date(),
    });
  }
};

/**
 * DELETE /api/prices/:id
 * Desativar preço (soft delete)
 */
export const deletePrice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Obter userId do token
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      });
    }

    // Desativar preço
    const price = await priceService.deletePrice(id, userId);

    return res.status(200).json({
      success: true,
      data: price,
      message: 'Preço desativado com sucesso',
      timestamp: new Date(),
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Erro ao desativar preço',
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/prices/history
 * Buscar histórico de preços
 */
export const getPriceHistory = async (req: Request, res: Response) => {
  try {
    const { type, seriesId, serviceName } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro "type" é obrigatório',
        timestamp: new Date(),
      });
    }

    const history = await priceService.getPriceHistory(
      type as PriceType,
      seriesId as string | undefined,
      serviceName as string | undefined
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
      error: error.message || 'Erro ao buscar histórico de preços',
      timestamp: new Date(),
    });
  }
};
