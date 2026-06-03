<?php

namespace App\Http\Controllers;

use App\Models\Rota;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VanController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // HELPER INTERNO
    // ─────────────────────────────────────────────────────────────────────────

    private function formatRota(Rota $rota, bool $incluirValor = false): array
    {
        $rota->loadMissing(['prestador', 'van.fotos']);

        $fotoPrincipalUrl = optional($rota->van)->foto_principal_url;

        $data = [
            'id'              => $rota->id,
            'nome'            => $rota->nome,
            'prestador'       => optional($rota->prestador)->nome,
            'origem'          => $rota->origem,
            'destino'         => $rota->destino,
            'instituicao'     => $rota->instituicao,
            'rota'            => $rota->rota,
            'horario'         => $rota->horario_formatado,
            'vagas'           => $rota->vagas_disponiveis,
            'avaliacao'       => $rota->avaliacao_media,
            'totalAvaliacoes' => $rota->total_avaliacoes,
            'telefone'        => $rota->telefone ?? optional($rota->prestador)->telefone,
            'email'           => $rota->email    ?? optional($rota->prestador)->email,
            'van'             => $rota->van ? [
                'id'               => $rota->van->id,
                'modelo'           => $rota->van->modelo,
                'marca'            => $rota->van->marca,
                'placa'            => $rota->van->placa,
                'ano'              => $rota->van->ano,
                'cor'              => $rota->van->cor,
                'ar_condicionado'  => (bool) $rota->van->ar_condicionado,
                'camera_interna'   => (bool) $rota->van->camera_interna,
                'porta_automatica' => (bool) $rota->van->porta_automatica,
                'wifi'             => (bool) $rota->van->wifi,
                'acessibilidade'   => (bool) $rota->van->acessibilidade,
                'usb_carregador'   => (bool) $rota->van->usb_carregador,
                'outros_itens'     => $rota->van->outros_itens,
                'fotos'            => $rota->van->fotos->map(fn($f) => [
                    'id'        => $f->id,
                    'url'       => $f->url,
                    'principal' => (bool) $f->principal,
                    'ordem'     => $f->ordem,
                ])->values(),
            ] : null,
            'foto_principal_url' => $fotoPrincipalUrl,
        ];

        if ($incluirValor) {
            $data['valor_mensal']       = $rota->valor_mensal;
            $data['ativa']              = (bool) $rota->ativa;
            $data['vagas_totais']       = $rota->vagas_totais;
            $data['vagas_disponiveis']  = $rota->vagas_disponiveis;
            $data['horario_manha']      = $rota->horario_manha;
            $data['horario_tarde']      = $rota->horario_tarde;
            $data['horario_noite']      = $rota->horario_noite;
            $data['van_id']             = $rota->van_id;
            $data['criadoEm']           = $rota->created_at->format('d/m/Y');
        }

        return $data;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROTAS PÚBLICAS
    // ─────────────────────────────────────────────────────────────────────────

    /** GET /api/vans — lista todas as rotas ativas */
    public function index()
    {
        $rotas = Rota::with(['prestador:id,nome,telefone,email', 'van.fotos'])
            ->ativas()
            ->get()
            ->map(fn($rota) => $this->formatRota($rota));

        return response()->json(['success' => true, 'vans' => $rotas]);
    }

    /** POST /api/vans/buscar — busca com filtros */
    public function buscar(Request $request)
    {
        $query = Rota::with(['prestador:id,nome,telefone,email', 'van.fotos'])->ativas();

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

        $rotas = $query->get()->map(fn($rota) => $this->formatRota($rota));

        return response()->json(['success' => true, 'vans' => $rotas]);
    }

    /** GET /api/vans/{id} — detalhe de uma rota */
    public function show($id)
    {
        // Segurança extra: se por algum motivo de roteamento chegar 'minhas' aqui, rejeita.
        if (!is_numeric($id)) {
            return response()->json(['success' => false, 'message' => 'ID inválido.'], 400);
        }

        $rota = Rota::with(['prestador:id,nome,telefone,email', 'van.fotos'])->find($id);

        if (!$rota) {
            return response()->json(['success' => false, 'message' => 'Rota não encontrada.'], 404);
        }

        return response()->json(['success' => true, 'van' => $this->formatRota($rota, true)]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROTAS AUTENTICADAS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/vans/minhas — rotas do prestador autenticado.
     *
     * IMPORTANTE: esta rota DEVE ser declarada em api.php ANTES de /vans/{id}.
     * Se vier depois, o Laravel captura "minhas" como {id} e cai no show() → 404.
     */
    public function minhas()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json([
                'success' => false,
                'message' => 'Apenas prestadores têm acesso a esta funcionalidade.',
            ], 403);
        }

        $rotas = Rota::with('van.fotos')
            ->where('prestador_id', $user->id)
            ->withTrashed()   // inclui soft-deleted para o prestador ver rotas inativas
            ->whereNull('deleted_at')  // mas exclui as realmente deletadas
            ->get()
            ->map(function (Rota $rota) {
                return [
                    'id'                 => $rota->id,
                    'nome'               => $rota->nome,
                    'origem'             => $rota->origem,
                    'destino'            => $rota->destino,
                    'instituicao'        => $rota->instituicao,
                    'rota'               => $rota->rota,
                    'horario'            => $rota->horario_formatado,
                    'horario_manha'      => $rota->horario_manha,
                    'horario_tarde'      => $rota->horario_tarde,
                    'horario_noite'      => $rota->horario_noite,
                    'vagas_totais'       => $rota->vagas_totais,
                    'vagas_disponiveis'  => $rota->vagas_disponiveis,
                    'valor_mensal'       => $rota->valor_mensal,
                    'telefone'           => $rota->telefone,
                    'email'              => $rota->email,
                    'avaliacao'          => $rota->avaliacao_media,
                    'totalAvaliacoes'    => $rota->total_avaliacoes,
                    'ativa'              => (bool) $rota->ativa,
                    'van_id'             => $rota->van_id,
                    'van'                => $rota->van ? [
                        'id'     => $rota->van->id,
                        'modelo' => $rota->van->modelo,
                        'marca'  => $rota->van->marca,
                        'placa'  => $rota->van->placa,
                    ] : null,
                    'foto_principal_url' => optional($rota->van)->foto_principal_url,
                    'criadoEm'           => $rota->created_at->format('d/m/Y'),
                ];
            });

        return response()->json(['success' => true, 'vans' => $rotas]);
    }

    /** POST /api/vans — cria nova rota */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json(['success' => false, 'message' => 'Apenas prestadores podem criar rotas.'], 403);
        }

        // Bloqueia criação se conta não estiver habilitada
        // (descomente quando a lógica de habilitação estiver ativa)
        if (!$user->podecriarRotas()) {
            return response()->json([
                'success' => false,
                'message' => 'Sua conta precisa ser habilitada antes de criar rotas. '
                        . 'Envie os documentos obrigatórios e aguarde a aprovação.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome'                    => 'required|string|max:255',
            'origem'                  => 'required|string|max:255',
            'destino'                 => 'required|string|max:255',
            'instituicao'             => 'required|string|max:255',
            'rota'                    => 'required|string|max:500',
            'van_id'                  => 'nullable|exists:vans,id',
            'horario_manha'           => 'nullable|date_format:H:i',
            'horario_tarde'           => 'nullable|date_format:H:i',
            'horario_noite'           => 'nullable|date_format:H:i',
            'vagas_totais'            => 'required|integer|min:1',
            'valor_mensal'            => 'nullable|numeric|min:0',
            'telefone'                => 'nullable|string|max:20',
            'email'                   => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Valida que van_id pertence ao prestador autenticado
        if ($request->filled('van_id')) {
            $vanDoUser = \App\Models\Van::where('id', $request->van_id)
                ->where('prestador_id', $user->id)
                ->exists();
            if (!$vanDoUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Van não encontrada ou não pertence a você.',
                ], 422);
            }
        }

        $rota = Rota::create([
            'prestador_id'      => $user->id,
            'van_id'            => $request->van_id,
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

        $rota->load(['van.fotos']);

        return response()->json([
            'success' => true,
            'message' => 'Rota criada com sucesso!',
            'van'     => $this->formatRota($rota, true),
        ], 201);
    }

    /** PUT /api/vans/{id} — atualiza uma rota */
    public function update(Request $request, $id)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $rota = Rota::find($id);

        if (!$rota) {
            return response()->json(['success' => false, 'message' => 'Rota não encontrada.'], 404);
        }
        if ($rota->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Você não tem permissão para editar esta rota.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome'              => 'sometimes|string|max:255',
            'origem'            => 'sometimes|string|max:255',
            'destino'           => 'sometimes|string|max:255',
            'instituicao'       => 'sometimes|string|max:255',
            'rota'              => 'sometimes|string|max:500',
            'van_id'            => 'nullable|exists:vans,id',
            'horario_manha'     => 'nullable|date_format:H:i',
            'horario_tarde'     => 'nullable|date_format:H:i',
            'horario_noite'     => 'nullable|date_format:H:i',
            'vagas_disponiveis' => 'sometimes|integer|min:0',
            'valor_mensal'      => 'sometimes|numeric|min:0',
            'telefone'          => 'sometimes|string|max:20',
            'email'             => 'sometimes|email',
            'ativa'             => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->filled('van_id')) {
            $vanDoUser = \App\Models\Van::where('id', $request->van_id)
                ->where('prestador_id', $user->id)
                ->exists();
            if (!$vanDoUser) {
                return response()->json(['success' => false, 'message' => 'Van não encontrada ou não pertence a você.'], 422);
            }
        }

        $rota->update($request->all());
        $rota->load(['prestador:id,nome,telefone,email', 'van.fotos']);

        return response()->json([
            'success' => true,
            'message' => 'Rota atualizada com sucesso!',
            'van'     => $this->formatRota($rota, true),
        ]);
    }

    /** DELETE /api/vans/{id} — remove uma rota (soft delete) */
    public function destroy($id)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $rota = Rota::find($id);

        if (!$rota) {
            return response()->json(['success' => false, 'message' => 'Rota não encontrada.'], 404);
        }
        if ($rota->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Você não tem permissão para deletar esta rota.'], 403);
        }

        $rota->delete();

        return response()->json(['success' => true, 'message' => 'Rota deletada com sucesso!']);
    }
}
