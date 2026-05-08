import api from "./api";
import type { Van } from "../types/Van";

export const favoritoService = {
  listar: async (): Promise<Van[]> => {
    const response = await api.get("/favoritos");
    return response.data;
  },

  adicionar: async (vanId: number): Promise<void> => {
    await api.post("/favoritos", { van_id: vanId });
  },

  remover: async (vanId: number): Promise<void> => {
    await api.delete(`/favoritos/${vanId}`);
  },

  verificar: async (vanId: number): Promise<boolean> => {
    const response = await api.get(`/favoritos/check/${vanId}`);
    return response.data.isFavorito as boolean;
  },
};

export default favoritoService;
