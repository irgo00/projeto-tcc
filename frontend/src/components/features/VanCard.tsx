import React from "react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Heart,
  ChevronRight,
  Map,
} from "lucide-react";
import Button from "../common/Button";
import type { Van } from "../../types/Van";

interface VanCardProps {
  van: Van;
  isFavorite: boolean;
  onViewDetails: (van: Van) => void;
  onViewRoute: (van: Van) => void;
  onToggleFavorite: (id: number) => void;
}

// ============================================================
// 🔧 MODIFICADO: Adicionada prop onViewRoute
// Antes: ({ van, onViewDetails, onToggleFavorite, isFavorite })
// Agora: ({ van, onViewDetails, onViewRoute, onToggleFavorite, isFavorite })
// ============================================================
const VanCard: React.FC<VanCardProps> = ({
  van,
  onViewDetails,
  onViewRoute,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{van.nome}</h3>
          <p className="text-gray-600 text-sm mt-1">{van.prestador}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(van.id)}
          className={`transition-colors ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{van.rota}</span>
        </div>
        <div className="flex items-start text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm flex flex-col">
            {Object.entries(van.horario).map(([periodo, hora]) => (
              <span key={periodo}>
                <strong className="capitalize">{periodo}:</strong> {hora}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <Users className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-sm font-medium">{van.vagas} vagas</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
            <span className="text-sm font-bold">
              {van.avaliacao.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({van.totalAvaliacoes})
            </span>
          </div>
        </div>
      </div>

      {/* 🔧 MODIFICADO: Antes tinha apenas um botão "Ver Detalhes"
          Agora tem dois botões lado a lado em um grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* 🆕 NOVO: Botão Ver Rota */}
        <Button
          variant="outline"
          onClick={() => onViewRoute(van)}
          className="flex items-center justify-center gap-1 text-sm"
        >
          <Map className="w-4 h-4" />
          Ver Rota
        </Button>
        {/* Botão Detalhes (antes era o único, agora adaptado para o grid) */}
        <Button
          variant="primary"
          onClick={() => onViewDetails(van)}
          className="flex items-center justify-center gap-1 text-sm"
        >
          Detalhes
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default VanCard;
