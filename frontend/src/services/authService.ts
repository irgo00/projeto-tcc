import api from './api';

export const authService = {
  // Login
  login: async (email, senha) => {
    try {
      const response = await api.post('/login', { email, senha });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar conta');
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Atualizar perfil
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/profile', userData);
      const { user } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  },

  // Alterar senha
  changePassword: async (senhaAtual, novaSenha) => {
    try {
      await api.post('/change-password', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  },
};