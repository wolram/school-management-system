import bcryptjs from 'bcryptjs';
import { prisma } from '../config/database';
import { generateToken } from '../middleware/auth';
import { JWTPayload } from '../types';
import { authSchema, createUserSchema } from '../utils/validation';
import { auditCreate } from '../middleware/audit';
import { ZodError } from 'zod';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    profile: string;
  };
}

interface SignUpResponse extends LoginResponse {}

/**
 * Fazer login com email e senha
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // Validar formato
    const validated = authSchema.parse({ email, password });

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    if (!user.active) {
      throw new Error('Usuário inativo');
    }

    // Validar senha
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos');
    }

    // Gerar token
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      profile: user.profile,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validação falhou: ${error.errors[0].message}`);
    }
    throw error;
  }
};

/**
 * Registrar novo usuário (apenas ADMIN pode criar outros usuários)
 */
export const signUp = async (
  data: {
    email: string;
    password: string;
    name: string;
    profile?: 'ADMIN' | 'GERENTE' | 'OPERADOR';
  },
  createdByUserId: string,
  auditContext?: any
): Promise<SignUpResponse> => {
  try {
    // Validar dados
    const validated = createUserSchema.parse(data);

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcryptjs.hash(validated.password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        name: validated.name,
        profile: validated.profile,
        active: true,
      },
    });

    // Registrar na auditoria
    await auditCreate(
      createdByUserId,
      'users',
      user.id,
      {
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
      `Novo usuário criado: ${user.name} (${user.email}) com perfil ${user.profile}`,
      auditContext
    );

    // Gerar token
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      profile: user.profile,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validação falhou: ${error.errors[0].message}`);
    }
    throw error;
  }
};

/**
 * Alterar senha do usuário
 */
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  auditContext?: any
): Promise<void> => {
  try {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Validar senha antiga
    const passwordMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Senha atual incorreta');
    }

    // Validar nova senha
    if (newPassword.length < 8) {
      throw new Error('Nova senha deve ter no mínimo 8 caracteres');
    }

    // Hash da nova senha
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Registrar na auditoria
    await auditCreate(
      userId,
      'users',
      userId,
      {},
      `Usuário ${user.email} alterou sua senha`,
      auditContext
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Obter dados do usuário
 */
export const getUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      profile: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Listar todos os usuários (apenas ADMIN)
 */
export const getAllUsers = async (limit = 50, skip = 0) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      profile: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip,
  });

  const total = await prisma.user.count();

  return {
    data: users,
    total,
    page: Math.floor(skip / limit) + 1,
    limit,
  };
};

/**
 * Desativar usuário (apenas ADMIN)
 */
export const deactivateUser = async (
  userId: string,
  deactivatedByUserId: string,
  auditContext?: any
): Promise<void> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { active: false },
  });

  await auditCreate(
    deactivatedByUserId,
    'users',
    userId,
    { active: false },
    `Usuário ${user.email} foi desativado`,
    auditContext
  );
};
