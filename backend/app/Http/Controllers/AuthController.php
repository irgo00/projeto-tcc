<?php

namespace App\Http\Controllers;

use App\Mail\VerificarEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome'            => 'required|string|max:255',
            'email'           => 'required|string|email|max:255|unique:users',
            'cpf'             => 'required|string|size:14|unique:users',
            'data_nascimento' => 'required|date|before:' . now()->subYears(config('app.min_age', 13))->format('Y-m-d'),
            'telefone'        => 'required|string|max:20',
            'senha'           => ['required', 'string', 'min:8', 'regex:/[A-Z]/', 'regex:/[a-z]/', 'regex:/[0-9]/', 'regex:/[@$!%*?&_\-#]/'],
            'tipo'            => 'required|in:cliente,prestador',   // admin só via seeder
        ], [
            'data_nascimento.before' => 'É necessário ter pelo menos 13 anos para criar uma conta.',
            'cpf.size'    => 'CPF inválido.',
            'cpf.unique'  => 'Este CPF já está cadastrado.',
            'email.unique'=> 'Este email já está cadastrado.',
            'senha.min'   => 'A senha deve ter no mínimo 8 caracteres.',
            'senha.regex' => 'A senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&_-#).',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if (!$this->validarCPF($request->cpf)) {
            return response()->json(['success' => false, 'message' => 'CPF inválido.'], 422);
        }

        $user = User::create([
            'nome'            => $request->nome,
            'email'           => $request->email,
            'cpf'             => $request->cpf,
            'data_nascimento' => $request->data_nascimento,
            'telefone'        => $request->telefone,
            'password'        => Hash::make($request->senha),
            'tipo'            => $request->tipo,
        ]);

        $emailEnviado = false;
        try {
            Mail::to($user->email)->send(new VerificarEmail($user));
            $emailEnviado = true;
        } catch (\Throwable $e) {
            Log::warning('Falha ao enviar e-mail de verificação no cadastro: ' . $e->getMessage());
        }

        $token = JWTAuth::fromUser($user);

        $message = $emailEnviado
            ? 'Cadastro realizado! Enviamos um e-mail para você confirmar seu endereço.'
            : 'Cadastro realizado! Reenvie o e-mail de confirmação pelo painel.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'token'   => $token,
            'user'    => $this->formatUser($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $credentials = ['email' => $request->email, 'password' => $request->senha];

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['success' => false, 'message' => 'Email ou senha incorretos.'], 401);
        }

        $user = auth()->user();

        return response()->json([
            'success' => true,
            'token'   => $token,
            'user'    => $this->formatUser($user),
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['success' => true, 'message' => 'Logout realizado com sucesso!']);
    }

    public function me()
    {
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'user'    => array_merge($this->formatUser($user), [
                'data_nascimento' => $user->data_nascimento->format('Y-m-d'),
            ]),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'nome'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'telefone' => 'sometimes|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Troca de e-mail invalida a verificação anterior
        $emailMudou = $request->filled('email') && $request->email !== $user->email;

        $user->update($request->only(['nome', 'email', 'telefone']));

        if ($emailMudou) {
            $user->email_verificado = false;
            $user->save();
            $user->recalcularHabilitacao();

            try {
                Mail::to($user->email)->send(new VerificarEmail($user));
            } catch (\Throwable $e) {
                Log::warning('Falha ao reenviar verificação após troca de e-mail: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => $emailMudou
                ? 'Perfil atualizado! Confirme o novo e-mail pelo link que enviamos.'
                : 'Perfil atualizado com sucesso!',
            'user'    => $this->formatUser($user->fresh()),
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'senha_atual' => 'required|string',
            'nova_senha'  => ['required', 'string', 'min:8', 'different:senha_atual', 'regex:/[A-Z]/', 'regex:/[a-z]/', 'regex:/[0-9]/', 'regex:/[@$!%*?&_\-#]/'],
        ], [
            'nova_senha.min'       => 'A nova senha deve ter no mínimo 8 caracteres.',
            'nova_senha.different' => 'A nova senha deve ser diferente da senha atual.',
            'nova_senha.regex'     => 'A nova senha deve conter maiúscula, minúscula, número e caractere especial (@$!%*?&_-#).',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = auth()->user();

        if (!Hash::check($request->senha_atual, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Senha atual incorreta.'], 422);
        }

        $user->password = Hash::make($request->nova_senha);
        $user->save();

        return response()->json(['success' => true, 'message' => 'Senha alterada com sucesso!']);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'                   => $user->id,
            'nome'                 => $user->nome,
            'email'                => $user->email,
            'cpf'                  => $user->cpf,
            'telefone'             => $user->telefone,
            'tipo'                 => $user->tipo,
            'status_habilitacao'   => $user->status_habilitacao  ?? 'pendente',
            'email_verificado'     => (bool) ($user->email_verificado  ?? false),
            'telefone_verificado'  => (bool) ($user->telefone_verificado ?? false),
        ];
    }

    private function validarCPF($cpf): bool
    {
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        if (strlen($cpf) != 11 || preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) return false;
        }

        return true;
    }
}
