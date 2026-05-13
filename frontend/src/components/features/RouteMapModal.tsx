import { Map, MapPin } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import type { Van } from "../../types/Van";

interface RouteMapModalProps {
  van: Van | null;
  isOpen: boolean;
  onClose: () => void;
}

const RouteMapModal = ({ van, isOpen, onClose }: RouteMapModalProps) => {
  if (!van) return null;

  const coordenadas = (van.coordenadas ?? [])
    .map((coord) => {
      const latitude = coord.latitude ?? coord.lat;
      const longitude = coord.longitude ?? coord.lng;

      if (latitude == null || longitude == null) {
        return null;
      }

      return {
        nome: coord.nome,
        latitude,
        longitude,
      };
    })
    .filter(
      (coord): coord is { nome: string; latitude: number; longitude: number } =>
        coord !== null,
    );

  const hasRoute = coordenadas.length >= 2;

  const createGoogleMapsUrl = () => {
    if (!hasRoute) {
      return null;
    }

    const origin = coordenadas[0];
    const destination = coordenadas[coordenadas.length - 1];
    const waypoints = coordenadas
      .slice(1, -1)
      .map((coord) => `${coord.latitude},${coord.longitude}`)
      .join("|");

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;

    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }

    return url;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Rota: ${van.nome}`}>
      <div>
        <div className="mb-6">
          <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h3 className="mb-2 flex items-center font-semibold text-gray-900">
              <MapPin className="mr-2 h-5 w-5 text-purple-600" />
              Trajeto Completo
            </h3>
            <p className="text-sm text-gray-700">{van.rota}</p>
          </div>

          {hasRoute ? (
            <div className="mb-6 space-y-3">
              {coordenadas.map((ponto, index) => (
                <div key={`${ponto.nome}-${index}`} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                        index === 0
                          ? "bg-green-500"
                          : index === coordenadas.length - 1
                            ? "bg-red-500"
                            : "bg-purple-500"
                      }`}
                    >
                      {index === 0 ? "A" : index === coordenadas.length - 1 ? "B" : index}
                    </div>
                    {index < coordenadas.length - 1 && (
                      <div className="h-8 w-0.5 bg-gray-300"></div>
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="font-medium text-gray-900">{ponto.nome}</p>
                    <p className="text-xs text-gray-500">
                      {ponto.latitude.toFixed(4)}, {ponto.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Esta van ainda nao possui coordenadas suficientes para exibir a rota no mapa.
            </div>
          )}
        </div>

        <div className="space-y-3">
          {hasRoute ? (
            <>
              <a
                href={createGoogleMapsUrl() ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="flex w-full items-center justify-center gap-2"
                >
                  <Map className="h-5 w-5" />
                  Abrir Rota no Google Maps
                </Button>
              </a>
              <p className="text-center text-xs text-gray-500">
                A rota sera aberta em uma nova aba do Google Maps com navegacao detalhada
              </p>
            </>
          ) : (
            <p className="text-center text-xs text-gray-500">
              Cadastre pelo menos origem e destino com coordenadas para habilitar a navegacao.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RouteMapModal;
