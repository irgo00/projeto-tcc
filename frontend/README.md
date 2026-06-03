# PBTE - Plataforma de Busca de Transporte Escolar

Sistema web para centralização e busca de serviços de transporte escolar em Irati-PR.

## 🚀 Tecnologias

- React 18
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Lucide React (ícones)

## 📦 Instalação
```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa linter

## 📁 Estrutura do Projeto
````
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── common/          # Botões, Inputs, Modais
│   └── features/        # Componentes específicos
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── contexts/           # Contextos React
├── hooks/              # Custom hooks
├── utils/              # Utilitários
├── App.jsx
└── main.jsx

🔗 Endpoints da API
Configurar VITE_API_URL no arquivo .env

## 🔁 Fluxos Principais

Breve resumo dos fluxos de usuário que o frontend implementa:

- Busca e filtragem: o usuário acessa a página de busca, aplica filtros (instituição, período, rota) e visualiza a lista de vans retornadas pela API.
- Visualização de detalhes: ao selecionar uma van, o usuário vê detalhes, fotos, horários e vagas disponíveis.
- Autenticação: cadastro/login via JWT; o token é armazenado (localStorage/sessionStorage) e anexado em requisições autenticadas.
- Favoritos e notificações: usuário autenticado pode favoritar rotas/vans; o frontend envia sinais ao backend para inscrição em notificações por e-mail.
- Área do prestador: prestadores autenticados podem criar/editar vans, atualizar vagas e fotos através dos formulários disponíveis.

📝 Licença
TCC - Instituto Federal do Paraná - 2025

