<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Van;
use App\Models\Avaliacao;
use App\Models\HistoricoContato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Dashboard do prestador
     */
    public function prestador()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json([
                'success' => false,
                'message' => 'Acesso negado.'
            ], 403);
        }

        $vans = Van::where('prestador_id', $user->id)->get();

        $totalRotas = $vans->count();
        $totalPassageiros = $vans->sum(function ($van) {
            return $van->vagas_totais - $van->vagas_disponiveis;
        });

        $avaliacaoMedia = 0;
        $totalAvaliacoes = 0;

        foreach ($vans as $van) {
            $totalAvaliacoes += $van->total_avaliacoes;
            $avaliacaoMedia += $van->avaliacao_media * $van->total_avaliacoes;
        }

        if ($totalAvaliacoes > 0) {
            $avaliacaoMedia = round($avaliacaoMedia / $totalAvaliacoes, 2);
        }

        $ocupacaoMedia = 0;
        if ($totalRotas > 0) {
            $ocupacaoTotal = $vans->sum(function ($van) {
                if ($van->vagas_totais == 0) return 0;
                return (($van->vagas_totais - $van->vagas_disponiveis) / $van->vagas_totais) * 100;
            });
            $ocupacaoMedia = round($ocupacaoTotal / $totalRotas);
        }

        return response()->json([
            'success' => true,
            'estatisticas' => [
                'total_rotas' => $totalRotas,
                'total_passageiros' => $totalPassageiros,
                'avaliacao_media' => $avaliacaoMedia,
                'ocupacao_media' => $ocupacaoMedia,
            ]
        ]);
    }

    /**
     * Dashboard do cliente
     */
    public function cliente()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'cliente') {
            return response()->json([
                'success' => false,
                'message' => 'Acesso negado.'
            ], 403);
        }

        $favoritos = $user->favoritos()->count();

        $historico = HistoricoContato::with(['van:id,nome', 'van.prestador:id,nome'])
            ->where('usuario_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($contato) {
                return [
                    'van' => $contato->van->nome,
                    'prestador' => $contato->van->prestador->nome,
                    'data' => $contato->created_at->format('d/m/Y'),
                    'tipo' => $contato->tipo_contato,
                ];
            });

        $avaliacoes = Avaliacao::with('van:id,nome')
            ->where('usuario_id', $user->id)
            ->count();

        return response()->json([
            'success' => true,
            'estatisticas' => [
                'total_favoritos' => $favoritos,
                'total_avaliacoes' => $avaliacoes,
                'historico' => $historico,
            ]
        ]);
    }
}
