import api from "./api";
import type { HistoricoItem } from "../types/Historico";

export type TipoContato = "telefone" | "email" | "whatsapp";

export const historicoService = {
  registrar: async (vanId: number, tipoContato: TipoContato = "telefone"): Promise<void> => {
    await api.post("/historico/registrar", { van_id: vanId, tipo_contato: tipoContato });
  },

  listar: async (): Promise<HistoricoItem[]> => {
    const response = await api.get("/historico");
    return response.data.historico.data as HistoricoItem[];
  },
};

export default historicoService;
