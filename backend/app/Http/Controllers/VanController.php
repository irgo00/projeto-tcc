<?php

namespace App\Http\Controllers;

use App\Models\Van;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class VanController extends Controller
{
    /**
     * Listar todas as vans (público)
     */
    public function index()
    {
        $vans = Van::with('prestador:id,nome,telefone,email')
            ->ativas()
            ->get()
            ->map(function ($van) {
                return [
                    'id' => $van->id,
                    'nome' => $van->nome,
                    'prestador' => optional($van->prestador)->nome,
                    'origem' => $van->origem,
                    'destino' => $van->destino,
                    'instituicao' => $van->instituicao,
                    'rota' => $van->rota,
                    'coordenadas' => $van->coordenadas,
                    'horario' => $van->horario_formatado,
                    'vagas' => $van->vagas_disponiveis,
                    'avaliacao' => $van->avaliacao_media,
                    'totalAvaliacoes' => $van->total_avaliacoes,
                    'telefone'  => $van->telefone ?? optional($van->prestador)->telefone,
                    'email' => $van->email ?? optional($van->prestador)->email,
                ];
            });

        return response()->json([
            'success' => true,
            'vans' => $vans
        ]);
    }

    /**
     * Buscar vans com filtros (público)
     */
    public function buscar(Request $request)
    {
        $query = Van::with('prestador:id,nome,telefone,email')->ativas();

        if ($request->has('origem') && $request->origem) {
            $query->where('origem', 'like', '%' . $request->origem . '%');
        }

        if ($request->has('instituicao') && $request->instituicao) {
            $query->where('instituicao', 'like', '%' . $request->instituicao . '%');
        }

        if ($request->has('periodo') && $request->periodo) {
            $periodo = strtolower($request->periodo);
            if (in_array($periodo, ['manha', 'tarde', 'noite'])) {
                $query->whereNotNull("horario_{$periodo}");
            }
        }

        $vans = $query->get()->map(function ($van) {
            return [
                'id' => $van->id,
                'nome' => $van->nome,
                'prestador' => optional($van->prestador)->nome,
                'origem' => $van->origem,
                'destino' => $van->destino,
                'instituicao' => $van->instituicao,
                'rota' => $van->rota,
                'coordenadas' => $van->coordenadas,
                'horario' => $van->horario_formatado,
                'vagas' => $van->vagas_disponiveis,
                'avaliacao' => $van->avaliacao_media,
                'totalAvaliacoes' => $van->total_avaliacoes,
                'telefone'  => $van->telefone ?? optional($van->prestador)->telefone,
                'email' => $van->email ?? optional($van->prestador)->email,
            ];
        });

        return response()->json([
            'success' => true,
            'vans' => $vans
        ]);
    }

    /**
     * Detalhes de uma van (público)
     */
    public function show($id)
    {
        $van = Van::with('prestador:id,nome,telefone,email')->find($id);

        if (!$van) {
            return response()->json([
                'success' => false,
                'message' => 'Van não encontrada.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'van' => [
                'id' => $van->id,
                'nome' => $van->nome,
                'prestador' => optional($van->prestador)->nome,
                'origem' => $van->origem,
                'destino' => $van->destino,
                'instituicao' => $van->instituicao,
                'rota' => $van->rota,
                'coordenadas' => $van->coordenadas,
                'horario' => $van->horario_formatado,
                'vagas' => $van->vagas_disponiveis,
                'valor_mensal' => $van->valor_mensal,
                'avaliacao' => $van->avaliacao_media,
                'totalAvaliacoes' => $van->total_avaliacoes,
                'telefone'  => $van->telefone ?? optional($van->prestador)->telefone,
                'email' => $van->email ?? optional($van->prestador)->email,
            ]
        ]);
    }

    /**
     * Criar van (apenas prestadores)
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json([
                'success' => false,
                'message' => 'Apenas prestadores podem criar vans.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'origem' => 'required|string|max:255',
            'destino' => 'required|string|max:255',
            'instituicao' => 'required|string|max:255',
            'rota' => 'required|string|max:500',
            'coordenadas' => 'nullable|array',
            'horario_manha' => 'nullable|date_format:H:i',
            'horario_tarde' => 'nullable|date_format:H:i',
            'horario_noite' => 'nullable|date_format:H:i',
            'vagas_totais' => 'required|integer|min:1',
            'valor_mensal' => 'nullable|numeric|min:0',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $van = Van::create([
            'prestador_id' => auth()->id(),
            'nome' => $request->nome,
            'origem' => $request->origem,
            'destino' => $request->destino,
            'instituicao' => $request->instituicao,
            'rota' => $request->rota,
            'coordenadas' => $request->coordenadas,
            'horario_manha' => $request->horario_manha,
            'horario_tarde' => $request->horario_tarde,
            'horario_noite' => $request->horario_noite,
            'vagas_totais' => $request->vagas_totais,
            'vagas_disponiveis' => $request->vagas_totais,
            'valor_mensal' => $request->valor_mensal,
            'telefone' => $request->telefone,
            'email' => $request->email,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Van criada com sucesso!',
            'van' => $van
        ], 201);
    }

    /**
     * Atualizar van (apenas prestador dono)
     */
    public function update(Request $request, $id)
    {
        $van = Van::find($id);

        if (!$van) {
            return response()->json([
                'success' => false,
                'message' => 'Van não encontrada.'
            ], 404);
        }

        if ($van->prestador_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Você não tem permissão para editar esta van.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|string|max:255',
            'origem' => 'sometimes|string|max:255',
            'destino' => 'sometimes|string|max:255',
            'instituicao' => 'sometimes|string|max:255',
            'rota' => 'sometimes|string|max:500',
            'coordenadas' => 'sometimes|array',
            'horario_manha' => 'nullable|date_format:H:i',
            'horario_tarde' => 'nullable|date_format:H:i',
            'horario_noite' => 'nullable|date_format:H:i',
            'vagas_disponiveis' => 'sometimes|integer|min:0',
            'valor_mensal' => 'sometimes|numeric|min:0',
            'telefone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email',
            'ativa' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $vagasAnteriores = $van->vagas_disponiveis;

        $van->update($request->all());

        // Se as vagas aumentaram, notificar favoritos
        if ($request->has('vagas_disponiveis') && $request->vagas_disponiveis > $vagasAnteriores) {
            $van->notificarFavoritos();
        }

        return response()->json([
            'success' => true,
            'message' => 'Van atualizada com sucesso!',
            'van' => $van
        ]);
    }

    /**
     * Deletar van (apenas prestador dono)
     */
    public function destroy($id)
    {
        $van = Van::find($id);

        if (!$van) {
            return response()->json([
                'success' => false,
                'message' => 'Van não encontrada.'
            ], 404);
        }

        if ($van->prestador_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Você não tem permissão para deletar esta van.'
            ], 403);
        }

        $van->delete();

        return response()->json([
            'success' => true,
            'message' => 'Van deletada com sucesso!'
        ]);
    }

    /**
     * Minhas vans (apenas prestadores)
     */
    public function minhas()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json([
                'success' => false,
                'message' => 'Apenas prestadores têm acesso a esta funcionalidade.'
            ], 403);
        }

        $vans = Van::where('prestador_id', auth()->id())
            ->withTrashed()
            ->get()
            ->map(function ($van) {
                return [
                    'id' => $van->id,
                    'nome' => $van->nome,
                    'rota' => $van->rota,
                    'horario' => $van->horario_formatado,
                    'vagas_totais' => $van->vagas_totais,
                    'vagas_disponiveis' => $van->vagas_disponiveis,
                    'avaliacao' => $van->avaliacao_media,
                    'total_avaliacoes' => $van->total_avaliacoes,
                    'ativa' => $van->ativa && !$van->deleted_at,
                    'created_at' => $van->created_at->format('d/m/Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'vans' => $vans
        ]);
    }
}
