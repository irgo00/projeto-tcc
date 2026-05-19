import { useRef, useState } from 'react';
import { Upload, Trash2, Star, Loader2, AlertCircle, ImageOff } from 'lucide-react';
import type { VanFoto } from '../../types/VanVeiculo';

interface Props {
  fotos: VanFoto[];
  vanId: number;
  onUpload: (vanId: number, arquivos: File[]) => Promise<void>;
  onDeletar: (vanId: number, fotoId: number) => Promise<void>;
  onSetPrincipal: (vanId: number, fotoId: number) => Promise<void>;
  onAtualizado: () => void;
}

export default function VanFotosManager({ fotos, vanId, onUpload, onDeletar, onSetPrincipal, onAtualizado }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [principalId, setPrincipalId] = useState<number | null>(null);

  const MAX_FOTOS = 5;
  const disponiveis = MAX_FOTOS - fotos.length;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (files.length > disponiveis) {
      setUploadError(`Você pode adicionar no máximo ${disponiveis} foto(s). Selecione menos arquivos.`);
      e.target.value = '';
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      await onUpload(vanId, files);
      onAtualizado();
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Erro ao enviar foto(s). Tente novamente.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDeletar = async (fotoId: number) => {
    setDeletingId(fotoId);
    try {
      await onDeletar(vanId, fotoId);
      onAtualizado();
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrincipal = async (fotoId: number) => {
    setPrincipalId(fotoId);
    try {
      await onSetPrincipal(vanId, fotoId);
      onAtualizado();
    } finally {
      setPrincipalId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">
          Fotos ({fotos.length}/{MAX_FOTOS})
        </p>
        {disponiveis > 0 && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
          >
            {uploading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Upload className="w-4 h-4" />}
            {uploading ? 'Enviando...' : `Adicionar (${disponiveis} disponíve${disponiveis === 1 ? 'l' : 'is'})`}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {uploadError}
        </div>
      )}

      {fotos.length === 0 ? (
        <div
          onClick={() => disponiveis > 0 && inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
        >
          <ImageOff className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Nenhuma foto adicionada</p>
          <p className="text-xs text-gray-400 mt-1">Clique para adicionar até {MAX_FOTOS} fotos</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {fotos.map(foto => (
            <div key={foto.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
              <img
                src={foto.url}
                alt="Foto da van"
                className="w-full h-full object-cover"
              />

              {foto.principal && (
                <div className="absolute top-1 left-1 bg-yellow-400 text-white text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  Principal
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!foto.principal && (
                  <button
                    onClick={() => handleSetPrincipal(foto.id)}
                    disabled={principalId === foto.id}
                    title="Definir como principal"
                    className="bg-yellow-400 hover:bg-yellow-500 text-white p-1.5 rounded-full transition disabled:opacity-50"
                  >
                    {principalId === foto.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Star className="w-3.5 h-3.5" />}
                  </button>
                )}
                <button
                  onClick={() => handleDeletar(foto.id)}
                  disabled={deletingId === foto.id}
                  title="Remover foto"
                  className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition disabled:opacity-50"
                >
                  {deletingId === foto.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}

          {disponiveis > 0 && (
            <div
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Adicionar</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
