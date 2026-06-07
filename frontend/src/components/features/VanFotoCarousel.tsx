import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, Expand, X } from 'lucide-react';
import type { VanFoto } from '../../types/VanVeiculo';

interface Props {
  fotos: VanFoto[];
  className?: string;
}

export default function VanFotoCarousel({ fotos, className = '' }: Props) {
  const [atual, setAtual] = useState(0);
  const [expandido, setExpandido] = useState(false);

  if (!fotos.length) {
    return (
      <div className={`bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 ${className}`}>
        <ImageOff className="w-10 h-10 mb-2" />
        <span className="text-sm">Sem fotos disponíveis</span>
      </div>
    );
  }

  const anterior = () => setAtual(i => (i - 1 + fotos.length) % fotos.length);
  const proximo  = () => setAtual(i => (i + 1) % fotos.length);

  return (
    <>
      <div className={`relative overflow-hidden rounded-xl bg-black ${className}`}>
        <img
          key={fotos[atual].id}
          src={fotos[atual].url}
          alt={`Foto ${atual + 1} da van`}
          className="w-full h-full object-cover"
        />

        <button
          onClick={() => setExpandido(true)}
          className="absolute bottom-2 left-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
          aria-label="Expandir foto"
        >
          <Expand className="w-4 h-4" />
        </button>

        {fotos.length > 1 && (
          <>
            <button
              onClick={anterior}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={proximo}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {fotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAtual(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === atual ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ir para foto ${i + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {atual + 1}/{fotos.length}
            </div>
          </>
        )}
      </div>

      {expandido && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setExpandido(false)}
        >
          <button
            onClick={() => setExpandido(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {fotos.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); anterior(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); proximo(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <img
            src={fotos[atual].url}
            alt={`Foto ${atual + 1} da van`}
            className="max-w-full max-h-full object-contain select-none"
            onClick={e => e.stopPropagation()}
          />

          {fotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {fotos.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setAtual(i); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === atual ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
