@extends('layouts.app')
@section('content')
<div class="text-center py-5">
    <h1 class="fw-bold">A maneira <span class="text-primary">ágil</span> de encontrar sua van local.</h1>
    <p>Clique no botão abaixo para acessar nossa barra de pesquisa.</p>
    <a href="#pesquisa" class="btn btn-primary mt-3">Pesquisar Agora</a>
</div>
@include('partials.search-form')
@endsection
