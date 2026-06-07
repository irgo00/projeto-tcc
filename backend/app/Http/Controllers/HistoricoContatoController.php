<?php

namespace App\Http\Controllers;

use App\Models\HistoricoContato;
use Illuminate\Http\Request;

class HistoricoContatoController extends Controller
{
    public function registrar(Request $request)
    {
        $request->validate([
            'van_id'       => 'required|exists:rotas,id',
            'tipo_contato' => 'required|in:telefone,email,whatsapp',
        ]);

        $historico = HistoricoContato::registrar(
            auth()->id(),
            $request->van_id,
            $request->tipo_contato
        );

        return response()->json([
            'success'   => true,
            'message'   => 'Contato registrado!',
            'historico' => $historico,
        ], 201);
    }

    public function index()
    {
        $historico = HistoricoContato::with(['rota:id,instituicao,prestador_id', 'rota.prestador:id,nome,nome_fantasia'])
            ->where('usuario_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(fn($contato) => [
                'id'           => $contato->id,
                'van'          => ($contato->rota->prestador->nome_fantasia ?: $contato->rota->prestador->nome) . ' - ' . $contato->rota->instituicao,
                'prestador'    => $contato->rota->prestador->nome,
                'tipo_contato' => $contato->tipo_contato,
                'data'         => $contato->created_at->format('d/m/Y H:i'),
            ]);

        return response()->json(['success' => true, 'historico' => $historico]);
    }
}
