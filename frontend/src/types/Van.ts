export interface VanVeiculoInfo {
  id: number;
  modelo: string;
  marca: string;
  placa: string;
  ano?: number;
  cor?: string;
  ar_condicionado?: boolean;
  camera_interna?: boolean;
  porta_automatica?: boolean;
  wifi?: boolean;
  acessibilidade?: boolean;
  usb_carregador?: boolean;
  outros_itens?: string;
  fotos?: Array<{ id: number; url: string; principal: boolean; ordem: number }>;
}

export interface Van {
  id: number;
  nome: string;
  prestador: string;
  rota: string;
  coordenadas?: Coordenada[];
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
  van_id?: number;
  van?: VanVeiculoInfo | null;
  foto_principal_url?: string;
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
  van_id: string;
}
