<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index() {
        $users = User::all();

        if ($users->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resource data not found"
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get All Resource",
            "data" => $users
        ], 200);
    }

    public function show(string $id) {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "message" => "Get Detail Resource",
            "data" => $user
        ], 200);
    }

    public function destroy(string $id) {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found"
            ], 404);
        }

        $user->delete();

        return response()->json([
            "success" => true,
            "message" => "Resource deleted successfully"
        ], 200);
    }
}
