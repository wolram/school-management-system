// API Service Layer for School Management System

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    profile: string;
  };
}

export interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  cpf?: string;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO';
  class?: {
    id: string;
    name: string;
  };
  series?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Segment {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

export interface Series {
  id: string;
  name: string;
  order: number;
  active: boolean;
  segmentId: string;
}

export interface Class {
  id: string;
  name: string;
  seriesId: string;
  defaultEntryTime: string;
  defaultExitTime: string;
  active: boolean;
}

export interface Price {
  id: string;
  type: 'MENSALIDADE' | 'SERVICO' | 'HORA_EXTRA';
  seriesId?: string;
  serviceName?: string;
  value: number;
  valuePerHour?: number;
  effectiveDate: string;
  active: boolean;
  series?: {
    id: string;
    name: string;
    segment: {
      id: string;
      name: string;
    };
  };
}

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
  detalhamentoDias: {
    data: string;
    horasExtras: number;
    diaSemana: number;
  }[];
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers as Record<string, string>),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ==================== AUTH ====================
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Extract token and user from the data object
    if (response.success && response.data) {
      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    }

    throw new Error(response.message || 'Login failed');
  }

  // ==================== STUDENTS ====================
  async getStudents(page: number = 1, limit: number = 10, filters?: any): Promise<ApiResponse<Student[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/api/students?${params.toString()}`);
  }

  async getStudent(id: string): Promise<ApiResponse<Student>> {
    return this.request(`/api/students/${id}`);
  }

  async createStudent(data: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/students/${id}`, {
      method: 'DELETE',
    });
  }

  async searchStudents(query: string): Promise<ApiResponse<Student[]>> {
    return this.request(`/api/students?search=${encodeURIComponent(query)}`);
  }

  // ==================== ACADEMIC - SEGMENTS ====================
  async getSegments(page: number = 1, limit: number = 10): Promise<ApiResponse<Segment[]>> {
    return this.request(`/api/academic/segments?page=${page}&limit=${limit}`);
  }

  async createSegment(data: any): Promise<ApiResponse<Segment>> {
    return this.request('/api/academic/segments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSegment(id: string, data: any): Promise<ApiResponse<Segment>> {
    return this.request(`/api/academic/segments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSegment(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/academic/segments/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ACADEMIC - CLASSES ====================
  async getClasses(page: number = 1, limit: number = 10): Promise<ApiResponse<Class[]>> {
    return this.request(`/api/academic/classes?page=${page}&limit=${limit}`);
  }

  async createClass(data: any): Promise<ApiResponse<Class>> {
    return this.request('/api/academic/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClass(id: string, data: any): Promise<ApiResponse<Class>> {
    return this.request(`/api/academic/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClass(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/academic/classes/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ACADEMIC - SERIES ====================
  async getSeries(page: number = 1, limit: number = 10): Promise<ApiResponse<Series[]>> {
    return this.request(`/api/academic/series?page=${page}&limit=${limit}`);
  }

  async createSeries(data: any): Promise<ApiResponse<Series>> {
    return this.request('/api/academic/series', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSeries(id: string, data: any): Promise<ApiResponse<Series>> {
    return this.request(`/api/academic/series/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSeries(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/academic/series/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PRICES ====================
  async getPrices(filters?: any): Promise<ApiResponse<Price[]>> {
    const params = new URLSearchParams(filters || {});
    return this.request(`/api/prices?${params.toString()}`);
  }

  async getPrice(id: string): Promise<ApiResponse<Price>> {
    return this.request(`/api/prices/${id}`);
  }

  async createPrice(data: Partial<Price>): Promise<ApiResponse<Price>> {
    return this.request('/api/prices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePrice(id: string, data: Partial<Price>): Promise<ApiResponse<Price>> {
    return this.request(`/api/prices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePrice(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/prices/${id}`, {
      method: 'DELETE',
    });
  }

  async getPricesBySeries(seriesId: string): Promise<ApiResponse<Price[]>> {
    return this.request(`/api/prices/series/${seriesId}`);
  }

  async getPriceHistory(type: string, seriesId?: string, serviceName?: string): Promise<ApiResponse<Price[]>> {
    const params = new URLSearchParams({ type });
    if (seriesId) params.append('seriesId', seriesId);
    if (serviceName) params.append('serviceName', serviceName);
    return this.request(`/api/prices/history?${params.toString()}`);
  }

  // ==================== CALCULATIONS ====================
  async calculateExtraHours(data: {
    studentId: string;
    date: string;
    realEntryTime: string;
    realExitTime: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/api/calculations/extra-hours', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMonthlyBudget(studentId: string, month: number, year: number): Promise<ApiResponse<BudgetBreakdown>> {
    return this.request(`/api/calculations/budget/${studentId}?month=${month}&year=${year}`);
  }

  async simulateContract(data: any): Promise<ApiResponse<any>> {
    return this.request('/api/calculations/simulate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getExtraHoursHistory(studentId: string, startDate: string, endDate: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/calculations/history/${studentId}?startDate=${startDate}&endDate=${endDate}`);
  }

  async exportMonthlyReport(studentId: string, month: number, year: number): Promise<ApiResponse<any>> {
    return this.request(`/api/calculations/export/${studentId}?month=${month}&year=${year}`);
  }

  // ==================== HEALTH ====================
  async health(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }
}

export const api = new ApiClient();
