export type AuthMode = 'login' | 'cadastro';

export interface User {
  id: string;                 // ⬅️ adicione
  nome?: string;              // ⬅️ torne opcional
  email: string;
  telefone?: string;
  cpf?: string;
  tipo?: 'prestador' | 'cliente'; // ⬅️ opcional
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
