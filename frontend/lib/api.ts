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
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then(res => res as LoginResponse);
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

  async createSegment(data: Partial<Segment>): Promise<ApiResponse<Segment>> {
    return this.request('/api/academic/segments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSegment(id: string, data: Partial<Segment>): Promise<ApiResponse<Segment>> {
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

  async createClass(data: Partial<Class>): Promise<ApiResponse<Class>> {
    return this.request('/api/academic/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClass(id: string, data: Partial<Class>): Promise<ApiResponse<Class>> {
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

  async createSeries(data: Partial<Series>): Promise<ApiResponse<Series>> {
    return this.request('/api/academic/series', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSeries(id: string, data: Partial<Series>): Promise<ApiResponse<Series>> {
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

  // ==================== HEALTH ====================
  async health(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }
}

export const api = new ApiClient();
