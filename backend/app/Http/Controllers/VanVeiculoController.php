<?php

namespace App\Http\Controllers;

use App\Models\Van;
use App\Models\VanFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class VanVeiculoController extends Controller
{
    private function formatVan(Van $van): array
    {
        $van->loadMissing('fotos');

        return [
            'id'               => $van->id,
            'prestador_id'     => $van->prestador_id,
            'modelo'           => $van->modelo,
            'marca'            => $van->marca,
            'placa'            => $van->placa,
            'ano'              => $van->ano,
            'cor'              => $van->cor,
            'descricao'        => $van->descricao,
            'ar_condicionado'  => (bool) $van->ar_condicionado,
            'camera_interna'   => (bool) $van->camera_interna,
            'porta_automatica' => (bool) $van->porta_automatica,
            'wifi'             => (bool) $van->wifi,
            'acessibilidade'   => (bool) $van->acessibilidade,
            'usb_carregador'   => (bool) $van->usb_carregador,
            'outros_itens'     => $van->outros_itens,
            'fotos'            => $van->fotos->map(fn($f) => [
                'id'        => $f->id,
                'url'       => $f->url,
                'principal' => (bool) $f->principal,
                'ordem'     => $f->ordem,
            ])->values(),
            'foto_principal_url' => $van->foto_principal_url,
            'total_rotas'      => $van->rotas()->count(),
            'criadoEm'         => $van->created_at->format('d/m/Y'),
        ];
    }

    public function minhas()
    {
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json(['success' => false, 'message' => 'Apenas prestadores têm acesso a esta funcionalidade.'], 403);
        }

        $vans = Van::with('fotos')
            ->where('prestador_id', $user->id)
            ->get()
            ->map(fn($van) => $this->formatVan($van));

        return response()->json(['success' => true, 'vans' => $vans]);
    }

    public function show($id)
    {
        $user = auth()->user();

        $van = Van::with('fotos')->find($id);

        if (!$van) {
            return response()->json(['success' => false, 'message' => 'Van não encontrada.'], 404);
        }

        if ($van->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Acesso negado.'], 403);
        }

        return response()->json(['success' => true, 'van' => $this->formatVan($van)]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->tipo !== 'prestador') {
            return response()->json(['success' => false, 'message' => 'Apenas prestadores podem cadastrar vans.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'modelo'           => 'required|string|max:100',
            'marca'            => 'required|string|max:100',
            'placa'            => ['required', 'string', 'max:10', 'unique:vans,placa', 'regex:/^[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}$/'],
            'ano'              => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'cor'              => 'required|string|max:50',
            'descricao'        => 'nullable|string',
            'ar_condicionado'  => 'nullable|boolean',
            'camera_interna'   => 'nullable|boolean',
            'porta_automatica' => 'nullable|boolean',
            'wifi'             => 'nullable|boolean',
            'acessibilidade'   => 'nullable|boolean',
            'usb_carregador'   => 'nullable|boolean',
            'outros_itens'     => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $van = Van::create([
            'prestador_id'     => $user->id,
            'modelo'           => $request->modelo,
            'marca'            => $request->marca,
            'placa'            => strtoupper($request->placa),
            'ano'              => $request->ano,
            'cor'              => $request->cor,
            'descricao'        => $request->descricao,
            'ar_condicionado'  => $request->boolean('ar_condicionado'),
            'camera_interna'   => $request->boolean('camera_interna'),
            'porta_automatica' => $request->boolean('porta_automatica'),
            'wifi'             => $request->boolean('wifi'),
            'acessibilidade'   => $request->boolean('acessibilidade'),
            'usb_carregador'   => $request->boolean('usb_carregador'),
            'outros_itens'     => $request->outros_itens,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Van cadastrada com sucesso!',
            'van'     => $this->formatVan($van),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();

        $van = Van::find($id);

        if (!$van) {
            return response()->json(['success' => false, 'message' => 'Van não encontrada.'], 404);
        }

        if ($van->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Você não tem permissão para editar esta van.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'modelo'           => 'sometimes|string|max:100',
            'marca'            => 'sometimes|string|max:100',
            'placa'            => ['sometimes', 'string', 'max:10', 'unique:vans,placa,' . $van->id, 'regex:/^[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}$/'],
            'ano'              => 'sometimes|integer|min:1990|max:' . (date('Y') + 1),
            'cor'              => 'sometimes|string|max:50',
            'descricao'        => 'nullable|string',
            'ar_condicionado'  => 'nullable|boolean',
            'camera_interna'   => 'nullable|boolean',
            'porta_automatica' => 'nullable|boolean',
            'wifi'             => 'nullable|boolean',
            'acessibilidade'   => 'nullable|boolean',
            'usb_carregador'   => 'nullable|boolean',
            'outros_itens'     => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->except(['placa']);

        if ($request->filled('placa')) {
            $data['placa'] = strtoupper($request->placa);
        }

        $van->update($data);
        $van->load('fotos');

        return response()->json([
            'success' => true,
            'message' => 'Van atualizada com sucesso!',
            'van'     => $this->formatVan($van),
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();

        $van = Van::find($id);

        if (!$van) {
            return response()->json(['success' => false, 'message' => 'Van não encontrada.'], 404);
        }

        if ($van->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Você não tem permissão para deletar esta van.'], 403);
        }

        $rotasAtivas = $van->rotas()->where('ativa', true)->count();
        if ($rotasAtivas > 0) {
            return response()->json([
                'success' => false,
                'message' => "Esta van possui {$rotasAtivas} rota(s) ativa(s). Desative as rotas antes de excluir a van.",
            ], 422);
        }

        foreach ($van->fotos as $foto) {
            Storage::disk('public')->delete($foto->caminho);
        }

        $van->delete();

        return response()->json(['success' => true, 'message' => 'Van excluída com sucesso!']);
    }

    public function uploadFotos(Request $request, $id)
    {
        $user = auth()->user();

        $van = Van::with('fotos')->find($id);

        if (!$van) {
            return response()->json(['success' => false, 'message' => 'Van não encontrada.'], 404);
        }

        if ($van->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Acesso negado.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'fotos'   => 'required|array|min:1',
            'fotos.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $totalAtual = $van->fotos->count();
        $novasFotos = count($request->file('fotos'));

        if ($totalAtual + $novasFotos > 5) {
            $disponiveis = 5 - $totalAtual;
            return response()->json([
                'success' => false,
                'message' => "Limite de 5 fotos por van. Você pode adicionar mais {$disponiveis} foto(s).",
            ], 422);
        }

        $proximaOrdem = $van->fotos->max('ordem') + 1;
        $ehPrimeira   = $totalAtual === 0;
        $fotosNovas   = [];

        foreach ($request->file('fotos') as $index => $arquivo) {
            $nome    = Str::uuid() . '.' . $arquivo->getClientOriginalExtension();
            $caminho = $arquivo->storeAs('van-fotos', $nome, 'public');

            $foto = VanFoto::create([
                'van_id'    => $van->id,
                'caminho'   => $caminho,
                'principal' => $ehPrimeira && $index === 0,
                'ordem'     => $proximaOrdem + $index,
            ]);

            $fotosNovas[] = [
                'id'        => $foto->id,
                'url'       => $foto->url,
                'principal' => (bool) $foto->principal,
                'ordem'     => $foto->ordem,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Foto(s) enviada(s) com sucesso!',
            'fotos'   => $fotosNovas,
        ], 201);
    }

    public function deleteFoto($vanId, $fotoId)
    {
        $user = auth()->user();

        $van  = Van::find($vanId);
        $foto = VanFoto::where('van_id', $vanId)->find($fotoId);

        if (!$van || !$foto) {
            return response()->json(['success' => false, 'message' => 'Foto não encontrada.'], 404);
        }

        if ($van->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Acesso negado.'], 403);
        }

        Storage::disk('public')->delete($foto->caminho);
        $eraPrincipal = $foto->principal;
        $foto->delete();

        if ($eraPrincipal) {
            $proxima = VanFoto::where('van_id', $vanId)->orderBy('ordem')->first();
            if ($proxima) {
                $proxima->update(['principal' => true]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Foto removida com sucesso!']);
    }

    public function setPrincipal($vanId, $fotoId)
    {
        $user = auth()->user();

        $van  = Van::find($vanId);
        $foto = VanFoto::where('van_id', $vanId)->find($fotoId);

        if (!$van || !$foto) {
            return response()->json(['success' => false, 'message' => 'Foto não encontrada.'], 404);
        }

        if ($van->prestador_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Acesso negado.'], 403);
        }

        VanFoto::where('van_id', $vanId)->update(['principal' => false]);
        $foto->update(['principal' => true]);

        return response()->json(['success' => true, 'message' => 'Foto principal definida com sucesso!']);
    }
}
