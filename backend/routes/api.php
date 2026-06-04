<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    VanController,
    VanVeiculoController,
    AvaliacaoController,
    FavoritoController,
    DashboardController,
    HistoricoContatoController,
    DocumentoController,
    EmailVerificationController,
};

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('email.verify');

Route::get('/vans',          [VanController::class, 'index']);
Route::post('/vans/buscar',  [VanController::class, 'buscar']);
Route::get('/vans/minhas',   [VanController::class, 'minhas']);
Route::get('/vans/{id}',     [VanController::class, 'show']);

Route::get('/avaliacoes/van/{vanId}', [AvaliacaoController::class, 'porVan']);

if (app()->environment('local')) {
    Route::get('/debug/rotas', fn() => \App\Models\Rota::with('van')->get());
}

Route::middleware(['auth:api'])->group(function () {

    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get('/me',               [AuthController::class, 'me']);
    Route::put('/profile',          [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1');

    Route::get('/vans/minhas', [VanController::class, 'minhas']);
    Route::post('/vans',       [VanController::class, 'store']);
    Route::put('/vans/{id}',   [VanController::class, 'update']);
    Route::delete('/vans/{id}',[VanController::class, 'destroy']);

    Route::get('/veiculos/minhas',                           [VanVeiculoController::class, 'minhas']);
    Route::post('/veiculos',                                 [VanVeiculoController::class, 'store']);
    Route::get('/veiculos/{id}',                             [VanVeiculoController::class, 'show']);
    Route::put('/veiculos/{id}',                             [VanVeiculoController::class, 'update']);
    Route::delete('/veiculos/{id}',                          [VanVeiculoController::class, 'destroy']);
    Route::post('/veiculos/{id}/fotos',                      [VanVeiculoController::class, 'uploadFotos']);
    Route::delete('/veiculos/{vanId}/fotos/{fotoId}',        [VanVeiculoController::class, 'deleteFoto']);
    Route::put('/veiculos/{vanId}/fotos/{fotoId}/principal', [VanVeiculoController::class, 'setPrincipal']);

    Route::post('/avaliacoes',          [AvaliacaoController::class, 'store']);
    Route::get('/avaliacoes/minhas',    [AvaliacaoController::class, 'minhas']);
    Route::get('/avaliacoes/recebidas', [AvaliacaoController::class, 'recebidas']);

    Route::get('/favoritos',               [FavoritoController::class, 'index']);
    Route::post('/favoritos',              [FavoritoController::class, 'store']);
    Route::get('/favoritos/check/{vanId}', [FavoritoController::class, 'check']);
    Route::delete('/favoritos/{vanId}',    [FavoritoController::class, 'destroy']);

    Route::get('/dashboard/prestador', [DashboardController::class, 'prestador']);
    Route::get('/dashboard/cliente',   [DashboardController::class, 'cliente']);

    Route::post('/historico/registrar', [HistoricoContatoController::class, 'registrar']);
    Route::get('/historico',            [HistoricoContatoController::class, 'index']);

    Route::get('/documentos/meus',           [DocumentoController::class, 'meus']);
    Route::post('/documentos',               [DocumentoController::class, 'store']);
    Route::post('/documentos/{id}/reenviar', [DocumentoController::class, 'reenviar']);

    Route::prefix('admin')->group(function () {
        Route::get('/stats',                              [DocumentoController::class, 'stats']);
        Route::get('/prestadores',                        [DocumentoController::class, 'prestadoresAdmin']);
        Route::get('/documentos',                         [DocumentoController::class, 'indexAdmin']);
        Route::get('/documentos/prestador/{prestadorId}', [DocumentoController::class, 'porPrestador']);
        Route::put('/documentos/{id}/aprovar',            [DocumentoController::class, 'aprovar']);
        Route::put('/documentos/{id}/reprovar',           [DocumentoController::class, 'reprovar']);
        Route::put('/documentos/{id}/correcao',           [DocumentoController::class, 'solicitarCorrecao']);
    });
});
