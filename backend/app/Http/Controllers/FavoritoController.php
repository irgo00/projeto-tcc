<?php

namespace App\Http\Controllers;

use App\Models\Rota;
use Illuminate\Http\Request;

class FavoritoController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $favoritos = $user
            ->favoritos()
            ->with(['prestador:id,nome', 'van.fotos'])
            ->get()
            ->map(fn($rota) => [
                'id'                 => $rota->id,
                'nome'               => $rota->nome,
                'prestador'          => $rota->prestador->nome,
                'rota'               => $rota->rota,
                'horario'            => $rota->horario_formatado,
                'vagas'              => $rota->vagas_disponiveis,
                'avaliacao'          => $rota->avaliacao_media,
                'totalAvaliacoes'    => $rota->total_avaliacoes,
                'telefone'           => $rota->telefone,
                'email'              => $rota->email,
                'foto_principal_url' => optional($rota->van)->foto_principal_url,
            ]);

        return response()->json($favoritos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'van_id' => 'required|exists:rotas,id',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->favoritos()->where('rotas.id', $request->van_id)->exists()) {
            return response()->json(['success' => false, 'message' => 'Rota já está nos favoritos.'], 422);
        }

        $user->favoritos()->attach($request->van_id);

        return response()->json(['success' => true, 'message' => 'Rota adicionada aos favoritos!']);
    }

    public function destroy($vanId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if (!$user->favoritos()->where('rotas.id', $vanId)->exists()) {
            return response()->json(['success' => false, 'message' => 'Rota não está nos favoritos.'], 404);
        }

        $user->favoritos()->detach($vanId);

        return response()->json(['success' => true, 'message' => 'Rota removida dos favoritos!']);
    }

    public function check($vanId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $isFavorito = $user->favoritos()->where('rotas.id', $vanId)->exists();

        return response()->json(['success' => true, 'isFavorito' => $isFavorito]);
    }
}
