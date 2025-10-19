import { prisma } from '../config/database';
import { PriceType, Prisma } from '@prisma/client';

// ============================================================
// INTERFACES
// ============================================================

export interface CreatePriceInput {
  type: PriceType;
  seriesId?: string;
  serviceName?: string;
  value: number;
  valuePerHour?: number;
  effectiveDate?: Date;
}

export interface UpdatePriceInput {
  type?: PriceType;
  seriesId?: string;
  serviceName?: string;
  value?: number;
  valuePerHour?: number;
  effectiveDate?: Date;
  active?: boolean;
}

export interface PriceFilters {
  type?: PriceType;
  seriesId?: string;
  active?: boolean;
  serviceName?: string;
}

// ============================================================
// PRICE SERVICE
// ============================================================

class PriceService {
  /**
   * Criar novo preço
   */
  async createPrice(input: CreatePriceInput, userId: string) {
    // Validações específicas por tipo
    if (input.type === 'MENSALIDADE' && !input.seriesId) {
      throw new Error('SeriesId é obrigatório para preços de mensalidade');
    }

    if (input.type === 'SERVICO' && !input.serviceName) {
      throw new Error('ServiceName é obrigatório para preços de serviço');
    }

    if (input.type === 'HORA_EXTRA' && !input.valuePerHour) {
      throw new Error('ValuePerHour é obrigatório para preços de hora extra');
    }

    if (input.value <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (input.valuePerHour && input.valuePerHour <= 0) {
      throw new Error('Valor por hora deve ser maior que zero');
    }

    // Verificar se já existe um preço ativo para evitar duplicação
    const existingPrice = await this.findConflictingPrice(input);
    if (existingPrice) {
      throw new Error('Já existe um preço ativo para esta configuração');
    }

    // Criar preço
    const price = await prisma.price.create({
      data: {
        type: input.type,
        seriesId: input.seriesId,
        serviceName: input.serviceName,
        value: new Prisma.Decimal(input.value),
        valuePerHour: input.valuePerHour ? new Prisma.Decimal(input.valuePerHour) : null,
        effectiveDate: input.effectiveDate || new Date(),
        active: true,
      },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
      },
    });

    return price;
  }

  /**
   * Buscar preço por ID
   */
  async getPriceById(id: string) {
    const price = await prisma.price.findUnique({
      where: { id },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
      },
    });

    if (!price) {
      throw new Error('Preço não encontrado');
    }

    return price;
  }

  /**
   * Listar todos os preços com filtros
   */
  async getAllPrices(filters: PriceFilters = {}) {
    const where: Prisma.PriceWhereInput = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.seriesId) {
      where.seriesId = filters.seriesId;
    }

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.serviceName) {
      where.serviceName = {
        contains: filters.serviceName,
        mode: 'insensitive',
      };
    }

    const prices = await prisma.price.findMany({
      where,
      include: {
        series: {
          include: {
            segment: true,
          },
        },
      },
      orderBy: [
        { effectiveDate: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return prices;
  }

  /**
   * Buscar preços ativos
   */
  async getActivePrices() {
    return this.getAllPrices({ active: true });
  }

  /**
   * Buscar preços por série
   */
  async getPricesBySeries(seriesId: string) {
    const prices = await prisma.price.findMany({
      where: {
        seriesId,
        active: true,
      },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    return prices;
  }

  /**
   * Atualizar preço
   */
  async updatePrice(id: string, input: UpdatePriceInput, userId: string) {
    // Verificar se o preço existe
    const existingPrice = await this.getPriceById(id);

    // Validações
    if (input.value !== undefined && input.value <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (input.valuePerHour !== undefined && input.valuePerHour <= 0) {
      throw new Error('Valor por hora deve ser maior que zero');
    }

    // Atualizar
    const updatedPrice = await prisma.price.update({
      where: { id },
      data: {
        ...(input.type && { type: input.type }),
        ...(input.seriesId && { seriesId: input.seriesId }),
        ...(input.serviceName && { serviceName: input.serviceName }),
        ...(input.value && { value: new Prisma.Decimal(input.value) }),
        ...(input.valuePerHour && { valuePerHour: new Prisma.Decimal(input.valuePerHour) }),
        ...(input.effectiveDate && { effectiveDate: input.effectiveDate }),
        ...(input.active !== undefined && { active: input.active }),
      },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
      },
    });

    return updatedPrice;
  }

  /**
   * Desativar preço (soft delete)
   */
  async deletePrice(id: string, userId: string) {
    // Verificar se o preço existe
    await this.getPriceById(id);

    // Desativar
    const price = await prisma.price.update({
      where: { id },
      data: {
        active: false,
      },
    });

    return price;
  }

  /**
   * Buscar histórico de preços (todas as versões)
   */
  async getPriceHistory(type: PriceType, seriesId?: string, serviceName?: string) {
    const where: Prisma.PriceWhereInput = { type };

    if (seriesId) {
      where.seriesId = seriesId;
    }

    if (serviceName) {
      where.serviceName = serviceName;
    }

    const history = await prisma.price.findMany({
      where,
      include: {
        series: {
          include: {
            segment: true,
          },
        },
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    return history;
  }

  /**
   * Verificar se existe preço conflitante
   */
  private async findConflictingPrice(input: CreatePriceInput) {
    const where: Prisma.PriceWhereInput = {
      type: input.type,
      active: true,
    };

    if (input.type === 'MENSALIDADE' && input.seriesId) {
      where.seriesId = input.seriesId;
    }

    if (input.type === 'SERVICO' && input.serviceName) {
      where.serviceName = input.serviceName;
    }

    if (input.type === 'HORA_EXTRA') {
      // Para hora extra, só pode existir um preço ativo por vez
      where.type = 'HORA_EXTRA';
    }

    return await prisma.price.findFirst({ where });
  }

  /**
   * Obter preço vigente em uma data específica
   */
  async getPriceAtDate(type: PriceType, date: Date, seriesId?: string, serviceName?: string) {
    const where: Prisma.PriceWhereInput = {
      type,
      active: true,
      effectiveDate: {
        lte: date,
      },
    };

    if (seriesId) {
      where.seriesId = seriesId;
    }

    if (serviceName) {
      where.serviceName = serviceName;
    }

    const price = await prisma.price.findFirst({
      where,
      orderBy: {
        effectiveDate: 'desc',
      },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
      },
    });

    return price;
  }
}

export const priceService = new PriceService();
