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
    </style>
</head>
<body>

    @include('partials.header')

    <main class="container py-5">
        @yield('content')
    </main>

    @include('partials.footer')

</body>
</html>
