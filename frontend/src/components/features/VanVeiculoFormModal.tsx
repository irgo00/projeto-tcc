import { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import type { VanVeiculo, VanVeiculoFormData } from '../../types/VanVeiculo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSalvo: (van: VanVeiculo) => void;
  editando?: VanVeiculo | null;
  onCriar: (data: object) => Promise<VanVeiculo>;
  onAtualizar: (id: number, data: object) => Promise<VanVeiculo>;
}

const FORM_VAZIO: VanVeiculoFormData = {
  modelo: '',
  marca: '',
  placa: '',
  ano: '',
  cor: '',
  descricao: '',
  ar_condicionado: false,
  camera_interna: false,
  porta_automatica: false,
  wifi: false,
  acessibilidade: false,
  usb_carregador: false,
  outros_itens: '',
};

type FormErrors = Partial<Record<keyof VanVeiculoFormData, string>>;

const CONFORTOS: { key: keyof VanVeiculoFormData; label: string }[] = [
  { key: 'ar_condicionado',  label: 'Ar-condicionado' },
  { key: 'camera_interna',   label: 'Câmera interna' },
  { key: 'porta_automatica', label: 'Porta automática' },
  { key: 'wifi',             label: 'Wi-Fi a bordo' },
  { key: 'acessibilidade',   label: 'Acessibilidade' },
  { key: 'usb_carregador',   label: 'USB / Carregador' },
];

export default function VanVeiculoFormModal({ isOpen, onClose, onSalvo, editando, onCriar, onAtualizar }: Props) {
  const [form, setForm] = useState<VanVeiculoFormData>(FORM_VAZIO);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editando) {
      setForm({
        modelo:           editando.modelo,
        marca:            editando.marca,
        placa:            editando.placa,
        ano:              String(editando.ano),
        cor:              editando.cor,
        descricao:        editando.descricao ?? '',
        ar_condicionado:  editando.ar_condicionado,
        camera_interna:   editando.camera_interna,
        porta_automatica: editando.porta_automatica,
        wifi:             editando.wifi,
        acessibilidade:   editando.acessibilidade,
        usb_carregador:   editando.usb_carregador,
        outros_itens:     editando.outros_itens ?? '',
      });
    } else {
      setForm(FORM_VAZIO);
    }
    setErrors({});
    setError(null);
  }, [isOpen, editando]);

  const setField = (field: keyof VanVeiculoFormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validar = (): boolean => {
    const e: FormErrors = {};
    if (!form.modelo.trim())  e.modelo = 'Modelo é obrigatório';
    if (!form.marca.trim())   e.marca = 'Marca é obrigatória';
    if (!form.placa.trim())   e.placa = 'Placa é obrigatória';
    else if (!/^[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}$/.test(form.placa.trim()))
      e.placa = 'Placa inválida (ex: ABC1D23 ou ABC1234)';
    if (!form.ano || Number(form.ano) < 1990 || Number(form.ano) > new Date().getFullYear() + 1)
      e.ano = `Ano inválido (1990–${new Date().getFullYear() + 1})`;
    if (!form.cor.trim()) e.cor = 'Cor é obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        modelo:           form.modelo.trim(),
        marca:            form.marca.trim(),
        placa:            form.placa.trim().toUpperCase(),
        ano:              Number(form.ano),
        cor:              form.cor.trim(),
        descricao:        form.descricao.trim() || null,
        ar_condicionado:  form.ar_condicionado,
        camera_interna:   form.camera_interna,
        porta_automatica: form.porta_automatica,
        wifi:             form.wifi,
        acessibilidade:   form.acessibilidade,
        usb_carregador:   form.usb_carregador,
        outros_itens:     form.outros_itens.trim() || null,
      };
      const van = editando
        ? await onAtualizar(editando.id, payload)
        : await onCriar(payload);
      onSalvo(van);
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const mapped: FormErrors = {};
        Object.entries(apiErrors).forEach(([k, v]) => {
          mapped[k as keyof VanVeiculoFormData] = (v as string[])[0];
        });
        setErrors(mapped);
      } else {
        setError(err.response?.data?.message || 'Erro ao salvar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !loading && onClose()}
      title={editando ? `Editar: ${editando.modelo} ${editando.marca}` : 'Cadastrar Nova Van'}
      size="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Modelo"
            value={form.modelo}
            error={errors.modelo}
            placeholder="Ex: Sprinter 415"
            required
            onChange={e => setField('modelo', e.target.value)}
          />
          <Input
            label="Marca"
            value={form.marca}
            error={errors.marca}
            placeholder="Ex: Mercedes-Benz"
            required
            onChange={e => setField('marca', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Placa"
            value={form.placa}
            error={errors.placa}
            placeholder="ABC1D23"
            required
            onChange={e => setField('placa', e.target.value.toUpperCase())}
          />
          <Input
            label="Ano"
            type="number"
            value={form.ano}
            error={errors.ano}
            placeholder="2023"
            required
            onChange={e => setField('ano', e.target.value)}
          />
          <Input
            label="Cor"
            value={form.cor}
            error={errors.cor}
            placeholder="Ex: Branco"
            required
            onChange={e => setField('cor', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={form.descricao}
            onChange={e => setField('descricao', e.target.value)}
            placeholder="Descreva a van brevemente..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">Confortos e Diferenciais</p>
          <div className="grid grid-cols-2 gap-2">
            {CONFORTOS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form[key] as boolean}
                  onChange={e => setField(key, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Outros itens <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.outros_itens}
            onChange={e => setField('outros_itens', e.target.value)}
            placeholder="Ex: TV, DVD, assentos reclináveis..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSalvar}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editando ? 'Salvar Alterações' : 'Cadastrar Van'}
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
