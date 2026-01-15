@extends('layouts.app')
@section('content')
<div class="bg-light rounded-4 shadow p-5 mx-auto" style="max-width:700px;">
    <h3 class="text-center mb-4">Cadastro de Cliente</h3>
    <form method="POST" action="/cadastro-cliente">
        @csrf
        <div class="row g-3">
            <div class="col-md-6">
                <label for="nome" class="form-label">Nome</label>
                <input type="text" id="nome" name="nome" class="form-control" required>
            </div>
            <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" name="email" class="form-control" required>
            </div>
            <div class="col-md-6">
                <label for="cpf" class="form-label">CPF</label>
                <input type="text" id="cpf" name="cpf" class="form-control" required>
            </div>
            <div class="col-md-6">
                <label for="telefone" class="form-label">Telefone</label>
                <input type="text" id="telefone" name="telefone" class="form-control" required>
            </div>
        </div>
        <div class="mt-3">
            <label class="form-label">Tipo de Usuário</label><br>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="tipo" id="cliente" value="cliente" checked>
                <label class="form-check-label" for="cliente">Cliente</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="tipo" id="prestador" value="prestador">
                <label class="form-check-label" for="prestador">Prestador</label>
            </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
            <button type="submit" class="btn btn-primary">Cadastrar</button>
            <a href="/" class="btn btn-outline-secondary">Cancelar</a>
        </div>
    </form>
</div>
@endsection
