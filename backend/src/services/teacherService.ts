import { prisma } from '../config/database';
import { CreateTeacherInput, UpdateTeacherInput } from '../types';

// ═══════════════════════════════════════════════════════════════
// TEACHER SERVICES
// ═══════════════════════════════════════════════════════════════

export const teacherService = {
  // Create new teacher
  async createTeacher(data: CreateTeacherInput) {
    const teacher = await prisma.teacher.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        hireDate: data.hireDate,
        specialization: data.specialization,
        salary: data.salary,
        contractType: data.contractType,
        status: data.status || 'ATIVO',
      },
    });
    return teacher;
  },

  // Get all teachers with pagination
  async getAllTeachers(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        skip,
        take: limit,
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.teacher.count({ where: { active: true } }),
    ]);
    return { teachers, total, page, limit };
  },

  // Get active teachers only
  async getActiveTeachers() {
    const teachers = await prisma.teacher.findMany({
      where: {
        active: true,
        status: 'ATIVO'
      },
      orderBy: { name: 'asc' },
    });
    return teachers;
  },

  // Get teacher by ID
  async getTeacherById(id: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });
    if (!teacher) throw new Error('Professor não encontrado');
    return teacher;
  },

  // Update teacher
  async updateTeacher(id: string, data: UpdateTeacherInput) {
    const teacher = await prisma.teacher.update({
      where: { id },
      data,
    });
    return teacher;
  },

  // Soft delete teacher
  async deleteTeacher(id: string) {
    const teacher = await prisma.teacher.update({
      where: { id },
      data: { active: false },
    });
    return { success: true, data: teacher };
  },

  // Search teachers by name, email or specialization
  async searchTeachers(query: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where: {
          AND: [
            { active: true },
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { specialization: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.teacher.count({
        where: {
          AND: [
            { active: true },
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { specialization: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
      }),
    ]);
    return { teachers, total, page, limit };
  },

  // Get teachers by status
  async getTeachersByStatus(status: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where: {
          active: true,
          status: status as any
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.teacher.count({
        where: {
          active: true,
          status: status as any
        }
      }),
    ]);
    return { teachers, total, page, limit };
  },
};
