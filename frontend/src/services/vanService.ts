import api from './api';
import type { Van } from '../types/Van';

export const vanService = {
  buscar: async (filtros: Partial<Van>): Promise<Van[]> => {
    const response = await api.post<Van[]>('/vans/buscar', filtros);
    return response.data;
  },

  listar: async (): Promise<Van[]> => {
    const response = await api.get<Van[]>('/vans');
    return response.data;
  },

  detalhes: async (id: number): Promise<Van> => {
    const response = await api.get<Van>(`/vans/${id}`);
    return response.data;
  },

  criar: async (vanData: Omit<Van, 'id'>): Promise<Van> => {
    const response = await api.post<Van>('/vans', vanData);
    return response.data;
  },

  atualizar: async (id: number, vanData: Partial<Van>): Promise<Van> => {
    const response = await api.put<Van>(`/vans/${id}`, vanData);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/vans/${id}`);
  },

  minhasVans: async (): Promise<Van[]> => {
    const response = await api.get<Van[]>('/vans/minhas');
    return response.data;
  },
};
