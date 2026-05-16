<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();   
            if (!in_array($user->role, $roles)) {
                return response()->json([
                    "success" => false,
                    "message" => "Unauthorized",
                    "data" => null
                ], 403);
            }
            return $next($request);
        } catch (JWTException $e) {
            return response()->json([
                "success" => false,
                "message" => "Token is invalid",
                "data" => null
            ], 401);
        }
    }
}
