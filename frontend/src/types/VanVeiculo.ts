export interface VanFoto {
  id: number;
  url: string;
  principal: boolean;
  ordem: number;
}

export interface VanVeiculo {
  id: number;
  prestador_id: number;
  modelo: string;
  marca: string;
  placa: string;
  ano: number;
  cor: string;
  descricao?: string;
  ar_condicionado: boolean;
  camera_interna: boolean;
  porta_automatica: boolean;
  wifi: boolean;
  acessibilidade: boolean;
  usb_carregador: boolean;
  outros_itens?: string;
  fotos: VanFoto[];
  foto_principal_url?: string;
  total_rotas: number;
  criadoEm: string;
}

export interface VanVeiculoFormData {
  modelo: string;
  marca: string;
  placa: string;
  ano: string;
  cor: string;
  descricao: string;
  ar_condicionado: boolean;
  camera_interna: boolean;
  porta_automatica: boolean;
  wifi: boolean;
  acessibilidade: boolean;
  usb_carregador: boolean;
  outros_itens: string;
}
