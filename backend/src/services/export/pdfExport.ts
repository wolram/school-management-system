import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface StudentReportData {
  student: {
    id: string;
    name: string;
    dateOfBirth: Date;
    cpf?: string | null;
    status: string;
  };
  class?: {
    name: string;
  } | null;
  series?: {
    name: string;
    segment: {
      name: string;
    };
  } | null;
  contractMatrix?: Array<{
    dayOfWeek: number;
    entryTime: string;
    exitTime: string;
    services: any;
  }> | null;
  monthlyBudget?: {
    mensalidade: number;
    servicosAdicionais: number;
    total: number;
  };
}

interface FinancialReportData {
  month: string;
  year: number;
  students: Array<{
    name: string;
    class: string;
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
  };
}

const DAYS_OF_WEEK = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

/**
 * Gera relatório PDF de estudante
 */
export const generateStudentReportPDF = (res: Response, data: StudentReportData): void => {
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=relatorio-${data.student.name.replace(/\s/g, '_')}.pdf`);

  // Pipe PDF to response
  doc.pipe(res);

  // Header
  doc.fontSize(20).text('Relatório de Estudante', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
  doc.moveDown(2);

  // Dados do Estudante
  doc.fontSize(16).fillColor('#2563eb').text('Dados Pessoais', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#000000');
  doc.text(`Nome: ${data.student.name}`);
  doc.text(`Data de Nascimento: ${new Date(data.student.dateOfBirth).toLocaleDateString('pt-BR')}`);
  if (data.student.cpf) {
    doc.text(`CPF: ${data.student.cpf}`);
  }
  doc.text(`Status: ${data.student.status}`);
  doc.moveDown();

  // Dados Acadêmicos
  if (data.series && data.class) {
    doc.fontSize(16).fillColor('#2563eb').text('Dados Acadêmicos', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000000');
    doc.text(`Segmento: ${data.series.segment.name}`);
    doc.text(`Série: ${data.series.name}`);
    doc.text(`Turma: ${data.class.name}`);
    doc.moveDown();
  }

  // Matriz Contratual (Horários)
  if (data.contractMatrix && data.contractMatrix.length > 0) {
    doc.fontSize(16).fillColor('#2563eb').text('Horários Semanais', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000000');

    data.contractMatrix.forEach(entry => {
      doc.text(`${DAYS_OF_WEEK[entry.dayOfWeek]}: ${entry.entryTime} às ${entry.exitTime}`);
      if (entry.services && Object.keys(entry.services).length > 0) {
        doc.fontSize(10).fillColor('#6b7280').text(`  Serviços: ${JSON.stringify(entry.services)}`, { indent: 20 });
        doc.fontSize(12).fillColor('#000000');
      }
    });
    doc.moveDown();
  }

  // Orçamento Mensal
  if (data.monthlyBudget) {
    doc.fontSize(16).fillColor('#2563eb').text('Orçamento Mensal', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000000');
    doc.text(`Mensalidade: R$ ${data.monthlyBudget.mensalidade.toFixed(2)}`);
    doc.text(`Serviços Adicionais: R$ ${data.monthlyBudget.servicosAdicionais.toFixed(2)}`);
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#16a34a').text(`TOTAL: R$ ${data.monthlyBudget.total.toFixed(2)}`);
  }

  // Footer
  doc.moveDown(3);
  doc.fontSize(10).fillColor('#6b7280').text(
    'School Management System - Relatório Confidencial',
    50,
    doc.page.height - 50,
    { align: 'center' }
  );

  // Finalize PDF
  doc.end();
};

/**
 * Gera relatório financeiro consolidado em PDF
 */
export const generateFinancialReportPDF = (res: Response, data: FinancialReportData): void => {
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=relatorio-financeiro-${data.month}-${data.year}.pdf`);

  // Pipe PDF to response
  doc.pipe(res);

  // Header
  doc.fontSize(20).text('Relatório Financeiro Mensal', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Período: ${data.month}/${data.year}`, { align: 'center' });
  doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
  doc.moveDown(2);

  // Resumo Executivo
  doc.fontSize(16).fillColor('#2563eb').text('Resumo Executivo', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#000000');
  doc.text(`Total Mensalidades: R$ ${data.summary.totalMensalidades.toFixed(2)}`);
  doc.text(`Total Horas Extras: R$ ${data.summary.totalExtraHours.toFixed(2)}`);
  doc.text(`Total Serviços: R$ ${data.summary.totalServices.toFixed(2)}`);
  doc.moveDown(0.5);
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#16a34a').text(
    `RECEITA TOTAL: R$ ${data.summary.totalRevenue.toFixed(2)}`
  );
  doc.moveDown(2);

  // Detalhamento por Estudante
  doc.fontSize(16).fillColor('#2563eb').text('Detalhamento por Estudante', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#000000');

  // Table Header
  const startY = doc.y;
  doc.text('Aluno', 50, startY, { width: 150, continued: false });
  doc.text('Turma', 200, startY, { width: 80, continued: false });
  doc.text('Mensalidade', 280, startY, { width: 80, continued: false, align: 'right' });
  doc.text('H. Extras', 360, startY, { width: 60, continued: false, align: 'right' });
  doc.text('Serviços', 420, startY, { width: 60, continued: false, align: 'right' });
  doc.text('Total', 480, startY, { width: 70, continued: false, align: 'right' });
  doc.moveDown();

  // Horizontal line
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // Table Rows
  data.students.forEach(student => {
    const y = doc.y;

    // Check if we need a new page
    if (y > 700) {
      doc.addPage();
      doc.fontSize(10);
    }

    doc.text(student.name.substring(0, 25), 50, y, { width: 150, continued: false });
    doc.text(student.class, 200, y, { width: 80, continued: false });
    doc.text(`R$ ${student.mensalidade.toFixed(2)}`, 280, y, { width: 80, continued: false, align: 'right' });
    doc.text(`R$ ${student.extraHours.toFixed(2)}`, 360, y, { width: 60, continued: false, align: 'right' });
    doc.text(`R$ ${student.services.toFixed(2)}`, 420, y, { width: 60, continued: false, align: 'right' });
    doc.text(`R$ ${student.total.toFixed(2)}`, 480, y, { width: 70, continued: false, align: 'right' });
    doc.moveDown();
  });

  // Footer
  doc.moveDown(3);
  doc.fontSize(10).fillColor('#6b7280').text(
    'School Management System - Relatório Confidencial',
    50,
    doc.page.height - 50,
    { align: 'center' }
  );

  // Finalize PDF
  doc.end();
};

/**
 * Gera lista de estudantes em PDF
 */
export const generateStudentsListPDF = (res: Response, students: any[], title = 'Lista de Estudantes'): void => {
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=lista-estudantes-${Date.now()}.pdf`);

  // Pipe PDF to response
  doc.pipe(res);

  // Header
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
  doc.fontSize(12).text(`Total de estudantes: ${students.length}`, { align: 'center' });
  doc.moveDown(2);

  // Table Header
  doc.fontSize(10).fillColor('#000000');
  const startY = doc.y;
  doc.text('Nome', 50, startY, { width: 200, continued: false });
  doc.text('Data Nasc.', 250, startY, { width: 80, continued: false });
  doc.text('Série', 330, startY, { width: 120, continued: false });
  doc.text('Status', 450, startY, { width: 100, continued: false });
  doc.moveDown();

  // Horizontal line
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // Table Rows
  students.forEach(student => {
    const y = doc.y;

    // Check if we need a new page
    if (y > 700) {
      doc.addPage();
      doc.fontSize(10);
    }

    doc.text(student.name.substring(0, 30), 50, y, { width: 200, continued: false });
    doc.text(new Date(student.dateOfBirth).toLocaleDateString('pt-BR'), 250, y, { width: 80, continued: false });
    doc.text(student.series?.name || 'N/A', 330, y, { width: 120, continued: false });
    doc.text(student.status, 450, y, { width: 100, continued: false });
    doc.moveDown();
  });

  // Footer
  doc.moveDown(3);
  doc.fontSize(10).fillColor('#6b7280').text(
    'School Management System - Relatório Confidencial',
    50,
    doc.page.height - 50,
    { align: 'center' }
  );

  // Finalize PDF
  doc.end();
};
