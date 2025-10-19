export interface JWTPayload {
  userId: string;
  email: string;
  profile: 'ADMIN' | 'GERENTE' | 'OPERADOR';
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    profile: string;
  };
}

export interface TimeSlot {
  hour: number;
  minute: 0 | 30; // Only 0 or 30 minutes
}

export interface ContractMatrixInput {
  studentId: string;
  dayOfWeek: number; // 0-4 (Monday-Friday)
  entryTime: string; // "HH:mm"
  exitTime: string; // "HH:mm"
  services: Record<string, boolean>; // { "almoço": true, "jantar": false }
}

export interface PriceInput {
  type: 'MENSALIDADE' | 'SERVICO' | 'HORA_EXTRA';
  seriesId?: string;
  serviceName?: string;
  value: number;
  valuePerHour?: number;
}

export interface StudentCreateInput {
  name: string;
  dateOfBirth: Date;
  cpf?: string;
  seriesId: string;
  classId: string;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
}

export interface AuditLogEntry {
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  recordId: string;
  description: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface CalculatorInput {
  seriesId: string;
  contractMatrix: Record<number, {
    entryTime: string;
    exitTime: string;
    services: Record<string, boolean>;
  }>;
  discounts?: {
    mensalidade?: number; // percentage
    servicios?: number; // percentage
    horasExtras?: number; // percentage
  };
}

export interface BudgetSummary {
  mensalidade: number;
  servicios: {
    [key: string]: number;
  };
  horasExtras: number;
  subtotal: number;
  discounts: number;
  total: number;
}

// ═══════════════════════════════════════════════════════════════
// ACADEMIC MODULE TYPES
// ═══════════════════════════════════════════════════════════════

export interface CreateSegmentInput {
  name: string;
  order?: number;
  active?: boolean;
}

export interface CreateSeriesInput {
  name: string;
  segmentId: string;
  order?: number;
  active?: boolean;
}

export interface CreateClassInput {
  name: string;
  seriesId: string;
  defaultEntryTime: string;
  defaultExitTime: string;
  active?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// TEACHER MODULE TYPES
// ═══════════════════════════════════════════════════════════════

export interface CreateTeacherInput {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  hireDate: Date;
  specialization: string; // ex: Matemática, Português
  salary: number;
  contractType: 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TEMPORARIO';
  status?: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'LICENCA';
}

export interface UpdateTeacherInput {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  hireDate?: Date;
  specialization?: string;
  salary?: number;
  contractType?: 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TEMPORARIO';
  status?: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'LICENCA';
  active?: boolean;
}
