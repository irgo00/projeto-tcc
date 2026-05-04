import api from "./api";
import type { AvaliacaoItem, MinhaAvaliacao } from "../types/Avaliacao";

export const avaliacaoService = {
  criar: async ({
    vanId,
    nota,
    comentario,
  }: {
    vanId: number;
    nota: number;
    comentario?: string;
  }): Promise<void> => {
    await api.post("/avaliacoes", { van_id: vanId, nota, comentario });
  },

  listarPorVan: async (vanId: number): Promise<AvaliacaoItem[]> => {
    const response = await api.get(`/avaliacoes/van/${vanId}`);
    return response.data;
  },

  minhas: async (): Promise<MinhaAvaliacao[]> => {
    const response = await api.get("/avaliacoes/minhas");
    return response.data;
  },
};

export default avaliacaoService;
