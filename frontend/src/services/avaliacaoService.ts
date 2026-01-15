import api from './api';

export const avaliacaoService = {
  // Criar avaliação
  criar: async (avaliacaoData) => {
    try {
      const response = await api.post('/avaliacoes', avaliacaoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar avaliação');
    }
  },

  // Listar avaliações de uma van
  listarPorVan: async (vanId) => {
    try {
      const response = await api.get(`/avaliacoes/van/${vanId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao listar avaliações');
    }
  },

  // Minhas avaliações
  minhas: async () => {
    try {
      const response = await api.get('/avaliacoes/minhas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar suas avaliações');
    }
  },
};