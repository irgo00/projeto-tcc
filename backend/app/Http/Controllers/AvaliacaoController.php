<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use App\Models\Van;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AvaliacaoController extends Controller
{
    /**
     * Criar avaliação (apenas clientes)
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'cliente') {
            return response()->json([
                'success' => false,
                'message' => 'Apenas clientes podem avaliar vans.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'van_id' => 'required|exists:vans,id',
            'nota' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar se já avaliou
        $avaliacaoExistente = Avaliacao::where('usuario_id', auth()->id())
            ->where('van_id', $request->van_id)
            ->first();

        if ($avaliacaoExistente) {
            return response()->json([
                'success' => false,
                'message' => 'Você já avaliou esta van.'
            ], 422);
        }

        $avaliacao = Avaliacao::create([
            'usuario_id' => auth()->id(),
            'van_id' => $request->van_id,
            'nota' => $request->nota,
            'comentario' => $request->comentario,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avaliação criada com sucesso!',
            'avaliacao' => $avaliacao
        ], 201);
    }

    /**
     * Listar avaliações de uma van (público)
     */
    public function porVan($vanId)
    {
        $van = Van::find($vanId);

        if (!$van) {
            return response()->json([
                'success' => false,
                'message' => 'Van não encontrada.'
            ], 404);
        }

        $avaliacoes = Avaliacao::with('usuario:id,nome')
            ->where('van_id', $vanId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($avaliacao) {
                return [
                    'id' => $avaliacao->id,
                    'usuario' => $avaliacao->usuario->nome,
                    'nota' => $avaliacao->nota,
                    'comentario' => $avaliacao->comentario,
                    'data' => $avaliacao->created_at->format('d/m/Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'avaliacoes' => $avaliacoes
        ]);
    }

    /**
     * Minhas avaliações (clientes)
     */
    public function minhas()
    {
        $avaliacoes = Avaliacao::with('van:id,nome')
            ->where('usuario_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($avaliacao) {
                return [
                    'id' => $avaliacao->id,
                    'van' => $avaliacao->van->nome,
                    'nota' => $avaliacao->nota,
                    'comentario' => $avaliacao->comentario,
                    'data' => $avaliacao->created_at->format('d/m/Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'avaliacoes' => $avaliacoes
        ]);
    }
}
