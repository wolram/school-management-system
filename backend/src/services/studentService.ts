import { prisma } from '@/config/database';
import { StudentCreateInput, ContractMatrixInput } from '@/types';

// ═══════════════════════════════════════════════════════════════
// STUDENT SERVICES
// ═══════════════════════════════════════════════════════════════

export const studentService = {
  // Create new student enrollment
  async createStudent(data: StudentCreateInput) {
    // Verify class exists
    const classExists = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { series: true },
    });

    if (!classExists) {
      throw new Error('Turma não encontrada');
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        cpf: data.cpf,
        email: data.guardianEmail || undefined,
        phone: data.guardianPhone || undefined,
        guardianName: data.guardianName,
        guardianEmail: data.guardianEmail,
        guardianPhone: data.guardianPhone,
        classId: data.classId,
        seriesId: data.seriesId,
        status: 'ATIVO',
      },
      include: {
        class: { include: { series: { include: { segment: true } } } },
        contractMatrix: true,
      },
    });

    return student;
  },

  // Get all students with pagination
  async getAllStudents(page: number = 1, limit: number = 50, filters?: {
    classId?: string;
    seriesId?: string;
    status?: string;
    search?: string;
  }) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.classId) where.classId = filters.classId;
    if (filters?.seriesId) where.seriesId = filters.seriesId;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { cpf: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          class: { include: { series: { include: { segment: true } } } },
          contractMatrix: true,
          extraHours: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    return { students, total, page, limit };
  },

  // Get student by ID with all relationships
  async getStudentById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: { include: { series: { include: { segment: true } } } },
        contractMatrix: true,
        extraHours: true,
        classHistory: true,
      },
    });

    if (!student) throw new Error('Aluno não encontrado');
    return student;
  },

  // Get students by class
  async getStudentsByClass(classId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: { classId },
        skip,
        take: limit,
        include: {
          class: { include: { series: { include: { segment: true } } } },
          contractMatrix: true,
        },
        orderBy: { name: 'asc' },
      }),
      prisma.student.count({ where: { classId } }),
    ]);

    return { students, total, page, limit };
  },

  // Get students by series
  async getStudentsBySeries(seriesId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: { seriesId },
        skip,
        take: limit,
        include: {
          class: { include: { series: { include: { segment: true } } } },
          contractMatrix: true,
        },
        orderBy: { name: 'asc' },
      }),
      prisma.student.count({ where: { seriesId } }),
    ]);

    return { students, total, page, limit };
  },

  // Update student
  async updateStudent(id: string, data: Partial<StudentCreateInput>) {
    // Verify student exists
    const studentExists = await prisma.student.findUnique({ where: { id } });
    if (!studentExists) throw new Error('Aluno não encontrado');

    // If changing class, verify it exists
    if (data.classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: data.classId },
      });
      if (!classExists) throw new Error('Turma não encontrada');
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        cpf: data.cpf,
        email: data.guardianEmail,
        phone: data.guardianPhone,
        guardianName: data.guardianName,
        guardianEmail: data.guardianEmail,
        guardianPhone: data.guardianPhone,
        classId: data.classId,
        seriesId: data.seriesId,
      },
      include: {
        class: { include: { series: { include: { segment: true } } } },
        contractMatrix: true,
      },
    });

    return student;
  },

  // Change student status
  async changeStudentStatus(id: string, status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO') {
    const student = await prisma.student.update({
      where: { id },
      data: { status },
      include: {
        class: { include: { series: { include: { segment: true } } } },
      },
    });

    return student;
  },

  // Delete student (soft delete by marking INATIVO)
  async deleteStudent(id: string) {
    await prisma.student.update({
      where: { id },
      data: { status: 'INATIVO' },
    });

    return { success: true };
  },

  // Add contract matrix entry (weekly schedule)
  async addContractMatrix(data: ContractMatrixInput) {
    // Verify student exists
    const studentExists = await prisma.student.findUnique({
      where: { id: data.studentId },
    });

    if (!studentExists) throw new Error('Aluno não encontrado');

    // Check if entry already exists for this day
    const existingEntry = await prisma.contractMatrix.findFirst({
      where: {
        studentId: data.studentId,
        dayOfWeek: data.dayOfWeek,
      },
    });

    if (existingEntry) {
      // Update existing entry
      return prisma.contractMatrix.update({
        where: { id: existingEntry.id },
        data: {
          entryTime: data.entryTime,
          exitTime: data.exitTime,
          services: data.services,
        },
      });
    }

    // Create new entry
    return prisma.contractMatrix.create({
      data,
    });
  },

  // Get student contract matrix (weekly schedule)
  async getStudentContractMatrix(studentId: string) {
    const contracts = await prisma.contractMatrix.findMany({
      where: { studentId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return contracts;
  },

  // Remove contract matrix entry
  async removeContractMatrixEntry(studentId: string, dayOfWeek: number) {
    await prisma.contractMatrix.deleteMany({
      where: {
        studentId,
        dayOfWeek,
      },
    });

    return { success: true };
  },

  // Get student extra hours
  async getStudentExtraHours(studentId: string) {
    const extraHours = await prisma.extraHours.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
    });

    return extraHours;
  },

  // Calculate total extra hours for period
  async calculateExtraHoursPeriod(
    studentId: string,
    startDate: Date,
    endDate: Date
  ) {
    const extraHours = await prisma.extraHours.findMany({
      where: {
        studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalMinutes = extraHours.reduce((sum, eh) => sum + eh.extraMinutes, 0);
    const totalCost = extraHours.reduce((sum, eh) => sum + (eh.extraCost?.toNumber() || 0), 0);

    return {
      totalMinutes,
      totalHours: totalMinutes / 60,
      totalCost,
      records: extraHours.length,
    };
  },

  // Get class composition
  async getClassComposition(classId: string) {
    const students = await prisma.student.findMany({
      where: {
        classId,
        status: 'ATIVO',
      },
      include: {
        contractMatrix: true,
      },
      orderBy: { name: 'asc' },
    });

    const classInfo = await prisma.class.findUnique({
      where: { id: classId },
      include: { series: { include: { segment: true } } },
    });

    return {
      class: classInfo,
      totalStudents: students.length,
      capacity: classInfo?.capacity,
      occupancy: classInfo ? (students.length / classInfo.capacity) * 100 : 0,
      students,
    };
  },

  // Bulk import students
  async bulkImportStudents(data: StudentCreateInput[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const studentData of data) {
      try {
        await this.createStudent(studentData);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          name: studentData.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  },
};
