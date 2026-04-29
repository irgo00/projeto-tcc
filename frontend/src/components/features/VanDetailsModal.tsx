import { MapPin, Clock, Users, Star, Phone, Mail } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Van } from '../../types/Van';

interface VanDetailsModalProps {
  van: Van | null;
  isOpen: boolean;
  onClose: () => void;
  onAvaliar: (van: Van) => void;
}

const VanDetailsModal = ({
  van,
  isOpen,
  onClose,
  onAvaliar,
}: VanDetailsModalProps) => {
  if (!van) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{van.nome}</h2>
          <p className="text-gray-600 mt-1 text-lg">{van.prestador}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-purple-600" />
              Rota Atendida
            </h3>
            <p className="text-gray-700 ml-7">{van.rota}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Horários
              </h3>
              <div className="ml-7 text-sm text-gray-700 space-y-1">
                {Object.entries(van.horario).map(([periodo, hora]) => (
                  <p key={periodo}>
                    <strong className="capitalize">{periodo}:</strong> {hora}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Disponibilidade
              </h3>
              <p className="text-gray-700 ml-7">
                <span className="text-2xl font-bold text-purple-600">
                  {van.vagas}
                </span>
                <span className="text-sm ml-1">vagas disponíveis</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Contato</h3>

            <div className="space-y-2 ml-1">
              {van.telefone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-3 text-purple-600" />
                  <span>{van.telefone}</span>
                </div>
              )}

              {van.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-3 text-purple-600" />
                  <span>{van.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
              Avaliações
            </h3>

            <div className="flex items-center mb-4">
              <span className="text-4xl font-bold text-gray-900">
                {van.avaliacao.toFixed(1)}
              </span>

              <div className="ml-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i <= Math.round(van.avaliacao)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-sm text-gray-600">
                  {van.totalAvaliacoes} avaliações
                </span>
              </div>
            </div>

            <button
              onClick={() => onAvaliar(van)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              + Deixar uma avaliação
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Entrar em Contato
          </Button>

          <Button variant="outline" className="w-full">
            Salvar nos Favoritos
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VanDetailsModal;
