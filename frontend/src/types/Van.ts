export interface Van {
  id: number;
  nome: string;
  prestador: string;
  rota: string;
  horario: Partial<Record<"manha" | "tarde" | "noite", string>>;
  vagas: number;
  avaliacao: number;
  totalAvaliacoes: number;
  telefone: string;
  email: string;
  origem?: string;
  destino?: string;
  instituicao?: string;
  horario_manha?: string;
  horario_tarde?: string;
  horario_noite?: string;
  vagas_totais?: number;
  vagas_disponiveis?: number;
  valor_mensal?: number;
  ativa?: boolean;
  criadoEm?: string;
}

export interface VanFormData {
  nome: string;
  origem: string;
  destino: string;
  instituicao: string;
  rota: string;
  horario_manha: string;
  horario_tarde: string;
  horario_noite: string;
  vagas_totais: string;
  valor_mensal: string;
  telefone: string;
  email: string;
}
