<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;

/**
 * E-mail de confirmação de endereço.
 * */
class VerificarEmail extends Mailable
{
    public User $usuario;

    public function __construct(User $usuario)
    {
        $this->usuario = $usuario;
    }

    public function build()
    {
        return $this->subject('Confirme seu e-mail')
            ->view('emails.verificar-email')
            ->with([
                'nome' => $this->usuario->nome,
                'url'  => $this->usuario->urlVerificacaoEmail(),
            ]);
    }
}
