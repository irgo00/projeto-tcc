import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Star, Phone, Mail, Loader2, ChevronDown, ChevronUp, X, Heart, Wifi, Wind, Camera, Zap, Accessibility, DoorOpen, Lock } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import VanFotoCarousel from './VanFotoCarousel';
import { useAuth } from '../../hooks/useAuth';
import { avaliacaoService } from '../../services/avaliacaoService';
import { authService } from '../../services/authService';
import { favoritoService } from '../../services/favoritoService';
import { historicoService } from '../../services/historicoService';
import type { Van } from '../../types/Van';
import type { VanFoto } from '../../types/VanVeiculo';
import type { AvaliacaoItem } from '../../types/Avaliacao';

interface VanDetailsModalProps {
  van: Van | null;
  isOpen: boolean;
  onClose: () => void;
  onFavoritoChange?: (vanId: number, isFavorito: boolean) => void;
}

const LIMITE_INICIAL = 3;

const CONFORTO_ICONS: Record<string, React.ReactNode> = {
  ar_condicionado:  <Wind className="w-3.5 h-3.5" />,
  camera_interna:   <Camera className="w-3.5 h-3.5" />,
  porta_automatica: <DoorOpen className="w-3.5 h-3.5" />,
  wifi:             <Wifi className="w-3.5 h-3.5" />,
  acessibilidade:   <Accessibility className="w-3.5 h-3.5" />,
  usb_carregador:   <Zap className="w-3.5 h-3.5" />,
};

const CONFORTO_LABELS: Record<string, string> = {
  ar_condicionado:  'Ar-condicionado',
  camera_interna:   'Câmera interna',
  porta_automatica: 'Porta automática',
  wifi:             'Wi-Fi',
  acessibilidade:   'Acessibilidade',
  usb_carregador:   'USB / Carregador',
};

const VanDetailsModal = ({ van, isOpen, onClose, onFavoritoChange }: VanDetailsModalProps) => {
  const { user } = useAuth();
  const isCliente = user?.tipo === 'cliente';
  const emailVerificado = user?.email_verificado === true;
  const podeFavoritar = isCliente && emailVerificado;

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
  const [favoritoErro, setFavoritoErro] = useState<string | null>(null);
  const [reenviandoEmail, setReenviandoEmail] = useState(false);
  const [reenvioEmailMsg, setReenvioEmailMsg] = useState<string | null>(null);
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
      setFavoritoErro(null);
      setReenvioEmailMsg(null);
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
      favoritoService.verificar(van.id).then(setIsFavorito).catch(() => {});
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
      await avaliacaoService.criar({ vanId: van.id, nota: formNota, comentario: formComentario.trim() || undefined });
      setFormSuccess(true);
      setShowForm(false);
      const updated = await avaliacaoService.listarPorVan(van.id);
      setAvaliacoes(updated);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleFavorito = async () => {
    if (!van) return;
    setFavoritoErro(null);
    setReenvioEmailMsg(null);
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
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 403) {
        setFavoritoErro(msg || 'Confirme seu e-mail para salvar rotas nos favoritos.');
      } else if (msg) {
        setFavoritoErro(msg);
      }
    } finally {
      setFavoritoLoading(false);
    }
  };

  const reenviarEmailVerificacao = async () => {
    setReenviandoEmail(true);
    setReenvioEmailMsg(null);
    try {
      const msg = await authService.reenviarVerificacaoEmail();
      setReenvioEmailMsg(msg);
    } catch (e) {
      setReenvioEmailMsg((e as Error).message);
    } finally {
      setReenviandoEmail(false);
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
        `Olá! Encontrei seu serviço "${van.prestador}" no PBTE e tenho interesse. Poderia me passar mais informações?`
      );
      window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    }
  };

  if (!van) return null;

  const avaliacao  = Number(van.avaliacao) || 0;
  const horarios   = Object.entries(van.horario ?? {});
  const visiveis   = showingAll ? avaliacoes : avaliacoes.slice(0, LIMITE_INICIAL);
  const extras     = avaliacoes.length - LIMITE_INICIAL;

  const fotosVan: VanFoto[] = (van as any).van?.fotos ?? [];

  const confortosAtivos = Object.entries(CONFORTO_LABELS)
    .filter(([key]) => (van as any).van?.[key] === true);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div>
        {fotosVan.length > 0 && (
          <div className="-mx-6 -mt-2 mb-6">
            <VanFotoCarousel fotos={fotosVan} className="h-56 rounded-none" />
          </div>
        )}

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">{van.prestador}</h2>
          {van.van && (
            <p className="text-sm text-purple-600 mt-1 font-medium">
              {van.van.modelo} {van.van.marca} · {van.van.placa} {van.van.ano ? `(${van.van.ano})` : ''}
            </p>
          )}
        </div>

        {confortosAtivos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {confortosAtivos.map(([key, label]) => (
              <span key={key} className="flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium border border-purple-100">
                {CONFORTO_ICONS[key]}
                {label}
              </span>
            ))}
            {(van as any).van?.outros_itens && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                {(van as any).van.outros_itens}
              </span>
            )}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-600" />
              Rota Atendida
            </h3>
            <p className="text-gray-700 ml-6 text-sm">{van.rota}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-purple-600" />
                Horários
              </h3>
              <div className="ml-6 text-sm text-gray-700 space-y-0.5">
                {horarios.length > 0
                  ? horarios.map(([periodo, hora]) => (
                      <p key={periodo}><strong className="capitalize">{periodo}:</strong> {hora}</p>
                    ))
                  : <p>Não informado</p>}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                Disponibilidade
              </h3>
              <p className="text-gray-700 ml-6">
                <span className="text-2xl font-bold text-purple-600">{van.vagas}</span>
                <span className="text-sm ml-1">vagas disponíveis</span>
              </p>
            </div>
          </div>

          {user && (van.telefone || van.email) && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Contato</h3>
              <div className="space-y-1.5 ml-1">
                {van.telefone && (
                  <div className="flex items-center text-gray-700 text-sm">
                    <Phone className="w-4 h-4 mr-2 text-purple-600" />
                    {van.telefone}
                  </div>
                )}
                {van.email && (
                  <div className="flex items-center text-gray-700 text-sm">
                    <Mail className="w-4 h-4 mr-2 text-purple-600" />
                    {van.email}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
              Avaliações
            </h3>

            <div className="flex items-center mb-4">
              <span className="text-4xl font-bold text-gray-900">{avaliacao.toFixed(1)}</span>
              <div className="ml-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(avaliacao) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600 block mt-0.5">
                  {van.totalAvaliacoes} {van.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </div>
            </div>

            {reviewsLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando avaliações...
              </div>
            )}

            {!reviewsLoading && visiveis.length > 0 && (
              <div className="space-y-2 mb-3">
                {visiveis.map(av => (
                  <div key={av.id} className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">{av.usuario}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-3 h-3 ${i <= av.nota ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {av.comentario && <p className="text-gray-600 text-sm">{av.comentario}</p>}
                    <p className="text-gray-400 text-xs mt-1">{av.data}</p>
                  </div>
                ))}

                {extras > 0 && !showingAll && (
                  <button onClick={() => setShowingAll(true)} className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                    <ChevronDown className="w-4 h-4" />
                    Ver mais {extras} {extras === 1 ? 'avaliação' : 'avaliações'}
                  </button>
                )}
                {showingAll && avaliacoes.length > LIMITE_INICIAL && (
                  <button onClick={() => setShowingAll(false)} className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                    <ChevronUp className="w-4 h-4" />
                    Ver menos
                  </button>
                )}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm mb-3">
                ✓ Avaliação enviada com sucesso!
              </div>
            )}

            {isCliente && !formSuccess && (
              !showForm ? (
                <button onClick={() => setShowForm(true)} className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  + Deixar uma avaliação
                </button>
              ) : (
                <div className="bg-white rounded-lg p-4 border border-yellow-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm">Sua avaliação</p>
                    <button onClick={() => { setShowForm(false); setFormError(null); setFormNota(0); }} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nota <span className="text-red-500">*</span></p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setFormNota(star)} onMouseEnter={() => setHoveredNota(star)} onMouseLeave={() => setHoveredNota(0)} className="transition-transform hover:scale-110">
                          <Star className={`w-8 h-8 transition-colors ${star <= (hoveredNota || formNota) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Comentário (opcional)</p>
                    <textarea
                      value={formComentario}
                      onChange={e => setFormComentario(e.target.value)}
                      placeholder="Conte sua experiência..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-400 text-right">{formComentario.length}/500</p>
                  </div>
                  {formError && <p className="text-red-600 text-sm">{formError}</p>}
                  <Button variant="primary" loading={formLoading} onClick={handleSubmitAvaliacao} className="w-full">
                    Enviar Avaliação
                  </Button>
                </div>
              )
            )}

            {!user && (
              <p className="text-sm text-gray-500 mt-2">
                <button className="text-purple-600 hover:underline font-medium">Faça login</button> para deixar uma avaliação.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {user ? (
            <Button variant="primary" size="lg" loading={contatoLoading} onClick={handleEntrarEmContato} className="w-full flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Entrar em Contato
            </Button>
          ) : (
            <Button variant="primary" size="lg" disabled className="w-full flex items-center justify-center gap-2 opacity-60 cursor-not-allowed">
              <Lock className="w-5 h-5" />
              Entrar em Contato
            </Button>
          )}

          {isCliente && (
            <>
              <Button
                variant="outline"
                loading={favoritoLoading}
                onClick={handleToggleFavorito}
                disabled={!podeFavoritar && !isFavorito}
                className={`w-full flex items-center justify-center gap-2 transition-colors ${
                  !podeFavoritar && !isFavorito
                    ? 'opacity-60 cursor-not-allowed'
                    : isFavorito
                    ? 'border-red-400 text-red-500 hover:bg-red-50'
                    : 'hover:border-red-400 hover:text-red-500'
                }`}
                title={!podeFavoritar && !isFavorito ? 'Confirme seu e-mail para salvar nos favoritos' : ''}
              >
                {!podeFavoritar && !isFavorito ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Heart className={`w-5 h-5 ${isFavorito ? 'fill-current' : ''}`} />
                )}
                {isFavorito ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
              </Button>

              {(favoritoErro || (!emailVerificado && !isFavorito)) && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2 text-xs space-y-1">
                  <p>
                    {favoritoErro ?? 'Confirme seu e-mail para salvar rotas nos favoritos.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={reenviarEmailVerificacao}
                      disabled={reenviandoEmail}
                      className="font-medium underline hover:text-amber-900 disabled:opacity-60"
                    >
                      {reenviandoEmail ? 'Reenviando...' : 'Reenviar e-mail de verificação'}
                    </button>
                    {reenvioEmailMsg && <span className="text-amber-700">{reenvioEmailMsg}</span>}
                  </div>
                </div>
              )}
            </>
          )}

          {!user && (
            <p className="text-center text-sm text-gray-500">
              <button className="text-purple-600 hover:underline font-medium">Faça login</button> para entrar em contato e salvar nos favoritos.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VanDetailsModal;
