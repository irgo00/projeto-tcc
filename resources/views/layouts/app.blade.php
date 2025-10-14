<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PBTE - Plataforma de Busca de Transporte Escolar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f4f6f8; }
        .btn-primary { background-color: #6f42c1; border: none; }
        .btn-primary:hover { background-color: #5a32a3; }
        header { background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        footer { background-color: #212529; color: #bbb; padding: 1.5rem 0; margin-top: 2rem; }
    </style>
</head>
<body>
    <header class="py-3">
        <div class="container d-flex justify-content-between align-items-center">
            <h4 class="fw-bold text-success">PBTE</h4>
            <nav>
                <a href="/" class="mx-3 text-dark text-decoration-none">Home</a>
                <a href="/pesquisar" class="mx-3 text-dark text-decoration-none">Pesquisar</a>
                <a href="/contato" class="mx-3 text-dark text-decoration-none">Contato</a>
                <a href="/login" class="btn btn-outline-primary btn-sm">Entrar</a>
                <a href="/cadastro-cliente" class="btn btn-primary btn-sm">Cadastrar</a>
            </nav>
        </div>
    </header>

    <main class="container py-5">
        @yield('content')
    </main>

    <footer class="text-center">
        <div class="container">
            <p class="mb-0">&copy; 2025 PBTE - Plataforma de Busca de Transporte Escolar</p>
        </div>
    </footer>
</body>
</html>
