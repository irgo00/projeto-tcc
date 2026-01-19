import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VanCard from "../components/features/VanCard";
import VanDetailsModal from "../components/features/VanDetailsModal";
import AuthModal from "../components/features/AuthModal";
import { Filter, SlidersHorizontal } from "lucide-react";
import Button from "../components/common/Button";
import type { Van, AuthMode } from "../types";

const Busca = () => {
  const location = useLocation();
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);
  const [selectedVan, setSelectedVan] = useState<Van | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const [filters] = useState(location.state?.filters || {});
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - substituir por chamada API
  const vans = [
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
    // Adicionar mais vans conforme necessário
  ];

  const handleToggleFavorite = (vanId: number) => {
    setFavorites((prev) =>
      prev.includes(vanId)
        ? prev.filter((id) => id !== vanId)
        : [...prev, vanId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={setAuthModal} />

      <div className="bg-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Resultados da Busca</h1>
          <p className="text-purple-100">
            {filters.origem && `De ${filters.origem} `}
            {filters.instituicao && `para ${filters.instituicao}`}
            {filters.periodo && ` - Período: ${filters.periodo}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {vans.length}{" "}
              {vans.length === 1 ? "van encontrada" : "vans encontradas"}
            </h2>
          </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Vagas
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Qualquer</option>
                  <option>1+</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>5+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação Mínima
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Qualquer</option>
                  <option>4.0+</option>
                  <option>4.5+</option>
                  <option>4.8+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Mais relevantes</option>
                  <option>Melhor avaliação</option>
                  <option>Mais vagas</option>
                  <option>Menor preço</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vans.map((van) => (
            <VanCard
              key={van.id}
              van={van}
              onViewDetails={setSelectedVan}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(van.id)}
            />
          ))}
        </div>

        {vans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-24 h-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Nenhuma van encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou fazer uma nova busca
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

      <Footer />
    </div>
  );
};

export default Busca;
