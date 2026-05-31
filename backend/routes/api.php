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

/* ==========================================================
 | ROTAS PÚBLICAS
 |==========================================================*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Confirmação de e-mail via link assinado (público — autenticidade pela assinatura)
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware('signed')
    ->name('email.verify');

// ATENÇÃO: rotas estáticas SEMPRE antes de rotas com parâmetro dinâmico {id}
// Se /vans/{id} vier antes de /vans/minhas ou /vans/buscar,
// o Laravel captura "minhas" e "buscar" como {id} → 404.
Route::get('/vans',          [VanController::class, 'index']);
Route::post('/vans/buscar',  [VanController::class, 'buscar']);
Route::get('/vans/minhas',   [VanController::class, 'minhas']);
Route::get('/vans/{id}',     [VanController::class, 'show']);   // sempre por último no grupo GET /vans

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

    // Reenvio do e-mail de verificação (limitado para evitar spam)
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1');

    // ── Vans / Rotas ──────────────────────────────────────────────────────────
    // CRÍTICO: /vans/minhas DEVE vir antes de /vans/{id}
    // Caso contrário o Laravel roteia GET /vans/minhas → show(id='minhas') → 404
    Route::get('/vans/minhas', [VanController::class, 'minhas']);   // ← estático primeiro
    Route::post('/vans',       [VanController::class, 'store']);
    Route::put('/vans/{id}',   [VanController::class, 'update']);
    Route::delete('/vans/{id}',[VanController::class, 'destroy']);

    // ── Veículos ──────────────────────────────────────────────────────────────
    // Mesmo padrão: estáticos antes de dinâmicos
    Route::get('/veiculos/minhas',                           [VanVeiculoController::class, 'minhas']);
    Route::post('/veiculos',                                 [VanVeiculoController::class, 'store']);
    Route::get('/veiculos/{id}',                             [VanVeiculoController::class, 'show']);
    Route::put('/veiculos/{id}',                             [VanVeiculoController::class, 'update']);
    Route::delete('/veiculos/{id}',                          [VanVeiculoController::class, 'destroy']);
    Route::post('/veiculos/{id}/fotos',                      [VanVeiculoController::class, 'uploadFotos']);
    Route::delete('/veiculos/{vanId}/fotos/{fotoId}',        [VanVeiculoController::class, 'deleteFoto']);
    Route::put('/veiculos/{vanId}/fotos/{fotoId}/principal', [VanVeiculoController::class, 'setPrincipal']);

    // ── Avaliações ────────────────────────────────────────────────────────────
    Route::post('/avaliacoes',          [AvaliacaoController::class, 'store']);
    Route::get('/avaliacoes/minhas',    [AvaliacaoController::class, 'minhas']);
    Route::get('/avaliacoes/recebidas', [AvaliacaoController::class, 'recebidas']);

    // ── Favoritos ─────────────────────────────────────────────────────────────
    Route::get('/favoritos',               [FavoritoController::class, 'index']);
    Route::post('/favoritos',              [FavoritoController::class, 'store']);
    Route::get('/favoritos/check/{vanId}', [FavoritoController::class, 'check']);
    Route::delete('/favoritos/{vanId}',    [FavoritoController::class, 'destroy']);

    // ── Dashboard ─────────────────────────────────────────────────────────────
    Route::get('/dashboard/prestador', [DashboardController::class, 'prestador']);
    Route::get('/dashboard/cliente',   [DashboardController::class, 'cliente']);

    // ── Histórico ─────────────────────────────────────────────────────────────
    Route::post('/historico/registrar', [HistoricoContatoController::class, 'registrar']);
    Route::get('/historico',            [HistoricoContatoController::class, 'index']);

    // ── Documentos (Prestador) ────────────────────────────────────────────────
    Route::get('/documentos/meus',           [DocumentoController::class, 'meus']);
    Route::post('/documentos',               [DocumentoController::class, 'store']);
    Route::post('/documentos/{id}/reenviar', [DocumentoController::class, 'reenviar']);

    // ── Admin ─────────────────────────────────────────────────────────────────
    Route::prefix('admin')->group(function () {
        Route::get('/stats',                              [DocumentoController::class, 'stats']);
        Route::get('/prestadores',                        [DocumentoController::class, 'prestadoresAdmin']);
        // estático antes de dinâmico também aqui:
        Route::get('/documentos',                         [DocumentoController::class, 'indexAdmin']);
        Route::get('/documentos/prestador/{prestadorId}', [DocumentoController::class, 'porPrestador']);
        Route::put('/documentos/{id}/aprovar',            [DocumentoController::class, 'aprovar']);
        Route::put('/documentos/{id}/reprovar',           [DocumentoController::class, 'reprovar']);
        Route::put('/documentos/{id}/correcao',           [DocumentoController::class, 'solicitarCorrecao']);
    });
});
