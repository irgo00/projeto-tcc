import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Star, Phone, Mail, Loader2, ChevronDown, ChevronUp, X, Heart } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { avaliacaoService } from '../../services/avaliacaoService';
import { favoritoService } from '../../services/favoritoService';
import { historicoService } from '../../services/historicoService';
import type { Van } from '../../types/Van';
import type { AvaliacaoItem } from '../../types/Avaliacao';

interface VanDetailsModalProps {
  van: Van | null;
  isOpen: boolean;
  onClose: () => void;
  onAvaliar?: (van: Van) => void;
  onFavoritoChange?: (vanId: number, isFavorito: boolean) => void;
}

const LIMITE_INICIAL = 3;

const VanDetailsModal = ({ van, isOpen, onClose, onFavoritoChange }: VanDetailsModalProps) => {
  const { user } = useAuth();
  const isCliente = user?.tipo === 'cliente';

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showingAll, setShowingAll] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formNota, setFormNota] = useState(0);
  const [hoveredNota, setHoveredNota] = useState(0);
  const [formComentario, setFormComentario] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const [isFavorito, setIsFavorito] = useState(false);
  const [favoritoLoading, setFavoritoLoading] = useState(false);

  const [contatoLoading, setContatoLoading] = useState(false);

  useEffect(() => {
    if (!van || !isOpen) {
      setAvaliacoes([]);
      setShowingAll(false);
      setShowForm(false);
      setFormNota(0);
      setFormComentario('');
      setFormError(null);
      setFormSuccess(false);
      setIsFavorito(false);
      return;
    }

    const carregar = async () => {
      setReviewsLoading(true);
      try {
        const data = await avaliacaoService.listarPorVan(van.id);
        setAvaliacoes(data);
      } catch {
      } finally {
        setReviewsLoading(false);
      }
    };

    carregar();

    if (isCliente) {
      favoritoService.verificar(van.id)
        .then(setIsFavorito)
        .catch(() => {});
    }
  }, [van?.id, isOpen]);

  const handleSubmitAvaliacao = async () => {
    if (!van || formNota === 0) {
      setFormError('Selecione uma nota de 1 a 5 estrelas.');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      await avaliacaoService.criar({
        vanId: van.id,
        nota: formNota,
        comentario: formComentario.trim() || undefined,
      });
      setFormSuccess(true);
      setShowForm(false);
      const updated = await avaliacaoService.listarPorVan(van.id);
      setAvaliacoes(updated);
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || 'Erro ao enviar avaliação. Tente novamente.',
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleFavorito = async () => {
    if (!van) return;
    setFavoritoLoading(true);
    try {
      if (isFavorito) {
        await favoritoService.remover(van.id);
        setIsFavorito(false);
        onFavoritoChange?.(van.id, false);
      } else {
        await favoritoService.adicionar(van.id);
        setIsFavorito(true);
        onFavoritoChange?.(van.id, true);
      }
    } catch {
    } finally {
      setFavoritoLoading(false);
    }
  };

  const handleEntrarEmContato = async () => {
    if (!van) return;
    if (isCliente) {
      setContatoLoading(true);
      try {
        await historicoService.registrar(van.id, 'whatsapp');
      } catch {
      } finally {
        setContatoLoading(false);
      }
    }
    if (van.telefone) {
      const digits = van.telefone.replace(/\D/g, '');
      const numero = digits.startsWith('55') ? digits : `55${digits}`;
      const mensagem = encodeURIComponent(
        `Olá! Encontrei sua van "${van.nome}" no PBTE e tenho interesse. Poderia me passar mais informações?`
      );
      window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    }
  };

  if (!van) return null;

  const avaliacao = Number(van.avaliacao) || 0;
  const horarios = Object.entries(van.horario ?? {});
  const visiveis = showingAll ? avaliacoes : avaliacoes.slice(0, LIMITE_INICIAL);
  const extras = avaliacoes.length - LIMITE_INICIAL;
  const podeAvaliar = isCliente;

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
                {horarios.length > 0 ? (
                  horarios.map(([periodo, hora]) => (
                    <p key={periodo}>
                      <strong className="capitalize">{periodo}:</strong> {hora}
                    </p>
                  ))
                ) : (
                  <p>Horário não informado</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Disponibilidade
              </h3>
              <p className="text-gray-700 ml-7">
                <span className="text-2xl font-bold text-purple-600">{van.vagas}</span>
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
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
              Avaliações
            </h3>

            <div className="flex items-center mb-5">
              <span className="text-4xl font-bold text-gray-900">
                {avaliacao.toFixed(1)}
              </span>
              <div className="ml-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i <= Math.round(avaliacao)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 mt-0.5 block">
                  {van.totalAvaliacoes}{' '}
                  {van.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </div>
            </div>

            {reviewsLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando avaliações...
              </div>
            )}

            {!reviewsLoading && avaliacoes.length > 0 && (
              <div className="space-y-3 mb-4">
                {visiveis.map(av => (
                  <div key={av.id} className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">{av.usuario}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i <= av.nota ? 'text-yellow-400 fill-current' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {av.comentario && (
                      <p className="text-gray-600 text-sm">{av.comentario}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">{av.data}</p>
                  </div>
                ))}

                {extras > 0 && !showingAll && (
                  <button
                    onClick={() => setShowingAll(true)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Ver mais {extras} {extras === 1 ? 'avaliação' : 'avaliações'}
                  </button>
                )}
                {showingAll && avaliacoes.length > LIMITE_INICIAL && (
                  <button
                    onClick={() => setShowingAll(false)}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    <ChevronUp className="w-4 h-4" />
                    Ver menos
                  </button>
                )}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm mb-3">
                ✓ Sua avaliação foi enviada com sucesso!
              </div>
            )}

            {podeAvaliar && !formSuccess && (
              <div>
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    + Deixar uma avaliação
                  </button>
                ) : (
                  <div className="bg-white rounded-lg p-4 border border-yellow-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm">Sua avaliação</p>
                      <button
                        onClick={() => { setShowForm(false); setFormError(null); setFormNota(0); }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nota <span className="text-red-500">*</span></p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormNota(star)}
                            onMouseEnter={() => setHoveredNota(star)}
                            onMouseLeave={() => setHoveredNota(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= (hoveredNota || formNota)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Comentário (opcional)</p>
                      <textarea
                        value={formComentario}
                        onChange={e => setFormComentario(e.target.value)}
                        placeholder="Conte sua experiência com este serviço..."
                        rows={3}
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-400 text-right">{formComentario.length}/500</p>
                    </div>

                    {formError && (
                      <p className="text-red-600 text-sm">{formError}</p>
                    )}

                    <Button
                      variant="primary"
                      loading={formLoading}
                      onClick={handleSubmitAvaliacao}
                      className="w-full"
                    >
                      Enviar Avaliação
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <p className="text-sm text-gray-500 mt-2">
                <button className="text-purple-600 hover:underline font-medium">Faça login</button>
                {' '}para deixar uma avaliação.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            loading={contatoLoading}
            onClick={handleEntrarEmContato}
            className="w-full flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Entrar em Contato
          </Button>

          {isCliente && (
            <Button
              variant="outline"
              loading={favoritoLoading}
              onClick={handleToggleFavorito}
              className={`w-full flex items-center justify-center gap-2 transition-colors ${
                isFavorito
                  ? 'border-red-400 text-red-500 hover:bg-red-50'
                  : 'hover:border-red-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorito ? 'fill-current' : ''}`} />
              {isFavorito ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
            </Button>
          )}

          {!user && (
            <p className="text-center text-sm text-gray-500">
              <button className="text-purple-600 hover:underline font-medium">Faça login</button>
              {' '}para salvar nos favoritos.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VanDetailsModal;
