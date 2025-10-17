import { Request, Response } from 'express';
import { login, signUp, changePassword, getUserById, getAllUsers } from '../services/authService';
import { ApiResponse } from '../types';

/**
 * POST /auth/login
 * Fazer login
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const result = await login(email, password);

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date(),
    } as ApiResponse<typeof result>);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Erro ao fazer login',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
};

/**
 * POST /auth/signup
 * Registrar novo usuário (requer autenticação + perfil ADMIN)
 */
export const signUpController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const { email, password, name, profile } = req.body;

    const result = await signUp(
      { email, password, name, profile },
      req.user.userId,
      (req as any).auditContext
    );

    res.status(201).json({
      success: true,
      data: result,
      message: 'Usuário criado com sucesso',
      timestamp: new Date(),
    } as ApiResponse<typeof result>);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Erro ao criar usuário',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
};

/**
 * GET /auth/me
 * Obter dados do usuário autenticado
 */
export const getMeController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const user = await getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      data: user,
      timestamp: new Date(),
    } as ApiResponse<typeof user>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar dados do usuário',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
};

/**
 * GET /auth/users
 * Listar todos os usuários (apenas ADMIN)
 */
export const listUsersController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    if (req.user.profile !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Apenas administradores podem listar usuários',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const result = await getAllUsers(Number(limit), skip);

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date(),
    } as ApiResponse<typeof result>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar usuários',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
};

/**
 * POST /auth/change-password
 * Alterar senha do usuário autenticado
 */
export const changePasswordController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Senha atual e nova senha são obrigatórias',
        timestamp: new Date(),
      } as ApiResponse<null>);
    }

    await changePassword(
      req.user.userId,
      oldPassword,
      newPassword,
      (req as any).auditContext
    );

    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso',
      timestamp: new Date(),
    } as ApiResponse<null>);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Erro ao alterar senha',
      timestamp: new Date(),
    } as ApiResponse<null>);
  }
};
