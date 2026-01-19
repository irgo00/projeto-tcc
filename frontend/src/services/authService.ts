import api from './api';
import type { User } from '../types';
import type { AxiosError } from 'axios';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (email: string, senha: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/login', { email, senha });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || 'Erro ao fazer login');
    }
  },

  register: async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || 'Erro ao criar conta');
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? (JSON.parse(userStr) as User) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<{ user: User }>('/profile', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  changePassword: async (senhaAtual: string, novaSenha: string): Promise<void> => {
    try {
      await api.post('/change-password', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || 'Erro ao alterar senha');
    }
  },
};
export default authService;
