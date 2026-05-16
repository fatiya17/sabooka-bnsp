<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $cartItems = Cart::with(['book.author', 'book.genre'])
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cartItems
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = auth()->user();
        
        // Check if item already exists in cart
        $cartItem = Cart::where('user_id', $user->id)
            ->where('book_id', $request->book_id)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            $cartItem = Cart::create([
                'user_id' => $user->id,
                'book_id' => $request->book_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart',
            'data' => $cartItem
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $cartItem = Cart::where('user_id', auth()->id())->find($id);

        if (!$cartItem) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'success' => true,
            'message' => 'Quantity updated'
        ]);
    }

    public function destroy($id)
    {
        $cartItem = Cart::where('user_id', auth()->id())->find($id);

        if (!$cartItem) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart'
        ]);
    }

    public function clear()
    {
        Cart::where('user_id', auth()->id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared'
        ]);
    }
}
