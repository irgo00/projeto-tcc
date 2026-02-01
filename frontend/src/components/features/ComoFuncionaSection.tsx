import { Bell, Heart, MapPin, Phone, Search, Star, UserPlus, History } from 'lucide-react';
import Button from '../common/Button';
import type { AuthMode } from '../../types';

interface ComoFuncionaSectionProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const ComoFuncionaSection = ({ onOpenAuth }: ComoFuncionaSectionProps) => {
  return (
    <div id="como-funciona" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
        <p className="text-xl text-gray-600">Encontre seu transporte escolar em 3 passos simples</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">1. Busque</h3>
          <p className="text-gray-600">
            Digite seu bairro de origem e a instituição de ensino de destino. Selecione o período (manhã, tarde ou noite).
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">2. Compare</h3>
          <p className="text-gray-600">
            Veja todas as vans disponíveis, compare horários, avaliações e visualize as rotas detalhadas no Google Maps.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">3. Contate</h3>
          <p className="text-gray-600">
            Entre em contato direto com o prestador de serviço através de telefone ou e-mail para confirmar sua vaga.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 md:p-12 text-white">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4">Vantagens de Criar uma Conta</h3>
          <p className="text-purple-100 text-lg">
            Você pode buscar sem cadastro, mas ao criar uma conta gratuita você ganha:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Vans Favoritas</h4>
                <p className="text-purple-100 text-sm">
                  Salve suas vans preferidas para acesso rápido e receba notificações quando houver vagas disponíveis.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Notificações por E-mail</h4>
                <p className="text-purple-100 text-sm">
                  Seja avisado imediatamente quando as vans que você favoritou tiverem novas vagas disponíveis.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Avalie Serviços</h4>
                <p className="text-purple-100 text-sm">
                  Compartilhe sua experiência avaliando os prestadores e ajude outros estudantes na escolha.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Histórico de Buscas</h4>
                <p className="text-purple-100 text-sm">
                  Acesse rapidamente suas buscas anteriores e prestadores que você já contatou.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onOpenAuth('cadastro')}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <UserPlus className="w-5 h-5 mr-2 inline" />
            Criar Conta Gratuita
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ComoFuncionaSection;