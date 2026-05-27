import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import {
  Users, FileCheck, Clock, CheckCircle2, XCircle, RefreshCw,
  Eye, Check, X, AlertTriangle, Loader2, Search, Filter,
  ShieldCheck, ChevronRight, BarChart3, FileText, Car, IdCard,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { adminService } from '../../services/documentoService';
import type { AdminStats, PrestadorAdmin, Documento, DocumentoStatus } from '../../types/Documento';
import type { AuthMode } from '../../types';

// ─── tipos locais ─────────────────────────────────────────────────────────────

interface DashboardAdminProps {
  onOpenAuth: (mode: AuthMode) => void;
}

type Aba = 'overview' | 'prestadores' | 'documentos';

// ─── helpers visuais ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    pendente:  'bg-amber-50 text-amber-700 border-amber-200',
    aprovado:  'bg-green-50 text-green-700 border-green-200',
    reprovado: 'bg-red-50   text-red-700   border-red-200',
    correcao:  'bg-blue-50  text-blue-700  border-blue-200',
    habilitado:'bg-green-50 text-green-700 border-green-200',
  };
  const dot: Record<string, string> = {
    pendente: 'bg-amber-400', aprovado: 'bg-green-500',
    reprovado: 'bg-red-500',  correcao: 'bg-blue-500',
    habilitado: 'bg-green-500',
  };
  const labels: Record<string, string> = {
    pendente: 'Pendente', aprovado: 'Aprovado', reprovado: 'Reprovado',
    correcao: 'Correção sol.', habilitado: 'Habilitado',
  };
  const cls = cfg[status] ?? cfg.pendente;
  const d   = dot[status]  ?? dot.pendente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${d}`} />
      {labels[status] ?? status}
    </span>
  );
}

const TIPO_ICONS: Record<string, React.ReactNode> = {
  cnh:           <IdCard  className="w-4 h-4" />,
  crlv:          <Car     className="w-4 h-4" />,
  antecedentes:  <ShieldCheck className="w-4 h-4" />,
  laudo_tecnico: <FileText className="w-4 h-4" />,
  outros:        <FileText className="w-4 h-4" />,
};

// ─── modal de revisão de documento ───────────────────────────────────────────

interface ReviewModalProps {
  doc: Documento | null;
  isOpen: boolean;
  onClose: () => void;
  onAtualizado: (doc: Documento) => void;
}

function ReviewModal({ doc, isOpen, onClose, onAtualizado }: ReviewModalProps) {
  const [acao, setAcao] = useState<'aprovar' | 'reprovar' | 'correcao' | null>(null);
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) { setAcao(null); setObservacao(''); setErro(null); }
  }, [isOpen, doc]);

  if (!doc) return null;

  const handleConfirmar = async () => {
    if ((acao === 'reprovar' || acao === 'correcao') && !observacao.trim()) {
      setErro('Informe o motivo.'); return;
    }
    setLoading(true); setErro(null);
    try {
      let updated: Documento;
      if (acao === 'aprovar') {
        updated = await adminService.aprovar(doc.id);
      } else if (acao === 'reprovar') {
        updated = await adminService.reprovar(doc.id, observacao.trim());
      } else {
        updated = await adminService.solicitarCorrecao(doc.id, observacao.trim());
      }
      onAtualizado(updated);
      onClose();
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao processar ação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Analisar documento" size="md">
      <div className="space-y-5">
        {/* info doc */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              {TIPO_ICONS[doc.tipo] ?? <FileText className="w-4 h-4" />}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{doc.tipo_label}</p>
              <p className="text-xs text-gray-500">{doc.prestador?.nome ?? '—'}</p>
            </div>
            <StatusBadge status={doc.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div><span className="text-gray-400">Arquivo:</span> {doc.nome_original}</div>
            <div><span className="text-gray-400">Tamanho:</span> {doc.tamanho_formatado}</div>
            <div><span className="text-gray-400">Enviado em:</span> {doc.enviado_em}</div>
            {doc.revisado_em && <div><span className="text-gray-400">Revisado em:</span> {doc.revisado_em}</div>}
          </div>
        </div>

        {/* pré-visualização */}
        <div className="border border-gray-200 rounded-xl bg-gray-50 p-8 text-center">
          <FileText className="w-10 h-10 text-purple-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">{doc.nome_original}</p>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-white border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
          >
            <Eye className="w-4 h-4" /> Abrir documento
          </a>
        </div>

        {/* observação anterior */}
        {doc.observacao_admin && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-sm text-amber-800">
            <p className="font-medium mb-1">Observação anterior:</p>
            {doc.observacao_admin}
          </div>
        )}

        {/* ação */}
        {doc.status !== 'aprovado' && (
          <>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Ação</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'aprovar',   label: 'Aprovar',          cls: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100', activeCls: 'ring-2 ring-green-400' },
                  { id: 'reprovar',  label: 'Reprovar',         cls: 'bg-red-50   border-red-200   text-red-700   hover:bg-red-100',   activeCls: 'ring-2 ring-red-400'   },
                  { id: 'correcao',  label: 'Solicitar correção',cls: 'bg-blue-50  border-blue-200  text-blue-700  hover:bg-blue-100',  activeCls: 'ring-2 ring-blue-400'  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setAcao(opt.id as any); setErro(null); }}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${opt.cls} ${acao === opt.id ? opt.activeCls : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {(acao === 'reprovar' || acao === 'correcao') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {acao === 'reprovar' ? 'Motivo da reprovação' : 'O que precisa ser corrigido'}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={observacao}
                  onChange={e => { setObservacao(e.target.value); setErro(null); }}
                  placeholder={acao === 'reprovar'
                    ? 'Descreva o motivo para que o prestador tome as ações necessárias...'
                    : 'Ex: Documento com data vencida. Por favor, reenvie a versão atualizada...'}
                  rows={3}
                  maxLength={1000}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
                />
                <div className="flex justify-between mt-1">
                  {erro ? <p className="text-xs text-red-600">{erro}</p> : <span />}
                  <p className="text-xs text-gray-400">{observacao.length}/1000</p>
                </div>
              </div>
            )}

            {acao && (
              <div className="flex gap-2 pt-1">
                <Button variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  variant={acao === 'aprovar' ? 'primary' : 'danger'}
                  loading={loading}
                  onClick={handleConfirmar}
                  className="flex-1"
                >
                  {acao === 'aprovar' ? 'Confirmar aprovação' : acao === 'reprovar' ? 'Confirmar reprovação' : 'Enviar solicitação'}
                </Button>
              </div>
            )}
          </>
        )}

        {doc.status === 'aprovado' && (
          <p className="text-center text-sm text-green-600 font-medium py-2">
            ✓ Este documento já foi aprovado.
          </p>
        )}
      </div>
    </Modal>
  );
}

// ─── componente principal ─────────────────────────────────────────────────────

export default function DashboardAdmin({ onOpenAuth }: DashboardAdminProps) {
  const [aba, setAba] = useState<Aba>('overview');

  // stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // prestadores
  const [prestadores, setPrestadores] = useState<PrestadorAdmin[]>([]);
  const [prestadoresLoading, setPrestadoresLoading] = useState(false);
  const [filtroPrestador, setFiltroPrestador] = useState('');
  const [filtroHab, setFiltroHab] = useState('');
  const [buscaPrestador, setBuscaPrestador] = useState('');

  // documentos
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<DocumentoStatus | ''>('');
  const [docReview, setDocReview] = useState<Documento | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  // prestador selecionado (drill-down)
  const [prestadorSel, setPrestadorSel] = useState<PrestadorAdmin | null>(null);
  const [docsPrestador, setDocsPrestador] = useState<Documento[]>([]);
  const [docsPrestadorLoading, setDocsPrestadorLoading] = useState(false);

  // ── carregamentos ──

  const carregarStats = useCallback(async () => {
    setStatsLoading(true);
    try { setStats(await adminService.stats()); }
    catch { /* silencia */ }
    finally { setStatsLoading(false); }
  }, []);

  const carregarPrestadores = useCallback(async () => {
    setPrestadoresLoading(true);
    try {
      const r = await adminService.prestadores(filtroHab ? { status_habilitacao: filtroHab } : {});
      setPrestadores(r.data);
    } catch { /* silencia */ }
    finally { setPrestadoresLoading(false); }
  }, [filtroHab]);

  const carregarDocumentos = useCallback(async () => {
    setDocsLoading(true);
    try {
      const r = await adminService.documentos(filtroStatus ? { status: filtroStatus } : {});
      setDocumentos(r.data);
    } catch { /* silencia */ }
    finally { setDocsLoading(false); }
  }, [filtroStatus]);

  const carregarDocsPrestador = async (p: PrestadorAdmin) => {
    setPrestadorSel(p); setDocsPrestador([]); setDocsPrestadorLoading(true);
    try {
      const r = await adminService.documentosPorPrestador(p.id);
      setDocsPrestador(r.documentos);
    } catch { /* silencia */ }
    finally { setDocsPrestadorLoading(false); }
  };

  useEffect(() => { carregarStats(); }, [carregarStats]);
  useEffect(() => { if (aba === 'prestadores') carregarPrestadores(); }, [aba, carregarPrestadores]);
  useEffect(() => { if (aba === 'documentos')  carregarDocumentos(); },  [aba, carregarDocumentos]);

  const handleDocAtualizado = (doc: Documento) => {
    setDocumentos(prev => prev.map(d => d.id === doc.id ? doc : d));
    setDocsPrestador(prev => prev.map(d => d.id === doc.id ? doc : d));
    carregarStats();
  };

  const abrirReview = (doc: Documento) => { setDocReview(doc); setReviewOpen(true); };

  // ── filtro local de prestadores ──
  const prestadoresFiltrados = prestadores.filter(p =>
    !buscaPrestador ||
    p.nome.toLowerCase().includes(buscaPrestador.toLowerCase()) ||
    p.email.toLowerCase().includes(buscaPrestador.toLowerCase())
  );

  // ── render ──

  const abas: { id: Aba; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',    label: 'Visão geral',  icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'prestadores', label: 'Prestadores',  icon: <Users className="w-4 h-4" /> },
    { id: 'documentos',  label: 'Documentos',   icon: <FileCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />

      {/* hero */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="w-7 h-7 text-purple-300" />
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          </div>
          <p className="text-purple-200 ml-10">Gestão de prestadores e documentos da plataforma</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── tabs ── */}
        <div className="flex border-b border-gray-200 mb-8 bg-white rounded-t-xl shadow-sm overflow-hidden">
          {abas.map(a => (
            <button
              key={a.id}
              onClick={() => { setAba(a.id); setPrestadorSel(null); }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition ${
                aba === a.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              {a.icon}{a.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            OVERVIEW
        ══════════════════════════════════════════ */}
        {aba === 'overview' && (
          <div>
            {/* cards de stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { label: 'Prestadores',        val: stats?.total_prestadores,    icon: <Users className="w-5 h-5 text-purple-600" />,     bg: 'bg-purple-50',  sub: `${stats?.prestadores_habilitados ?? '—'} habilitados` },
                { label: 'Docs. pendentes',     val: stats?.docs_pendentes,       icon: <Clock className="w-5 h-5 text-amber-600" />,      bg: 'bg-amber-50',   sub: 'Aguardando análise' },
                { label: 'Docs. aprovados',     val: stats?.docs_aprovados,       icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,bg: 'bg-green-50',  sub: 'Total aprovados' },
                { label: 'Correção/Reprovados', val: (stats?.docs_reprovados ?? 0) + (stats?.docs_correcao ?? 0), icon: <XCircle className="w-5 h-5 text-red-500" />, bg: 'bg-red-50', sub: 'Requerem atenção' },
              ].map(({ label, val, icon, bg, sub }) => (
                <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-0.5">
                    {statsLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-300" /> : (val ?? '—')}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>

            {/* pendentes recentes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Documentos aguardando análise</h2>
                <button
                  onClick={() => setAba('documentos')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  Ver todos <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {statsLoading ? (
                <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" /> Carregando...
                </div>
              ) : (stats?.docs_pendentes ?? 0) === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-300" />
                  <p className="font-medium">Nenhum documento pendente!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  <p className="px-6 py-3 text-sm text-amber-600 bg-amber-50 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {stats?.docs_pendentes} documento(s) aguardando sua análise. Acesse a aba "Documentos" para revisá-los.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            PRESTADORES
        ══════════════════════════════════════════ */}
        {aba === 'prestadores' && !prestadorSel && (
          <div>
            {/* filtros */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={buscaPrestador}
                  onChange={e => setBuscaPrestador(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { val: '', label: 'Todos' },
                  { val: 'pendente',   label: 'Pendentes' },
                  { val: 'habilitado', label: 'Habilitados' },
                  { val: 'reprovado',  label: 'Reprovados' },
                ].map(f => (
                  <button
                    key={f.val}
                    onClick={() => setFiltroHab(f.val)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                      filtroHab === f.val
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Prestadores cadastrados {!prestadoresLoading && `(${prestadoresFiltrados.length})`}
                </h2>
                <button onClick={carregarPrestadores} className="text-gray-400 hover:text-purple-600 p-1.5 rounded-lg hover:bg-purple-50">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {prestadoresLoading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" /> Carregando prestadores...
                </div>
              ) : prestadoresFiltrados.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p>Nenhum prestador encontrado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Prestador</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Cadastro</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">E-mail</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Documentos</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Habilitação</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {prestadoresFiltrados.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {p.nome.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{p.nome}</div>
                                <div className="text-xs text-gray-400">{p.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{p.cadastrado_em}</td>
                          <td className="px-4 py-4">
                            {p.email_verificado
                              ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 font-medium">Verificado</span>
                              : <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">Não verificado</span>}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {p.docs_aprovados > 0 && (
                                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium border border-green-200">
                                  {p.docs_aprovados}✓
                                </span>
                              )}
                              {p.docs_pendentes > 0 && (
                                <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                                  {p.docs_pendentes} pendente{p.docs_pendentes > 1 ? 's' : ''}
                                </span>
                              )}
                              {p.docs_reprovados > 0 && (
                                <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium border border-red-200">
                                  {p.docs_reprovados} reprovado{p.docs_reprovados > 1 ? 's' : ''}
                                </span>
                              )}
                              {p.docs_correcao > 0 && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                                  {p.docs_correcao} correção
                                </span>
                              )}
                              {p.documentos_total === 0 && (
                                <span className="text-xs text-gray-400">Nenhum enviado</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={p.status_habilitacao} />
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => carregarDocsPrestador(p)}
                              className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ver docs
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── drill-down: documentos de um prestador ── */}
        {aba === 'prestadores' && prestadorSel && (
          <div>
            <button
              onClick={() => setPrestadorSel(null)}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium mb-5"
            >
              ← Voltar para prestadores
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                  {prestadorSel.nome.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{prestadorSel.nome}</h2>
                  <p className="text-xs text-gray-500">{prestadorSel.email} · {prestadorSel.telefone}</p>
                </div>
                <StatusBadge status={prestadorSel.status_habilitacao} />
              </div>

              {docsPrestadorLoading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" /> Carregando documentos...
                </div>
              ) : docsPrestador.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p>Este prestador ainda não enviou documentos.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {docsPrestador.map(doc => (
                    <div key={doc.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          {TIPO_ICONS[doc.tipo] ?? <FileText className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.tipo_label}</p>
                          <p className="text-xs text-gray-400">{doc.nome_original} · {doc.tamanho_formatado} · {doc.enviado_em}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={doc.status} />
                        <button
                          onClick={() => abrirReview(doc)}
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 px-3 py-1.5 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Analisar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            DOCUMENTOS
        ══════════════════════════════════════════ */}
        {aba === 'documentos' && (
          <div>
            {/* filtros */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { val: '' as DocumentoStatus | '', label: 'Todos' },
                { val: 'pendente'  as DocumentoStatus, label: `Pendentes${stats?.docs_pendentes ? ` (${stats.docs_pendentes})` : ''}` },
                { val: 'aprovado'  as DocumentoStatus, label: 'Aprovados' },
                { val: 'reprovado' as DocumentoStatus, label: 'Reprovados' },
                { val: 'correcao'  as DocumentoStatus, label: 'Correção sol.' },
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setFiltroStatus(f.val)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                    filtroStatus === f.val
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">
                  Documentos {!docsLoading && `(${documentos.length})`}
                </h2>
                <button onClick={carregarDocumentos} className="text-gray-400 hover:text-purple-600 p-1.5 rounded-lg hover:bg-purple-50">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {docsLoading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" /> Carregando documentos...
                </div>
              ) : documentos.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p>Nenhum documento encontrado.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {documentos.map(doc => (
                    <div key={doc.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          {TIPO_ICONS[doc.tipo] ?? <FileText className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-900">{doc.tipo_label}</p>
                            <StatusBadge status={doc.status} />
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            <span className="font-medium">{doc.prestador?.nome ?? '—'}</span>
                            {' · '}{doc.nome_original}
                            {' · '}{doc.enviado_em}
                          </p>
                          {doc.observacao_admin && (
                            <p className="text-xs text-gray-400 mt-0.5 italic truncate max-w-sm">
                              Obs: {doc.observacao_admin}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* ações rápidas para pendentes */}
                        {doc.status === 'pendente' && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  const updated = await adminService.aprovar(doc.id);
                                  handleDocAtualizado(updated);
                                } catch { /* modal de erro não implementado aqui */ }
                              }}
                              className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-2.5 py-1.5 rounded-lg transition"
                              title="Aprovar"
                            >
                              <Check className="w-3.5 h-3.5" /> Aprovar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => abrirReview(doc)}
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 px-3 py-1.5 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> Analisar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* modal de revisão */}
      <ReviewModal
        doc={docReview}
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onAtualizado={handleDocAtualizado}
      />

      <Footer />
    </div>
  );
}
