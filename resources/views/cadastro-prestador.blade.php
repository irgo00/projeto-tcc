@extends('layouts.app')
@section('content')
<div class="bg-light rounded-4 shadow p-5 mx-auto" style="max-width:700px;">
    <h3 class="text-center mb-4">Cadastro de Prestador de Serviço</h3>
    <form method="POST" action="/cadastro-prestador">
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
            <div class="col-md-6">
                <label for="rota" class="form-label">Rota Atendida</label>
                <input type="text" id="rota" name="rota" class="form-control" placeholder="Ex: Bairro Centro - Escola Estadual" required>
            </div>
            <div class="col-md-6">
                <label for="capacidade" class="form-label">Capacidade da Van</label>
                <input type="number" id="capacidade" name="capacidade" class="form-control" required>
            </div>
            <div class="col-md-6">
                <label for="placa" class="form-label">Placa do Veículo</label>
                <input type="text" id="placa" name="placa" class="form-control" required>
            </div>
            <div class="col-md-6">
                <label for="horario" class="form-label">Disponibilidade de Horários</label>
                <input type="text" id="horario" name="horario" class="form-control" placeholder="Ex: 07:00 às 18:00" required>
            </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
            <button type="submit" class="btn btn-primary">Cadastrar</button>
            <a href="/" class="btn btn-outline-secondary">Cancelar</a>
        </div>
    </form>
</div>
@endsection
