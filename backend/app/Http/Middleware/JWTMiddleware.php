<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;

class JWTMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            // Get token from request header
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token não fornecido.'
                ], 401);
            }

            // Authenticate the token
            $user = JWTAuth::authenticate($token);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuário não autenticado.'
                ], 401);
            }

            // Register user with the API guard so auth()->user() works
            Auth::guard('api')->setUser($user);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido: ' . $e->getMessage()
            ], 401);
        }

        return $next($request);
    }
}
