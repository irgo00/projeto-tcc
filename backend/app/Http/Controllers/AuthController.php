<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Registro de novo usuário
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'cpf' => 'required|string|size:14|unique:users',
            'data_nascimento' => 'required|date|before:' . now()->subYears(config('app.min_age', 13))->format('Y-m-d'),
            'telefone' => 'required|string|max:20',
            'senha' => 'required|string|min:8',
            'tipo' => 'required|in:cliente,prestador',
        ], [
            'data_nascimento.before' => 'É necessário ter pelo menos ' . config('app.min_age', 13) . ' anos para criar uma conta.',
            'cpf.size' => 'CPF inválido.',
            'cpf.unique' => 'Este CPF já está cadastrado.',
            'email.unique' => 'Este email já está cadastrado.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Validar CPF
        if (!$this->validarCPF($request->cpf)) {
            return response()->json([
                'success' => false,
                'message' => 'CPF inválido.'
            ], 422);
        }

        $user = User::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'cpf' => $request->cpf,
            'data_nascimento' => $request->data_nascimento,
            'telefone' => $request->telefone,
            'password' => Hash::make($request->senha),
            'tipo' => $request->tipo,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'success' => true,
            'message' => 'Usuário cadastrado com sucesso!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'email' => $user->email,
                'cpf' => $user->cpf,
                'telefone' => $user->telefone,
                'tipo' => $user->tipo,
            ]
        ], 201);
    }

    /**
     * Login de usuário
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = [
            'email' => $request->email,
            'password' => $request->senha,
        ];

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou senha incorretos.'
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'email' => $user->email,
                'cpf' => $user->cpf,
                'telefone' => $user->telefone,
                'tipo' => $user->tipo,
            ]
        ]);
    }

    /**
     * Logout de usuário
     */
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso!'
        ]);
    }

    /**
     * Obter dados do usuário autenticado
     */
    public function me()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'email' => $user->email,
                'cpf' => $user->cpf,
                'telefone' => $user->telefone,
                'data_nascimento' => $user->data_nascimento->format('Y-m-d'),
                'tipo' => $user->tipo,
            ]
        ]);
    }

    /**
     * Atualizar perfil do usuário
     */
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'telefone' => 'sometimes|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only(['nome', 'email', 'telefone']));

        return response()->json([
            'success' => true,
            'message' => 'Perfil atualizado com sucesso!',
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'email' => $user->email,
                'cpf' => $user->cpf,
                'telefone' => $user->telefone,
                'tipo' => $user->tipo,
            ]
        ]);
    }

    /**
     * Alterar senha
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'senha_atual' => 'required|string',
            'nova_senha' => 'required|string|min:8|different:senha_atual',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = auth()->user();

        if (!Hash::check($request->senha_atual, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Senha atual incorreta.'
            ], 422);
        }

        $user->password = Hash::make($request->nova_senha);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Senha alterada com sucesso!'
        ]);
    }

    /**
     * Validar CPF
     */
    private function validarCPF($cpf)
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
            if ($cpf[$c] != $d) {
                return false;
            }
        }

        return true;
    }
}
