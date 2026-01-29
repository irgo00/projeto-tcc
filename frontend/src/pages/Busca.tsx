import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchSection from "../components/features/SearchSection";
import VanCard from "../components/features/VanCard";
import VanDetailsModal from "../components/features/VanDetailsModal";
import AuthModal from "../components/features/AuthModal";
import Button from "../components/common/Button";

import type { AuthMode } from "../types";
import type { Van } from "../types/Van";
import RouteMapModal from "../components/features/RouteMapModal";

const Busca = () => {
  const location = useLocation();

  /* =====================
     Estados principais
  ===================== */
  const [routeVan, setRouteVan] = useState<Van | null>(null);
  const [filteredVans, setFilteredVans] = useState<Van[]>([]);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filters = location.state?.filters || {};

  /* =====================
     Mock de vans
     (substituir por API)
  ===================== */

  const vans: Van[] = [
    {
      id: 1,
      nome: "Van Escolar Central",
      prestador: "João Silva Transportes",
      rota: "Centro → UNICENTRO (Campus Santa Cruz)",
      horario: "Manhã: 06:30 | Tarde: 13:00",
      vagas: 3,
      avaliacao: 4.8,
      totalAvaliacoes: 24,
      telefone: "(42) 99999-0001",
      email: "joao.van@email.com",
    },
  ];

  /* =====================
     Função de busca
     (EXATAMENTE como pedido)
  ===================== */

  const performSearch = (filters: any) => {
    let results = vans;

    if (filters.origem) {
      results = results.filter((van) =>
        van.rota.toLowerCase().includes(filters.origem.toLowerCase()),
      );
    }

    if (filters.instituicao) {
      results = results.filter((van) =>
        van.rota.toLowerCase().includes(filters.instituicao.toLowerCase()),
      );
    }

    setFilteredVans(results);
  };

  /* =====================
     Busca automática
     ao entrar na página
  ===================== */

  useEffect(() => {
    if (filters) {
      performSearch(filters);
    }
  }, [filters]);

  /* =====================
     Favoritos
  ===================== */

  const handleToggleFavorite = (vanId: number) => {
    setFavorites((prev) =>
      prev.includes(vanId)
        ? prev.filter((id) => id !== vanId)
        : [...prev, vanId],
    );
  };

  /* =====================
     Render
  ===================== */

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={setAuthModal} />

      {/* 🔹 SearchSection NOVO */}
      <SearchSection
        onSearch={performSearch}
        showResultsCount
        resultsCount={filteredVans.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredVans.length}{" "}
            {filteredVans.length === 1 ? "van encontrada" : "vans encontradas"}
          </h2>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Filtros Avançados</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Qualquer número de vagas</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
              </select>

              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Avaliação mínima</option>
                <option>4.0+</option>
                <option>4.5+</option>
              </select>

              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Ordenar por</option>
                <option>Melhor avaliação</option>
                <option>Mais vagas</option>
              </select>
            </div>
          </div>
        )}

        {/* 🔹 Renderiza filteredVans */}
        {filteredVans.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVans.map((van) => (
              <VanCard
                key={van.id}
                van={van}
                onViewDetails={setSelectedVan}
                onViewRoute={setRouteVan}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(van.id)}
              />
            ))}
          </div>
        )}

        {/* 🔹 Nenhuma van encontrada */}
        {filteredVans.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhuma van encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou buscar por outra região.
            </p>
            <Button variant="primary" onClick={() => window.history.back()}>
              Voltar para Busca
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

      <AuthModal
        isOpen={!!authModal}
        onClose={() => setAuthModal(null)}
        initialMode={authModal ?? undefined}
      />

      <RouteMapModal
        van={routeVan}
        isOpen={!!routeVan}
        onClose={() => setRouteVan(null)}
      />

      <Footer />
    </div>
  );
};

export default Busca;
