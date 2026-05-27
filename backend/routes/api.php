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
};

/* ==========================================================
 | ROTAS PÚBLICAS
 |==========================================================*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/vans',         [VanController::class, 'index']);
Route::post('/vans/buscar', [VanController::class, 'buscar']);
Route::get('/vans/{id}',    [VanController::class, 'show']);

Route::get('/avaliacoes/van/{vanId}', [AvaliacaoController::class, 'porVan']);

if (app()->environment('local')) {
    Route::get('/debug/rotas', fn() => \App\Models\Rota::with('van')->get());
}

/* ==========================================================
 | ROTAS AUTENTICADAS (JWT)
 |==========================================================*/

Route::middleware(['auth:api'])->group(function () {

    // Auth
    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get('/me',               [AuthController::class, 'me']);
    Route::put('/profile',          [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Rotas (vans)
    Route::get('/vans/minhas', [VanController::class, 'minhas']);
    Route::post('/vans',       [VanController::class, 'store']);
    Route::put('/vans/{id}',   [VanController::class, 'update']);
    Route::delete('/vans/{id}',[VanController::class, 'destroy']);

    // Veículos
    Route::get('/veiculos/minhas',                           [VanVeiculoController::class, 'minhas']);
    Route::get('/veiculos/{id}',                             [VanVeiculoController::class, 'show']);
    Route::post('/veiculos',                                 [VanVeiculoController::class, 'store']);
    Route::put('/veiculos/{id}',                             [VanVeiculoController::class, 'update']);
    Route::delete('/veiculos/{id}',                          [VanVeiculoController::class, 'destroy']);
    Route::post('/veiculos/{id}/fotos',                      [VanVeiculoController::class, 'uploadFotos']);
    Route::delete('/veiculos/{vanId}/fotos/{fotoId}',        [VanVeiculoController::class, 'deleteFoto']);
    Route::put('/veiculos/{vanId}/fotos/{fotoId}/principal', [VanVeiculoController::class, 'setPrincipal']);

    // Avaliações
    Route::post('/avaliacoes',          [AvaliacaoController::class, 'store']);
    Route::get('/avaliacoes/minhas',    [AvaliacaoController::class, 'minhas']);
    Route::get('/avaliacoes/recebidas', [AvaliacaoController::class, 'recebidas']);

    // Favoritos
    Route::get('/favoritos',               [FavoritoController::class, 'index']);
    Route::post('/favoritos',              [FavoritoController::class, 'store']);
    Route::get('/favoritos/check/{vanId}', [FavoritoController::class, 'check']);
    Route::delete('/favoritos/{vanId}',    [FavoritoController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard/prestador', [DashboardController::class, 'prestador']);
    Route::get('/dashboard/cliente',   [DashboardController::class, 'cliente']);

    // Histórico
    Route::post('/historico/registrar', [HistoricoContatoController::class, 'registrar']);
    Route::get('/historico',            [HistoricoContatoController::class, 'index']);

    /* ----------------------------------------------------------
     | DOCUMENTOS — Prestador
     |----------------------------------------------------------*/
    // Lista documentos + progresso de habilitação do próprio prestador
    Route::get('/documentos/meus',              [DocumentoController::class, 'meus']);
    // Envia novo documento
    Route::post('/documentos',                  [DocumentoController::class, 'store']);
    // Reenvio após correção solicitada
    Route::post('/documentos/{id}/reenviar',    [DocumentoController::class, 'reenviar']);

    /* ----------------------------------------------------------
     | ADMIN — documentos e prestadores
     |----------------------------------------------------------*/
    Route::prefix('admin')->group(function () {
        // Estatísticas do painel
        Route::get('/stats',                                    [DocumentoController::class, 'stats']);

        // Listagem de prestadores com status
        Route::get('/prestadores',                              [DocumentoController::class, 'prestadoresAdmin']);

        // Todos os documentos (com filtros: ?status=&tipo=&prestador_id=)
        Route::get('/documentos',                               [DocumentoController::class, 'indexAdmin']);

        // Documentos de um prestador específico
        Route::get('/documentos/prestador/{prestadorId}',       [DocumentoController::class, 'porPrestador']);

        // Ações de revisão
        Route::put('/documentos/{id}/aprovar',                  [DocumentoController::class, 'aprovar']);
        Route::put('/documentos/{id}/reprovar',                 [DocumentoController::class, 'reprovar']);
        Route::put('/documentos/{id}/correcao',                 [DocumentoController::class, 'solicitarCorrecao']);
    });
});
