<?php

namespace App\Http\Controllers;

use App\Models\Van;
use App\Models\Coordenada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VanController extends Controller
{
    private function formatVan(Van $van, bool $incluirValor = false): array
    {
        $data = [
            'id'             => $van->id,
            'nome'           => $van->nome,
            'prestador'      => optional($van->prestador)->nome,
            'origem'         => $van->origem,
            'destino'        => $van->destino,
            'instituicao'    => $van->instituicao,
            'rota'           => $van->rota,
            'coordenadas'    => $van->coordenadas->map(fn($c) => [
                'nome'      => $c->nome,
                'latitude'  => $c->latitude,
                'longitude' => $c->longitude,
                'ordem'     => $c->ordem,
            ])->values(),
            'horario'        => $van->horario_formatado,
            'vagas'          => $van->vagas_disponiveis,
            'avaliacao'      => $van->avaliacao_media,
            'totalAvaliacoes' => $van->total_avaliacoes,
            'telefone'       => $van->telefone ?? optional($van->prestador)->telefone,
            'email'          => $van->email ?? optional($van->prestador)->email,
        ];

        if ($incluirValor) {
            $data['valor_mensal'] = $van->valor_mensal;
        }

        return $data;
    }

    /**
     * Listar todas as vans (público)
     */
    public function index()
    {
        $vans = Van::with(['prestador:id,nome,telefone,email', 'coordenadas'])
            ->ativas()
            ->get()
            ->map(fn($van) => $this->formatVan($van));

        return response()->json(['success' => true, 'vans' => $vans]);
    }

    /**
     * Buscar vans com filtros (público)
     */
    public function buscar(Request $request)
    {
        $query = Van::with(['prestador:id,nome,telefone,email', 'coordenadas'])->ativas();

        if ($request->filled('origem')) {
            $query->where('origem', 'like', '%' . $request->origem . '%');
        }

        if ($request->filled('instituicao')) {
            $query->where('instituicao', 'like', '%' . $request->instituicao . '%');
        }

        if ($request->filled('periodo')) {
            $periodo = strtolower($request->periodo);
            if (in_array($periodo, ['manha', 'tarde', 'noite'])) {
                $query->whereNotNull("horario_{$periodo}");
            }
        }

        $vans = $query->get()->map(fn($van) => $this->formatVan($van));

        return response()->json(['success' => true, 'vans' => $vans]);
    }

    /**
     * Detalhes de uma van (público)
     */
    public function show($id)
    {
        $van = Van::with(['prestador:id,nome,telefone,email', 'coordenadas'])->find($id);

        if (!$van) {
            return response()->json(['success' => false, 'message' => 'Van não encontrada.'], 404);
        }

        return response()->json(['success' => true, 'van' => $this->formatVan($van, true)]);
    }

    /**
     * Criar van (apenas prestadores)
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json(['success' => false, 'message' => 'Apenas prestadores podem criar vans.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome'           => 'required|string|max:255',
            'origem'         => 'required|string|max:255',
            'destino'        => 'required|string|max:255',
            'instituicao'    => 'required|string|max:255',
            'rota'           => 'required|string|max:500',
            'coordenadas'    => 'nullable|array',
            'coordenadas.*.nome'      => 'required_with:coordenadas|string',
            'coordenadas.*.latitude'  => 'required_with:coordenadas|numeric',
            'coordenadas.*.longitude' => 'required_with:coordenadas|numeric',
            'coordenadas.*.ordem'     => 'nullable|integer|min:0',
            'horario_manha'  => 'nullable|date_format:H:i',
            'horario_tarde'  => 'nullable|date_format:H:i',
            'horario_noite'  => 'nullable|date_format:H:i',
            'vagas_totais'   => 'required|integer|min:1',
            'valor_mensal'   => 'nullable|numeric|min:0',
            'telefone'       => 'nullable|string|max:20',
            'email'          => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $van = Van::create([
            'prestador_id'      => auth()->id(),
            'nome'              => $request->nome,
            'origem'            => $request->origem,
            'destino'           => $request->destino,
            'instituicao'       => $request->instituicao,
            'rota'              => $request->rota,
            'horario_manha'     => $request->horario_manha,
            'horario_tarde'     => $request->horario_tarde,
            'horario_noite'     => $request->horario_noite,
            'vagas_totais'      => $request->vagas_totais,
            'vagas_disponiveis' => $request->vagas_totais,
            'valor_mensal'      => $request->valor_mensal,
            'telefone'          => $request->telefone,
            'email'             => $request->email,
        ]);

        if ($request->filled('coordenadas')) {
            foreach ($request->coordenadas as $index => $coord) {
                $van->coordenadas()->create([
                    'nome'      => $coord['nome'],
                    'latitude'  => $coord['latitude'],
                    'longitude' => $coord['longitude'],
                    'ordem'     => $coord['ordem'] ?? $index,
                ]);
            }
        }

        $van->load('coordenadas');

        return response()->json([
            'success' => true,
            'message' => 'Van criada com sucesso!',
            'van'     => $this->formatVan($van, true),
        ], 201);
    }

    /**
     * Atualizar van (apenas prestador dono)
     */
    public function update(Request $request, $id)
    {
        $van = Van::find($id);

        if (!$van) {
            return response()->json(['success' => false, 'message' => 'Van não encontrada.'], 404);
        }

        if ($van->prestador_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Você não tem permissão para editar esta van.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome'           => 'sometimes|string|max:255',
            'origem'         => 'sometimes|string|max:255',
            'destino'        => 'sometimes|string|max:255',
            'instituicao'    => 'sometimes|string|max:255',
            'rota'           => 'sometimes|string|max:500',
            'coordenadas'    => 'sometimes|array',
            'coordenadas.*.nome'      => 'required_with:coordenadas|string',
            'coordenadas.*.latitude'  => 'required_with:coordenadas|numeric',
            'coordenadas.*.longitude' => 'required_with:coordenadas|numeric',
            'coordenadas.*.ordem'     => 'nullable|integer|min:0',
            'horario_manha'  => 'nullable|date_format:H:i',
            'horario_tarde'  => 'nullable|date_format:H:i',
            'horario_noite'  => 'nullable|date_format:H:i',
            'vagas_disponiveis' => 'sometimes|integer|min:0',
            'valor_mensal'   => 'sometimes|numeric|min:0',
            'telefone'       => 'sometimes|string|max:20',
            'email'          => 'sometimes|email',
            'ativa'          => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $van->update($request->except('coordenadas'));

        if ($request->has('coordenadas')) {
            $van->coordenadas()->delete();
            foreach ($request->coordenadas as $index => $coord) {
                $van->coordenadas()->create([
                    'nome'      => $coord['nome'],
                    'latitude'  => $coord['latitude'],
                    'longitude' => $coord['longitude'],
                    'ordem'     => $coord['ordem'] ?? $index,
                ]);
            }
        }

        $van->load(['prestador:id,nome,telefone,email', 'coordenadas']);

        return response()->json([
            'success' => true,
            'message' => 'Van atualizada com sucesso!',
            'van'     => $this->formatVan($van, true),
        ]);
    }

    /**
     * Deletar van (apenas prestador dono)
     */
    public function destroy($id)
    {
        $van = Van::find($id);

        if (!$van) {
            return response()->json(['success' => false, 'message' => 'Van não encontrada.'], 404);
        }

        if ($van->prestador_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Você não tem permissão para deletar esta van.'], 403);
        }

        $van->delete();

        return response()->json(['success' => true, 'message' => 'Van deletada com sucesso!']);
    }

    /**
     * Minhas vans (apenas prestadores)
     */
    public function minhas()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json(['success' => false, 'message' => 'Apenas prestadores têm acesso a esta funcionalidade.'], 403);
        }

        $vans = Van::where('prestador_id', auth()->id())
            ->withTrashed()
            ->get()
            ->map(function ($van) {
                return [
                    'id'               => $van->id,
                    'nome'             => $van->nome,
                    'rota'             => $van->rota,
                    'horario'          => $van->horario_formatado,
                    'vagas_totais'     => $van->vagas_totais,
                    'vagas_disponiveis' => $van->vagas_disponiveis,
                    'avaliacao'        => $van->avaliacao_media,
                    'total_avaliacoes' => $van->total_avaliacoes,
                    'ativa'            => $van->ativa && !$van->deleted_at,
                    'created_at'       => $van->created_at->format('d/m/Y'),
                ];
            });

        return response()->json(['success' => true, 'vans' => $vans]);
    }
}
