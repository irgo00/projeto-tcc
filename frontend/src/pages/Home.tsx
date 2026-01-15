import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchSection from '../components/features/SearchSection';
import VanCard from '../components/features/VanCard';
import VanDetailsModal from '../components/features/VanDetailsModal';
import AuthModal from '../components/features/AuthModal';
import { Heart, Bell, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [authModal, setAuthModal] = useState(null);
  const [selectedVan, setSelectedVan] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Mock data - substituir por chamada API
  const vans = [
    {
      id: 1,
      nome: 'Van Escolar Central',
      prestador: 'João Silva Transportes',
      rota: 'Centro → UNICENTRO (Campus Santa Cruz)',
      horario: 'Manhã: 06:30 | Tarde: 13:00',
      vagas: 3,
      avaliacao: 4.8,
      totalAvaliacoes: 24,
      telefone: '(42) 99999-0001',
      email: 'joao.van@email.com',
    },
    {
      id: 2,
      nome: 'Transporte Universitário',
      prestador: 'Maria Santos',
      rota: 'Engenheiro Gutierrez → IFPR Campus Irati',
      horario: 'Manhã: 07:00 | Tarde: 13:30',
      vagas: 5,
      avaliacao: 4.9,
      totalAvaliacoes: 31,
      telefone: '(42) 99999-0002',
      email: 'maria.transporte@email.com',
    },
    {
      id: 3,
      nome: 'Van Estudantil',
      prestador: 'Pedro Oliveira',
      rota: 'Alto da Glória → Colégio Estadual',
      horario: 'Manhã: 06:45 | Tarde: 12:45',
      vagas: 2,
      avaliacao: 4.7,
      totalAvaliacoes: 18,
      telefone: '(42) 99999-0003',
      email: 'pedro.estudantil@email.com',
    },
    {
      id: 4,
      nome: 'Transporte Escolar Seguro',
      prestador: 'Ana Costa',
      rota: 'Riozinho → Escola Municipal',
      horario: 'Manhã: 07:15 | Tarde: 13:15',
      vagas: 4,
      avaliacao: 4.6,
      totalAvaliacoes: 15,
      telefone: '(42) 99999-0004',
      email: 'ana.transporte@email.com',
    },
    {
      id: 5,
      nome: 'Van Universitária Plus',
      prestador: 'Carlos Mendes',
      rota: 'Zona Rural → UNICENTRO',
      horario: 'Manhã: 06:00 | Tarde: 12:30',
      vagas: 6,
      avaliacao: 4.9,
      totalAvaliacoes: 42,
      telefone: '(42) 99999-0005',
      email: 'carlos.van@email.com',
    },
    {
      id: 6,
      nome: 'Transporte Escolar Rápido',
      prestador: 'Juliana Ferreira',
      rota: 'Itapará → Colégio Estadual',
      horario: 'Manhã: 06:50 | Noite: 18:00',
      vagas: 1,
      avaliacao: 4.5,
      totalAvaliacoes: 12,
      telefone: '(42) 99999-0006',
      email: 'juliana.rapido@email.com',
    },
  ];

  const handleSearch = (filters) => {
    console.log('Buscando com filtros:', filters);
    navigate('/busca', { state: { filters } });
  };

  const handleToggleFavorite = (vanId) => {
    setFavorites((prev) =>
      prev.includes(vanId) ? prev.filter((id) => id !== vanId) : [...prev, vanId]
    );
  };

  const handleAvaliar = (van) => {
    console.log('Avaliar van:', van);
    // Implementar modal de avaliação
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={setAuthModal} />

      <SearchSection onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Vans Disponíveis</h2>
            <p className="text-gray-600 mt-1">{vans.length} opções encontradas</p>
          </div>
          <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium border-2 border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition">
            <Filter className="w-5 h-5" />
            Mais Filtros
          </button>
        </div>

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
      </div>

      <VanDetailsModal
        van={selectedVan}
        isOpen={!!selectedVan}
        onClose={() => setSelectedVan(null)}
        onAvaliar={handleAvaliar}
      />

      <AuthModal
        isOpen={!!authModal}
        onClose={() => setAuthModal(null)}
        initialMode={authModal}
      />

      <Footer />
    </div>
  );
};

export default Home;