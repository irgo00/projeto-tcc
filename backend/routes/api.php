<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{AuthController, VanController, AvaliacaoController, FavoritoController, DashboardController, HistoricoContatoController};

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/vans', [VanController::class, 'index']);
Route::post('/vans/buscar', [VanController::class, 'buscar']);
Route::get('/vans/minhas', [VanController::class, 'minhas'])->middleware('auth:api');
Route::get('/vans/{id}', [VanController::class, 'show']);
Route::get('/avaliacoes/van/{vanId}', [AvaliacaoController::class, 'porVan']);

if (app()->environment('local')) {
    Route::get('/debug/vans', function () {
        return \App\Models\Van::all();
    });
}

Route::middleware(['auth:api'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::post('/vans', [VanController::class, 'store']);
    Route::put('/vans/{id}', [VanController::class, 'update']);
    Route::delete('/vans/{id}', [VanController::class, 'destroy']);

    Route::post('/avaliacoes', [AvaliacaoController::class, 'store']);
    Route::get('/avaliacoes/minhas', [AvaliacaoController::class, 'minhas']);
    Route::get('/avaliacoes/recebidas', [AvaliacaoController::class, 'recebidas']);

    Route::get('/favoritos', [FavoritoController::class, 'index']);
    Route::post('/favoritos', [FavoritoController::class, 'store']);
    Route::get('/favoritos/check/{vanId}', [FavoritoController::class, 'check']);
    Route::delete('/favoritos/{vanId}', [FavoritoController::class, 'destroy']);

    Route::get('/dashboard/prestador', [DashboardController::class, 'prestador']);
    Route::get('/dashboard/cliente', [DashboardController::class, 'cliente']);

    Route::post('/historico/registrar', [HistoricoContatoController::class, 'registrar']);
    Route::get('/historico', [HistoricoContatoController::class, 'index']);
});
