import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============ CLEAR EXISTING DATA ============
  await prisma.auditLog.deleteMany({});
  await prisma.classHistory.deleteMany({});
  await prisma.extraHours.deleteMany({});
  await prisma.contractMatrix.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.series.deleteMany({});
  await prisma.price.deleteMany({});
  await prisma.segment.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✓ Cleared existing data');

  // ============ CREATE USERS ============
  const hashedPassword = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin School',
      email: 'admin@school.com',
      password: hashedPassword,
      profile: 'ADMIN',
      active: true,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: 'Gerente Principal',
      email: 'gerente@school.com',
      password: hashedPassword,
      profile: 'GERENTE',
      active: true,
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      name: 'Operador Sistema',
      email: 'operador@school.com',
      password: hashedPassword,
      profile: 'OPERADOR',
      active: true,
    },
  });

  console.log('✓ Created 3 users (Admin, Manager, Operator)');

  // ============ CREATE EDUCATIONAL SEGMENTS ============
  const infantilSegment = await prisma.segment.create({
    data: {
      name: 'Educação Infantil',
      order: 1,
      active: true,
    },
  });

  const fundamentalSegment = await prisma.segment.create({
    data: {
      name: 'Ensino Fundamental',
      order: 2,
      active: true,
    },
  });

  const mediaSegment = await prisma.segment.create({
    data: {
      name: 'Ensino Médio',
      order: 3,
      active: true,
    },
  });

  console.log('✓ Created 3 educational segments');

  // ============ CREATE SERIES ============
  // Infantil Series
  const pre1 = await prisma.series.create({
    data: {
      name: 'Maternal',
      order: 1,
      segmentId: infantilSegment.id,
      active: true,
    },
  });

  const pre2 = await prisma.series.create({
    data: {
      name: 'Pré-Escolar I',
      order: 2,
      segmentId: infantilSegment.id,
      active: true,
    },
  });

  // Fundamental Series
  const fundamental1 = await prisma.series.create({
    data: {
      name: '1º Ano',
      order: 3,
      segmentId: fundamentalSegment.id,
      active: true,
    },
  });

  const fundamental2 = await prisma.series.create({
    data: {
      name: '2º Ano',
      order: 4,
      segmentId: fundamentalSegment.id,
      active: true,
    },
  });

  // High School Series
  const highSchool1 = await prisma.series.create({
    data: {
      name: '1ª Série',
      order: 11,
      segmentId: mediaSegment.id,
      active: true,
    },
  });

  console.log('✓ Created 5 series');

  // ============ CREATE CLASSES ============
  const classA1 = await prisma.class.create({
    data: {
      name: 'Maternal - Turma A',
      seriesId: pre1.id,
      defaultEntryTime: '08:00',
      defaultExitTime: '12:00',
      active: true,
    },
  });

  const classB1 = await prisma.class.create({
    data: {
      name: 'Maternal - Turma B',
      seriesId: pre1.id,
      defaultEntryTime: '08:00',
      defaultExitTime: '12:00',
      active: true,
    },
  });

  const class1A = await prisma.class.create({
    data: {
      name: '1º Ano - Turma A',
      seriesId: fundamental1.id,
      defaultEntryTime: '08:00',
      defaultExitTime: '17:00',
      active: true,
    },
  });

  const class1B = await prisma.class.create({
    data: {
      name: '1º Ano - Turma B',
      seriesId: fundamental1.id,
      defaultEntryTime: '08:00',
      defaultExitTime: '17:00',
      active: true,
    },
  });

  const class2A = await prisma.class.create({
    data: {
      name: '2º Ano - Turma A',
      seriesId: fundamental2.id,
      defaultEntryTime: '08:00',
      defaultExitTime: '17:00',
      active: true,
    },
  });

  const classHS1A = await prisma.class.create({
    data: {
      name: '1ª Série Médio - Turma A',
      seriesId: highSchool1.id,
      defaultEntryTime: '07:30',
      defaultExitTime: '17:30',
      active: true,
    },
  });

  console.log('✓ Created 6 classes');

  // ============ CREATE PRICES ============
  const price1 = await prisma.price.create({
    data: {
      type: 'MENSALIDADE',
      serviceName: 'Turno Integral',
      value: 1500.00,
      valuePerHour: 25.00,
      seriesId: pre1.id,
      active: true,
    },
  });

  const price2 = await prisma.price.create({
    data: {
      type: 'MENSALIDADE',
      serviceName: 'Período Estendido',
      value: 1200.00,
      valuePerHour: 30.00,
      seriesId: fundamental1.id,
      active: true,
    },
  });

  console.log('✓ Created 2 pricing plans');

  // ============ CREATE STUDENTS ============
  const students = [];
  const studentNames = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
    'Lucas Ferreira', 'Juliana Alves', 'Felipe Gomes', 'Carolina Rocha',
    'Gustavo Martins', 'Beatriz Lima', 'Rafael Sousa', 'Isabela Pires'
  ];

  const classIds = [classA1.id, classB1.id, class1A.id, class1B.id, class2A.id];
  const seriesIds = [pre1.id, pre1.id, fundamental1.id, fundamental1.id, fundamental2.id];

  for (let i = 0; i < studentNames.length; i++) {
    const student = await prisma.student.create({
      data: {
        name: studentNames[i],
        dateOfBirth: new Date(2020 + Math.floor(i / 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        cpf: `123.456.${String(i).padStart(3, '0')}-00`,
        classId: classIds[i % 5],
        seriesId: seriesIds[i % 5],
        guardianName: `Responsável ${studentNames[i]}`,
        guardianEmail: `responsavel${i}@email.com`,
        guardianPhone: `(51) 9999${String(i).padStart(5, '0')}`,
        status: i < 10 ? 'ATIVO' : 'INATIVO',
        active: i < 10,
      },
    });
    students.push(student);
  }

  console.log(`✓ Created ${students.length} students`);

  // ============ CREATE CONTRACT MATRICES ============
  const contractData = [
    { dayOfWeek: 0, entryTime: '08:00', exitTime: '12:00', services: { lunch: true, activities: true } },
    { dayOfWeek: 1, entryTime: '08:00', exitTime: '17:00', services: { lunch: true, activities: true, afternoon: true } },
    { dayOfWeek: 2, entryTime: '08:00', exitTime: '12:00', services: { lunch: true } },
    { dayOfWeek: 3, entryTime: '08:00', exitTime: '17:00', services: { lunch: true, activities: true, afternoon: true } },
    { dayOfWeek: 4, entryTime: '08:00', exitTime: '12:00', services: { lunch: true, activities: true } },
  ];

  let contractCount = 0;
  for (const student of students.slice(0, 8)) {
    for (const contract of contractData) {
      await prisma.contractMatrix.create({
        data: {
          studentId: student.id,
          dayOfWeek: contract.dayOfWeek,
          entryTime: contract.entryTime,
          exitTime: contract.exitTime,
          services: contract.services,
        },
      });
      contractCount++;
    }
  }

  console.log(`✓ Created ${contractCount} contract matrix entries`);

  // ============ CREATE EXTRA HOURS ============
  const today = new Date();
  let extraHoursCount = 0;

  for (const student of students.slice(0, 5)) {
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);

      await prisma.extraHours.create({
        data: {
          studentId: student.id,
          date,
          hoursCalculated: 1.42, // 85 minutes = 1.42 hours
        },
      });
      extraHoursCount++;
    }
  }

  console.log(`✓ Created ${extraHoursCount} extra hours records`);

  // ============ CREATE AUDIT LOGS ============
  const auditLog = await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      table: 'students',
      recordId: students[0].id,
      userId: adminUser.id,
      description: `Aluno ${students[0].name} matriculado com sucesso`,
      newValue: { name: students[0].name, status: 'ATIVO' },
      ipAddress: '127.0.0.1',
      userAgent: 'Seed Script',
    },
  });

  console.log('✓ Created audit log entry');

  // ============ SUMMARY ============
  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Data Summary:');
  console.log(`   Users: 3 (1 Admin, 1 Manager, 1 Operator)`);
  console.log(`   Segments: 3`);
  console.log(`   Series: 5`);
  console.log(`   Classes: 6`);
  console.log(`   Students: ${students.length}`);
  console.log(`   Contract Matrix: ${contractCount}`);
  console.log(`   Extra Hours: ${extraHoursCount}`);
  console.log(`   Prices: 2`);
  console.log('\n🔐 Test Credentials:');
  console.log(`   Admin    → admin@school.com / 123456`);
  console.log(`   Manager  → gerente@school.com / 123456`);
  console.log(`   Operator → operador@school.com / 123456`);
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
