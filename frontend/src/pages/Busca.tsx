import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, Search, Heart, Bell, Loader2, AlertCircle } from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchSection from "../components/features/SearchSection";
import VanCard from "../components/features/VanCard";
import VanDetailsModal from "../components/features/VanDetailsModal";
import RouteMapModal from "../components/features/RouteMapModal";
import Button from "../components/common/Button";
import FiltrosPanel, {
  FILTROS_PADRAO,
  contarFiltrosAtivos,
} from "../components/features/FiltrosPanel";
import type { FiltrosAtivos, OrdenacaoOpcao } from "../components/features/FiltrosPanel";

import { vanService } from "../services/vanService";
import type { Van } from "../types/Van";
import type { SearchFilters, AuthMode } from "../types";

interface BuscaPageProps {
  onOpenAuth: (mode: AuthMode) => void;
}

// ─── funções de filtragem/ordenação (client-side) ────────────────────────────

function aplicarFiltros(vans: Van[], f: FiltrosAtivos): Van[] {
  let resultado = [...vans];

  // avaliação mínima
  if (f.avaliacaoMinima > 0) {
    resultado = resultado.filter((v) => v.avaliacao >= f.avaliacaoMinima);
  }

  // vagas mínimas
  if (f.vagasMinimas > 0) {
    resultado = resultado.filter((v) => v.vagas >= f.vagasMinimas);
  }

  // apenas com vagas
  if (f.apenasComVagas) {
    resultado = resultado.filter((v) => v.vagas > 0);
  }

  // confortos do veículo (só filtra se o veículo tiver os dados; ignora se não tiver)
  const confortosAtivos: (keyof FiltrosAtivos)[] = [
    "ar_condicionado",
    "wifi",
    "camera_interna",
    "usb_carregador",
    "acessibilidade",
    "porta_automatica",
  ];

  for (const conforto of confortosAtivos) {
    if (f[conforto]) {
      resultado = resultado.filter((v) => {
        // se a van não tem dados de veículo, não filtra (evita excluir indevidamente)
        if (!v.van) return true;
        return (v.van as any)[conforto] === true;
      });
    }
  }

  return resultado;
}

function aplicarOrdenacao(vans: Van[], ordenacao: OrdenacaoOpcao): Van[] {
  const copia = [...vans];
  switch (ordenacao) {
    case "avaliacao_desc":
      return copia.sort((a, b) => b.avaliacao - a.avaliacao);
    case "vagas_desc":
      return copia.sort((a, b) => b.vagas - a.vagas);
    case "vagas_asc":
      return copia.sort((a, b) => a.vagas - b.vagas);
    case "nome_asc":
      return copia.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    default:
      return copia; // relevancia = ordem da API
  }
}

// ─── componente ───────────────────────────────────────────────────────────────

const Busca = ({ onOpenAuth }: BuscaPageProps) => {
  const location  = useLocation();
  const navigate  = useNavigate();

  const searchFilters = location.state?.filters as SearchFilters | undefined;

  // resultado bruto da API
  const [vansRaw, setVansRaw]         = useState<Van[]>([]);
  const [loading, setLoading]         = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // modais
  const [selectedVan, setSelectedVan]         = useState<Van | null>(null);
  const [selectedRouteVan, setSelectedRouteVan] = useState<Van | null>(null);

  // favoritos (local — sem backend ainda)
  const [favorites, setFavorites] = useState<number[]>([]);

  // filtros
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [filtros, setFiltros]         = useState<FiltrosAtivos>({
    ...FILTROS_PADRAO,
    origem:      searchFilters?.origem      ?? "",
    instituicao: searchFilters?.instituicao ?? "",
    periodo:     searchFilters?.periodo     ?? "",
  });

  // aplica filtros + ordenação sobre o resultado da API (client-side, instantâneo)
  const vansExibidas = useMemo(() => {
    const filtradas  = aplicarFiltros(vansRaw, filtros);
    const ordenadas  = aplicarOrdenacao(filtradas, filtros.ordenacao);
    return ordenadas;
  }, [vansRaw, filtros]);

  const qtdFiltrosExtras = contarFiltrosAtivos(filtros);

  // ── busca na API ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!searchFilters) {
      navigate("/");
      return;
    }
    performSearch(searchFilters);
  }, [searchFilters]);

  const performSearch = async (sf: SearchFilters) => {
    setLoading(true);
    setSearchError(null);
    setHasSearched(false);
    try {
      const vans = await vanService.buscar(sf);
      setVansRaw(vans);
    } catch {
      setSearchError("Não foi possível realizar a busca. Tente novamente.");
      setVansRaw([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // nova busca vinda do SearchSection (no topo da página de resultados)
  const handleSearch = (sf: SearchFilters) => {
    // atualiza também os campos correspondentes nos filtros para consistência
    setFiltros((prev) => ({
      ...prev,
      origem:      sf.origem      ?? "",
      instituicao: sf.instituicao ?? "",
      periodo:     sf.periodo     ?? "",
    }));
    performSearch(sf);
  };

  const handleToggleFavorite = (vanId: number) => {
    setFavorites((prev) =>
      prev.includes(vanId) ? prev.filter((id) => id !== vanId) : [...prev, vanId]
    );
  };

  const handleFiltrosChange = (novosFiltros: FiltrosAtivos) => {
    setFiltros(novosFiltros);
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />

      <SearchSection
        onSearch={handleSearch}
        showResultsCount={hasSearched && !loading}
        resultsCount={vansExibidas.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <p className="text-lg">Buscando vans disponíveis...</p>
          </div>
        )}

        {/* ── erro ── */}
        {!loading && searchError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl max-w-xl mx-auto mt-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">{searchError}</div>
            <button
              onClick={() => searchFilters && performSearch(searchFilters)}
              className="underline text-sm whitespace-nowrap"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* ── resultados ── */}
        {!loading && !searchError && hasSearched && (
          <>
            {/* cabeçalho de resultados + botão de filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Vans Disponíveis
                </h2>
                <p className="text-gray-600 mt-1">
                  {vansExibidas.length}{" "}
                  {vansExibidas.length === 1 ? "opção encontrada" : "opções encontradas"}
                  {vansRaw.length !== vansExibidas.length && (
                    <span className="text-gray-400 text-sm ml-1">
                      (de {vansRaw.length} no total)
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={() => setFiltrosOpen(true)}
                className="relative flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium border-2 border-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50 transition"
              >
                <Filter className="w-5 h-5" />
                Filtros e Ordenação
                {qtdFiltrosExtras > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {qtdFiltrosExtras}
                  </span>
                )}
              </button>
            </div>

            {/* chips dos filtros ativos */}
            {qtdFiltrosExtras > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filtros.avaliacaoMinima > 0 && (
                  <Chip
                    label={`${filtros.avaliacaoMinima}★ ou mais`}
                    onRemove={() => setFiltros((p) => ({ ...p, avaliacaoMinima: 0 }))}
                  />
                )}
                {filtros.vagasMinimas > 0 && (
                  <Chip
                    label={`Mínimo ${filtros.vagasMinimas} vagas`}
                    onRemove={() => setFiltros((p) => ({ ...p, vagasMinimas: 0 }))}
                  />
                )}
                {!filtros.apenasComVagas && (
                  <Chip
                    label="Incluir sem vagas"
                    onRemove={() => setFiltros((p) => ({ ...p, apenasComVagas: true }))}
                  />
                )}
                {filtros.ordenacao !== "relevancia" && (
                  <Chip
                    label={
                      {
                        avaliacao_desc: "Melhor avaliação",
                        vagas_desc:     "Mais vagas",
                        vagas_asc:      "Quase cheias",
                        nome_asc:       "Nome A–Z",
                      }[filtros.ordenacao] ?? filtros.ordenacao
                    }
                    onRemove={() => setFiltros((p) => ({ ...p, ordenacao: "relevancia" }))}
                  />
                )}
                {filtros.ar_condicionado  && <Chip label="Ar-condicionado" onRemove={() => setFiltros((p) => ({ ...p, ar_condicionado: false }))} />}
                {filtros.wifi             && <Chip label="Wi-Fi"           onRemove={() => setFiltros((p) => ({ ...p, wifi: false }))} />}
                {filtros.camera_interna   && <Chip label="Câmera interna"  onRemove={() => setFiltros((p) => ({ ...p, camera_interna: false }))} />}
                {filtros.usb_carregador   && <Chip label="USB"             onRemove={() => setFiltros((p) => ({ ...p, usb_carregador: false }))} />}
                {filtros.acessibilidade   && <Chip label="Acessibilidade"  onRemove={() => setFiltros((p) => ({ ...p, acessibilidade: false }))} />}
                {filtros.porta_automatica && <Chip label="Porta automática"onRemove={() => setFiltros((p) => ({ ...p, porta_automatica: false }))} />}

                <button
                  onClick={() =>
                    setFiltros((p) => ({
                      ...FILTROS_PADRAO,
                      origem: p.origem,
                      instituicao: p.instituicao,
                      periodo: p.periodo,
                    }))
                  }
                  className="text-xs text-gray-500 hover:text-gray-700 underline px-2 py-1"
                >
                  Limpar todos
                </button>
              </div>
            )}

            {/* grid de resultados */}
            {vansExibidas.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vansExibidas.map((van) => (
                    <VanCard
                      key={van.id}
                      van={van}
                      onViewDetails={(v) => setSelectedVan(v)}
                      onViewRoute={(v) => setSelectedRouteVan(v)}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(van.id)}
                    />
                  ))}
                </div>

                {/* bloco de favoritos */}
                {favorites.length > 0 && (
                  <div className="mt-12 bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-red-500 fill-current" />
                        Meus Favoritos ({favorites.length})
                      </h3>
                      <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                        <Bell className="w-4 h-4" />
                        Ativar Notificações
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Você será notificado quando houver vagas disponíveis nas vans que favoritou.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* nenhum resultado após filtros */
              <div className="text-center py-16">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {vansRaw.length === 0
                    ? "Nenhuma van encontrada"
                    : "Nenhuma van corresponde aos filtros"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {vansRaw.length === 0
                    ? "Não encontramos vans que correspondam à sua busca. Tente ajustar os critérios ou buscar por outras regiões."
                    : `Encontramos ${vansRaw.length} van${vansRaw.length > 1 ? "s" : ""} no total, mas nenhuma passou pelos filtros aplicados. Tente remover alguns filtros.`}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  {qtdFiltrosExtras > 0 && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        setFiltros((p) => ({
                          ...FILTROS_PADRAO,
                          origem: p.origem,
                          instituicao: p.instituicao,
                          periodo: p.periodo,
                        }))
                      }
                    >
                      Remover filtros
                    </Button>
                  )}
                  <Button variant="primary" onClick={() => navigate("/")}>
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── painel de filtros ── */}
      <FiltrosPanel
        isOpen={filtrosOpen}
        onClose={() => setFiltrosOpen(false)}
        filtros={filtros}
        onChange={handleFiltrosChange}
        totalResultados={
          // calcula quantos resultados a configuração local do painel retornaria
          aplicarFiltros(vansRaw, filtros).length
        }
      />

      {/* ── modais ── */}
      <VanDetailsModal
        van={selectedVan}
        isOpen={!!selectedVan}
        onClose={() => setSelectedVan(null)}
        onFavoritoChange={(id, fav) =>
          setFavorites((prev) =>
            fav ? [...prev, id] : prev.filter((x) => x !== id)
          )
        }
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

// ─── chip de filtro ativo ─────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-200">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-purple-900 transition"
        title="Remover filtro"
      >
        <X size={12} />
      </button>
    </span>
  );
}

// importação local do X para o Chip (evita import circular)
import { X } from "lucide-react";

export default Busca;
