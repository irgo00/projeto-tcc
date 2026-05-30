// ─────────────────────────────────────────────────────────────────────────────
//  Dashboard/Prestador.tsx  (versão atualizada com aba de Habilitação)
//
//  MUDANÇAS em relação à versão anterior:
//   1. Nova aba "Habilitação" com <HabilitacaoSection />
//   2. Bloqueio de criar rotas enquanto conta não estiver habilitada
//   3. Banner de alerta persistente quando status_habilitacao !== 'habilitado'
//
//  O restante do dashboard (Rotas, Minhas Vans, Avaliações) permanece igual.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import {
  Plus, Edit2, Trash2, Users, Star, TrendingUp, Calendar,
  PowerOff, Power, Loader2, AlertCircle, X, Save, Truck, ImageOff,
  Wifi, Wind, Camera, Zap, Accessibility, DoorOpen, ShieldAlert,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import VanVeiculoFormModal from '../../components/features/VanVeiculoFormModal';
import VanFotosManager from '../../components/features/VanFotosManager';
import HabilitacaoSection from '../../components/features/HabilitacaoSection';
import { useAuth } from '../../hooks/useAuth';
import { vanService } from '../../services/vanService';
import { vanVeiculoService } from '../../services/vanVeiculoService';
import { avaliacaoService } from '../../services/avaliacaoService';
import { parseMoeda, formatMoeda } from '../../utils/helpers';
import type { Van, VanFormData } from '../../types/Van';
import type { VanVeiculo } from '../../types/VanVeiculo';
import type { AvaliacaoRecebida } from '../../types/Avaliacao';
import type { AuthMode } from '../../types';

interface DashboardPrestadorProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const FORM_VAZIO: VanFormData = {
  nome: '', origem: '', destino: '', instituicao: '', rota: '',
  horario_manha: '', horario_tarde: '', horario_noite: '',
  vagas_totais: '', valor_mensal: '', telefone: '', email: '', van_id: '',
};

type FormErrors = Partial<Record<keyof VanFormData | 'horarios', string>>;

const CONFORTO_ICONS: Record<string, React.ReactNode> = {
  ar_condicionado:  <Wind className="w-3.5 h-3.5" />,
  camera_interna:   <Camera className="w-3.5 h-3.5" />,
  porta_automatica: <DoorOpen className="w-3.5 h-3.5" />,
  wifi:             <Wifi className="w-3.5 h-3.5" />,
  acessibilidade:   <Accessibility className="w-3.5 h-3.5" />,
  usb_carregador:   <Zap className="w-3.5 h-3.5" />,
};

const CONFORTO_LABELS: Record<string, string> = {
  ar_condicionado: 'Ar-cond.', camera_interna: 'Câmera', porta_automatica: 'Porta auto.',
  wifi: 'Wi-Fi', acessibilidade: 'Acessível', usb_carregador: 'USB',
};

function DashboardPrestador({ onOpenAuth }: DashboardPrestadorProps) {
  const { user } = useAuth();

  // Verifica se a conta está habilitada (campo vindo do backend via /me)
  const habilitado = (user as any)?.status_habilitacao === 'habilitado';

  const [activeTab, setActiveTab] = useState('rotas');

  // ── rotas ──
  const [vans, setVans] = useState<Van[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVan, setEditingVan] = useState<Van | null>(null);
  const [formData, setFormData] = useState<VanFormData>(FORM_VAZIO);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingVanId, setDeletingVanId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [togglingVanId, setTogglingVanId] = useState<number | null>(null);
  const [ajustandoVagasId, setAjustandoVagasId] = useState<number | null>(null);

  // ── veículos ──
  const [veiculos, setVeiculos] = useState<VanVeiculo[]>([]);
  const [veiculosLoading, setVeiculosLoading] = useState(false);
  const [veiculosError, setVeiculosError] = useState<string | null>(null);
  const [showVeiculoForm, setShowVeiculoForm] = useState(false);
  const [editandoVeiculo, setEditandoVeiculo] = useState<VanVeiculo | null>(null);
  const [deletingVeiculoId, setDeletingVeiculoId] = useState<number | null>(null);
  const [deleteVeiculoLoading, setDeleteVeiculoLoading] = useState(false);
  const [deleteVeiculoError, setDeleteVeiculoError] = useState<string | null>(null);
  const [fotoVeiculoId, setFotoVeiculoId] = useState<number | null>(null);

  // ── avaliações ──
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoRecebida[]>([]);
  const [avaliacoesLoading, setAvaliacoesLoading] = useState(false);
  const [avaliacoesError, setAvaliacoesError] = useState<string | null>(null);

  useEffect(() => { carregarVans(); }, []);

  useEffect(() => {
    if (activeTab === 'avaliacoes' && avaliacoes.length === 0 && !avaliacoesLoading) carregarAvaliacoes();
    if (activeTab === 'veiculos'   && veiculos.length === 0   && !veiculosLoading)   carregarVeiculos();
  }, [activeTab]);

  const carregarVans = async () => {
    setLoading(true); setLoadError(null);
    try { setVans(await vanService.minhasVans()); }
    catch { setLoadError('Erro ao carregar rotas. Tente novamente.'); }
    finally { setLoading(false); }
  };

  const carregarVeiculos = async () => {
    setVeiculosLoading(true); setVeiculosError(null);
    try { setVeiculos(await vanVeiculoService.minhas()); }
    catch { setVeiculosError('Erro ao carregar veículos. Tente novamente.'); }
    finally { setVeiculosLoading(false); }
  };

  const carregarAvaliacoes = async () => {
    setAvaliacoesLoading(true); setAvaliacoesError(null);
    try { setAvaliacoes(await avaliacaoService.recebidas()); }
    catch { setAvaliacoesError('Erro ao carregar avaliações.'); }
    finally { setAvaliacoesLoading(false); }
  };

  const vansAtivas = vans.filter(v => v.ativa !== false);
  const estatisticas = {
    totalRotas: vansAtivas.length,
    totalPassageiros: vans.reduce((acc, v) => acc + ((v.vagas_totais ?? 0) - (v.vagas_disponiveis ?? 0)), 0),
    avaliacaoMedia: (() => {
      const c = vans.filter(v => (v.totalAvaliacoes ?? 0) > 0);
      return c.length ? c.reduce((acc, v) => acc + (v.avaliacao ?? 0), 0) / c.length : 0;
    })(),
    ocupacaoMedia: (() => {
      const v = vansAtivas.filter(v => (v.vagas_totais ?? 0) > 0);
      return v.length ? Math.round(v.reduce((acc, v) => acc + (v.vagas_totais! - (v.vagas_disponiveis ?? 0)) / v.vagas_totais!, 0) / v.length * 100) : 0;
    })(),
  };

  const abrirModalCriar = () => {
    if (!habilitado) return; // guarda de segurança
    setEditingVan(null);
    setFormData({ ...FORM_VAZIO, telefone: user?.telefone ?? '', email: user?.email ?? '' });
    setFormErrors({}); setFormError(null); setShowModal(true);
    if (veiculos.length === 0 && !veiculosLoading) carregarVeiculos();
  };

  const abrirModalEditar = (van: Van) => {
    setEditingVan(van);
    setFormData({
      nome: van.nome ?? '', origem: van.origem ?? '', destino: van.destino ?? '',
      instituicao: van.instituicao ?? '', rota: van.rota ?? '',
      horario_manha: van.horario_manha ?? '', horario_tarde: van.horario_tarde ?? '',
      horario_noite: van.horario_noite ?? '', vagas_totais: String(van.vagas_totais ?? ''),
      valor_mensal: van.valor_mensal != null ? formatMoeda(String(Math.round(Number(van.valor_mensal) * 100))) : '',
      telefone: van.telefone ?? user?.telefone ?? '', email: van.email ?? user?.email ?? '',
      van_id: van.van_id ? String(van.van_id) : '',
    });
    setFormErrors({}); setFormError(null); setShowModal(true);
    if (veiculos.length === 0 && !veiculosLoading) carregarVeiculos();
  };

  const validarForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.nome.trim())        errors.nome = 'Nome é obrigatório';
    if (!formData.origem.trim())      errors.origem = 'Origem é obrigatória';
    if (!formData.destino.trim())     errors.destino = 'Destino é obrigatório';
    if (!formData.instituicao.trim()) errors.instituicao = 'Instituição é obrigatória';
    if (!formData.rota.trim())        errors.rota = 'Descrição da rota é obrigatória';
    if (!formData.vagas_totais || Number(formData.vagas_totais) < 1)
      errors.vagas_totais = 'Informe o número de vagas (mínimo 1)';
    if (!formData.horario_manha && !formData.horario_tarde && !formData.horario_noite)
      errors.horarios = 'Informe ao menos um horário';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarForm()) return;
    setFormLoading(true); setFormError(null);
    try {
      const payload = {
        nome: formData.nome, origem: formData.origem, destino: formData.destino,
        instituicao: formData.instituicao, rota: formData.rota,
        horario_manha: formData.horario_manha || null,
        horario_tarde: formData.horario_tarde || null,
        horario_noite: formData.horario_noite || null,
        vagas_totais: Number(formData.vagas_totais),
        valor_mensal: formData.valor_mensal ? parseMoeda(formData.valor_mensal) : null,
        telefone: formData.telefone || null, email: formData.email || null,
        van_id: formData.van_id ? Number(formData.van_id) : null,
      };
      editingVan ? await vanService.atualizar(editingVan.id, payload) : await vanService.criar(payload);
      await carregarVans();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao salvar. Tente novamente.');
    } finally { setFormLoading(false); }
  };

  const handleToggleAtiva = async (van: Van) => {
    setTogglingVanId(van.id);
    try {
      await vanService.atualizar(van.id, { ativa: !van.ativa });
      setVans(prev => prev.map(v => v.id === van.id ? { ...v, ativa: !van.ativa } : v));
    } finally { setTogglingVanId(null); }
  };

  const handleAjustarVagas = async (van: Van, delta: 1 | -1) => {
    const novoValor = (van.vagas_disponiveis ?? 0) + delta;
    if (novoValor < 0 || novoValor > (van.vagas_totais ?? 0)) return;
    setAjustandoVagasId(van.id);
    try {
      await vanService.atualizar(van.id, { vagas_disponiveis: novoValor });
      setVans(prev => prev.map(v => v.id === van.id ? { ...v, vagas_disponiveis: novoValor } : v));
    } finally { setAjustandoVagasId(null); }
  };

  const handleDeletar = async (id: number) => {
    setDeleteLoading(true); setDeleteError(null);
    try {
      await vanService.deletar(id);
      setVans(prev => prev.filter(v => v.id !== id));
      setDeletingVanId(null);
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Erro ao excluir.');
    } finally { setDeleteLoading(false); }
  };

  const handleDeletarVeiculo = async (id: number) => {
    setDeleteVeiculoLoading(true); setDeleteVeiculoError(null);
    try {
      await vanVeiculoService.deletar(id);
      setVeiculos(prev => prev.filter(v => v.id !== id));
      setDeletingVeiculoId(null);
    } catch (err: any) {
      setDeleteVeiculoError(err.response?.data?.message || 'Erro ao excluir.');
    } finally { setDeleteVeiculoLoading(false); }
  };

  const recarregarVeiculo = async (id: number) => {
    try {
      const atualizado = await vanVeiculoService.detalhes(id);
      setVeiculos(prev => prev.map(v => v.id === id ? atualizado : v));
    } catch {}
  };

  const setField = (field: keyof VanFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined, horarios: undefined }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Painel do Prestador</h1>
          <p className="text-purple-100">Gerencie suas rotas, veículos e serviços</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── banner de conta não habilitada ── */}
        {!habilitado && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-amber-800">Conta pendente de habilitação</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Para criar e gerenciar rotas, você precisa enviar e ter seus documentos aprovados.{' '}
                <button
                  onClick={() => setActiveTab('habilitacao')}
                  className="underline font-medium hover:text-amber-900"
                >
                  Acesse a aba Habilitação
                </button>{' '}
                para ver o que falta.
              </p>
            </div>
          </div>
        )}

        {/* Cards de estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <Calendar className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100', valor: loading ? '—' : estatisticas.totalRotas, label: 'Rotas Ativas' },
            { icon: <Users className="w-6 h-6 text-blue-600" />,      bg: 'bg-blue-100',   valor: loading ? '—' : estatisticas.totalPassageiros, label: 'Passageiros' },
            { icon: <Star className="w-6 h-6 text-yellow-600" />,     bg: 'bg-yellow-100', valor: loading ? '—' : estatisticas.avaliacaoMedia.toFixed(1), label: 'Avaliação Média' },
            { icon: <TrendingUp className="w-6 h-6 text-green-600" />,bg: 'bg-green-100',  valor: loading ? '—' : `${estatisticas.ocupacaoMedia}%`, label: 'Ocupação Média' },
          ].map(({ icon, bg, valor, label }) => (
            <div key={label} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`${bg} p-3 rounded-lg`}>{icon}</div>
                <span className="text-3xl font-bold text-gray-900">{valor}</span>
              </div>
              <p className="text-gray-600 text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md">
          {/* abas */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { key: 'rotas',       label: 'Minhas Rotas', icon: <Calendar className="w-5 h-5" /> },
                { key: 'veiculos',    label: 'Minhas Vans',  icon: <Truck className="w-5 h-5" /> },
                { key: 'avaliacoes',  label: 'Avaliações',   icon: <Star className="w-5 h-5" /> },
                { key: 'habilitacao', label: 'Habilitação',  icon: <ShieldAlert className="w-5 h-5" />, alert: !habilitado },
              ].map(({ key, label, icon, alert }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                    activeTab === key
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {icon}{label}
                  {alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Ação necessária" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">

            {/* ══ ROTAS ══ */}
            {activeTab === 'rotas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Gerenciar Rotas{!loading && ` (${vans.length})`}</h2>
                  <Button
                    variant="primary"
                    onClick={habilitado ? abrirModalCriar : () => setActiveTab('habilitacao')}
                    className="flex items-center gap-2"
                    title={!habilitado ? 'Complete a habilitação para criar rotas' : ''}
                  >
                    <Plus className="w-5 h-5" />
                    {habilitado ? 'Nova Rota' : 'Habilitar conta'}
                  </Button>
                </div>

                {!habilitado && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Você precisa concluir a habilitação da conta antes de criar rotas.{' '}
                    <button onClick={() => setActiveTab('habilitacao')} className="underline font-medium ml-1">Ver habilitação</button>
                  </div>
                )}

                {loading && <div className="flex items-center justify-center py-16 gap-3 text-gray-500"><Loader2 className="w-6 h-6 animate-spin" /> Carregando rotas...</div>}

                {!loading && loadError && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />{loadError}
                    <button onClick={carregarVans} className="ml-auto underline text-sm">Tentar novamente</button>
                  </div>
                )}

                {!loading && !loadError && vans.length === 0 && (
                  <div className="text-center py-16">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma rota cadastrada ainda</h3>
                    <p className="text-gray-600 mb-6">
                      {habilitado
                        ? 'Adicione sua primeira rota para aparecer nas buscas.'
                        : 'Conclua sua habilitação para poder criar rotas.'}
                    </p>
                    {habilitado && (
                      <Button variant="primary" className="flex items-center gap-2 mx-auto" onClick={abrirModalCriar}>
                        <Plus className="w-4 h-4 mr-2" />Cadastrar Primeira Rota
                      </Button>
                    )}
                  </div>
                )}

                {!loading && !loadError && vans.length > 0 && (
                  <div className="space-y-4">
                    {vans.map(van => (
                      <div key={van.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3">
                            {van.foto_principal_url && (
                              <img src={van.foto_principal_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                            )}
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-gray-900">{van.nome}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${van.ativa !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {van.ativa !== false ? 'Ativa' : 'Inativa'}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">{van.origem} → {van.destino}{van.instituicao && <span className="ml-2 text-purple-600 font-medium">· {van.instituicao}</span>}</p>
                              {van.van && <p className="text-xs text-purple-500 mt-0.5">{van.van.modelo} {van.van.marca} · {van.van.placa}</p>}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 ml-4">
                            <button onClick={() => abrirModalEditar(van)} title="Editar" className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"><Edit2 className="w-5 h-5" /></button>
                            <button onClick={() => handleToggleAtiva(van)} disabled={togglingVanId === van.id} title={van.ativa !== false ? 'Desativar' : 'Ativar'} className={`p-2 rounded-lg transition ${van.ativa !== false ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                              {togglingVanId === van.id ? <Loader2 className="w-5 h-5 animate-spin" /> : van.ativa !== false ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                            </button>
                            <button onClick={() => { setDeletingVanId(van.id); setDeleteError(null); }} title="Excluir" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </div>

                        {deletingVanId === van.id && (
                          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-medium mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Excluir "{van.nome}"? Ação irreversível.</p>
                            {deleteError && <p className="text-red-600 text-sm mb-3">{deleteError}</p>}
                            <div className="flex gap-2">
                              <Button variant="primary" loading={deleteLoading} onClick={() => handleDeletar(van.id)} className="bg-red-600 hover:bg-red-700 flex items-center gap-2 text-sm"><Trash2 className="w-4 h-4" />Confirmar</Button>
                              <Button variant="secondary" onClick={() => { setDeletingVanId(null); setDeleteError(null); }} className="text-sm"><X className="w-4 h-4" />Cancelar</Button>
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Ocupação</p>
                            <p className="text-2xl font-bold text-gray-900">{(van.vagas_totais ?? 0) - (van.vagas_disponiveis ?? 0)}/{van.vagas_totais ?? 0}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: van.vagas_totais ? `${((van.vagas_totais - (van.vagas_disponiveis ?? 0)) / van.vagas_totais) * 100}%` : '0%' }} />
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Vagas Disponíveis</p>
                            <div className="flex items-center gap-3 mt-1">
                              <button onClick={() => handleAjustarVagas(van, -1)} disabled={ajustandoVagasId === van.id || (van.vagas_disponiveis ?? 0) <= 0} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition text-lg font-bold">−</button>
                              <span className="text-2xl font-bold text-green-600 min-w-[2ch] text-center">{ajustandoVagasId === van.id ? '…' : (van.vagas_disponiveis ?? 0)}</span>
                              <button onClick={() => handleAjustarVagas(van, 1)} disabled={ajustandoVagasId === van.id || (van.vagas_disponiveis ?? 0) >= (van.vagas_totais ?? 0)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition text-lg font-bold">+</button>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Avaliação</p>
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="text-2xl font-bold text-gray-900">{(van.avaliacao ?? 0).toFixed(1)}</span>
                              <span className="text-xs text-gray-400">({van.totalAvaliacoes ?? 0})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ VEÍCULOS ══ */}
            {activeTab === 'veiculos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Minhas Vans{!veiculosLoading && ` (${veiculos.length})`}</h2>
                  <Button variant="primary" onClick={() => { setEditandoVeiculo(null); setShowVeiculoForm(true); }} className="flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Cadastrar Van
                  </Button>
                </div>
                {veiculosLoading && <div className="flex items-center justify-center py-16 gap-3 text-gray-500"><Loader2 className="w-6 h-6 animate-spin" /> Carregando veículos...</div>}
                {!veiculosLoading && veiculosError && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />{veiculosError}
                    <button onClick={carregarVeiculos} className="ml-auto underline text-sm">Tentar novamente</button>
                  </div>
                )}
                {!veiculosLoading && !veiculosError && veiculos.length === 0 && (
                  <div className="text-center py-16">
                    <Truck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma van cadastrada</h3>
                    <p className="text-gray-600 mb-6">Cadastre suas vans para vinculá-las às rotas.</p>
                    <Button variant="primary" className="flex items-center gap-2 mx-auto" onClick={() => { setEditandoVeiculo(null); setShowVeiculoForm(true); }}><Plus className="w-4 h-4 mr-2" />Cadastrar Primeira Van</Button>
                  </div>
                )}
                {!veiculosLoading && !veiculosError && veiculos.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {veiculos.map(veiculo => (
                      <div key={veiculo.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="relative h-40 bg-gray-200">
                          {veiculo.foto_principal_url
                            ? <img src={veiculo.foto_principal_url} alt={veiculo.modelo} className="w-full h-full object-cover" />
                            : <div className="flex flex-col items-center justify-center h-full text-gray-400"><ImageOff className="w-8 h-8 mb-1" /><span className="text-xs">Sem foto</span></div>}
                          <div className="absolute top-2 right-2 flex gap-1.5">
                            <button onClick={() => { setEditandoVeiculo(veiculo); setShowVeiculoForm(true); }} className="bg-white/90 hover:bg-white text-purple-600 p-1.5 rounded-lg shadow transition" title="Editar"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => { setDeletingVeiculoId(veiculo.id); setDeleteVeiculoError(null); }} className="bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-lg shadow transition" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{veiculo.modelo} <span className="font-normal text-gray-600">{veiculo.marca}</span></h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-0.5">
                              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs font-semibold">{veiculo.placa}</span>
                              <span>{veiculo.ano}</span><span>{veiculo.cor}</span>
                            </div>
                          </div>
                          {Object.entries(CONFORTO_LABELS).some(([k]) => (veiculo as any)[k]) && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {Object.entries(CONFORTO_LABELS).filter(([k]) => (veiculo as any)[k]).map(([k, l]) => (
                                <span key={k} className="flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-100">
                                  {CONFORTO_ICONS[k]}{l}
                                </span>
                              ))}
                            </div>
                          )}
                          {fotoVeiculoId === veiculo.id ? (
                            <div className="border-t pt-3 mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-700">Gerenciar Fotos</p>
                                <button onClick={() => setFotoVeiculoId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                              </div>
                              <VanFotosManager
                                fotos={veiculo.fotos}
                                vanId={veiculo.id}
                                onUpload={vanVeiculoService.uploadFotos}
                                onDeletar={vanVeiculoService.deletarFoto}
                                onSetPrincipal={vanVeiculoService.setPrincipal}
                                onAtualizado={() => recarregarVeiculo(veiculo.id)}
                              />
                            </div>
                          ) : (
                            <button onClick={() => setFotoVeiculoId(veiculo.id)} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              {veiculo.fotos.length > 0 ? `Gerenciar fotos (${veiculo.fotos.length}/5)` : '+ Adicionar fotos'}
                            </button>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-500">
                            <span>{veiculo.total_rotas} rota{veiculo.total_rotas !== 1 ? 's' : ''} vinculada{veiculo.total_rotas !== 1 ? 's' : ''}</span>
                            <span>Cadastrado em {veiculo.criadoEm}</span>
                          </div>
                        </div>
                        {deletingVeiculoId === veiculo.id && (
                          <div className="mx-4 mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm font-medium mb-2">Excluir "{veiculo.modelo} {veiculo.marca}"?</p>
                            {deleteVeiculoError && <p className="text-red-600 text-xs mb-2">{deleteVeiculoError}</p>}
                            <div className="flex gap-2">
                              <Button variant="primary" loading={deleteVeiculoLoading} onClick={() => handleDeletarVeiculo(veiculo.id)} className="bg-red-600 hover:bg-red-700 text-xs py-1 px-3">Confirmar</Button>
                              <Button variant="secondary" onClick={() => { setDeletingVeiculoId(null); setDeleteVeiculoError(null); }} className="text-xs py-1 px-3">Cancelar</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ AVALIAÇÕES ══ */}
            {activeTab === 'avaliacoes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações Recebidas{!avaliacoesLoading && ` (${avaliacoes.length})`}</h2>
                {avaliacoesLoading && <div className="flex items-center justify-center py-12 gap-3 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" />Carregando...</div>}
                {!avaliacoesLoading && avaliacoesError && <div className="text-center py-12"><p className="text-red-600 mb-3">{avaliacoesError}</p><button onClick={carregarAvaliacoes} className="text-purple-600 hover:underline text-sm">Tentar novamente</button></div>}
                {!avaliacoesLoading && !avaliacoesError && avaliacoes.length === 0 && (
                  <div className="text-center py-12"><Star className="w-16 h-16 mx-auto text-gray-300 mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma avaliação ainda</h3><p className="text-gray-600">As avaliações aparecerão aqui.</p></div>
                )}
                {!avaliacoesLoading && !avaliacoesError && avaliacoes.length > 0 && (
                  <div className="space-y-4">
                    {avaliacoes.map(av => (
                      <div key={av.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div><h3 className="font-semibold text-gray-900">{av.usuario}</h3><p className="text-sm text-purple-600 font-medium">{av.van}</p></div>
                          <div className="flex items-center gap-1">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= av.nota ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}</div>
                        </div>
                        {av.comentario && <p className="text-gray-700 text-sm mb-2">{av.comentario}</p>}
                        <p className="text-xs text-gray-400">{av.data}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ HABILITAÇÃO ══ */}
            {activeTab === 'habilitacao' && <HabilitacaoSection />}

          </div>
        </div>
      </div>

      {/* modal rota */}
      <Modal isOpen={showModal} onClose={() => !formLoading && setShowModal(false)} title={editingVan ? `Editar: ${editingVan.nome}` : 'Nova Rota'} size="md">
        <div className="space-y-4">
          <Input label="Nome da Rota" value={formData.nome} error={formErrors.nome} placeholder="Ex: Van Escolar Central" required onChange={e => setField('nome', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Origem" value={formData.origem} error={formErrors.origem} placeholder="Ex: Centro" required onChange={e => setField('origem', e.target.value)} />
            <Input label="Destino" value={formData.destino} error={formErrors.destino} placeholder="Ex: UNICENTRO" required onChange={e => setField('destino', e.target.value)} />
          </div>
          <Input label="Instituição de Ensino" value={formData.instituicao} error={formErrors.instituicao} placeholder="Ex: UNICENTRO, IFPR..." required onChange={e => setField('instituicao', e.target.value)} />
          <Input label="Descrição da Rota" value={formData.rota} error={formErrors.rota} placeholder="Ex: Centro → UNICENTRO, passando pela Av. Brasil" required onChange={e => setField('rota', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Van <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            {veiculos.length === 0 ? (
              <p className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                Nenhuma van cadastrada.{' '}
                <button type="button" onClick={() => { setShowModal(false); setActiveTab('veiculos'); }} className="text-purple-600 hover:underline font-medium">Cadastre uma van</button>
                {' '}e volte aqui.
              </p>
            ) : (
              <select
                value={formData.van_id}
                onChange={e => setField('van_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">— Selecionar van —</option>
                {veiculos.map(v => (
                  <option key={v.id} value={String(v.id)}>
                    {v.modelo} {v.marca} · {v.placa} ({v.ano})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-2">Horários <span className="text-red-500">*</span><span className="text-gray-400 font-normal text-sm ml-1">(ao menos um)</span></p>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Manhã" type="time" value={formData.horario_manha} onChange={e => setField('horario_manha', e.target.value)} />
              <Input label="Tarde" type="time" value={formData.horario_tarde} onChange={e => setField('horario_tarde', e.target.value)} />
              <Input label="Noite" type="time" value={formData.horario_noite} onChange={e => setField('horario_noite', e.target.value)} />
            </div>
            {formErrors.horarios && <p className="text-red-500 text-sm mt-1">{formErrors.horarios}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vagas Totais" type="number" value={formData.vagas_totais} error={formErrors.vagas_totais} placeholder="Ex: 15" required onChange={e => setField('vagas_totais', e.target.value)} />
            <Input label="Valor Mensal (R$)" currency value={formData.valor_mensal} placeholder="Ex: 250,00" onChange={e => setField('valor_mensal', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Telefone" type="tel" value={formData.telefone} placeholder="(00) 00000-0000" onChange={e => setField('telefone', e.target.value)} />
            <Input label="E-mail" type="email" value={formData.email} placeholder="contato@email.com" onChange={e => setField('email', e.target.value)} />
          </div>
          {formError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{formError}</div>}
          <div className="flex gap-3 pt-2">
            <Button variant="primary" loading={formLoading} onClick={handleSalvar} className="flex-1 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />{editingVan ? 'Salvar Alterações' : 'Cadastrar Rota'}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading} className="flex items-center gap-2">
              <X className="w-4 h-4" />Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <VanVeiculoFormModal
        isOpen={showVeiculoForm}
        onClose={() => setShowVeiculoForm(false)}
        editando={editandoVeiculo}
        onCriar={vanVeiculoService.criar}
        onAtualizar={vanVeiculoService.atualizar}
        onSalvo={salvo => {
          setVeiculos(prev => {
            const existe = prev.find(v => v.id === salvo.id);
            return existe ? prev.map(v => v.id === salvo.id ? salvo : v) : [...prev, salvo];
          });
          setShowVeiculoForm(false);
        }}
      />

      <Footer />
    </div>
  );
}

export default DashboardPrestador;