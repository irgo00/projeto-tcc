<?php

namespace App\Http\Controllers;

use App\Models\Rota;
use App\Models\Avaliacao;
use App\Models\HistoricoContato;

class DashboardController extends Controller
{
    public function prestador()
    {
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json(['success' => false, 'message' => 'Acesso negado.'], 403);
        }

        $rotas = Rota::where('prestador_id', $user->id)->get();

        $totalRotas       = $rotas->count();
        $totalPassageiros = $rotas->sum(fn($r) => $r->vagas_totais - $r->vagas_disponiveis);

        $avaliacaoMedia  = 0;
        $totalAvaliacoes = 0;

        foreach ($rotas as $rota) {
            $totalAvaliacoes += $rota->total_avaliacoes;
            $avaliacaoMedia  += $rota->avaliacao_media * $rota->total_avaliacoes;
        }

        if ($totalAvaliacoes > 0) {
            $avaliacaoMedia = round($avaliacaoMedia / $totalAvaliacoes, 2);
        }

        $ocupacaoMedia = 0;
        if ($totalRotas > 0) {
            $ocupacaoTotal = $rotas->sum(function ($rota) {
                if ($rota->vagas_totais == 0) return 0;
                return (($rota->vagas_totais - $rota->vagas_disponiveis) / $rota->vagas_totais) * 100;
            });
            $ocupacaoMedia = round($ocupacaoTotal / $totalRotas);
        }

        $totalVans = $user->vans()->count();

        return response()->json([
            'success' => true,
            'estatisticas' => [
                'total_rotas'       => $totalRotas,
                'total_passageiros' => $totalPassageiros,
                'avaliacao_media'   => $avaliacaoMedia,
                'ocupacao_media'    => $ocupacaoMedia,
                'total_vans'        => $totalVans,
            ],
        ]);
    }

    public function cliente()
    {
        $user = auth()->user();

        if ($user->tipo !== 'cliente') {
            return response()->json(['success' => false, 'message' => 'Acesso negado.'], 403);
        }

        $favoritos = $user->favoritos()->count();

        $historico = HistoricoContato::with(['rota:id,nome,prestador_id', 'rota.prestador:id,nome'])
            ->where('usuario_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn($contato) => [
                'van'       => $contato->rota->nome,
                'prestador' => $contato->rota->prestador->nome,
                'data'      => $contato->created_at->format('d/m/Y'),
                'tipo'      => $contato->tipo_contato,
            ]);

        $avaliacoes = Avaliacao::where('usuario_id', $user->id)->count();

        return response()->json([
            'success' => true,
            'estatisticas' => [
                'total_favoritos'  => $favoritos,
                'total_avaliacoes' => $avaliacoes,
                'historico'        => $historico,
            ],
        ]);
    }
}
