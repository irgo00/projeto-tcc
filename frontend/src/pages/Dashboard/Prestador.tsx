import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import {
  Plus, Edit2, Trash2, Users, Star, TrendingUp, Calendar,
  PowerOff, Power, Loader2, AlertCircle, X, Save,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { vanService } from '../../services/vanService';
import { parseMoeda, formatMoeda } from '../../utils/helpers';
import type { Van, VanFormData } from '../../types/Van';
import type { AuthMode } from '../../types';

interface DashboardPrestadorProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const FORM_VAZIO: VanFormData = {
  nome: '',
  origem: '',
  destino: '',
  instituicao: '',
  rota: '',
  horario_manha: '',
  horario_tarde: '',
  horario_noite: '',
  vagas_totais: '',
  valor_mensal: '',
  telefone: '',
  email: '',
};

type FormErrors = Partial<Record<keyof VanFormData | 'horarios', string>>;

function DashboardPrestador({ onOpenAuth }: DashboardPrestadorProps) {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('rotas');
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

  const avaliacoes = [
    { id: 1, cliente: 'Maria Silva', nota: 5, comentario: 'Excelente serviço, sempre pontual!', data: '10/01/2025', rota: 'Van Escolar Central' },
    { id: 2, cliente: 'João Santos', nota: 4, comentario: 'Muito bom, motorista educado.', data: '08/01/2025', rota: 'Transporte Noturno' },
  ];

  useEffect(() => {
    carregarVans();
  }, []);

  const carregarVans = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await vanService.minhasVans();
      setVans(data);
    } catch {
      setLoadError('Erro ao carregar suas vans. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const vansAtivas = vans.filter(v => v.ativa !== false);

  const estatisticas = {
    totalRotas: vansAtivas.length,

    totalPassageiros: vans.reduce(
      (acc, v) => acc + ((v.vagas_totais ?? 0) - (v.vagas_disponiveis ?? 0)),
      0,
    ),

    avaliacaoMedia: (() => {
      const comAval = vans.filter(v => (v.totalAvaliacoes ?? 0) > 0);
      if (!comAval.length) return 0;
      return comAval.reduce((acc, v) => acc + (v.avaliacao ?? 0), 0) / comAval.length;
    })(),

    ocupacaoMedia: (() => {
      const validas = vansAtivas.filter(v => (v.vagas_totais ?? 0) > 0);
      if (!validas.length) return 0;
      return Math.round(
        validas.reduce(
          (acc, v) => acc + (v.vagas_totais! - (v.vagas_disponiveis ?? 0)) / v.vagas_totais!,
          0,
        ) / validas.length * 100,
      );
    })(),
  };

  const abrirModalCriar = () => {
    setEditingVan(null);
    setFormData({
      ...FORM_VAZIO,
      telefone: user?.telefone ?? '',
      email: user?.email ?? '',
    });
    setFormErrors({});
    setFormError(null);
    setShowModal(true);
  };

  const abrirModalEditar = (van: Van) => {
    setEditingVan(van);
    setFormData({
      nome:          van.nome ?? '',
      origem:        van.origem ?? '',
      destino:       van.destino ?? '',
      instituicao:   van.instituicao ?? '',
      rota:          van.rota ?? '',
      horario_manha: van.horario_manha ?? '',
      horario_tarde: van.horario_tarde ?? '',
      horario_noite: van.horario_noite ?? '',
      vagas_totais:  String(van.vagas_totais ?? ''),
      valor_mensal:  van.valor_mensal != null
        ? formatMoeda(String(Math.round(Number(van.valor_mensal) * 100)))
        : '',
      telefone:      van.telefone ?? user?.telefone ?? '',
      email:         van.email ?? user?.email ?? '',
    });
    setFormErrors({});
    setFormError(null);
    setShowModal(true);
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
      errors.horarios = 'Informe ao menos um horário (manhã, tarde ou noite)';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarForm()) return;
    setFormLoading(true);
    setFormError(null);
    try {
      const payload = {
        nome:          formData.nome,
        origem:        formData.origem,
        destino:       formData.destino,
        instituicao:   formData.instituicao,
        rota:          formData.rota,
        horario_manha: formData.horario_manha  || null,
        horario_tarde: formData.horario_tarde  || null,
        horario_noite: formData.horario_noite  || null,
        vagas_totais:  Number(formData.vagas_totais),
        valor_mensal:  formData.valor_mensal   ? parseMoeda(formData.valor_mensal) : null,
        telefone:      formData.telefone       || null,
        email:         formData.email          || null,
      };

      if (editingVan) {
        await vanService.atualizar(editingVan.id, payload);
      } else {
        await vanService.criar(payload);
      }

      await carregarVans();
      setShowModal(false);
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || 'Erro ao salvar. Tente novamente.',
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleAtiva = async (van: Van) => {
    setTogglingVanId(van.id);
    try {
      await vanService.atualizar(van.id, { ativa: !van.ativa });
      setVans(prev => prev.map(v => v.id === van.id ? { ...v, ativa: !van.ativa } : v));
    } catch {
    } finally {
      setTogglingVanId(null);
    }
  };

  const handleDeletar = async (id: number) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await vanService.deletar(id);
      setVans(prev => prev.filter(v => v.id !== id));
      setDeletingVanId(null);
    } catch (err: any) {
      setDeleteError(
        err.response?.data?.message || 'Erro ao excluir. Tente novamente.',
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const setField = (field: keyof VanFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined, horarios: undefined }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />

      <div className="bg-linear-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Painel do Prestador</h1>
          <p className="text-purple-100">Gerencie suas rotas e serviços</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {loading ? '—' : estatisticas.totalRotas}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Rotas Ativas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {loading ? '—' : estatisticas.totalPassageiros}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Passageiros</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {loading ? '—' : estatisticas.avaliacaoMedia.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Avaliação Média</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {loading ? '—' : `${estatisticas.ocupacaoMedia}%`}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Ocupação Média</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('rotas')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'rotas'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Minhas Rotas
              </button>
              <button
                onClick={() => setActiveTab('avaliacoes')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'avaliacoes'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Star className="w-5 h-5" />
                Avaliações
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'rotas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Gerenciar Rotas{!loading && ` (${vans.length})`}
                  </h2>
                  <Button
                    variant="primary"
                    onClick={abrirModalCriar}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nova Rota
                  </Button>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Carregando suas vans...
                  </div>
                )}

                {!loading && loadError && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {loadError}
                    <button
                      onClick={carregarVans}
                      className="ml-auto underline text-sm"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}

                {!loading && !loadError && vans.length === 0 && (
                  <div className="text-center py-16">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhuma rota cadastrada ainda
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Adicione sua primeira rota para aparecer nas buscas.
                    </p>
                    <Button variant="primary" onClick={abrirModalCriar}>
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Primeira Rota
                    </Button>
                  </div>
                )}

                {!loading && !loadError && vans.length > 0 && (
                  <div className="space-y-4">
                    {vans.map(van => (
                      <div
                        key={van.id}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">
                                {van.nome}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                van.ativa !== false
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {van.ativa !== false ? 'Ativa' : 'Inativa'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {van.origem} → {van.destino}
                              {van.instituicao && (
                                <span className="ml-2 text-purple-600 font-medium">
                                  · {van.instituicao}
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{van.rota}</p>
                            {van.horario && Object.keys(van.horario).length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                {Object.entries(van.horario)
                                  .map(([p, h]) => `${p.charAt(0).toUpperCase() + p.slice(1)}: ${h}`)
                                  .join(' · ')}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 flex-shrink-0 ml-4">
                            <button
                              onClick={() => abrirModalEditar(van)}
                              title="Editar"
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() => handleToggleAtiva(van)}
                              disabled={togglingVanId === van.id}
                              title={van.ativa !== false ? 'Desativar' : 'Ativar'}
                              className={`p-2 rounded-lg transition ${
                                van.ativa !== false
                                  ? 'text-orange-500 hover:bg-orange-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {togglingVanId === van.id
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : van.ativa !== false
                                  ? <PowerOff className="w-5 h-5" />
                                  : <Power className="w-5 h-5" />
                              }
                            </button>

                            <button
                              onClick={() => {
                                setDeletingVanId(van.id);
                                setDeleteError(null);
                              }}
                              title="Excluir"
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {deletingVanId === van.id && (
                          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-medium mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Tem certeza que deseja excluir "{van.nome}"? Esta ação não pode ser desfeita.
                            </p>
                            {deleteError && (
                              <p className="text-red-600 text-sm mb-3">{deleteError}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                loading={deleteLoading}
                                onClick={() => handleDeletar(van.id)}
                                className="bg-red-600 hover:bg-red-700 flex items-center gap-2 text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                Confirmar Exclusão
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => { setDeletingVanId(null); setDeleteError(null); }}
                                className="flex items-center gap-2 text-sm"
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Ocupação</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {(van.vagas_totais ?? 0) - (van.vagas_disponiveis ?? 0)}/{van.vagas_totais ?? 0}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full transition-all"
                                style={{
                                  width: van.vagas_totais
                                    ? `${((van.vagas_totais - (van.vagas_disponiveis ?? 0)) / van.vagas_totais) * 100}%`
                                    : '0%',
                                }}
                              />
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Vagas Disponíveis</p>
                            <p className="text-2xl font-bold text-green-600">
                              {van.vagas_disponiveis ?? 0}
                            </p>
                            {van.valor_mensal != null && (
                              <p className="text-xs text-gray-400 mt-1">
                                R$ {Number(van.valor_mensal).toFixed(2).replace('.', ',')}/mês
                              </p>
                            )}
                          </div>

                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Avaliação</p>
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="text-2xl font-bold text-gray-900">
                                {(van.avaliacao ?? 0).toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({van.totalAvaliacoes ?? 0})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Avaliações Recebidas ({avaliacoes.length})
                </h2>
                <div className="space-y-4">
                  {avaliacoes.map(avaliacao => (
                    <div
                      key={avaliacao.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{avaliacao.cliente}</h3>
                          <p className="text-sm text-gray-500">{avaliacao.rota}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= avaliacao.nota
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{avaliacao.comentario}</p>
                      <p className="text-xs text-gray-500">{avaliacao.data}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => !formLoading && setShowModal(false)}
        title={editingVan ? `Editar: ${editingVan.nome}` : 'Nova Rota'}
        size="md"
      >
        <div className="space-y-4">

          <Input
            label="Nome da Van"
            value={formData.nome}
            error={formErrors.nome}
            placeholder="Ex: Van Escolar Central"
            required
            onChange={e => setField('nome', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Origem"
              value={formData.origem}
              error={formErrors.origem}
              placeholder="Ex: Centro"
              required
              onChange={e => setField('origem', e.target.value)}
            />
            <Input
              label="Destino"
              value={formData.destino}
              error={formErrors.destino}
              placeholder="Ex: UNICENTRO"
              required
              onChange={e => setField('destino', e.target.value)}
            />
          </div>

          <Input
            label="Instituição de Ensino"
            value={formData.instituicao}
            error={formErrors.instituicao}
            placeholder="Ex: UNICENTRO, IFPR, UEL..."
            required
            onChange={e => setField('instituicao', e.target.value)}
          />

          <Input
            label="Descrição da Rota"
            value={formData.rota}
            error={formErrors.rota}
            placeholder="Ex: Centro → UNICENTRO, passando pela Av. Brasil"
            required
            onChange={e => setField('rota', e.target.value)}
          />

          <div>
            <p className="text-gray-700 font-medium mb-2">
              Horários <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal text-sm ml-1">
                (informe ao menos um)
              </span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Manhã"
                type="time"
                value={formData.horario_manha}
                onChange={e => setField('horario_manha', e.target.value)}
              />
              <Input
                label="Tarde"
                type="time"
                value={formData.horario_tarde}
                onChange={e => setField('horario_tarde', e.target.value)}
              />
              <Input
                label="Noite"
                type="time"
                value={formData.horario_noite}
                onChange={e => setField('horario_noite', e.target.value)}
              />
            </div>
            {formErrors.horarios && (
              <p className="text-red-500 text-sm mt-1">{formErrors.horarios}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vagas Totais"
              type="number"
              value={formData.vagas_totais}
              error={formErrors.vagas_totais}
              placeholder="Ex: 15"
              required
              onChange={e => setField('vagas_totais', e.target.value)}
            />
            <Input
              label="Valor Mensal (R$)"
              currency
              value={formData.valor_mensal}
              placeholder="Ex: 250,00"
              onChange={e => setField('valor_mensal', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Telefone de Contato"
              type="tel"
              value={formData.telefone}
              placeholder="(00) 00000-0000"
              onChange={e => setField('telefone', e.target.value)}
            />
            <Input
              label="E-mail de Contato"
              type="email"
              value={formData.email}
              placeholder="contato@email.com"
              onChange={e => setField('email', e.target.value)}
            />
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              loading={formLoading}
              onClick={handleSalvar}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingVan ? 'Salvar Alterações' : 'Cadastrar Rota'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2"
              disabled={formLoading}
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

export default DashboardPrestador;
