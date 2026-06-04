import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import VanCard from '../../components/features/VanCard';
import VanDetailsModal from '../../components/features/VanDetailsModal';
import { Heart, Bell, History, Star, Loader2, Phone, Mail, AlertCircle, X, MailCheck } from 'lucide-react';
import { avaliacaoService } from '../../services/avaliacaoService';
import { authService } from '../../services/authService';
import { favoritoService } from '../../services/favoritoService';
import { historicoService } from '../../services/historicoService';
import { useAuth } from '../../hooks/useAuth';
import type { Van } from '../../types/Van';
import type { MinhaAvaliacao } from '../../types/Avaliacao';
import type { HistoricoItem } from '../../types/Historico';
import type { AuthMode } from '../../types';

interface DashboardClienteProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const tipoContatoLabel: Record<string, string> = {
  telefone: 'Telefone',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
};

const tipoContatoIcon = (tipo: string) => {
  if (tipo === 'email') return <Mail className="w-4 h-4" />;
  return <Phone className="w-4 h-4" />;
};

const DashboardCliente = ({ onOpenAuth }: DashboardClienteProps) => {
  const { user, updateUser } = useAuth();
  const emailVerificado = user?.email_verificado === true;

  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [activeTab, setActiveTab] = useState('favoritos');

  const [emailFeedback, setEmailFeedback] = useState<{ tipo: 'ok' | 'erro' | 'info'; texto: string } | null>(null);
  const [reenviando, setReenviando] = useState(false);
  const [reenvioMsg, setReenvioMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('email_verified');
    if (!status) return;

    const mensagens: Record<string, { tipo: 'ok' | 'erro' | 'info'; texto: string }> = {
      '1':     { tipo: 'ok',   texto: 'E-mail confirmado com sucesso! Agora você pode salvar rotas nos favoritos.' },
      already: { tipo: 'info', texto: 'Seu e-mail já estava confirmado.' },
      invalid: { tipo: 'erro', texto: 'Link de confirmação inválido. Reenvie o e-mail de verificação.' },
      expired: { tipo: 'erro', texto: 'O link de confirmação expirou. Reenvie o e-mail de verificação.' },
    };

    setEmailFeedback(mensagens[status] ?? null);

    if (status === '1' || status === 'already') {
      authService.getCurrentUser().then((u) => { if (u) updateUser(u); });
    }

    params.delete('email_verified');
    const novaQuery = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (novaQuery ? `?${novaQuery}` : ''));
  }, [updateUser]);

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

  // favoritos
  const [favoritos, setFavoritos] = useState<Van[]>([]);
  const [favoritosLoading, setFavoritosLoading] = useState(false);
  const [favoritosError, setFavoritosError] = useState<string | null>(null);
  const [favoritosCarregados, setFavoritosCarregados] = useState(false);

  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [historicoLoading, setHistoricoLoading] = useState(false);
  const [historicoError, setHistoricoError] = useState<string | null>(null);
  const [historicoCarregado, setHistoricoCarregado] = useState(false);

  const [minhasAvaliacoes, setMinhasAvaliacoes] = useState<MinhaAvaliacao[]>([]);
  const [avaliacoesLoading, setAvaliacoesLoading] = useState(false);
  const [avaliacoesError, setAvaliacoesError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'favoritos' && !favoritosCarregados && !favoritosLoading) {
      carregarFavoritos();
    }
    if (activeTab === 'historico' && !historicoCarregado && !historicoLoading) {
      carregarHistorico();
    }
    if (activeTab === 'avaliacoes' && minhasAvaliacoes.length === 0 && !avaliacoesLoading) {
      carregarAvaliacoes();
    }
  }, [activeTab]);

  const carregarFavoritos = async () => {
    setFavoritosLoading(true);
    setFavoritosError(null);
    try {
      const data = await favoritoService.listar();
      setFavoritos(data);
      setFavoritosCarregados(true);
    } catch {
      setFavoritosError('Erro ao carregar favoritos. Tente novamente.');
    } finally {
      setFavoritosLoading(false);
    }
  };

  const carregarHistorico = async () => {
    setHistoricoLoading(true);
    setHistoricoError(null);
    try {
      const data = await historicoService.listar();
      setHistorico(data);
      setHistoricoCarregado(true);
    } catch {
      setHistoricoError('Erro ao carregar histórico. Tente novamente.');
    } finally {
      setHistoricoLoading(false);
    }
  };

  const carregarAvaliacoes = async () => {
    setAvaliacoesLoading(true);
    setAvaliacoesError(null);
    try {
      const data = await avaliacaoService.minhas();
      setMinhasAvaliacoes(data);
    } catch {
      setAvaliacoesError('Erro ao carregar avaliações. Tente novamente.');
    } finally {
      setAvaliacoesLoading(false);
    }
  };

  const handleToggleFavorito = async (vanId: number) => {
    try {
      await favoritoService.remover(vanId);
      setFavoritos(prev => prev.filter(v => v.id !== vanId));
    } catch {}
  };

  const handleFavoritoChangeModal = (vanId: number, isFavorito: boolean) => {
    if (!isFavorito) {
      setFavoritos(prev => prev.filter(v => v.id !== vanId));
    } else {
      setFavoritosCarregados(false);
      if (activeTab === 'favoritos') carregarFavoritos();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Meu Painel</h1>
          <p className="text-purple-100">Gerencie seus favoritos e histórico</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {emailFeedback && (
          <div className={`flex items-start gap-3 rounded-xl px-5 py-4 mb-8 border ${
            emailFeedback.tipo === 'ok'
              ? 'bg-green-50 border-green-200 text-green-800'
              : emailFeedback.tipo === 'erro'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1 min-w-0">{emailFeedback.texto}</p>
            <button onClick={() => setEmailFeedback(null)} className="flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {user && !emailVerificado && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8">
            <MailCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-amber-800">Confirme seu e-mail</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Para salvar rotas nos favoritos você precisa confirmar seu e-mail. Verifique sua caixa de entrada (ou spam) — o link expira em 48 horas.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={reenviarEmail}
                  disabled={reenviando}
                  className="text-sm font-medium text-amber-900 underline hover:text-amber-700 disabled:opacity-60"
                >
                  {reenviando ? 'Reenviando...' : 'Reenviar e-mail de verificação'}
                </button>
                {reenvioMsg && (
                  <span className={`text-xs ${reenvioMsg.tipo === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
                    {reenvioMsg.texto}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('favoritos')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'favoritos'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Heart className="w-5 h-5" />
                Favoritos
              </button>
              <button
                onClick={() => setActiveTab('historico')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'historico'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <History className="w-5 h-5" />
                Histórico
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
                Minhas Avaliações
              </button>
            </div>
          </div>

          <div className="p-6">

            {activeTab === 'favoritos' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Vans Favoritas{!favoritosLoading && ` (${favoritos.length})`}
                  </h2>
                  <button
                    onClick={() => { setFavoritosCarregados(false); carregarFavoritos(); }}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    <Bell className="w-4 h-4" />
                    Atualizar
                  </button>
                </div>

                {favoritosLoading && (
                  <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Carregando favoritos...
                  </div>
                )}

                {!favoritosLoading && favoritosError && (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-3">{favoritosError}</p>
                    <button onClick={carregarFavoritos} className="text-purple-600 hover:underline text-sm">
                      Tentar novamente
                    </button>
                  </div>
                )}

                {!favoritosLoading && !favoritosError && favoritos.length === 0 && (
                  <div className="text-center py-12">
                    <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhum favorito ainda
                    </h3>
                    <p className="text-gray-600">
                      Salve vans nos favoritos a partir dos detalhes de cada uma na busca
                    </p>
                  </div>
                )}

                {!favoritosLoading && !favoritosError && favoritos.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoritos.map(van => (
                      <VanCard
                        key={van.id}
                        van={van}
                        onViewDetails={setSelectedVan}
                        onToggleFavorite={handleToggleFavorito}
                        isFavorite={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── HISTÓRICO ─────────────────────────────── */}
            {activeTab === 'historico' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Histórico de Contatos{!historicoLoading && ` (${historico.length})`}
                </h2>

                {historicoLoading && (
                  <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Carregando histórico...
                  </div>
                )}

                {!historicoLoading && historicoError && (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-3">{historicoError}</p>
                    <button onClick={carregarHistorico} className="text-purple-600 hover:underline text-sm">
                      Tentar novamente
                    </button>
                  </div>
                )}

                {!historicoLoading && !historicoError && historico.length === 0 && (
                  <div className="text-center py-12">
                    <History className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhum histórico ainda
                    </h3>
                    <p className="text-gray-600">
                      Seus contatos com prestadores aparecerão aqui
                    </p>
                  </div>
                )}

                {!historicoLoading && !historicoError && historico.length > 0 && (
                  <div className="space-y-4">
                    {historico.map(item => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-6 flex justify-between items-center border border-gray-200"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.van}</h3>
                          <p className="text-sm text-gray-600">{item.prestador}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Contato realizado em {item.data}
                          </p>
                        </div>
                        <span className="flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
                          {tipoContatoIcon(item.tipo_contato)}
                          {tipoContatoLabel[item.tipo_contato] ?? item.tipo_contato}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Minhas Avaliações
                </h2>

                {avaliacoesLoading && (
                  <div className="flex items-center justify-center py-12 gap-3 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Carregando avaliações...
                  </div>
                )}

                {!avaliacoesLoading && avaliacoesError && (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-3">{avaliacoesError}</p>
                    <button
                      onClick={carregarAvaliacoes}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}

                {!avaliacoesLoading && !avaliacoesError && minhasAvaliacoes.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhuma avaliação ainda
                    </h3>
                    <p className="text-gray-600">
                      Avalie as vans que você utilizou abrindo os detalhes delas na busca
                    </p>
                  </div>
                )}

                {!avaliacoesLoading && !avaliacoesError && minhasAvaliacoes.length > 0 && (
                  <div className="space-y-4">
                    {minhasAvaliacoes.map(av => (
                      <div
                        key={av.id}
                        className="bg-gray-50 rounded-lg p-5 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{av.van}</h3>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= av.nota
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {av.comentario && (
                          <p className="text-gray-700 text-sm mb-2">{av.comentario}</p>
                        )}
                        <p className="text-xs text-gray-400">{av.data}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <VanDetailsModal
        van={selectedVan}
        isOpen={!!selectedVan}
        onClose={() => setSelectedVan(null)}
        onFavoritoChange={handleFavoritoChangeModal}
      />

      <Footer />
    </div>
  );
};

export default DashboardCliente;
