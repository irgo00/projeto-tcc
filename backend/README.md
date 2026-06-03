# 🚐 PBTE Backend - Laravel + SQLite

Backend da Plataforma de Busca de Transporte Escolar desenvolvido em Laravel com SQLite.

## 📋 Pré-requisitos

- PHP >= 8.1
- Composer
- SQLite3

## 🚀 Instalação

### 1. Instalar dependências do Composer

```bash
cd backend
composer install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configurar banco de dados SQLite

O arquivo `.env` já está configurado para usar SQLite. O banco será criado automaticamente.

### 4. Executar migrations e seeders

```bash
php artisan migrate --seed
```

### 5. Iniciar servidor de desenvolvimento

```bash
php artisan serve
```

O servidor estará rodando em `http://localhost:8000`

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Controllers da API
│   │   ├── Middleware/       # Middleware de autenticação
│   │   └── Requests/         # Form Requests (validação)
│   ├── Models/               # Models Eloquent
│   ├── Mail/                 # Classes de email
│   └── Services/             # Lógica de negócio
├── config/                   # Configurações
├── database/
│   ├── migrations/           # Migrations do banco
│   └── seeders/              # Seeders de dados iniciais
└── routes/
    └── api.php              # Rotas da API
```

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação.

### Endpoints de Autenticação

- `POST /api/register` - Cadastro de usuário
- `POST /api/login` - Login
- `POST /api/logout` - Logout (requer autenticação)
- `GET /api/me` - Dados do usuário logado

## 📡 Endpoints Principais

### 🚐 Vans

- `GET /api/vans` - Listar todas as vans (público)
- `POST /api/vans/buscar` - Buscar vans com filtros (público)
- `GET /api/vans/{id}` - Detalhes de uma van (público)
- `POST /api/vans` - Criar van (prestador)
- `PUT /api/vans/{id}` - Atualizar van (prestador/owner)
- `DELETE /api/vans/{id}` - Deletar van (prestador/owner)
- `GET /api/vans/minhas` - Minhas vans (prestador)

### ⭐ Avaliações

- `POST /api/avaliacoes` - Criar avaliação (cliente)
- `GET /api/avaliacoes/van/{vanId}` - Avaliações de uma van (público)
- `GET /api/avaliacoes/minhas` - Minhas avaliações (cliente)

### ❤️ Favoritos

- `GET /api/favoritos` - Listar favoritos (cliente)
- `POST /api/favoritos` - Adicionar favorito (cliente)
- `DELETE /api/favoritos/{vanId}` - Remover favorito (cliente)
- `GET /api/favoritos/check/{vanId}` - Verificar se é favorito (cliente)

### 📊 Dashboard

- `GET /api/dashboard/prestador` - Estatísticas do prestador
- `GET /api/dashboard/cliente` - Dados do cliente (favoritos, histórico)

## 🔁 Fluxos Principais

Principais fluxos de uso tratados pelo backend (API):

- Autenticação: registro (`/api/register`), login (`/api/login`) retornando JWT; endpoints protegidos exigem o token no cabeçalho `Authorization: Bearer <token>`.
- Gestão de vans (prestador): rotas CRUD para criação, edição, listagem e exclusão de vans; atualizações de vagas disparam notificações para usuários favoritados.
- Busca e filtros: `/api/vans/buscar` aceita filtros (instituição, rota, período) e retorna resultados paginados.
- Favoritos e notificações: endpoints para favoritar/checar favoritos; quando vagas são atualizadas, o backend envia e-mails para usuários inscritos.
- Avaliações: clientes autenticados podem criar avaliações; validação impede avaliações duplicadas por mesmo usuário para a mesma van.

## 🔒 Regras de Negócio

- ✅ CPF deve ser válido
- ✅ Idade mínima: 13 anos
- ✅ Apenas prestadores podem criar/editar vans
- ✅ Apenas clientes podem avaliar e favoritar
- ✅ Um cliente só pode avaliar uma van uma vez
- ✅ Emails são enviados quando há novas vagas em vans favoritadas

## 🧪 Dados de Teste

Após rodar `php artisan migrate --seed`, você terá:

**Usuário Cliente:**
- Email: `cliente@teste.com`
- Senha: `senha123`

**Usuário Prestador:**
- Email: `prestador@teste.com`
- Senha: `senha123`

**6 Vans de exemplo** criadas automaticamente

## 📧 Configuração de Email

Para enviar emails de notificação, configure no `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@pbte.com.br
MAIL_FROM_NAME="PBTE"
```

## 🛠️ Comandos Úteis

```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver rotas disponíveis
php artisan route:list

# Recriar banco do zero
php artisan migrate:fresh --seed

# Gerar documentação da API (se instalado)
php artisan l5-swagger:generate
```

## 📝 Licença

TCC - Instituto Federal do Paraná - 2025
