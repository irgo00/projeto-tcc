@extends('layouts.app')
@section('content')
<div class="bg-light rounded-4 shadow p-5 mx-auto" style="max-width:500px;">
    <h3 class="text-center mb-4">Entrar</h3>
    <form method="POST" action="/login">
        @csrf
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" name="email" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input type="password" id="password" name="password" class="form-control" required>
        </div>
        <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Entrar</button>
            <a href="/" class="btn btn-outline-secondary">Cancelar</a>
        </div>
        <div class="text-center mt-3">
            <a href="/cadastro-cliente" class="text-decoration-none">Criar conta</a>
        </div>
    </form>
</div>
@endsection
