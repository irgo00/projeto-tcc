<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\{JWTException, TokenExpiredException, TokenInvalidException};

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Usuário não encontrado.'], 401);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['success' => false, 'message' => 'Token expirado.'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['success' => false, 'message' => 'Token inválido.'], 401);
        } catch (JWTException $e) {
            return response()->json(['success' => false, 'message' => 'Token não fornecido.'], 401);
        }
        return $next($request);
    }
}
