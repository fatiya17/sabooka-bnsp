<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    public function index() {
        $transactions = Transaction::with('user', 'book')->latest()->get();
        
        // jika data kosong
        if ($transactions->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resource data not found"
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get All Resource",
            "data" => $transactions
        ], 200);
    }

    public function userHistory() {
        $user = auth()->user();
        $transactions = Transaction::with('book.author', 'book.genre')
            ->where('customer_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            "success" => true,
            "message" => "Get User History",
            "data" => $transactions
        ], 200);
    }

    public function confirmReceipt($id) {
        $user = auth()->user();
        $transaction = Transaction::where('customer_id', $user->id)->find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        if ($transaction->status !== 'PAID') {
            return response()->json(['message' => 'Only paid orders can be confirmed'], 400);
        }

        $transaction->update(['status' => 'COMPLETED']);

        return response()->json([
            "success" => true,
            "message" => "Order confirmed as received"
        ], 200);
    }

    public function show($id) {
        $transactions = Transaction::with('user', 'book')->find($id);

        if (!$transactions) {
            return response()->json([
                "success" => false,
                "message" => "Resource data not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "message" => "Get Resource",
            "data" => $transactions
        ], 200);
    }

    public function store(Request $request) {
        // 1. validator & cek validator
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation Error",
                "data" => $validator->errors()
            ], 422);
        }

        // 2. generate order number -> unique | ORD-003
        $uniqueCode = 'ORD-' . strtoupper(uniqid());

        // 3. ambil user yang sedang login & cek login (apakah ada data user)
        $user = auth('api')->user();
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Unauthorized"
            ], 401);
        }

        // 4. mencari data buku dari request
        $book = Book::find($request->book_id);

        // 5. cek stok buku
        if ($book->stock < $request->quantity) {
            return response()->json([
                "success" => false,
                "message" => "Insufficient stock"
            ], 400);
        }

        // 6. hitung total harga = price * quantity
        $totalAmount = $book->price * $request->quantity;

        // 7. kurangi stok buku (update)
        $book->stock -= $request->quantity;
        $book->save();

        // 8. simpan data transaksi
        $transactions = Transaction::create([
            'order_number' => $uniqueCode,
            'customer_id' => $user->id,
            'book_id' => $book->id,
            'quantity' => $request->quantity,
            'amount' => $totalAmount,
            'status' => 'PAID'
        ]);

        return response()->json([
            "success" => true,
            "message" => "Transaction created successfully",
            "data" => $transactions
        ], 201);
    }

    public function update($id, Request $request) {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
            'status' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "message" => "Validation Error",
                "data" => $validator->errors()
            ], 422);
        }

        $book = Book::find($request->book_id);

        if ($book->stock < $request->quantity) {
            return response()->json([
                "success" => false,
                "message" => "Insufficient stock"
            ], 400);
        }

        $totalAmount = $book->price * $request->quantity;

        $book->stock -= $request->quantity;
        $book->save();

        $transaction->update([
            'book_id' => $book->id,
            'amount' => $totalAmount,
            'quantity' => $request->quantity,
            'status' => $request->status ?? $transaction->status
        ]);

        return response()->json([
            "success" => true,
            "message" => "Transaction updated successfully",
            "data" => $transaction
        ], 200);
    }
    
    public function destroy($id) {
            $transaction = Transaction::find($id);

            if (!$transaction) {
                return response()->json([
                    "success" => false,
                    "message" => "Resource not found"
                ], 404);
            }

            $transaction->delete();

            return response()->json([
                "success" => true,
                "message" => "Resource deleted successfully"
            ], 200);
    }
}
