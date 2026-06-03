import { useState, useEffect } from "react";
import {
  X, Star, Users, Wifi, Wind, Camera, Zap,
  Accessibility, DoorOpen, SlidersHorizontal, RotateCcw,
} from "lucide-react";
import Button from "../common/Button";

// ─── tipos ────────────────────────────────────────────────────────────────────

export interface FiltrosAtivos {
  // vindos da busca principal (SearchSection) — repassados aqui só para exibição
  origem: string;
  instituicao: string;
  periodo: string;

  // filtros locais (aplicados no frontend sobre o resultado já retornado pela API)
  avaliacaoMinima: number;       // 0 = qualquer
  vagasMinimas: number;          // 0 = qualquer
  apenasComVagas: boolean;       // oculta rotas com 0 vagas
  ordenacao: OrdenacaoOpcao;

  // confortos do veículo
  ar_condicionado: boolean;
  wifi: boolean;
  camera_interna: boolean;
  usb_carregador: boolean;
  acessibilidade: boolean;
  porta_automatica: boolean;
}

export type OrdenacaoOpcao =
  | "relevancia"
  | "avaliacao_desc"
  | "vagas_desc"
  | "vagas_asc"
  | "nome_asc";

export const FILTROS_PADRAO: FiltrosAtivos = {
  origem: "",
  instituicao: "",
  periodo: "",
  avaliacaoMinima: 0,
  vagasMinimas: 0,
  apenasComVagas: true,
  ordenacao: "relevancia",
  ar_condicionado: false,
  wifi: false,
  camera_interna: false,
  usb_carregador: false,
  acessibilidade: false,
  porta_automatica: false,
};

/** Conta quantos filtros "extras" (além dos da busca principal) estão ativos */
export function contarFiltrosAtivos(f: FiltrosAtivos): number {
  let n = 0;
  if (f.avaliacaoMinima > 0)  n++;
  if (f.vagasMinimas > 0)     n++;
  if (!f.apenasComVagas)      n++;  // invertido: padrão é true
  if (f.ordenacao !== "relevancia") n++;
  if (f.ar_condicionado)  n++;
  if (f.wifi)             n++;
  if (f.camera_interna)   n++;
  if (f.usb_carregador)   n++;
  if (f.acessibilidade)   n++;
  if (f.porta_automatica) n++;
  return n;
}

// ─── props ────────────────────────────────────────────────────────────────────

interface FiltrosPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filtros: FiltrosAtivos;
  onChange: (filtros: FiltrosAtivos) => void;
  totalResultados: number;
}

// ─── sub-componentes internos ─────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(value === star ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          title={`${star} estrela${star > 1 ? "s" : ""} ou mais`}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? "text-yellow-400 fill-current"
                : "text-gray-200"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs text-gray-500 ml-1">
          {value}★ ou mais
        </span>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 w-full text-left group"
    >
      <div
        className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors mt-0.5 ${
          checked ? "bg-purple-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </div>
      <div>
        <p className={`text-sm font-medium ${checked ? "text-gray-900" : "text-gray-600"}`}>
          {label}
        </p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </button>
  );
}

const CONFORTOS: {
  key: keyof Pick<
    FiltrosAtivos,
    "ar_condicionado" | "wifi" | "camera_interna" | "usb_carregador" | "acessibilidade" | "porta_automatica"
  >;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "ar_condicionado",  label: "Ar-condicionado", icon: <Wind className="w-4 h-4" /> },
  { key: "wifi",             label: "Wi-Fi a bordo",   icon: <Wifi className="w-4 h-4" /> },
  { key: "camera_interna",   label: "Câmera interna",  icon: <Camera className="w-4 h-4" /> },
  { key: "usb_carregador",   label: "USB / Carregador",icon: <Zap className="w-4 h-4" /> },
  { key: "acessibilidade",   label: "Acessibilidade",  icon: <Accessibility className="w-4 h-4" /> },
  { key: "porta_automatica", label: "Porta automática",icon: <DoorOpen className="w-4 h-4" /> },
];

const ORDENACOES: { value: OrdenacaoOpcao; label: string }[] = [
  { value: "relevancia",    label: "Relevância" },
  { value: "avaliacao_desc",label: "Melhor avaliação" },
  { value: "vagas_desc",    label: "Mais vagas disponíveis" },
  { value: "vagas_asc",     label: "Menos vagas (quase cheias)" },
  { value: "nome_asc",      label: "Nome A–Z" },
];

// ─── componente principal ─────────────────────────────────────────────────────

export default function FiltrosPanel({
  isOpen,
  onClose,
  filtros,
  onChange,
  totalResultados,
}: FiltrosPanelProps) {
  // cópia local para editar sem aplicar imediatamente
  const [local, setLocal] = useState<FiltrosAtivos>(filtros);

  // sincroniza quando o painel abre
  useEffect(() => {
    if (isOpen) setLocal(filtros);
  }, [isOpen]);

  // bloqueia scroll do body quando aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const set = <K extends keyof FiltrosAtivos>(key: K, value: FiltrosAtivos[K]) =>
    setLocal((prev) => ({ ...prev, [key]: value }));

  const handleAplicar = () => {
    onChange(local);
    onClose();
  };

  const handleLimpar = () => {
    const limpo: FiltrosAtivos = {
      ...FILTROS_PADRAO,
      // mantém os filtros da busca principal
      origem: filtros.origem,
      instituicao: filtros.instituicao,
      periodo: filtros.periodo,
    };
    setLocal(limpo);
    onChange(limpo);
  };

  const filtrosExtrasAtivos = contarFiltrosAtivos(local);

  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">Filtros</h2>
            {filtrosExtrasAtivos > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {filtrosExtrasAtivos}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* corpo — scrollável */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

          {/* ── Ordenação ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Ordenar por
            </h3>
            <div className="space-y-2">
              {ORDENACOES.map((op) => (
                <label
                  key={op.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      local.ordenacao === op.value
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300 group-hover:border-purple-400"
                    }`}
                    onClick={() => set("ordenacao", op.value)}
                  >
                    {local.ordenacao === op.value && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    onClick={() => set("ordenacao", op.value)}
                    className={`text-sm ${
                      local.ordenacao === op.value
                        ? "font-medium text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {op.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* ── Vagas ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Disponibilidade
            </h3>
            <div className="space-y-4">
              <Toggle
                checked={local.apenasComVagas}
                onChange={(v) => set("apenasComVagas", v)}
                label="Apenas com vagas disponíveis"
                desc="Oculta rotas que estão com lotação máxima"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    Mínimo de vagas
                  </label>
                  <span className="text-sm font-semibold text-purple-600">
                    {local.vagasMinimas === 0 ? "Qualquer" : `${local.vagasMinimas}+`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={local.vagasMinimas}
                  onChange={(e) => set("vagasMinimas", Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Qualquer</span>
                  <span>10+</span>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* ── Avaliação ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Avaliação mínima
            </h3>
            <StarRating
              value={local.avaliacaoMinima}
              onChange={(v) => set("avaliacaoMinima", v)}
            />
            {local.avaliacaoMinima === 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Clique em uma estrela para filtrar. Clique novamente para remover.
              </p>
            )}
          </section>

          <div className="border-t border-gray-100" />

          {/* ── Confortos do veículo ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Confortos e diferenciais
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CONFORTOS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set(key, !local[key])}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    local[key]
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                  }`}
                >
                  <span className={local[key] ? "text-white" : "text-purple-500"}>
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* footer fixo */}
        <div className="border-t border-gray-100 px-5 py-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleLimpar}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Limpar
            </button>
            <Button
              variant="primary"
              onClick={handleAplicar}
              className="flex-1"
            >
              Ver {totalResultados}{" "}
              {totalResultados === 1 ? "resultado" : "resultados"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
