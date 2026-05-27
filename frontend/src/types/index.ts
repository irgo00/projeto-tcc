export type AuthMode = 'login' | 'cadastro';

export interface User {
  id: string;
  nome?: string;
  email: string;
  telefone?: string;
  cpf?: string;
  /** 'cliente' | 'prestador' | 'admin' */
  tipo?: 'prestador' | 'cliente' | 'admin';
  /** Presente apenas para prestadores */
  status_habilitacao?: 'pendente' | 'habilitado' | 'reprovado';
  email_verificado?: boolean;
  telefone_verificado?: boolean;
}

export interface Van {
  id: number;
  nome: string;
  prestador: string;
  rota: string;
  horario: string;
  vagas: number;
  avaliacao: number;
  totalAvaliacoes: number;
  telefone?: string;
  email?: string;
}

export interface SearchFilters {
  periodo: any;
  origem?: string;
  instituicao?: string;
}