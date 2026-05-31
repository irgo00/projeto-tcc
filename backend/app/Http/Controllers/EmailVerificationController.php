<?php

namespace App\Http\Controllers;

use App\Mail\VerificarEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailVerificationController extends Controller
{
    public function verify(Request $request, int $id, string $hash)
    {
        $destino = rtrim(config('app.frontend_url'), '/') . '/dashboard/prestador';

        $user = User::find($id);

        // Link válido (assinado), mas usuário inexistente ou hash não confere com o e-mail atual
        if (!$user || !hash_equals(sha1($user->email), (string) $hash)) {
            return redirect($destino . '?email_verified=invalid');
        }

        if ($user->email_verificado) {
            return redirect($destino . '?email_verified=already');
        }

        $user->email_verificado = true;
        $user->save();

        // Recalcula a habilitação (e-mail é pré-requisito) — ponto único de verdade
        $user->recalcularHabilitacao();

        return redirect($destino . '?email_verified=1');
    }

    public function resend()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->email_verificado) {
            return response()->json([
                'success' => false,
                'message' => 'Seu e-mail já foi verificado.',
            ], 422);
        }

        Mail::to($user->email)->send(new VerificarEmail($user));

        return response()->json([
            'success' => true,
            'message' => 'E-mail de verificação reenviado. Verifique sua caixa de entrada.',
        ]);
    }
}
