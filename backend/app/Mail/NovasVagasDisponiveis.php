<?php
namespace App\Mail;
use App\Models\{Van, User};
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NovasVagasDisponiveis extends Mailable
{
    use Queueable, SerializesModels;

    public $van;
    public $usuario;

    public function __construct(Van $van, User $usuario)
    {
        $this->van = $van;
        $this->usuario = $usuario;
    }

    public function build()
    {
        return $this->subject('Novas vagas disponíveis!')
            ->view('emails.novas-vagas')
            ->with([
                'nomeVan' => $this->van->nome,
                'rota' => $this->van->rota,
                'vagas' => $this->van->vagas_disponiveis,
                'nomeUsuario' => $this->usuario->nome,
            ]);
    }
}
