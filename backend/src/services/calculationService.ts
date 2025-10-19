import { prisma } from '../config/database';
import { timeToMinutes, minutesToTime } from '../utils/validation';
import { Decimal } from '@prisma/client/runtime/library';

// ============================================================
// INTERFACES
// ============================================================

export interface BudgetBreakdown {
  mensalidade: number;
  servicosContratados: {
    nome: string;
    valor: number;
  }[];
  horasExtras: {
    totalHoras: number;
    valorPorHora: number;
    subtotal: number;
  };
  totalGeral: number;
  detalhamentoDias: Array<{
    data: Date;
    horasExtras: number;
    diaSemana: number;
  }>;
}

export interface SimulationParams {
  studentId: string;
  contractMatrix: Record<number, {
    entryTime: string;
    exitTime: string;
    services: Record<string, boolean>;
  }>;
  discounts?: {
    mensalidade?: number; // porcentagem
    servicos?: number; // porcentagem
    horasExtras?: number; // porcentagem
  };
  month: number;
  year: number;
}

export interface SimulationResult {
  contratoAtual: BudgetBreakdown;
  contratoSimulado: BudgetBreakdown;
  diferencas: {
    mensalidade: number;
    servicosContratados: number;
    horasExtras: number;
    totalGeral: number;
  };
}

export interface ExtraHoursInput {
  studentId: string;
  date: Date;
  realEntryTime: string; // horário real de entrada
  realExitTime: string; // horário real de saída
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calcula horas extras entre horário contratado e real
 * @param contractedEntry - Horário contratado de entrada (HH:mm)
 * @param contractedExit - Horário contratado de saída (HH:mm)
 * @param realEntry - Horário real de entrada (HH:mm)
 * @param realExit - Horário real de saída (HH:mm)
 * @returns Horas extras em formato decimal, arredondadas para incrementos de 0.5h
 */
export const calculateExtraHoursBetweenTimes = (
  contractedEntry: string,
  contractedExit: string,
  realEntry: string,
  realExit: string
): number => {
  const contractedEntryMin = timeToMinutes(contractedEntry);
  const contractedExitMin = timeToMinutes(contractedExit);
  const realEntryMin = timeToMinutes(realEntry);
  const realExitMin = timeToMinutes(realExit);

  // Calcular minutos antes do horário contratado
  let minutesBefore = 0;
  if (realEntryMin < contractedEntryMin) {
    minutesBefore = contractedEntryMin - realEntryMin;
  }

  // Calcular minutos depois do horário contratado
  let minutesAfter = 0;
  if (realExitMin > contractedExitMin) {
    minutesAfter = realExitMin - contractedExitMin;
  }

  // Total de minutos extras
  const totalExtraMinutes = minutesBefore + minutesAfter;

  // Converter para horas decimais
  const extraHours = totalExtraMinutes / 60;

  // Arredondar para incrementos de 0.5h (30 min)
  return Math.round(extraHours * 2) / 2;
};

/**
 * Obter dia da semana a partir de uma data (0 = Segunda, 4 = Sexta)
 */
const getDayOfWeekIndex = (date: Date): number => {
  const jsDay = date.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  if (jsDay === 0 || jsDay === 6) {
    throw new Error('Dia inválido: sábado e domingo não são dias letivos');
  }
  return jsDay - 1; // Converte para 0 = Segunda, 4 = Sexta
};

/**
 * Obter todos os dias úteis de um mês
 */
const getWeekdaysInMonth = (month: number, year: number): Date[] => {
  const days: Date[] = [];
  const date = new Date(year, month - 1, 1);

  while (date.getMonth() === month - 1) {
    const dayOfWeek = date.getDay();
    // Apenas dias úteis (Segunda a Sexta)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      days.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }

  return days;
};

/**
 * Converter Decimal do Prisma para number
 */
const decimalToNumber = (decimal: Decimal | null | undefined): number => {
  if (!decimal) return 0;
  return parseFloat(decimal.toString());
};

// ============================================================
// CALCULATION SERVICE
// ============================================================

class CalculationService {
  /**
   * Calcular horas extras de um aluno em um dia específico
   * @param input - Dados de entrada (studentId, date, horários reais)
   * @returns Total de horas extras calculadas
   */
  async calculateExtraHours(input: ExtraHoursInput): Promise<number> {
    const { studentId, date, realEntryTime, realExitTime } = input;

    // Validar que a data não é futura
    if (date > new Date()) {
      throw new Error('Não é possível calcular horas extras para datas futuras');
    }

    // Obter dia da semana
    const dayOfWeek = getDayOfWeekIndex(date);

    // Buscar matriz de contrato do aluno para esse dia
    const contractMatrix = await prisma.contractMatrix.findUnique({
      where: {
        studentId_dayOfWeek: {
          studentId,
          dayOfWeek,
        },
      },
    });

    if (!contractMatrix) {
      throw new Error(`Matriz de contrato não encontrada para o dia da semana ${dayOfWeek}`);
    }

    // Calcular horas extras
    const extraHours = calculateExtraHoursBetweenTimes(
      contractMatrix.entryTime,
      contractMatrix.exitTime,
      realEntryTime,
      realExitTime
    );

    // Salvar ou atualizar registro de horas extras
    await prisma.extraHours.upsert({
      where: {
        studentId_date: {
          studentId,
          date,
        },
      },
      update: {
        hoursCalculated: new Decimal(extraHours),
      },
      create: {
        studentId,
        date,
        hoursCalculated: new Decimal(extraHours),
      },
    });

    return extraHours;
  }

  /**
   * Calcular orçamento mensal de um aluno
   * @param studentId - ID do aluno
   * @param month - Mês (1-12)
   * @param year - Ano
   * @returns Breakdown detalhado do orçamento
   */
  async calculateMonthlyBudget(
    studentId: string,
    month: number,
    year: number
  ): Promise<BudgetBreakdown> {
    // Validar mês
    if (month < 1 || month > 12) {
      throw new Error('Mês inválido. Deve estar entre 1 e 12');
    }

    // Buscar aluno com série
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        series: true,
        contractMatrix: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    if (!student.active || student.status !== 'ATIVO') {
      throw new Error('Aluno não está ativo');
    }

    // 1. MENSALIDADE
    const mensalidadePrice = await prisma.price.findFirst({
      where: {
        type: 'MENSALIDADE',
        seriesId: student.seriesId,
        active: true,
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    const mensalidade = mensalidadePrice ? decimalToNumber(mensalidadePrice.value) : 0;

    // 2. SERVIÇOS CONTRATADOS
    const servicosContratados: { nome: string; valor: number }[] = [];

    // Extrair todos os serviços únicos da matriz de contrato
    const uniqueServices = new Set<string>();
    student.contractMatrix.forEach((matrix) => {
      const services = matrix.services as Record<string, boolean>;
      Object.entries(services).forEach(([serviceName, isActive]) => {
        if (isActive) {
          uniqueServices.add(serviceName);
        }
      });
    });

    // Buscar preços dos serviços
    for (const serviceName of uniqueServices) {
      const servicePrice = await prisma.price.findFirst({
        where: {
          type: 'SERVICO',
          serviceName,
          active: true,
        },
        orderBy: {
          effectiveDate: 'desc',
        },
      });

      if (servicePrice) {
        servicosContratados.push({
          nome: serviceName,
          valor: decimalToNumber(servicePrice.value),
        });
      }
    }

    // 3. HORAS EXTRAS
    const extraHoursPrice = await prisma.price.findFirst({
      where: {
        type: 'HORA_EXTRA',
        active: true,
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    const valorPorHora = extraHoursPrice ? decimalToNumber(extraHoursPrice.valuePerHour) : 0;

    // Buscar horas extras do mês
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const extraHoursRecords = await prisma.extraHours.findMany({
      where: {
        studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    let totalHoras = 0;
    const detalhamentoDias = extraHoursRecords.map((record) => {
      const hours = decimalToNumber(record.hoursCalculated);
      totalHoras += hours;

      return {
        data: record.date,
        horasExtras: hours,
        diaSemana: getDayOfWeekIndex(record.date),
      };
    });

    const subtotalHorasExtras = totalHoras * valorPorHora;

    // 4. TOTAL GERAL
    const totalServicos = servicosContratados.reduce((sum, s) => sum + s.valor, 0);
    const totalGeral = mensalidade + totalServicos + subtotalHorasExtras;

    return {
      mensalidade,
      servicosContratados,
      horasExtras: {
        totalHoras,
        valorPorHora,
        subtotal: subtotalHorasExtras,
      },
      totalGeral,
      detalhamentoDias,
    };
  }

  /**
   * Simular contrato com alterações
   * @param params - Parâmetros da simulação
   * @returns Comparação entre contrato atual e simulado
   */
  async simulateContract(params: SimulationParams): Promise<SimulationResult> {
    const { studentId, contractMatrix, discounts, month, year } = params;

    // 1. Obter orçamento atual
    const contratoAtual = await this.calculateMonthlyBudget(studentId, month, year);

    // 2. Calcular orçamento simulado

    // Buscar aluno
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { series: true },
    });

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    // 2.1 Mensalidade
    const mensalidadePrice = await prisma.price.findFirst({
      where: {
        type: 'MENSALIDADE',
        seriesId: student.seriesId,
        active: true,
      },
      orderBy: { effectiveDate: 'desc' },
    });

    let mensalidadeSimulada = mensalidadePrice ? decimalToNumber(mensalidadePrice.value) : 0;

    // Aplicar desconto
    if (discounts?.mensalidade) {
      mensalidadeSimulada *= (1 - discounts.mensalidade / 100);
    }

    // 2.2 Serviços simulados
    const servicosSimulados: { nome: string; valor: number }[] = [];
    const uniqueServices = new Set<string>();

    Object.values(contractMatrix).forEach((daySchedule) => {
      Object.entries(daySchedule.services).forEach(([serviceName, isActive]) => {
        if (isActive) {
          uniqueServices.add(serviceName);
        }
      });
    });

    for (const serviceName of uniqueServices) {
      const servicePrice = await prisma.price.findFirst({
        where: {
          type: 'SERVICO',
          serviceName,
          active: true,
        },
        orderBy: { effectiveDate: 'desc' },
      });

      if (servicePrice) {
        let valor = decimalToNumber(servicePrice.value);

        // Aplicar desconto
        if (discounts?.servicos) {
          valor *= (1 - discounts.servicos / 100);
        }

        servicosSimulados.push({
          nome: serviceName,
          valor,
        });
      }
    }

    // 2.3 Horas extras simuladas (baseado em horários diferentes)
    // Para simulação, vamos calcular horas extras assumindo que o aluno
    // ficará exatamente no horário simulado vs horário real médio

    const extraHoursPrice = await prisma.price.findFirst({
      where: {
        type: 'HORA_EXTRA',
        active: true,
      },
      orderBy: { effectiveDate: 'desc' },
    });

    let valorPorHoraSimulado = extraHoursPrice ? decimalToNumber(extraHoursPrice.valuePerHour) : 0;

    // Aplicar desconto
    if (discounts?.horasExtras) {
      valorPorHoraSimulado *= (1 - discounts.horasExtras / 100);
    }

    // Calcular total de horas extras simuladas
    // (vamos manter o mesmo histórico de horas extras, mas com preço simulado)
    const totalHorasSimulado = contratoAtual.horasExtras.totalHoras;
    const subtotalHorasExtrasSimulado = totalHorasSimulado * valorPorHoraSimulado;

    // 2.4 Total simulado
    const totalServicosSimulado = servicosSimulados.reduce((sum, s) => sum + s.valor, 0);
    const totalGeralSimulado = mensalidadeSimulada + totalServicosSimulado + subtotalHorasExtrasSimulado;

    const contratoSimulado: BudgetBreakdown = {
      mensalidade: mensalidadeSimulada,
      servicosContratados: servicosSimulados,
      horasExtras: {
        totalHoras: totalHorasSimulado,
        valorPorHora: valorPorHoraSimulado,
        subtotal: subtotalHorasExtrasSimulado,
      },
      totalGeral: totalGeralSimulado,
      detalhamentoDias: contratoAtual.detalhamentoDias, // mantém o mesmo histórico
    };

    // 3. Calcular diferenças
    const diferencas = {
      mensalidade: contratoSimulado.mensalidade - contratoAtual.mensalidade,
      servicosContratados:
        servicosSimulados.reduce((sum, s) => sum + s.valor, 0) -
        contratoAtual.servicosContratados.reduce((sum, s) => sum + s.valor, 0),
      horasExtras: contratoSimulado.horasExtras.subtotal - contratoAtual.horasExtras.subtotal,
      totalGeral: contratoSimulado.totalGeral - contratoAtual.totalGeral,
    };

    return {
      contratoAtual,
      contratoSimulado,
      diferencas,
    };
  }

  /**
   * Obter histórico de horas extras de um aluno
   * @param studentId - ID do aluno
   * @param startDate - Data inicial
   * @param endDate - Data final
   * @returns Lista de horas extras no período
   */
  async getExtraHoursHistory(
    studentId: string,
    startDate: Date,
    endDate: Date
  ) {
    const records = await prisma.extraHours.findMany({
      where: {
        studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Buscar preço por hora vigente
    const extraHoursPrice = await prisma.price.findFirst({
      where: {
        type: 'HORA_EXTRA',
        active: true,
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    const valorPorHora = extraHoursPrice ? decimalToNumber(extraHoursPrice.valuePerHour) : 0;

    return records.map((record) => {
      const hours = decimalToNumber(record.hoursCalculated);
      return {
        id: record.id,
        date: record.date,
        horasExtras: hours,
        valorPorHora,
        valor: hours * valorPorHora,
        diaSemana: getDayOfWeekIndex(record.date),
      };
    });
  }

  /**
   * Exportar relatório mensal
   * @param studentId - ID do aluno
   * @param month - Mês
   * @param year - Ano
   * @returns Dados formatados para exportação
   */
  async exportMonthlyReport(studentId: string, month: number, year: number) {
    const budget = await this.calculateMonthlyBudget(studentId, month, year);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
        class: true,
      },
    });

    return {
      aluno: {
        id: student?.id,
        nome: student?.name,
        serie: student?.series.name,
        segmento: student?.series.segment.name,
        turma: student?.class.name,
      },
      periodo: {
        mes: month,
        ano: year,
      },
      orcamento: budget,
      geradoEm: new Date(),
    };
  }
}

export const calculationService = new CalculationService();
