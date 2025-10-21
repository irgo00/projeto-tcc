<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('/login', function () {
    return view('login');
});

Route::get('/cadastro-cliente', function () {
    return view('cadastro-cliente');
});

Route::get('/cadastro-prestador', function () {
    return view('cadastro-prestador');
});
