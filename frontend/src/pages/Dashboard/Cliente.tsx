import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import VanCard from '../../components/features/VanCard';
import VanDetailsModal from '../../components/features/VanDetailsModal';
import RouteMapModal from '../../components/features/RouteMapModal';
import { Heart, Bell, History, Star, Loader2, Phone, Mail } from 'lucide-react';
import { avaliacaoService } from '../../services/avaliacaoService';
import { favoritoService } from '../../services/favoritoService';
import { historicoService } from '../../services/historicoService';
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
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [selectedRouteVan, setSelectedRouteVan] = useState<Van | null>(null);
  const [activeTab, setActiveTab] = useState('favoritos');

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
                        onViewRoute={setSelectedRouteVan}
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
      <RouteMapModal
        van={selectedRouteVan}
        isOpen={!!selectedRouteVan}
        onClose={() => setSelectedRouteVan(null)}
      />

      <Footer />
    </div>
  );
};

export default DashboardCliente;
