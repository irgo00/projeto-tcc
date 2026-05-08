import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, Search, Heart, Bell, Loader2, AlertCircle } from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchSection from "../components/features/SearchSection";
import VanCard from "../components/features/VanCard";
import VanDetailsModal from "../components/features/VanDetailsModal";
import RouteMapModal from "../components/features/RouteMapModal";
import Button from "../components/common/Button";

import { vanService } from "../services/vanService";
import type { Van } from "../types/Van";
import type { SearchFilters, AuthMode } from "../types";

interface BuscaPageProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const Busca = ({ onOpenAuth }: BuscaPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchFilters = location.state?.filters;

  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [selectedRouteVan, setSelectedRouteVan] = useState<Van | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filteredVans, setFilteredVans] = useState<Van[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!searchFilters) {
      navigate("/");
      return;
    }
    performSearch(searchFilters);
  }, [searchFilters]);

  const performSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setSearchError(null);
    setHasSearched(false);
    try {
      const vans = await vanService.buscar(filters);
      setFilteredVans(vans);
    } catch {
      setSearchError("Não foi possível realizar a busca. Tente novamente.");
      setFilteredVans([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    performSearch(filters);
  };

  const handleToggleFavorite = (vanId: number) => {
    setFavorites((prev) =>
      prev.includes(vanId)
        ? prev.filter((id) => id !== vanId)
        : [...prev, vanId],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />

      <SearchSection
        onSearch={handleSearch}
        showResultsCount={hasSearched && !loading}
        resultsCount={filteredVans.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <p className="text-lg">Buscando vans disponíveis...</p>
          </div>
        )}

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

        {!loading && !searchError && hasSearched && filteredVans.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Vans Disponíveis
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredVans.length}{" "}
                  {filteredVans.length === 1 ? "opção encontrada" : "opções encontradas"}
                </p>
              </div>
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium border-2 border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition">
                <Filter className="w-5 h-5" />
                Mais Filtros
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVans.map((van) => (
                <VanCard
                  key={van.id}
                  van={van}
                  onViewDetails={(van) => setSelectedVan(van)}
                  onViewRoute={(van) => setSelectedRouteVan(van)}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(van.id)}
                />
              ))}
            </div>

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
                  Você será notificado quando houver vagas disponíveis nas vans que favoritou
                </p>
              </div>
            )}
          </>
        )}

        {!loading && !searchError && hasSearched && filteredVans.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhuma van encontrada
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Não encontramos vans que correspondam à sua busca. Tente ajustar
              os filtros ou buscar por outras regiões.
            </p>
            <Button variant="primary" onClick={() => navigate("/")}>
              Voltar ao Início
            </Button>
          </div>
        )}

      </div>

      <VanDetailsModal
        van={selectedVan}
        isOpen={!!selectedVan}
        onClose={() => setSelectedVan(null)}
        onAvaliar={() => {}}
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

export default Busca;
