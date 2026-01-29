import { MapPin, Map } from "lucide-react";
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const RouteMapModal = ({ van, isOpen, onClose }: { van: any; isOpen: boolean; onClose: () => void }) => {
  if (!van) return null;

  const createGoogleMapsUrl = () => {
    const waypoints = van.coordenadas
      .map((coord: { lat: any; lng: any; }) => `${coord.lat},${coord.lng}`)
      .join('|');
    
    const origin = van.coordenadas[0];
    const destination = van.coordenadas[van.coordenadas.length - 1];
    
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving&waypoints=${waypoints}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Rota: ${van.nome}`}>
      <div>
        <div className="mb-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-purple-600" />
              Trajeto Completo
            </h3>
            <p className="text-gray-700 text-sm">{van.rota}</p>
          </div>

          <div className="space-y-3 mb-6">
            {van.coordenadas.map((ponto: { nome: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; lat: number; lng: number; }, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-green-500 text-white' : 
                    index === van.coordenadas.length - 1 ? 'bg-red-500 text-white' : 
                    'bg-purple-500 text-white'
                  }`}>
                    {index === 0 ? 'A' : index === van.coordenadas.length - 1 ? 'B' : index}
                  </div>
                  {index < van.coordenadas.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-300"></div>
                  )}
                </div>
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