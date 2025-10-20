import ExcelJS from 'exceljs';
import { Response } from 'express';

interface StudentExcelData {
  id: string;
  name: string;
  dateOfBirth: Date;
  cpf?: string | null;
  status: string;
  series?: {
    name: string;
    segment: {
      name: string;
    };
  } | null;
  class?: {
    name: string;
  } | null;
}

interface FinancialExcelData {
  month: string;
  year: number;
  students: Array<{
    name: string;
    class: string;
    series: string;
    mensalidade: number;
    extraHours: number;
    services: number;
    total: number;
  }>;
  summary: {
    totalMensalidades: number;
    totalExtraHours: number;
    totalServices: number;
    totalRevenue: number;
    totalStudents: number;
    averagePerStudent: number;
  };
}

interface ClassOccupancyData {
  classes: Array<{
    id: string;
    name: string;
    series: string;
    segment: string;
    capacity?: number;
    enrolled: number;
    occupancyRate: string;
  }>;
}

/**
 * Exporta lista de estudantes para Excel
 */
export const exportStudentsToExcel = async (res: Response, students: StudentExcelData[]): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'School Management System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Estudantes');

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nome', key: 'name', width: 30 },
    { header: 'Data de Nascimento', key: 'dateOfBirth', width: 20 },
    { header: 'CPF', key: 'cpf', width: 15 },
    { header: 'Segmento', key: 'segment', width: 20 },
    { header: 'Série', key: 'series', width: 20 },
    { header: 'Turma', key: 'class', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' },
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  students.forEach(student => {
    worksheet.addRow({
      id: student.id,
      name: student.name,
      dateOfBirth: new Date(student.dateOfBirth).toLocaleDateString('pt-BR'),
      cpf: student.cpf || 'N/A',
      segment: student.series?.segment.name || 'N/A',
      series: student.series?.name || 'N/A',
      class: student.class?.name || 'N/A',
      status: student.status,
    });
  });

  // Add alternating row colors
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && rowNumber % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF3F4F6' },
      };
    }
  });

  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=estudantes-${Date.now()}.xlsx`);

  // Write to response
  await workbook.xlsx.write(res);
  res.end();
};

/**
 * Exporta relatório financeiro para Excel
 */
export const exportFinancialReportToExcel = async (
  res: Response,
  data: FinancialExcelData
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'School Management System';
  workbook.created = new Date();

  // ============ Worksheet 1: Resumo ============
  const summarySheet = workbook.addWorksheet('Resumo');

  summarySheet.columns = [
    { header: 'Métrica', key: 'metric', width: 30 },
    { header: 'Valor', key: 'value', width: 20 },
  ];

  // Style header
  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' },
  };

  // Add summary data
  summarySheet.addRow({ metric: 'Período', value: `${data.month}/${data.year}` });
  summarySheet.addRow({ metric: 'Total de Estudantes', value: data.summary.totalStudents });
  summarySheet.addRow({ metric: 'Receita - Mensalidades', value: `R$ ${data.summary.totalMensalidades.toFixed(2)}` });
  summarySheet.addRow({ metric: 'Receita - Horas Extras', value: `R$ ${data.summary.totalExtraHours.toFixed(2)}` });
  summarySheet.addRow({ metric: 'Receita - Serviços', value: `R$ ${data.summary.totalServices.toFixed(2)}` });
  summarySheet.addRow({ metric: 'RECEITA TOTAL', value: `R$ ${data.summary.totalRevenue.toFixed(2)}` });
  summarySheet.addRow({ metric: 'Média por Estudante', value: `R$ ${data.summary.averagePerStudent.toFixed(2)}` });

  // Highlight total row
  const totalRow = summarySheet.getRow(6);
  totalRow.font = { bold: true, color: { argb: 'FF16A34A' } };
  totalRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD1FAE5' },
  };

  // ============ Worksheet 2: Detalhamento ============
  const detailSheet = workbook.addWorksheet('Detalhamento');

  detailSheet.columns = [
    { header: 'Aluno', key: 'name', width: 30 },
    { header: 'Turma', key: 'class', width: 15 },
    { header: 'Série', key: 'series', width: 20 },
    { header: 'Mensalidade', key: 'mensalidade', width: 15 },
    { header: 'Horas Extras', key: 'extraHours', width: 15 },
    { header: 'Serviços', key: 'services', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  // Style header
  detailSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  detailSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' },
  };
  detailSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add detail rows
  data.students.forEach(student => {
    detailSheet.addRow({
      name: student.name,
      class: student.class,
      series: student.series,
      mensalidade: student.mensalidade,
      extraHours: student.extraHours,
      services: student.services,
      total: student.total,
    });
  });

  // Format currency columns
  ['D', 'E', 'F', 'G'].forEach(col => {
    detailSheet.getColumn(col).numFmt = 'R$ #,##0.00';
  });

  // Add alternating row colors
  detailSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && rowNumber % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF3F4F6' },
      };
    }
  });

  // Add borders
  [summarySheet, detailSheet].forEach(sheet => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=relatorio-financeiro-${data.month}-${data.year}.xlsx`);

  // Write to response
  await workbook.xlsx.write(res);
  res.end();
};

/**
 * Exporta relatório de ocupação de turmas para Excel
 */
export const exportClassOccupancyToExcel = async (
  res: Response,
  data: ClassOccupancyData
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'School Management System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Ocupação de Turmas');

  // Define columns
  worksheet.columns = [
    { header: 'Turma', key: 'name', width: 20 },
    { header: 'Série', key: 'series', width: 25 },
    { header: 'Segmento', key: 'segment', width: 25 },
    { header: 'Capacidade', key: 'capacity', width: 15 },
    { header: 'Matriculados', key: 'enrolled', width: 15 },
    { header: 'Taxa de Ocupação', key: 'occupancyRate', width: 20 },
  ];

  // Style header
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' },
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  data.classes.forEach(classData => {
    worksheet.addRow({
      name: classData.name,
      series: classData.series,
      segment: classData.segment,
      capacity: classData.capacity || 'N/A',
      enrolled: classData.enrolled,
      occupancyRate: classData.occupancyRate,
    });
  });

  // Add conditional formatting for occupancy rate
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const rate = parseInt(row.getCell(6).value?.toString().replace('%', '') || '0');
      if (rate >= 90) {
        row.getCell(6).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEF4444' }, // Red for high occupancy
        };
        row.getCell(6).font = { color: { argb: 'FFFFFFFF' }, bold: true };
      } else if (rate >= 70) {
        row.getCell(6).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF59E0B' }, // Yellow for medium occupancy
        };
      } else {
        row.getCell(6).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF16A34A' }, // Green for low occupancy
        };
        row.getCell(6).font = { color: { argb: 'FFFFFFFF' }, bold: true };
      }
    }
  });

  // Add alternating row colors (for other cells)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1 && rowNumber % 2 === 0) {
      for (let i = 1; i <= 5; i++) {
        if (!row.getCell(i).fill || typeof row.getCell(i).fill === 'undefined') {
          row.getCell(i).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' },
          };
        }
      }
    }
  });

  // Add borders
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=ocupacao-turmas-${Date.now()}.xlsx`);

  // Write to response
  await workbook.xlsx.write(res);
  res.end();
};
