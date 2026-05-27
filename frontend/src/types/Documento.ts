// =====================================================
// Documento.ts  —  tipos relacionados a documentos
//                  e habilitação do prestador
// =====================================================

export type DocumentoTipo =
  | 'cnh'
  | 'crlv'
  | 'antecedentes'
  | 'laudo_tecnico'
  | 'outros';

export type DocumentoStatus =
  | 'pendente'
  | 'aprovado'
  | 'reprovado'
  | 'correcao';

export type StatusHabilitacao =
  | 'pendente'
  | 'habilitado'
  | 'reprovado';

export interface Documento {
  id: number;
  tipo: DocumentoTipo;
  tipo_label: string;
  nome_original: string;
  url: string;
  tamanho_formatado: string;
  status: DocumentoStatus;
  status_label: string;
  observacao_admin?: string | null;
  revisado_em?: string | null;
  enviado_em: string;
  /** Presente apenas em respostas do admin */
  prestador?: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface EtapasHabilitacao {
  email_verificado: boolean;
  telefone_verificado: boolean;
  documentos_enviados: boolean;
  documentos_aprovados: boolean;
  perfil_validado: boolean;
}

export interface ProgressoHabilitacao {
  etapas: EtapasHabilitacao;
  percentual: number;
  habilitado: boolean;
}

export interface MeusDocumentosResponse {
  success: boolean;
  documentos: Documento[];
  progresso: ProgressoHabilitacao;
}

// =====================================================
// Admin
// =====================================================

export interface PrestadorAdmin {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  email_verificado: boolean;
  telefone_verificado: boolean;
  status_habilitacao: StatusHabilitacao;
  documentos_total: number;
  docs_aprovados: number;
  docs_pendentes: number;
  docs_reprovados: number;
  docs_correcao: number;
  cadastrado_em: string;
}

export interface AdminStats {
  total_prestadores: number;
  prestadores_habilitados: number;
  docs_pendentes: number;
  docs_aprovados: number;
  docs_reprovados: number;
  docs_correcao: number;
}
