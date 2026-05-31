<?php

namespace App\Mail;

use App\Models\Rota;
use App\Models\User;
use Illuminate\Mail\Mailable;

class NovasVagasDisponiveis extends Mailable
{
    protected Rota $rota;
    protected User $usuario;

    public function __construct(Rota $rota, User $usuario)
    {
        $this->rota    = $rota;
        $this->usuario = $usuario;
    }

    public function build()
    {
        $horarios = collect([
            'Manhã' => $this->rota->horario_manha,
            'Tarde' => $this->rota->horario_tarde,
            'Noite' => $this->rota->horario_noite,
        ])->filter()->map(fn ($h) => substr((string) $h, 0, 5))->all();

        $valor = $this->rota->valor_mensal;
        $valorFormatado = ($valor !== null && (float) $valor > 0)
            ? 'R$ ' . number_format((float) $valor, 2, ',', '.')
            : null;

        return $this->subject("Vagas reabriram em {$this->rota->nome}!")
            ->view('emails.novas-vagas')
            ->with([
                'nomeUsuario'    => $this->usuario->nome,
                'nomeRota'       => $this->rota->nome,
                'descricaoRota'  => $this->rota->rota,
                'origem'         => $this->rota->origem,
                'destino'        => $this->rota->destino,
                'instituicao'    => $this->rota->instituicao,
                'horarios'       => $horarios,
                'valorFormatado' => $valorFormatado,
                'telefone'       => $this->rota->telefone,
                'emailContato'   => $this->rota->email,
                'vagas'          => (int) $this->rota->vagas_disponiveis,
                'urlBusca'       => rtrim(config('app.frontend_url'), '/') . '/busca',
            ]);
    }
}
