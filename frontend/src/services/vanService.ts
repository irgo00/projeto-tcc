import api from './api';

export const vanService = {
  // Buscar vans
  buscar: async (filtros) => {
    try {
      const response = await api.post('/vans/buscar', filtros);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar vans');
    }
  },

  // Listar todas as vans
  listar: async () => {
    try {
      const response = await api.get('/vans');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao listar vans');
    }
  },

  // Detalhes da van
  detalhes: async (id) => {
    try {
      const response = await api.get(`/vans/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar detalhes');
    }
  },

  // Criar van (prestador)
  criar: async (vanData) => {
    try {
      const response = await api.post('/vans', vanData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar van');
    }
  },

  // Atualizar van (prestador)
  atualizar: async (id, vanData) => {
    try {
      const response = await api.put(`/vans/${id}`, vanData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar van');
    }
  },

  // Deletar van (prestador)
  deletar: async (id) => {
    try {
      await api.delete(`/vans/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar van');
    }
  },

  // Minhas vans (prestador)
  minhasVans: async () => {
    try {
      const response = await api.get('/vans/minhas');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar suas vans');
    }
  },
};