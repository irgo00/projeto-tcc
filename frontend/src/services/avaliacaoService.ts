import api from "./api";
import type { Avaliacao } from "../types/Avaliacao";

export const avaliacaoService = {
  criar: async ({
    vanId,
    nota,
    comentario,
  }: Pick<Avaliacao, "vanId" | "nota" | "comentario">): Promise<Avaliacao> => {
    const response = await api.post("/avaliacoes", { van_id: vanId, nota, comentario });
    return response.data;
  },

  listarPorVan: async (vanId: number): Promise<Avaliacao[]> => {
    const response = await api.get(`/avaliacoes/van/${vanId}`);
    return response.data;
  },

  minhas: async (): Promise<Avaliacao[]> => {
    const response = await api.get("/avaliacoes/minhas");
    return response.data;
  },
};

export default avaliacaoService;