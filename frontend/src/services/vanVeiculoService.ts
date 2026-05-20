import api from "./api";
import type { VanVeiculo } from "../types/VanVeiculo";

export const vanVeiculoService = {
  minhas: async (): Promise<VanVeiculo[]> => {
    const response = await api.get("/veiculos/minhas");
    return response.data.vans;
  },

  detalhes: async (id: number): Promise<VanVeiculo> => {
    const response = await api.get(`/veiculos/${id}`);
    return response.data.van;
  },

  criar: async (data: object): Promise<VanVeiculo> => {
    const response = await api.post("/veiculos", data);
    return response.data.van;
  },

  atualizar: async (id: number, data: object): Promise<VanVeiculo> => {
    const response = await api.put(`/veiculos/${id}`, data);
    return response.data.van;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/veiculos/${id}`);
  },

  uploadFotos: async (id: number, arquivos: File[]): Promise<void> => {
    const form = new FormData();
    arquivos.forEach(f => form.append("fotos[]", f));
    await api.post(`/veiculos/${id}/fotos`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deletarFoto: async (vanId: number, fotoId: number): Promise<void> => {
    await api.delete(`/veiculos/${vanId}/fotos/${fotoId}`);
  },

  setPrincipal: async (vanId: number, fotoId: number): Promise<void> => {
    await api.put(`/veiculos/${vanId}/fotos/${fotoId}/principal`);
  },
};
