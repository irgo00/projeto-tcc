import React from "react";
import { MapPin, Clock, Users, Star, ChevronRight, ImageOff } from "lucide-react";
import Button from "../common/Button";
import type { Van } from "../../types/Van";

interface VanCardProps {
  van: Van;
  isFavorite: boolean;
  onViewDetails: (van: Van) => void;
  onToggleFavorite: (id: number) => void;
}

const formatRouteDescription = (rota: string, instituicao?: string) => {
  let text = rota?.trim() || "";

  if (instituicao) {
    const index = text.indexOf(instituicao);
    if (index >= 0) {
      const end = index + instituicao.length;
      if (end < text.length && text[end] !== "\n") {
        text = `${text.slice(0, end)}\n${text.slice(end).trimStart()}`;
      }
    }
  }

  if (text.length > 44) {
    return `${text.slice(0, 44).trimEnd()}...`;
  }

  return text;
};

const VanCard: React.FC<VanCardProps> = ({ van, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="relative h-44 bg-gray-100">
        {van.foto_principal_url ? (
          <img
            src={van.foto_principal_url}
            alt={`Foto da van ${van.prestador}`}
            className="w-full h-full object-cover"
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${van.foto_principal_url ? 'hidden' : 'flex'} absolute inset-0 flex-col items-center justify-center text-gray-400`}>
          <ImageOff className="w-10 h-10 mb-1" />
          <span className="text-xs">Sem foto</span>
        </div>
        {van.van && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {van.van.modelo} · {van.van.placa}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{van.prestador}</h3>
          <p className="text-gray-500 text-sm mt-0.5">{van.instituicao}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm line-clamp-2 whitespace-pre-line">
              {formatRouteDescription(van.rota, van.instituicao)}
            </span>
          </div>
          <div className="flex items-start text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              {Object.entries(van.horario).map(([periodo, hora]) => (
                <span key={periodo} className="mr-2">
                  <strong className="capitalize">{periodo}:</strong> {hora}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-1.5 text-purple-600" />
              <span className="text-sm font-medium">{van.vagas} vagas</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-black">{van.avaliacao.toFixed(1)}</span>
              <span className="text-xs text-gray-500 ml-1">({van.totalAvaliacoes})</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => onViewDetails(van)}
          className="w-full flex items-center justify-center gap-1 text-sm"
        >
          Detalhes
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default VanCard;
