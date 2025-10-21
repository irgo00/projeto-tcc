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
                <label for="cnpj" class="form-label">CNPJ</label>
                <input type="text" id="cnpj" name="cnpj" class="form-control" required>
            </div>
            <div class="col-md-6">
                <label for="telefone" class="form-label">Telefone</label>
                <input type="text" id="telefone" name="telefone" class="form-control" required>
            </div>
            <div class="col-md-12">
                <label for="instituicoes" class="form-label">Instituições de Ensino</label>
                <div id="instituicoes">
                    <div class="input-group mb-3">
                        <input type="text" name="instituicoes[]" class="form-control" placeholder="Ex: IFPR Campus Irati" required>
                        <button type="button" class="btn btn-outline-secondary" onclick="addInstituicao()">+</button>
                    </div>
                </div>
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

<script>
    function addInstituicao() {
        var div = document.createElement("div");
        div.classList.add("input-group", "mb-3");
        div.innerHTML = `
            <input type="text" name="instituicoes[]" class="form-control" placeholder="Ex: IFPR Campus Irati" required>
            <button type="button" class="btn btn-outline-secondary" onclick="removeInstituicao(this)">-</button>
        `;
        document.getElementById("instituicoes").appendChild(div);
    }

    function removeInstituicao(button) {
        button.parentElement.remove();
    }
</script>
@endsection
