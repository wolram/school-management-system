import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import authRoutes from './routes/auth';
import academicRoutes from './routes/academic';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import priceRoutes from './routes/prices';
import calculationRoutes from './routes/calculations';
import { prisma } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============ Middlewares Globais ============
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost port during development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ Logging Simples ============
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// ============ Rotas ============

/**
 * GET /
 * Health check
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'School Management System API',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

/**
 * GET /health
 * Health check detalhado
 */
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Testar conexão com banco de dados
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      status: 'OK',
      database: 'connected',
      node_env: NODE_ENV,
      timestamp: new Date(),
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'SERVICE_UNAVAILABLE',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date(),
    });
  }
});

/**
 * Incluir rotas de autenticação
 */
app.use('/api/auth', authRoutes);

/**
 * Incluir rotas do módulo acadêmico
 */
app.use('/api/academic', academicRoutes);

/**
 * Incluir rotas de estudantes
 */
app.use('/api/students', studentRoutes);

/**
 * Incluir rotas de professores
 */
app.use('/api/teachers', teacherRoutes);

/**
 * Incluir rotas de preços
 */
app.use('/api/prices', priceRoutes);

/**
 * Incluir rotas de cálculos financeiros
 */
app.use('/api/calculations', calculationRoutes);

// ============ Tratamento de Erros ============

/**
 * 404 - Rota não encontrada
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.path,
    timestamp: new Date(),
  });
});

/**
 * Error handler global
 */
app.use((err: any, req: Request, res: Response, next) => {
  console.error('Erro:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date(),
  });
});

// ============ Iniciar Servidor ============
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🎓 School Management System API             ║
║  Environment: ${NODE_ENV.padEnd(37)}║
║  Port: ${String(PORT).padEnd(42)}║
║  Started: ${new Date().toLocaleString('pt-BR').padEnd(39)}║
╚════════════════════════════════════════════════╝
  `);
  console.log(`\n📚 API Documentation:\n`);
  console.log(`  Health Check:    GET  http://localhost:${PORT}/health`);
  console.log(`  API Root:        GET  http://localhost:${PORT}/`);
  console.log(`  Auth Routes:     POST http://localhost:${PORT}/api/auth/login`);
  console.log(`\n`);
});

export default app;
