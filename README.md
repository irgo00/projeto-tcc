# PBTE - Plataforma de Busca de Transporte Escolar

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?logo=php)
![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql)
![License](https://img.shields.io/badge/license-Academic-blue)

## 📋 Sobre o Projeto

A **PBTE (Plataforma de Busca de Transporte Escolar)** é um sistema web responsivo desenvolvido como Trabalho de Conclusão de Curso (TCC) do Instituto Federal do Paraná (IFPR), voltado à centralização e otimização da busca por serviços de transporte escolar no município de Irati-PR.

### Contexto

Atualmente, a busca por transporte escolar no município depende de métodos informais como indicações pessoais e redes sociais, comprometendo a confiabilidade e a acessibilidade dos serviços. A PBTE surge como uma solução tecnológica para conectar usuários (responsáveis, estudantes) e prestadores de serviço (motoristas de vans escolares) de forma estruturada, segura e transparente.

### Problema Identificado

- Falta de um sistema centralizado para busca de transporte escolar
- Dificuldade para comparar ofertas, rotas e horários
- Ausência de informações sobre disponibilidade de vagas em tempo real
- Baixa visibilidade dos prestadores de serviço
- Processos informais que comprometem a segurança e confiabilidade

## 🎯 Objetivos

### Objetivo Geral
Desenvolver um sistema web para a centralização de buscas por serviços de transporte escolar no município de Irati.

### Objetivos Específicos
- ✅ Criar funcionalidade de busca avançada com filtros por linhas predefinidas
- ✅ Desenvolver sistema de notificação automática via e-mail sobre vagas disponíveis
- ✅ Implementar área de cadastro dedicada aos prestadores de serviço
- ✅ Permitir consulta, comparação e seleção de opções de vans disponíveis

## 🚀 Funcionalidades

### Para Usuários (Responsáveis/Estudantes)
- **Busca Avançada**: Localização de vans por colégio/faculdade, período e rota
- **Consulta de Disponibilidade**: Visualização de vagas disponíveis em tempo real
- **Rotas de Interesse**: Marcação de rotas favoritas para receber notificações
- **Notificações por E-mail**: Alertas automáticos sobre novas vagas
- **Avaliação de Prestadores**: Sistema de classificação com notas de 1 a 5 estrelas
- **Informações Detalhadas**: Acesso a horários, rotas, destinos e contatos dos prestadores

### Para Prestadores de Serviço
- **Cadastro Completo**: Registro com informações de veículo, rotas e documentação
- **Gerenciamento de Ofertas**: Atualização de horários, rotas e disponibilidade de vagas
- **Área Administrativa**: Painel para edição e controle das informações
- **Visibilidade**: Exposição dos serviços para potenciais clientes

### Recursos do Sistema
- Interface responsiva (mobile, tablet e desktop)
- Sistema de autenticação seguro
- Validação de dados e regras de negócio
- Proteção de dados conforme LGPD
- Design intuitivo e acessível

## 🛠️ Tecnologias Utilizadas

### Backend
- **PHP** 8.x
- **Laravel** 11.x
- **MySQL** 8.x (SQLite para testes em desenvolvimento)
- **Composer** (gerenciamento de dependências)

### Frontend
- **HTML5** / **CSS3**
- **TypeScript**
- **React** (framework em JS para interatividade e renderização)
- **Vite** (ferramenta de build de front-end moderna)

### Ferramentas de Desenvolvimento
- **Visual Studio Code** (IDE)
- **Node.js** (gerenciamento de pacotes frontend)
- **Git** (controle de versão)

### Metodologia
- **Scrum** (desenvolvimento ágil)
- **UML** (modelagem do sistema)
- **POO** (Programação Orientada a Objetos)

## 📊 Modelagem do Sistema

### Diagramas Desenvolvidos
- **Diagrama de Casos de Uso (DCU)**: Representação das interações entre atores e sistema
- **Diagrama de Atividades**: Fluxo de execução das funcionalidades principais
- **Diagrama de Classes**: Estrutura estática do sistema e relacionamentos
- **Modelo Entidade-Relacionamento (MER/DER)**: Estrutura do banco de dados

### Principais Entidades
- **Usuários**: Clientes (responsáveis/estudantes)
- **Prestadores**: Motoristas de vans escolares
- **Veículos**: Vans cadastradas no sistema
- **Rotas**: Trajetos oferecidos pelos prestadores
- **Instituições**: Escolas e faculdades atendidas
- **Avaliações**: Feedback dos usuários sobre os serviços

## 📋 Requisitos Funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RF001 | Buscar vans por filtro | Localizar vans por colégio/faculdade e período |
| RF002 | Enviar e-mail sobre vagas | Notificação automática de novas vagas |
| RF003 | Cadastro de usuários | Registro de clientes e prestadores |
| RF004 | Gerenciamento de ofertas | Atualização de rotas, horários e vagas |
| RF005 | Consultar vans disponíveis | Listagem dinâmica de vans ativas |
| RF006 | Exibir informações detalhadas | Página completa com dados da van |
| RF007 | Avaliar prestador | Sistema de avaliação com estrelas |
| RF008 | Marcar rotas de interesse | Salvamento de rotas favoritas |

## 📋 Requisitos Não Funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RNF001 | Responsividade | Adaptação a diferentes tamanhos de tela |
| RNF002 | Usabilidade | Interface simples e intuitiva |
| RNF003 | Segurança | Proteção de dados e conformidade com LGPD |
| RNF004 | Desempenho | Tempo de resposta otimizado |

## 🔒 Regras de Negócio

### Restrições de Idade
- **Menores de 13 anos**: Devem utilizar a conta de um responsável legal
- **Entre 13 e 17 anos**: Podem criar conta própria com CPF e data de nascimento
- **Maiores de 18 anos**: Acesso completo às funcionalidades

### Validações
- Verificação de CPF/CNPJ no cadastro
- Validação de e-mail obrigatória
- Rotas devem estar associadas a instituições cadastradas
- Apenas usuários logados podem avaliar prestadores

## 🚦 Status do Projeto

### Concluído ✅
- [x] Levantamento de requisitos
- [x] Modelagem do sistema (UML)
- [x] Definição de arquitetura
- [x] Documentação técnica

### Em Desenvolvimento 🔄
- [ ] Implementação do backend
- [ ] Desenvolvimento do frontend
- [ ] Integração com banco de dados
- [ ] Sistema de notificações por e-mail
- [ ] Testes de funcionalidades

### Planejado 📅
- [ ] Testes de usabilidade
- [ ] Ajustes e melhorias
- [ ] Deploy em ambiente de produção
- [ ] Documentação para usuários finais

## 👥 Equipe de Desenvolvimento

- **Matheus Candido Xavier** - Desenvolvedor
- **Igor Michel Mazo** - Desenvolvedor
- **Prof. Me. João Alexandre Batista da Cruz** - Orientador

**Instituição**: Instituto Federal do Paraná - Campus Irati  
**Curso**: Tecnologia em Análise e Desenvolvimento de Sistemas  
**Ano**: 2025

## 📚 Documentação Adicional

Para mais informações sobre o projeto, consulte:
- [Documentação Completa (PDF)](/docs/PBTE_Plataforma_de_Busca_de_Transporte_Escolar.pdf)

## 🤝 Contribuindo

Este é um projeto acadêmico desenvolvido como TCC. Sugestões e feedbacks são bem-vindos através dos canais da instituição.

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos no Instituto Federal do Paraná.

## 📞 Contato

Para dúvidas ou mais informações sobre o projeto, entre em contato com:
- **Instituto Federal do Paraná - Campus Irati**
- **E-mail institucional**: [contato via IFPR]

---

**PBTE** - Modernizando o acesso ao transporte escolar em Irati-PR 🚐📚