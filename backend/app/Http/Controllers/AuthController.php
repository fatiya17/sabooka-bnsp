<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. setup validator
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        // 2. cek validator
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 3. create user
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        // 4. cek keberhasilan
        if ($user) {
            return response()->json([
                "success" => true,
                "message" => "User created successfully",
                "data" => $user
            ], 201);
        }

        // 5. cek kegagalan
        return response()->json([
            "success" => false,
            "message" => "User creation failed",
            "data" => null
        ], 409);
    }

    public function login(Request $request)
    {
        // 1. setup validator
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. cek validator
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 3. get credentials dari request
        $credentials = $request->only('email', 'password');

        // 4. get isFailed
        if (!$token = auth()->guard('api')->attempt($credentials)) {
            return response()->json([
                "success" => false,
                "message" => "Unauthorized",
                "data" => null
            ], 401);
        }

        // 5. get isSuccess
        return response()->json([
            'success' => true,
            'message' => 'Login successfully',
            'user' => auth()->guard('api')->user(),
            'token' => $token,
        ], 200);
    }

    public function logout()
    {
        // try 
        // 1. invalidate token
        // 2. cek isSuccess

        // catch
        // 3. cek isFailed

        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'success' => true,
                'message' => 'Logout successfully',
                'data' => null
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'data' => null
            ], 500);
        }

    }
}
