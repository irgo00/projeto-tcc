<?php

namespace App\Observers;

use App\Mail\NovasVagasDisponiveis;
use App\Models\Rota;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RotaObserver
{
    public function updated(Rota $rota): void
    {
        if (!$rota->wasChanged('vagas_disponiveis')) {
            return;
        }

        $original = (int) $rota->getOriginal('vagas_disponiveis');
        $atual    = (int) $rota->vagas_disponiveis;

        if ($original !== 0 || $atual <= 0) {
            return;
        }

        $destinatarios = $rota->favoritos()
            ->where('tipo', 'cliente')
            ->get();

        foreach ($destinatarios as $usuario) {
            try {
                Mail::to($usuario->email)->send(new NovasVagasDisponiveis($rota, $usuario));
            } catch (\Throwable $e) {
                Log::warning(
                    "Falha ao notificar favorito {$usuario->id} da rota {$rota->id}: " . $e->getMessage()
                );
            }
        }
    }
}
