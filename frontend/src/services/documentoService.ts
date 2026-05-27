import api from './api';
import type {
  Documento,
  MeusDocumentosResponse,
  AdminStats,
  PrestadorAdmin,
  DocumentoStatus,
  DocumentoTipo,
} from '../types/Documento';

// =====================================================
// Prestador
// =====================================================

export const documentoService = {
  /**
   * Retorna os documentos do prestador autenticado + progresso de habilitação.
   * GET /documentos/meus
   */
  meus: async (): Promise<MeusDocumentosResponse> => {
    const response = await api.get('/documentos/meus');
    return response.data;
  },

  /**
   * Envia um novo documento.
   * POST /documentos
   */
  enviar: async (tipo: DocumentoTipo, arquivo: File): Promise<Documento> => {
    const form = new FormData();
    form.append('tipo', tipo);
    form.append('arquivo', arquivo);
    const response = await api.post('/documentos', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.documento;
  },

  /**
   * Reenvio de documento com correção solicitada.
   * POST /documentos/{id}/reenviar
   */
  reenviar: async (id: number, arquivo: File): Promise<Documento> => {
    const form = new FormData();
    form.append('arquivo', arquivo);
    const response = await api.post(`/documentos/${id}/reenviar`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.documento;
  },
};

// =====================================================
// Admin
// =====================================================

export const adminService = {
  /**
   * Estatísticas gerais.
   * GET /admin/stats
   */
  stats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data.stats;
  },

  /**
   * Lista prestadores com status de habilitação.
   * GET /admin/prestadores
   */
  prestadores: async (filtros?: {
    status_habilitacao?: string;
    page?: number;
  }): Promise<{ data: PrestadorAdmin[]; total: number }> => {
    const response = await api.get('/admin/prestadores', { params: filtros });
    const { data, total } = response.data.prestadores;
    return { data, total };
  },

  /**
   * Lista documentos com filtros.
   * GET /admin/documentos
   */
  documentos: async (filtros?: {
    status?: DocumentoStatus;
    tipo?: DocumentoTipo;
    prestador_id?: number;
    page?: number;
  }): Promise<{ data: Documento[]; total: number }> => {
    const response = await api.get('/admin/documentos', { params: filtros });
    const { data, total } = response.data.documentos;
    return { data, total };
  },

  /**
   * Documentos de um prestador específico.
   * GET /admin/documentos/prestador/{id}
   */
  documentosPorPrestador: async (prestadorId: number): Promise<{
    prestador: { id: number; nome: string; email: string };
    documentos: Documento[];
    progresso: MeusDocumentosResponse['progresso'];
  }> => {
    const response = await api.get(`/admin/documentos/prestador/${prestadorId}`);
    return response.data;
  },

  /**
   * Aprova um documento.
   * PUT /admin/documentos/{id}/aprovar
   */
  aprovar: async (id: number): Promise<Documento> => {
    const response = await api.put(`/admin/documentos/${id}/aprovar`);
    return response.data.documento;
  },

  /**
   * Reprova um documento.
   * PUT /admin/documentos/{id}/reprovar
   */
  reprovar: async (id: number, observacao: string): Promise<Documento> => {
    const response = await api.put(`/admin/documentos/${id}/reprovar`, { observacao });
    return response.data.documento;
  },

  /**
   * Solicita correção de um documento.
   * PUT /admin/documentos/{id}/correcao
   */
  solicitarCorrecao: async (id: number, observacao: string): Promise<Documento> => {
    const response = await api.put(`/admin/documentos/${id}/correcao`, { observacao });
    return response.data.documento;
  },
};

export default documentoService;
