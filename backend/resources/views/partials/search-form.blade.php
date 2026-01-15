<div id="pesquisa" class="bg-white rounded-4 shadow p-4 mt-5 mx-auto" style="max-width:600px;">
    <h4 class="text-center mb-4">Buscar Transporte Escolar</h4>
    <form>
        <div class="mb-3">
            <label for="origem" class="form-label">Origem</label>
            <input type="text" id="origem" class="form-control" placeholder="De onde você vai sair?">
        </div>
        <div class="mb-3">
            <label for="destino" class="form-label">Destino</label>
            <input type="text" id="destino" class="form-control" placeholder="Para onde você vai?">
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="viagem" id="ida" checked>
            <label class="form-check-label" for="ida">Somente Ida</label>
        </div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="viagem" id="idaVolta">
            <label class="form-check-label" for="idaVolta">Ida e Volta</label>
        </div>
        <div class="d-grid">
            <button type="submit" class="btn btn-primary">Buscar</button>
        </div>
    </form>
</div>
