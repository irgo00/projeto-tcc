export interface Van {
  id: number;
  nome: string;
  prestador: string;
  rota: string;
  horario: Record<"manha" | "tarde" | "noite", string>;
  vagas: number;
  avaliacao: number;
  totalAvaliacoes: number;
  telefone: string;
  email: string;
}
