import api from "./api";
import type { Avaliacao } from "../types/Avaliacao";

export const avaliacaoService = {
  criar: async (
    avaliacaoData: Omit<Avaliacao, "id" | "createdAt">
  ): Promise<Avaliacao> => {
    const response = await api.post<Avaliacao>("/avaliacoes", avaliacaoData);
    return response.data;
  },

  listarPorVan: async (vanId: number): Promise<Avaliacao[]> => {
    const response = await api.get<Avaliacao[]>(`/avaliacoes/van/${vanId}`);
    return response.data;
  },

  minhas: async (): Promise<Avaliacao[]> => {
    const response = await api.get<Avaliacao[]>("/avaliacoes/minhas");
    return response.data;
  },
};
export default avaliacaoService;
