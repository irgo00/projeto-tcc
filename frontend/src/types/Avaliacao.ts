export interface AvaliacaoItem {
  id: number;
  usuario: string;
  nota: number;
  comentario?: string;
  data: string;
}

export interface AvaliacaoRecebida {
  id: number;
  usuario: string;
  van: string;
  nota: number;
  comentario?: string;
  data: string;
}

export interface MinhaAvaliacao {
  id: number;
  van: string;
  nota: number;
  comentario?: string;
  data: string;
}

export interface Avaliacao {
  id?: number;
  vanId: number;
  nota: number;
  comentario?: string;
}
