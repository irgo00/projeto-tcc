export interface HistoricoItem {
  id: number;
  van: string;
  prestador: string;
  tipo_contato: "telefone" | "email" | "whatsapp";
  data: string;
}
