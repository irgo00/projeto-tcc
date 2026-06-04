<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use App\Models\Rota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AvaliacaoController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->tipo !== 'cliente') {
            return response()->json(['success' => false, 'message' => 'Apenas clientes podem avaliar rotas.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'van_id'     => 'required|exists:rotas,id',
            'nota'       => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $existente = Avaliacao::where('usuario_id', auth()->id())
            ->where('rota_id', $request->van_id)
            ->first();

        if ($existente) {
            return response()->json(['success' => false, 'message' => 'Você já avaliou esta rota.'], 422);
        }

        $avaliacao = Avaliacao::create([
            'usuario_id' => auth()->id(),
            'rota_id'    => $request->van_id,
            'nota'       => $request->nota,
            'comentario' => $request->comentario,
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'Avaliação criada com sucesso!',
            'avaliacao' => $avaliacao,
        ], 201);
    }

    public function porVan($vanId)
    {
        $rota = Rota::find($vanId);

        if (!$rota) {
            return response()->json(['success' => false, 'message' => 'Rota não encontrada.'], 404);
        }

        $avaliacoes = Avaliacao::with('usuario:id,nome')
            ->where('rota_id', $vanId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($avaliacao) => [
                'id'         => $avaliacao->id,
                'usuario'    => $avaliacao->usuario->nome,
                'nota'       => $avaliacao->nota,
                'comentario' => $avaliacao->comentario,
                'data'       => $avaliacao->created_at->format('d/m/Y'),
            ]);

        return response()->json($avaliacoes);
    }

    public function recebidas()
    {
        $user = auth()->user();

        $rotaIds = Rota::where('prestador_id', $user->id)->pluck('id');

        $avaliacoes = Avaliacao::with(['usuario:id,nome', 'rota:id,nome'])
            ->whereIn('rota_id', $rotaIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($avaliacao) => [
                'id'         => $avaliacao->id,
                'usuario'    => $avaliacao->usuario->nome,
                'van'        => $avaliacao->rota->nome,
                'nota'       => $avaliacao->nota,
                'comentario' => $avaliacao->comentario,
                'data'       => $avaliacao->created_at->format('d/m/Y'),
            ]);

        return response()->json($avaliacoes);
    }

    public function minhas()
    {
        $avaliacoes = Avaliacao::with('rota:id,nome')
            ->where('usuario_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($avaliacao) => [
                'id'         => $avaliacao->id,
                'van'        => $avaliacao->rota->nome,
                'nota'       => $avaliacao->nota,
                'comentario' => $avaliacao->comentario,
                'data'       => $avaliacao->created_at->format('d/m/Y'),
            ]);

        return response()->json($avaliacoes);
    }
}
