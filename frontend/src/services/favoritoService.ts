import api from './api';

export const favoritoService = {
  listar: async (): Promise<number[]> => {
    const response = await api.get<number[]>('/favoritos');
    return response.data;
  },

  adicionar: async (vanId: number): Promise<void> => {
    await api.post('/favoritos', { van_id: vanId });
  },

  remover: async (vanId: number): Promise<void> => {
    await api.delete(`/favoritos/${vanId}`);
  },

  isFavorito: async (vanId: number): Promise<boolean> => {
    try {
      const response = await api.get<{ isFavorito: boolean }>(`/favoritos/check/${vanId}`);
      return response.data.isFavorito;
    } catch {
      return false;
    }
  },
};
export default favoritoService;

