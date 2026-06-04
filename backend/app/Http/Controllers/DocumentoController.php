<?php

namespace App\Http\Controllers;

use App\Models\DocumentoPrestador;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DocumentoController extends Controller
{
    public function meus()
    {
        $user = auth()->user();

        if (!$user->isPrestador()) {
            return response()->json(['success' => false, 'message' => 'Acesso negado.'], 403);
        }

        $documentos = $user->documentos()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($doc) => $this->formatDocumento($doc));

        $progresso = $user->progressoHabilitacao();

        return response()->json([
            'success'   => true,
            'documentos'=> $documentos,
            'progresso' => $progresso,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->isPrestador()) {
            return response()->json(['success' => false, 'message' => 'Apenas prestadores podem enviar documentos.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'tipo'   => 'required|in:cnh,crlv,antecedentes,laudo_tecnico,outros',
            'arquivo'=> 'required|file|mimes:pdf,jpeg,jpg,png,webp|max:10240',
        ], [
            'arquivo.mimes' => 'Formato inválido. Envie PDF, JPG, PNG ou WEBP.',
            'arquivo.max'   => 'O arquivo não pode ultrapassar 10 MB.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Se já existe um documento deste tipo pendente/em análise, bloqueia reenvio
        $existente = $user->documentos()
            ->where('tipo', $request->tipo)
            ->whereIn('status', ['pendente', 'aprovado'])
            ->first();

        if ($existente) {
            $status = $existente->status === 'aprovado' ? 'já aprovado' : 'já enviado e aguardando análise';
            return response()->json([
                'success' => false,
                'message' => "Este documento ({$request->tipo}) está {$status}.",
            ], 422);
        }

        $arquivo       = $request->file('arquivo');
        $nomeOriginal  = $arquivo->getClientOriginalName();
        $extensao      = $arquivo->getClientOriginalExtension();
        $nomeArquivo   = Str::uuid() . '.' . $extensao;
        $caminho       = $arquivo->storeAs('documentos-prestador', $nomeArquivo, 'public');

        $documento = DocumentoPrestador::create([
            'prestador_id' => $user->id,
            'tipo'         => $request->tipo,
            'nome_original'=> $nomeOriginal,
            'caminho'      => $caminho,
            'mime_type'    => $arquivo->getMimeType(),
            'tamanho'      => $arquivo->getSize(),
            'status'       => 'pendente',
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'Documento enviado com sucesso! Aguardando análise.',
            'documento' => $this->formatDocumento($documento),
        ], 201);
    }

    public function reenviar(Request $request, int $id)
    {
        $user = auth()->user();

        $documento = DocumentoPrestador::where('prestador_id', $user->id)->find($id);

        if (!$documento) {
            return response()->json(['success' => false, 'message' => 'Documento não encontrado.'], 404);
        }

        if ($documento->status !== 'correcao') {
            return response()->json([
                'success' => false,
                'message' => 'Apenas documentos com correção solicitada podem ser reenviados.',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'arquivo' => 'required|file|mimes:pdf,jpeg,jpg,png,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Remove arquivo anterior
        Storage::disk('public')->delete($documento->caminho);

        $arquivo = $request->file('arquivo');
        $nomeArquivo = Str::uuid() . '.' . $arquivo->getClientOriginalExtension();
        $caminho     = $arquivo->storeAs('documentos-prestador', $nomeArquivo, 'public');

        $documento->update([
            'nome_original'    => $arquivo->getClientOriginalName(),
            'caminho'          => $caminho,
            'mime_type'        => $arquivo->getMimeType(),
            'tamanho'          => $arquivo->getSize(),
            'status'           => 'pendente',
            'observacao_admin' => null,
            'revisado_por'     => null,
            'revisado_em'      => null,
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'Documento reenviado com sucesso! Aguardando nova análise.',
            'documento' => $this->formatDocumento($documento),
        ]);
    }

    public function porPrestador(int $prestadorId)
    {
        $this->autorizarAdmin();

        $prestador = User::find($prestadorId);
        if (!$prestador || !$prestador->isPrestador()) {
            return response()->json(['success' => false, 'message' => 'Prestador não encontrado.'], 404);
        }

        $documentos = DocumentoPrestador::where('prestador_id', $prestadorId)
            ->withTrashed()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($doc) => $this->formatDocumento($doc, true));

        return response()->json([
            'success'    => true,
            'prestador'  => [
                'id'    => $prestador->id,
                'nome'  => $prestador->nome,
                'email' => $prestador->email,
            ],
            'documentos' => $documentos,
            'progresso'  => $prestador->progressoHabilitacao(),
        ]);
    }

    public function indexAdmin(Request $request)
    {
        $this->autorizarAdmin();

        $query = DocumentoPrestador::with('prestador:id,nome,email')
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('prestador_id')) {
            $query->where('prestador_id', $request->prestador_id);
        }

        $documentos = $query->paginate(20)->through(fn($doc) => $this->formatDocumento($doc, true));

        return response()->json(['success' => true, 'documentos' => $documentos]);
    }

    public function aprovar(int $id)
    {
        $this->autorizarAdmin();

        $documento = DocumentoPrestador::with('prestador')->find($id);

        if (!$documento) {
            return response()->json(['success' => false, 'message' => 'Documento não encontrado.'], 404);
        }

        $documento->update([
            'status'           => 'aprovado',
            'observacao_admin' => null,
            'revisado_por'     => auth()->id(),
            'revisado_em'      => now(),
        ]);

        $documento->prestador->recalcularHabilitacao();

        return response()->json([
            'success'   => true,
            'message'   => 'Documento aprovado com sucesso!',
            'documento' => $this->formatDocumento($documento->fresh()),
        ]);
    }

    public function reprovar(Request $request, int $id)
    {
        $this->autorizarAdmin();

        $validator = Validator::make($request->all(), [
            'observacao' => 'required|string|max:1000',
        ], [
            'observacao.required' => 'O motivo da reprovação é obrigatório.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $documento = DocumentoPrestador::with('prestador')->find($id);

        if (!$documento) {
            return response()->json(['success' => false, 'message' => 'Documento não encontrado.'], 404);
        }

        $documento->update([
            'status'           => 'reprovado',
            'observacao_admin' => $request->observacao,
            'revisado_por'     => auth()->id(),
            'revisado_em'      => now(),
        ]);

        $documento->prestador->recalcularHabilitacao();

        return response()->json([
            'success'   => true,
            'message'   => 'Documento reprovado.',
            'documento' => $this->formatDocumento($documento->fresh()),
        ]);
    }

    public function solicitarCorrecao(Request $request, int $id)
    {
        $this->autorizarAdmin();

        $validator = Validator::make($request->all(), [
            'observacao' => 'required|string|max:1000',
        ], [
            'observacao.required' => 'Informe o que precisa ser corrigido.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $documento = DocumentoPrestador::find($id);

        if (!$documento) {
            return response()->json(['success' => false, 'message' => 'Documento não encontrado.'], 404);
        }

        $documento->update([
            'status'           => 'correcao',
            'observacao_admin' => $request->observacao,
            'revisado_por'     => auth()->id(),
            'revisado_em'      => now(),
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'Solicitação de correção enviada ao prestador.',
            'documento' => $this->formatDocumento($documento->fresh()),
        ]);
    }

    public function prestadoresAdmin(Request $request)
    {
        $this->autorizarAdmin();

        $query = User::where('tipo', 'prestador')
            ->withCount([
                'documentos',
                'documentos as docs_aprovados' => fn($q) => $q->where('status', 'aprovado'),
                'documentos as docs_pendentes'  => fn($q) => $q->where('status', 'pendente'),
                'documentos as docs_reprovados' => fn($q) => $q->where('status', 'reprovado'),
                'documentos as docs_correcao'   => fn($q) => $q->where('status', 'correcao'),
            ])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status_habilitacao')) {
            $query->where('status_habilitacao', $request->status_habilitacao);
        }

        $prestadores = $query->paginate(20)->through(fn($u) => [
            'id'                  => $u->id,
            'nome'                => $u->nome,
            'email'               => $u->email,
            'telefone'            => $u->telefone,
            'email_verificado'    => (bool) $u->email_verificado,
            'telefone_verificado' => (bool) $u->telefone_verificado,
            'status_habilitacao'  => $u->status_habilitacao,
            'documentos_total'    => $u->documentos_count,
            'docs_aprovados'      => $u->docs_aprovados,
            'docs_pendentes'      => $u->docs_pendentes,
            'docs_reprovados'     => $u->docs_reprovados,
            'docs_correcao'       => $u->docs_correcao,
            'cadastrado_em'       => $u->created_at->format('d/m/Y'),
        ]);

        return response()->json(['success' => true, 'prestadores' => $prestadores]);
    }

    public function stats()
    {
        $this->autorizarAdmin();

        return response()->json([
            'success' => true,
            'stats'   => [
                'total_prestadores'   => User::where('tipo', 'prestador')->count(),
                'prestadores_habilitados' => User::where('tipo', 'prestador')
                                               ->where('status_habilitacao', 'habilitado')->count(),
                'docs_pendentes'      => DocumentoPrestador::where('status', 'pendente')->count(),
                'docs_aprovados'      => DocumentoPrestador::where('status', 'aprovado')->count(),
                'docs_reprovados'     => DocumentoPrestador::where('status', 'reprovado')->count(),
                'docs_correcao'       => DocumentoPrestador::where('status', 'correcao')->count(),
            ],
        ]);
    }

    private function autorizarAdmin(): void
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            abort(403, 'Acesso exclusivo para administradores.');
        }
    }

    private function formatDocumento(DocumentoPrestador $doc, bool $comPrestador = false): array
    {
        $data = [
            'id'                => $doc->id,
            'tipo'              => $doc->tipo,
            'tipo_label'        => DocumentoPrestador::tipoLabel($doc->tipo),
            'nome_original'     => $doc->nome_original,
            'url'               => $doc->url,
            'tamanho_formatado' => $doc->tamanho_formatado,
            'status'            => $doc->status,
            'status_label'      => DocumentoPrestador::statusLabel($doc->status),
            'observacao_admin'  => $doc->observacao_admin,
            'revisado_em'       => $doc->revisado_em?->format('d/m/Y H:i'),
            'enviado_em'        => $doc->created_at->format('d/m/Y H:i'),
        ];

        if ($comPrestador && $doc->relationLoaded('prestador')) {
            $data['prestador'] = [
                'id'    => $doc->prestador->id,
                'nome'  => $doc->prestador->nome,
                'email' => $doc->prestador->email,
            ];
        }

        return $data;
    }
}
