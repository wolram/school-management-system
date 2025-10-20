import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuditLogEntry } from '../types';

/**
 * Registrar ação de auditoria no banco de dados
 */
export const logAudit = async (entry: AuditLogEntry): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        table: entry.table,
        recordId: entry.recordId,
        description: entry.description,
        oldValue: entry.oldValue ?? undefined,
        newValue: entry.newValue ?? undefined,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
    // Não interromper a operação principal em caso de erro na auditoria
  }
};

/**
 * Middleware para capturar informações de requisição (IP, User-Agent)
 * e disponibilizá-las para logging
 */
export const auditContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Extrair IP real (considerando proxies)
  const ipAddress =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'UNKNOWN';

  const userAgent = req.headers['user-agent'] || 'UNKNOWN';

  // Adicionar ao request para uso posterior
  (req as any).auditContext = {
    ipAddress,
    userAgent,
  };

  next();
};

/**
 * Registrar criação de registro com descrição humanizada
 */
export const auditCreate = async (
  userId: string,
  table: string,
  recordId: string,
  data: Record<string, any>,
  description: string,
  context?: any
): Promise<void> => {
  await logAudit({
    userId,
    action: 'CREATE',
    table,
    recordId,
    description,
    newValue: data,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });
};

/**
 * Registrar atualização de registro
 */
export const auditUpdate = async (
  userId: string,
  table: string,
  recordId: string,
  oldData: Record<string, any>,
  newData: Record<string, any>,
  description: string,
  context?: any
): Promise<void> => {
  await logAudit({
    userId,
    action: 'UPDATE',
    table,
    recordId,
    description,
    oldValue: oldData,
    newValue: newData,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });
};

/**
 * Registrar exclusão de registro
 */
export const auditDelete = async (
  userId: string,
  table: string,
  recordId: string,
  data: Record<string, any>,
  description: string,
  context?: any
): Promise<void> => {
  await logAudit({
    userId,
    action: 'DELETE',
    table,
    recordId,
    description,
    oldValue: data,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });
};

/**
 * Helper para gerar descrição humanizada de mudanças
 */
export const generateChangeDescription = (
  entity: string,
  action: 'criar' | 'atualizar' | 'deletar',
  details: Record<string, any>
): string => {
  const timestamp = new Date().toLocaleString('pt-BR');

  if (action === 'criar') {
    return `${entity} criado(a): ${JSON.stringify(details)}. [${timestamp}]`;
  }

  if (action === 'deletar') {
    return `${entity} deletado(a). ID: ${details.id}. [${timestamp}]`;
  }

  // Para atualizar, montar descrição das mudanças
  const changes: string[] = [];
  for (const [key, value] of Object.entries(details)) {
    changes.push(`${key}: ${value}`);
  }

  return `${entity} atualizado(a). Mudanças: ${changes.join(', ')}. [${timestamp}]`;
};

/**
 * Buscar logs de auditoria com filtros
 */
export const getAuditLogs = async (filters: {
  userId?: string;
  table?: string;
  recordId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}) => {
  const {
    userId,
    table,
    recordId,
    action,
    startDate,
    endDate,
    limit = 50,
    skip = 0,
  } = filters;

  return await prisma.auditLog.findMany({
    where: {
      ...(userId && { userId }),
      ...(table && { table }),
      ...(recordId && { recordId }),
      ...(action && { action: action as any }),
      ...(startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip,
  });
};
