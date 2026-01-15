import api from './api';

export const favoritoService = {
  // Listar favoritos
  listar: async () => {
    try {
      const response = await api.get('/favoritos');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao listar favoritos');
    }
  },

  // Adicionar favorito
  adicionar: async (vanId) => {
    try {
      const response = await api.post('/favoritos', { van_id: vanId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao adicionar favorito');
    }
  },

  // Remover favorito
  remover: async (vanId) => {
    try {
      await api.delete(`/favoritos/${vanId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao remover favorito');
    }
  },

  // Verificar se é favorito
  isFavorito: async (vanId) => {
    try {
      const response = await api.get(`/favoritos/check/${vanId}`);
      return response.data.isFavorito;
    } catch (error) {
      return false;
    }
  },
};