export const PERIODOS = {
  MANHA: 'manha',
  TARDE: 'tarde',
  NOITE: 'noite',
} as const;

export type Periodo = typeof PERIODOS[keyof typeof PERIODOS];

export const TIPOS_USUARIO = {
  CLIENTE: 'cliente',
  PRESTADOR: 'prestador',
} as const;

export type TipoUsuario = typeof TIPOS_USUARIO[keyof typeof TIPOS_USUARIO];

export const BAIRROS_IRATI = [
  'Centro',
  'Alto da Glória',
  'Engenheiro Gutierrez',
  'Riozinho',
  'Itapará',
  'Zona Rural',
];

export const INSTITUICOES_ENSINO = [
  'UNICENTRO',
  'IFPR Campus Irati',
  'Colégio Estadual',
  'Escola Municipal',
];

export const STATUS_VAN = {
  ATIVA: 'ativa',
  INATIVA: 'inativa',
  MANUTENCAO: 'manutencao',
} as const;

export type StatusVan = typeof STATUS_VAN[keyof typeof STATUS_VAN];

export const MENSAGENS = {
  ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
  SUCESSO_CADASTRO: 'Cadastro realizado com sucesso!',
  SUCESSO_LOGIN: 'Login realizado com sucesso!',
  SUCESSO_LOGOUT: 'Até logo!',
  ERRO_LOGIN: 'Email ou senha incorretos.',
  ERRO_CONEXAO: 'Erro de conexão. Verifique sua internet.',
};