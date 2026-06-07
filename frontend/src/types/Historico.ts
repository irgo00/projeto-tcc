export interface HistoricoItem {
  id: number;
  van: string;
  tipo_contato: "telefone" | "email" | "whatsapp";
  data: string;
}
