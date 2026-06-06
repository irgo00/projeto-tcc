import { MapPin } from "lucide-react";
import Modal from "../common/Modal";
import type { Van } from "../../types/Van";

interface RouteMapModalProps {
  van: Van | null;
  isOpen: boolean;
  onClose: () => void;
}

const RouteMapModal = ({ van, isOpen, onClose }: RouteMapModalProps) => {
  if (!van) return null;

  const routePoints = van.rota
    .split("→")
    .map((point) => point.trim())
    .filter(Boolean);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Serviço: ${van.prestador}`}>
      <div>
        <div className="mb-6">
          <div className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h3 className="mb-2 flex items-center font-semibold text-gray-900">
              <MapPin className="mr-2 h-5 w-5 text-purple-600" />
              Rotas Atendidas
            </h3>
            <p className="text-sm text-gray-700">{van.rota}</p>
          </div>

          {routePoints.length > 0 ? (
            <div className="mb-6 space-y-3">
              {routePoints.map((point, index) => (
                <div key={`${point}-${index}`} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                        index === 0
                          ? "bg-green-500"
                          : index === routePoints.length - 1
                          ? "bg-red-500"
                          : "bg-purple-500"
                      }`}
                    >
                      {index === 0 ? "A" : index === routePoints.length - 1 ? "B" : index}
                    </div>
                    {index < routePoints.length - 1 && (
                      <div className="h-8 w-0.5 bg-gray-300"></div>
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="font-medium text-gray-900">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Não há pontos de rota suficientes para listar os trajetos atendidos.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RouteMapModal;
