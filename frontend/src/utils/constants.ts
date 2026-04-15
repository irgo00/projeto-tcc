// // ============================================================
// // ADICIONADO: VANS_DATABASE (era apenas PERIODOS, TIPOS etc)
// // Esse array é importado pela página Busca para filtrar resultados
// // ============================================================

// export const PERIODOS = {
//   MANHA: 'manha',
//   TARDE: 'tarde',
//   NOITE: 'noite',
// };

// export const TIPOS_USUARIO = {
//   CLIENTE: 'cliente',
//   PRESTADOR: 'prestador',
// };

// export const BAIRROS_IRATI = [
//   'Centro',
//   'Alto da Glória',
//   'Engenheiro Gutierrez',
//   'Riozinho',
//   'Itapará',
//   'Zona Rural',
// ];

// export const INSTITUICOES_ENSINO = [
//   'UNICENTRO',
//   'IFPR Campus Irati',
//   'Colégio Estadual',
//   'Escola Municipal',
// ];

// export const STATUS_VAN = {
//   ATIVA: 'ativa',
//   INATIVA: 'inativa',
//   MANUTENCAO: 'manutencao',
// };

// export const MENSAGENS = {
//   ERRO_GENERICO: 'Ocorreu um erro. Tente novamente.',
//   SUCESSO_CADASTRO: 'Cadastro realizado com sucesso!',
//   SUCESSO_LOGIN: 'Login realizado com sucesso!',
//   SUCESSO_LOGOUT: 'Até logo!',
//   ERRO_LOGIN: 'Email ou senha incorretos.',
//   ERRO_CONEXAO: 'Erro de conexão. Verifique sua internet.',
// };

// // ============================================================
// // 🆕 NOVO: VANS_DATABASE
// // Banco de dados mock das vans disponíveis em Irati-PR
// // Cada van possui:
// //   - origem: bairro de partida (usado para filtrar busca)
// //   - destino: instituição de chegada
// //   - instituicao: nome da escola/faculdade (usado para filtrar)
// //   - coordenadas: array de pontos lat/lng para montar rota
// // ============================================================
// export const VANS_DATABASE = [
//   {
//     id: 1,
//     nome: 'Van Escolar Central',
//     prestador: 'João Silva Transportes',
//     origem: 'Centro',
//     destino: 'UNICENTRO',
//     instituicao: 'UNICENTRO',
//     rota: 'Centro → UNICENTRO (Campus Santa Cruz)',
//     coordenadas: [
//       { lat: -25.4686, lng: -51.0848, nome: 'Centro - Praça da República' },
//       { lat: -25.4712, lng: -51.0892, nome: 'Rua Visconde do Rio Branco' },
//       { lat: -25.4755, lng: -51.0945, nome: 'UNICENTRO Campus Santa Cruz' }
//     ],
//     horario: 'Manhã: 06:30 | Tarde: 13:00',
//     vagas: 3,
//     avaliacao: 4.8,
//     totalAvaliacoes: 24,
//     telefone: '(42) 99999-0001',
//     email: 'joao.van@email.com',
//   },
//   {
//     id: 2,
//     nome: 'Transporte Universitário',
//     prestador: 'Maria Santos',
//     origem: 'Engenheiro Gutierrez',
//     destino: 'IFPR',
//     instituicao: 'IFPR',
//     rota: 'Engenheiro Gutierrez → IFPR Campus Irati',
//     coordenadas: [
//       { lat: -25.4823, lng: -51.0756, nome: 'Engenheiro Gutierrez' },
//       { lat: -25.4789, lng: -51.0801, nome: 'Rua Coronel Emílio Gomes' },
//       { lat: -25.4652, lng: -51.0912, nome: 'IFPR Campus Irati' }
//     ],
//     horario: 'Manhã: 07:00 | Tarde: 13:30',
//     vagas: 5,
//     avaliacao: 4.9,
//     totalAvaliacoes: 31,
//     telefone: '(42) 99999-0002',
//     email: 'maria.transporte@email.com',
//   },
//   {
//     id: 3,
//     nome: 'Van Estudantil',
//     prestador: 'Pedro Oliveira',
//     origem: 'Alto da Glória',
//     destino: 'Colégio Estadual',
//     instituicao: 'Colégio Estadual',
//     rota: 'Alto da Glória → Colégio Estadual',
//     coordenadas: [
//       { lat: -25.4612, lng: -51.0723, nome: 'Alto da Glória' },
//       { lat: -25.4656, lng: -51.0789, nome: 'Rua XV de Novembro' },
//       { lat: -25.4678, lng: -51.0834, nome: 'Colégio Estadual' }
//     ],
//     horario: 'Manhã: 06:45 | Tarde: 12:45',
//     vagas: 2,
//     avaliacao: 4.7,
//     totalAvaliacoes: 18,
//     telefone: '(42) 99999-0003',
//     email: 'pedro.estudantil@email.com',
//   },
//   {
//     id: 4,
//     nome: 'Transporte Escolar Seguro',
//     prestador: 'Ana Costa',
//     origem: 'Riozinho',
//     destino: 'Escola Municipal',
//     instituicao: 'Escola Municipal',
//     rota: 'Riozinho → Escola Municipal',
//     coordenadas: [
//       { lat: -25.4923, lng: -51.0634, nome: 'Riozinho' },
//       { lat: -25.4834, lng: -51.0712, nome: 'Rua Paraná' },
//       { lat: -25.4701, lng: -51.0823, nome: 'Escola Municipal' }
//     ],
//     horario: 'Manhã: 07:15 | Tarde: 13:15',
//     vagas: 4,
//     avaliacao: 4.6,
//     totalAvaliacoes: 15,
//     telefone: '(42) 99999-0004',
//     email: 'ana.transporte@email.com',
//   },
//   {
//     id: 5,
//     nome: 'Van Universitária Plus',
//     prestador: 'Carlos Mendes',
//     origem: 'Centro',
//     destino: 'UNICENTRO',
//     instituicao: 'UNICENTRO',
//     rota: 'Centro → UNICENTRO (Rota Alternativa)',
//     coordenadas: [
//       { lat: -25.4686, lng: -51.0848, nome: 'Centro - Terminal' },
//       { lat: -25.4723, lng: -51.0901, nome: 'Rua Prudente de Morais' },
//       { lat: -25.4755, lng: -51.0945, nome: 'UNICENTRO Campus' }
//     ],
//     horario: 'Manhã: 06:00 | Tarde: 12:30',
//     vagas: 6,
//     avaliacao: 4.9,
//     totalAvaliacoes: 42,
//     telefone: '(42) 99999-0005',
//     email: 'carlos.van@email.com',
//   },
//   {
//     id: 6,
//     nome: 'Transporte IFPR Expresso',
//     prestador: 'Juliana Ferreira',
//     origem: 'Centro',
//     destino: 'IFPR',
//     instituicao: 'IFPR',
//     rota: 'Centro → IFPR Campus Irati',
//     coordenadas: [
//       { lat: -25.4686, lng: -51.0848, nome: 'Centro' },
//       { lat: -25.4667, lng: -51.0878, nome: 'Av. Presidente Kennedy' },
//       { lat: -25.4652, lng: -51.0912, nome: 'IFPR' }
//     ],
//     horario: 'Manhã: 06:50 | Noite: 18:00',
//     vagas: 1,
//     avaliacao: 4.5,
//     totalAvaliacoes: 12,
//     telefone: '(42) 99999-0006',
//     email: 'juliana.rapido@email.com',
//   },
// ];