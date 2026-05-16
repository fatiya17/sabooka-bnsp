<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AuthorController extends Controller
{
    public function index() {
        $authors = Author::all();

        if ($authors->isEmpty()) {
            return response()->json( [
                "success" => true,
                "message" => "Rosource data not found"
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get All Resource",
            "data" => $authors
        ], 200);
    }

    public function store(Request $request) {
       $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:2048',
            'bio' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json( [
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        $image = $request->file('photo');
        $image->store('authors', 'public');

        $author = Author::create([
            'name' => $request->name,
            'photo' => $image->hashName(),
            'bio' => $request->bio,
        ]);

        return response()->json([
            "success" => true,
            "message" => "Resource added successfully",
            "data" => $author
        ], 201);
    }

    public function show(string $id) {
        $author = Author::find($id);

        if (!$author) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "message" => "Get Detail Resource",
            "data" => $author
        ], 200);
    }

    public function update(string $id, Request $request) {
        $author = Author::find($id);

        if (!$author) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:200',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'bio' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => $validator->errors()
            ], 422);
        }

        $data = [
            'name' => $request->name,
            'bio' => $request->bio
        ];

        if ($request->hasFile('photo')) {
            $image = $request->file('photo');
            $image->store('authors', 'public');
            if ($author->photo) {
                Storage::disk('public')->delete('authors/' . $author->photo);
            }
            $data['photo'] = $image->hashName();
        }

        $author->update($data);

        return response()->json([
            "success" => true,
            "message" => "Resource updated successfully",
            "data" => $author
        ], 200);
    }

    public function destroy(string $id) {
        $author = Author::find($id);

        if (!$author) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found"
            ], 404);
        }

        if ($author->photo) {
            Storage::disk('public')->delete('authors/' . $author->photo);
        }

        $author->delete();

        return response()->json([
            "success" => true,
            "message" => "Resource deleted successfully"
        ], 200);
    }
}
