import { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, Clock, Lock, AlertTriangle, Upload, X,
  FileText, Car, ShieldCheck, CreditCard, File, Loader2,
  RefreshCw, Eye, ChevronDown, ChevronUp,
} from 'lucide-react';
import Button from '../common/Button';
import { documentoService } from '../../services/documentoService';
import { authService } from '../../services/authService';
import type { Documento, ProgressoHabilitacao, DocumentoTipo } from '../../types/Documento';

const TIPOS_OBRIGATORIOS: { tipo: DocumentoTipo; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    tipo: 'cnh',
    label: 'CNH — Carteira Nacional de Habilitação',
    icon: <CreditCard className="w-5 h-5" />,
    desc: 'Carteira válida e dentro do prazo de validade.',
  },
  {
    tipo: 'crlv',
    label: 'CRLV — Certificado de Registro do Veículo',
    icon: <Car className="w-5 h-5" />,
    desc: 'Documento do veículo que será utilizado na rota.',
  },
  {
    tipo: 'antecedentes',
    label: 'Certidão de antecedentes criminais',
    icon: <ShieldCheck className="w-5 h-5" />,
    desc: 'Certidão negativa emitida há no máximo 90 dias.',
  },
  {
    tipo: 'laudo_tecnico',
    label: 'Laudo técnico do veículo',
    icon: <FileText className="w-5 h-5" />,
    desc: 'Laudo de vistoria emitido por órgão credenciado.',
  },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  pendente:  { label: 'Em análise',        classes: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-400' },
  aprovado:  { label: 'Aprovado',          classes: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500' },
  reprovado: { label: 'Reprovado',         classes: 'bg-red-50   text-red-700   border-red-200',    dot: 'bg-red-500'   },
  correcao:  { label: 'Correção solicitada', classes: 'bg-blue-50  text-blue-700  border-blue-200', dot: 'bg-blue-500'  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pendente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

interface UploadModalProps {
  tipo: DocumentoTipo;
  label: string;
  reenvioId?: number;
  motivoCorrecao?: string | null;
  onClose: () => void;
  onSucesso: (doc: Documento) => void;
}

function UploadModal({ tipo, label, reenvioId, motivoCorrecao, onClose, onSucesso }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const escolherArquivo = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setErro('Arquivo maior que 10 MB.'); return; }
    const ok = ['application/pdf','image/jpeg','image/jpg','image/png','image/webp'];
    if (!ok.includes(file.type)) { setErro('Formato inválido. Use PDF, JPG, PNG ou WEBP.'); return; }
    setErro(null);
    setArquivo(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) escolherArquivo(f);
  };

  const handleSubmit = async () => {
    if (!arquivo) { setErro('Selecione um arquivo.'); return; }
    setLoading(true); setErro(null);
    try {
      let doc: Documento;
      if (reenvioId) {
        doc = await documentoService.reenviar(reenvioId, arquivo);
      } else {
        doc = await documentoService.enviar(tipo, arquivo);
      }
      onSucesso(doc);
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">
              {reenvioId ? 'Reenviar documento' : 'Enviar documento'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {motivoCorrecao && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 mb-0.5">Motivo da solicitação de correção</p>
                <p className="text-sm text-amber-700">{motivoCorrecao}</p>
              </div>
            </div>
          )}

          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              drag ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) escolherArquivo(f); }}
            />
            {arquivo ? (
              <div className="flex flex-col items-center gap-2">
                <File className="w-8 h-8 text-purple-500" />
                <p className="text-sm font-medium text-gray-800">{arquivo.name}</p>
                <p className="text-xs text-gray-500">{(arquivo.size / 1024).toFixed(0)} KB</p>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setArquivo(null); }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">Arraste o arquivo ou clique para selecionar</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG ou WEBP — máximo 10 MB</p>
              </div>
            )}
          </div>

          {erro && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{erro}
            </p>
          )}
        </div>

        <div className="flex gap-2 px-5 pb-5">
          <Button variant="secondary" onClick={onClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-1 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            {reenvioId ? 'Reenviar' : 'Enviar para análise'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HabilitacaoSection() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [progresso, setProgresso] = useState<ProgressoHabilitacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [showHabilitadoBanner, setShowHabilitadoBanner] = useState(true);

  const [uploadModal, setUploadModal] = useState<{
    tipo: DocumentoTipo;
    label: string;
    reenvioId?: number;
    motivoCorrecao?: string | null;
  } | null>(null);

  const [expandedObs, setExpandedObs] = useState<number | null>(null);

  const [reenviando, setReenviando] = useState(false);
  const [reenvioMsg, setReenvioMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null);

  const reenviarEmail = async () => {
    setReenviando(true);
    setReenvioMsg(null);
    try {
      const msg = await authService.reenviarVerificacaoEmail();
      setReenvioMsg({ tipo: 'ok', texto: msg });
    } catch (e) {
      setReenvioMsg({ tipo: 'erro', texto: (e as Error).message });
    } finally {
      setReenviando(false);
    }
  };

  const carregar = async () => {
    setLoading(true); setErro(null);
    try {
      const data = await documentoService.meus();
      setDocumentos(data.documentos);
      setProgresso(data.progresso);
    } catch {
      setErro('Não foi possível carregar seus documentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleSucesso = (doc: Documento) => {
    setDocumentos(prev => {
      const idx = prev.findIndex(d => d.id === doc.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = doc; return n; }
      return [doc, ...prev];
    });
    setUploadModal(null);
    carregar();
  };

  const docPorTipo = (tipo: DocumentoTipo) => documentos.find(d => d.tipo === tipo);

  const podeEnviar = (tipo: DocumentoTipo): boolean => {
    const doc = docPorTipo(tipo);
    if (!doc) return true;
    return doc.status === 'correcao' || doc.status === 'reprovado';
  };

  const etapas = progresso
    ? [
        { key: 'email_verificado',    label: 'E-mail verificado',       desc: 'Link de confirmação enviado e validado.',  done: progresso.etapas.email_verificado,     waiting: false },
        { key: 'documentos_enviados', label: 'Documentos enviados',      desc: 'CNH, CRLV, laudo e antecedentes enviados.',done: progresso.etapas.documentos_enviados,  waiting: false },
        { key: 'documentos_aprovados',label: 'Documentos aprovados',     desc: 'Aguardando análise da administração.',     done: progresso.etapas.documentos_aprovados, waiting: !progresso.etapas.documentos_aprovados && progresso.etapas.documentos_enviados },
        { key: 'perfil_validado',     label: 'Perfil 100% validado',     desc: 'Disponível após aprovação dos documentos.',done: progresso.etapas.perfil_validado,      waiting: false },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        Carregando habilitação...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl max-w-xl">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        {erro}
        <button onClick={carregar} className="ml-auto text-sm underline whitespace-nowrap">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">

      {progresso && !progresso.habilitado && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Conta ainda não habilitada</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Complete todas as etapas abaixo para poder criar rotas na plataforma.
            </p>
          </div>
        </div>
      )}

      {progresso?.habilitado && showHabilitadoBanner && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-green-800">Conta habilitada!</p>
            <p className="text-sm text-green-700 mt-0.5">
              Todos os documentos foram aprovados. Você já pode criar e gerenciar suas rotas.
            </p>
          </div>
          <button onClick={() => setShowHabilitadoBanner(false)} className="flex-shrink-0 text-green-600 hover:text-green-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {progresso && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Progresso de habilitação</h3>
            <span className="text-sm font-semibold text-purple-600">{progresso.percentual}%</span>
          </div>
          <div className="px-6 py-5">
            <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${progresso.percentual}%` }}
              />
            </div>

            <div className="space-y-4">
              {etapas.map((etapa, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    etapa.done
                      ? 'bg-green-100 text-green-600'
                      : etapa.waiting
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {etapa.done
                      ? <CheckCircle2 className="w-4 h-4" />
                      : etapa.waiting
                      ? <Clock className="w-4 h-4" />
                      : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${etapa.done ? 'text-gray-900' : 'text-gray-500'}`}>
                      {etapa.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{etapa.desc}</p>

                    {etapa.key === 'email_verificado' && !etapa.done && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={reenviarEmail}
                          disabled={reenviando}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
                        >
                          {reenviando
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <RefreshCw className="w-3.5 h-3.5" />}
                          Reenviar e-mail de verificação
                        </button>
                        {reenvioMsg && (
                          <p className={`text-xs mt-1 ${reenvioMsg.tipo === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                            {reenvioMsg.texto}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {etapa.done ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Concluído
                    </span>
                  ) : etapa.waiting ? (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Em análise
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                      Bloqueado
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Documentos obrigatórios</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Envie os quatro documentos abaixo para concluir sua habilitação.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {TIPOS_OBRIGATORIOS.map(({ tipo, label, icon, desc }) => {
            const doc = docPorTipo(tipo);
            const podeSub = podeEnviar(tipo);

            return (
              <div key={tipo} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      doc?.status === 'aprovado'
                        ? 'bg-green-100 text-green-600'
                        : doc?.status === 'reprovado'
                        ? 'bg-red-100 text-red-600'
                        : doc?.status === 'correcao'
                        ? 'bg-blue-100 text-blue-600'
                        : doc?.status === 'pendente'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      {doc && (
                        <p className="text-xs text-gray-400 mt-1">
                          {doc.nome_original} · {doc.tamanho_formatado} · Enviado em {doc.enviado_em}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {doc && <StatusBadge status={doc.status} />}

                    {doc && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Ver arquivo"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}

                    {podeSub && (
                      <button
                        onClick={() =>
                          setUploadModal({
                            tipo,
                            label,
                            reenvioId: doc?.status === 'correcao' ? doc.id : undefined,
                            motivoCorrecao: doc?.status === 'correcao' ? doc.observacao_admin : null,
                          })
                        }
                        className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
                      >
                        {doc?.status === 'correcao' || doc?.status === 'reprovado'
                          ? <><RefreshCw className="w-3.5 h-3.5" /> Reenviar</>
                          : <><Upload className="w-3.5 h-3.5" /> Enviar</>}
                      </button>
                    )}

                    {!doc && !podeSub && (
                      <span className="text-xs text-gray-400">Não enviado</span>
                    )}
                  </div>
                </div>

                {doc?.observacao_admin && (
                  <div className="mt-3 ml-12">
                    <button
                      onClick={() => setExpandedObs(expandedObs === doc.id ? null : doc.id)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {expandedObs === doc.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      Ver observação do admin
                    </button>
                    {expandedObs === doc.id && (
                      <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 text-sm text-blue-800">
                        {doc.observacao_admin}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {uploadModal && (
        <UploadModal
          {...uploadModal}
          onClose={() => setUploadModal(null)}
          onSucesso={handleSucesso}
        />
      )}
    </div>
  );
}
