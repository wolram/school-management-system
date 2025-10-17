import { z } from 'zod';

// Validar formato de horário (HH:mm com incrementos de 30min)
export const timeFormatSchema = z.string()
  .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido. Use HH:mm')
  .refine((time) => {
    const [, minutes] = time.split(':');
    const mins = parseInt(minutes);
    return mins === 0 || mins === 30;
  }, 'Horários devem ser em horas cheias ou meia hora (ex: 08:00, 08:30)');

// Validar horário de entrada vs saída
export const validateTimeRange = (entryTime: string, exitTime: string): boolean => {
  const [entryHour, entryMin] = entryTime.split(':').map(Number);
  const [exitHour, exitMin] = exitTime.split(':').map(Number);

  const entryMinutes = entryHour * 60 + entryMin;
  const exitMinutes = exitHour * 60 + exitMin;

  return exitMinutes > entryMinutes;
};

// Converter horário string para minutos
export const timeToMinutes = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

// Converter minutos para horário string
export const minutesToTime = (minutes: number): string => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

// Calcular diferença de horas
export const calculateHourDifference = (entryTime: string, exitTime: string): number => {
  const entryMinutes = timeToMinutes(entryTime);
  const exitMinutes = timeToMinutes(exitTime);
  return (exitMinutes - entryMinutes) / 60; // retorna em horas decimais
};

// Validação de email
export const emailSchema = z.string()
  .email('Email inválido')
  .toLowerCase();

// Validação de senha (mínimo 8 caracteres)
export const passwordSchema = z.string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter número');

// Autenticação schemas
export const authSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  profile: z.enum(['ADMIN', 'GERENTE', 'OPERADOR']).default('OPERADOR'),
});

// Estudante schemas
export const createStudentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dateOfBirth: z.coerce.date(),
  cpf: z.string().optional().nullable(),
  seriesId: z.string().cuid('Series ID inválido'),
  classId: z.string().cuid('Class ID inválido'),
  guardianName: z.string().optional(),
  guardianEmail: emailSchema.optional(),
  guardianPhone: z.string().optional(),
});

// Matriz de Contrato schema
export const contractMatrixSchema = z.object({
  studentId: z.string().cuid('Student ID inválido'),
  dayOfWeek: z.number().int().min(0).max(4), // Segunda a Sexta
  entryTime: timeFormatSchema,
  exitTime: timeFormatSchema,
  services: z.record(z.boolean()),
}).refine(
  (data) => validateTimeRange(data.entryTime, data.exitTime),
  { message: 'Horário de saída deve ser após horário de entrada' }
);

// Preço schema
export const priceSchema = z.object({
  type: z.enum(['MENSALIDADE', 'SERVICO', 'HORA_EXTRA']),
  seriesId: z.string().cuid().optional(),
  serviceName: z.string().optional(),
  value: z.number().positive('Valor deve ser positivo'),
  valuePerHour: z.number().positive().optional(),
});

// Filtros de paginação
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Calculadora de orçamento
export const budgetCalculatorSchema = z.object({
  seriesId: z.string().cuid(),
  contractMatrix: z.record(
    z.object({
      entryTime: timeFormatSchema,
      exitTime: timeFormatSchema,
      services: z.record(z.boolean()),
    })
  ),
  discounts: z.object({
    mensalidade: z.number().min(0).max(100).optional(),
    servicios: z.number().min(0).max(100).optional(),
    horasExtras: z.number().min(0).max(100).optional(),
  }).optional(),
});

// ═══════════════════════════════════════════════════════════════
// ACADEMIC MODULE SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const segmentSchema = z.object({
  name: z.string().min(3, 'Nome do segmento deve ter no mínimo 3 caracteres'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser válida (ex: #FF5733)').optional(),
});

export const seriesSchema = z.object({
  name: z.string().min(2, 'Nome da série deve ter no mínimo 2 caracteres'),
  level: z.number().int().min(1, 'Nível deve ser no mínimo 1'),
  segmentId: z.string().cuid('ID do segmento inválido'),
});

export const classSchema = z.object({
  name: z.string().min(1, 'Nome da turma é obrigatório'),
  capacity: z.number().int().min(1, 'Capacidade deve ser no mínimo 1'),
  seriesId: z.string().cuid('ID da série inválido'),
});
