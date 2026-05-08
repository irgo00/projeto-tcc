<?php

namespace App\Http\Controllers;

use App\Models\Van;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoritoController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $favoritos = $user
            ->favoritos()
            ->with(['prestador:id,nome', 'avaliacoes'])
            ->get()
            ->map(function ($van) {
                return [
                    'id'              => $van->id,
                    'nome'            => $van->nome,
                    'prestador'       => $van->prestador->nome,
                    'rota'            => $van->rota,
                    'horario'         => $van->horario_formatado,
                    'vagas'           => $van->vagas_disponiveis,
                    'avaliacao'       => $van->avaliacao_media,
                    'totalAvaliacoes' => $van->total_avaliacoes,
                    'telefone'        => $van->telefone,
                    'email'           => $van->email,
                ];
            });

        return response()->json($favoritos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'van_id' => 'required|exists:vans,id',
        ]);

        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->favoritos()->where('van_id', $request->van_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Van já está nos favoritos.'
            ], 422);
        }

        $user->favoritos()->attach($request->van_id);

        return response()->json([
            'success' => true,
            'message' => 'Van adicionada aos favoritos!'
        ]);
    }

    public function destroy($vanId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if (!$user->favoritos()->where('van_id', $vanId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Van não está nos favoritos.'
            ], 404);
        }

        $user->favoritos()->detach($vanId);

        return response()->json([
            'success' => true,
            'message' => 'Van removida dos favoritos!'
        ]);
    }

    public function check($vanId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $isFavorito = $user
            ->favoritos()
            ->where('van_id', $vanId)
            ->exists();

        return response()->json([
            'success' => true,
            'isFavorito' => $isFavorito
        ]);
    }
}
