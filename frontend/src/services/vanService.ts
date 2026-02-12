import api from "./api";
import type { Van } from "../types/Van";

export const vanService = {
  buscar: async (filtros: Partial<Van>): Promise<Van[]> => {
    const response = await api.post("/vans/buscar", filtros);
    return response.data.vans;
  },

  listar: async (): Promise<Van[]> => {
    const response = await api.get("/vans");
    return response.data.vans;
  },

  detalhes: async (id: number): Promise<Van> => {
    const response = await api.get(`/vans/${id}`);
    return response.data.van;
  },

  criar: async (vanData: Omit<Van, "id">): Promise<Van> => {
    const response = await api.post("/vans", vanData);
    return response.data;
  },

  atualizar: async (id: number, vanData: Partial<Van>): Promise<Van> => {
    const response = await api.put(`/vans/${id}`, vanData);
    return response.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/vans/${id}`);
  },

  minhasVans: async (): Promise<Van[]> => {
    const response = await api.get("/vans/minhas");
    return response.data.vans;
  },
};
