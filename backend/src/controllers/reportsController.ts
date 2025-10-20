import { Request, Response } from 'express';
import { prisma } from '../config/database';
import {
  generateStudentReportPDF,
  generateFinancialReportPDF,
  generateStudentsListPDF,
} from '../services/export/pdfExport';
import {
  exportStudentsToExcel,
  exportFinancialReportToExcel,
  exportClassOccupancyToExcel,
} from '../services/export/excelExport';

/**
 * GET /api/reports/students/pdf
 * Exportar lista de estudantes em PDF
 */
export const exportStudentsPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, classId, seriesId } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (classId) where.classId = classId as string;
    if (seriesId) where.seriesId = seriesId as string;

    const students = await prisma.student.findMany({
      where,
      include: {
        series: {
          include: {
            segment: true,
          },
        },
        class: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    generateStudentsListPDF(res, students, 'Lista de Estudantes');
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório PDF',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/reports/students/excel
 * Exportar lista de estudantes em Excel
 */
export const exportStudentsExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, classId, seriesId } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (classId) where.classId = classId as string;
    if (seriesId) where.seriesId = seriesId as string;

    const students = await prisma.student.findMany({
      where,
      include: {
        series: {
          include: {
            segment: true,
          },
        },
        class: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    await exportStudentsToExcel(res, students);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório Excel',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/reports/student/:id/pdf
 * Exportar relatório detalhado de um estudante em PDF
 */
export const exportStudentReportPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: id },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
        class: true,
        contractMatrix: true,
      },
    });

    if (!student) {
      res.status(404).json({
        success: false,
        error: 'Estudante não encontrado',
        timestamp: new Date(),
      });
      return;
    }

    // Calculate monthly budget (simplified)
    const mensalidade = 1000; // This should come from Price model
    const servicosAdicionais = 200; // Calculate from contract matrix services

    const reportData = {
      student,
      class: student.class,
      series: student.series,
      contractMatrix: student.contractMatrix,
      monthlyBudget: {
        mensalidade,
        servicosAdicionais,
        total: mensalidade + servicosAdicionais,
      },
    };

    generateStudentReportPDF(res, reportData);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório do estudante',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/reports/financial/pdf
 * Exportar relatório financeiro consolidado em PDF
 */
export const exportFinancialPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, year } = req.query;
    const targetMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    // Get all active students
    const students = await prisma.student.findMany({
      where: {
        status: 'ATIVO',
      },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
        class: true,
      },
    });

    // Calculate financial data for each student (simplified)
    const studentFinancials = students.map(student => {
      const mensalidade = 1000; // Should come from Price model
      const extraHours = Math.random() * 200; // Should come from ExtraHours model
      const services = 150; // Should calculate from contract matrix

      return {
        name: student.name,
        class: student.class?.name || 'N/A',
        mensalidade,
        extraHours,
        services,
        total: mensalidade + extraHours + services,
      };
    });

    // Calculate summary
    const summary = {
      totalMensalidades: studentFinancials.reduce((sum, s) => sum + s.mensalidade, 0),
      totalExtraHours: studentFinancials.reduce((sum, s) => sum + s.extraHours, 0),
      totalServices: studentFinancials.reduce((sum, s) => sum + s.services, 0),
      totalRevenue: studentFinancials.reduce((sum, s) => sum + s.total, 0),
    };

    const reportData = {
      month: String(targetMonth).padStart(2, '0'),
      year: targetYear,
      students: studentFinancials,
      summary,
    };

    generateFinancialReportPDF(res, reportData);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório financeiro',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/reports/financial/excel
 * Exportar relatório financeiro em Excel
 */
export const exportFinancialExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, year } = req.query;
    const targetMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    // Get all active students
    const students = await prisma.student.findMany({
      where: {
        status: 'ATIVO',
      },
      include: {
        series: {
          include: {
            segment: true,
          },
        },
        class: true,
      },
    });

    // Calculate financial data for each student (simplified)
    const studentFinancials = students.map(student => {
      const mensalidade = 1000; // Should come from Price model
      const extraHours = Math.random() * 200; // Should come from ExtraHours model
      const services = 150; // Should calculate from contract matrix

      return {
        name: student.name,
        class: student.class?.name || 'N/A',
        series: student.series?.name || 'N/A',
        mensalidade,
        extraHours,
        services,
        total: mensalidade + extraHours + services,
      };
    });

    // Calculate summary
    const totalRevenue = studentFinancials.reduce((sum, s) => sum + s.total, 0);
    const summary = {
      totalMensalidades: studentFinancials.reduce((sum, s) => sum + s.mensalidade, 0),
      totalExtraHours: studentFinancials.reduce((sum, s) => sum + s.extraHours, 0),
      totalServices: studentFinancials.reduce((sum, s) => sum + s.services, 0),
      totalRevenue,
      totalStudents: students.length,
      averagePerStudent: students.length > 0 ? totalRevenue / students.length : 0,
    };

    const reportData = {
      month: String(targetMonth).padStart(2, '0'),
      year: targetYear,
      students: studentFinancials,
      summary,
    };

    await exportFinancialReportToExcel(res, reportData);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório financeiro Excel',
      message: error.message,
      timestamp: new Date(),
    });
  }
};

/**
 * GET /api/reports/occupancy/excel
 * Exportar relatório de ocupação de turmas em Excel
 */
export const exportOccupancyExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        series: {
          include: {
            segment: true,
          },
        },
        students: {
          where: {
            status: 'ATIVO',
          },
        },
      },
      orderBy: [
        { series: { segment: { order: 'asc' } } },
        { series: { order: 'asc' } },
        { name: 'asc' },
      ],
    });

    const classOccupancy = classes.map(cls => {
      const enrolled = cls.students.length;
      const capacity = 30; // Default capacity (schema doesn't have capacity field yet)
      const occupancyRate = capacity > 0 ? ((enrolled / capacity) * 100).toFixed(1) + '%' : 'N/A';

      return {
        id: cls.id,
        name: cls.name,
        series: cls.series.name,
        segment: cls.series.segment.name,
        capacity,
        enrolled,
        occupancyRate,
      };
    });

    await exportClassOccupancyToExcel(res, { classes: classOccupancy });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório de ocupação',
      message: error.message,
      timestamp: new Date(),
    });
  }
};
