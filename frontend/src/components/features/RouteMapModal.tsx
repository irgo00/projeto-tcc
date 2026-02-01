import { MapPin, Map } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

// ============================================================
// 🆕 NOVO COMPONENTE: RouteMapModal
// Responsável por:
//   1. Mostrar o trajeto da van ponto a ponto
//   2. Gerar a URL do Google Maps com origin, destination e waypoints
//   3. Abrir o Google Maps em nova aba com a rota completa
// ============================================================
const RouteMapModal = ({ van, isOpen, onClose }: { van: any; isOpen: boolean; onClose: () => void }) => {
  if (!van) return null;

  // Gera a URL do Google Maps com todos os pontos da rota
  const createGoogleMapsUrl = () => {
    const origin = van.coordenadas[0];
    const destination = van.coordenadas[van.coordenadas.length - 1];

    // Waypoints são os pontos intermediários (sem o primeiro e último)
    const waypoints = van.coordenadas
      .slice(1, -1)
      .map((coord: { lat: any; lng: any; }) => `${coord.lat},${coord.lng}`)
      .join('|');

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

    // Adiciona waypoints apenas se houver pontos intermediários
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }

    return url;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Rota: ${van.nome}`}>
      <div>
        {/* Cabeçalho com resumo da rota */}
        <div className="mb-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-purple-600" />
              Trajeto Completo
            </h3>
            <p className="text-gray-700 text-sm">{van.rota}</p>
          </div>

          {/* Lista visual dos pontos da rota */}
          <div className="space-y-3 mb-6">
            {van.coordenadas.map((ponto: { nome: string; lat: number; lng: number; }, index: number) => (
              <div key={index} className="flex items-start gap-3">
                {/* Coluna esquerda: bolha colorida + linha conectora */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0
                      ? 'bg-green-500 text-white'                    // Início = verde
                      : index === van.coordenadas.length - 1
                        ? 'bg-red-500 text-white'                    // Fim = vermelho
                        : 'bg-purple-500 text-white'                 // Intermediário = roxo
                  }`}>
                    {index === 0 ? 'A' : index === van.coordenadas.length - 1 ? 'B' : index}
                  </div>
                  {/* Linha conectora entre pontos */}
                  {index < van.coordenadas.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-300"></div>
                  )}
                </div>
                {/* Coluna direita: nome do ponto + coordenadas */}
                <div className="flex-1 pt-1">
                  <p className="font-medium text-gray-900">{ponto.nome}</p>
                  <p className="text-xs text-gray-500">
                    {ponto.lat.toFixed(4)}, {ponto.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão para abrir no Google Maps */}
        <div className="space-y-3">
          <a
            href={createGoogleMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
              <Map className="w-5 h-5" />
              Abrir Rota no Google Maps
            </Button>
          </a>
          <p className="text-xs text-gray-500 text-center">
            A rota será aberta em uma nova aba do Google Maps com navegação detalhada
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default RouteMapModal;