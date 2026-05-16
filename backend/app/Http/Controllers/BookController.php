<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with(['genre', 'author'])->get();

        // jika data kosong
        if ($books->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resource data not found"
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get All Resource",
            "data" => $books
        ], 200);
    }

    // menambahkan data
    public function store(Request $request) {
        // 1. validator
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'cover_photo' => 'required|image|mimes:jpeg,jpg,png|max:2048',
            'genre_id' => 'required|exists:genres,id',
            'author_id' => 'required|exists:authors,id'
        ]);

        // 2. cek validator error
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // 3. upload gambar
        $image = $request->file('cover_photo');
        $image->store('books', 'public');

        // 4. insert data
        $book = Book::create([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'cover_photo' => $image->hashName(), // agar nama file nya di hash
            'genre_id' => $request->genre_id,
            'author_id' => $request->author_id
        ]);

        // 5. response
        return response()->json([
            'success' => true,
            'message' => 'Resource added successfully',
            'data' => $book
        ], 201);
    }

    public function show(string $id) {
        $book = Book::with(['genre', 'author'])->find($id);

        // id tidak ada
        if (!$book) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found",
            ], 404);
        }

        return response()->json([
            "success" => true,
            "message" => "Get Detail Resource",
            "data" => $book
        ], 200);
    }

    public function update(string $id, Request $request) {
        // 1. mencari data
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found",
            ], 404);
        }

        // 2. validasi data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'cover_photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'genre_id' => 'required|exists:genres,id',
            'author_id' => 'required|exists:authors,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // 3. siapkan data yang ingin diupdate
        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'genre_id' => $request->genre_id,
            'author_id' => $request->author_id
        ];

        // 4. handle image (upload & delete)
        if ($request->hasFile('cover_photo')) {
            // upload new image
            $image = $request->file('cover_photo');
            $image->store('books', 'public');
            // delete old image
            if ($book->cover_photo) {
                Storage::disk('public')->delete('books/' . $book->cover_photo);
            }

            $data['cover_photo'] = $image->hashName();
        }

        // 5. update data baru ke database
        $book->update($data);

        return response()->json([
            "success" => true,
            "message" => "Resource updated successfully",
        ], 200);
    }

    public function destroy(string $id) {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found",
            ], 404);
        }

        if ($book->cover_photo) {
            // delete from storage
            Storage::disk('public')->delete('books/' . $book->cover_photo);
        }
        $book->delete();

        return response()->json([
            "success" => true,
            "message" => "Resource deleted successfully",
        ], 200);
    }
}
