<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createInvoice(Request $request)
    {
        $user = auth()->user();
        $cartItems = Cart::with('book')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $totalAmount = 0;
        $orderNumber = 'ORD-' . strtoupper(uniqid());
        
        foreach ($cartItems as $item) {
            if ($item->book->stock < $item->quantity) {
                return response()->json(['message' => "Stock insuficient for {$item->book->title}"], 400);
            }
            $totalAmount += $item->book->price * $item->quantity;
        }

        $secretKey = env('XENDIT_SECRET_KEY');
        $response = Http::withBasicAuth($secretKey, '')
            ->post('https://api.xendit.co/v2/invoices', [
                'external_id' => $orderNumber,
                'amount' => (int)$totalAmount,
                'payer_email' => $user->email,
                'description' => "Pembayaran Buku sabooka - {$orderNumber}",
                'invoice_duration' => 86400,
                'success_redirect_url' => 'http://localhost:5173/history',
                'failure_redirect_url' => 'http://localhost:5173/history',
            ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to create Xendit invoice',
                'error' => $response->json()
            ], 500);
        }

        $invoiceData = $response->json();

        foreach ($cartItems as $item) {
            Transaction::create([
                'order_number' => $orderNumber,
                'customer_id' => $user->id,
                'book_id' => $item->book_id,
                'quantity' => $item->quantity,
                'amount' => $item->book->price * $item->quantity,
                'status' => 'PENDING',
                'external_id' => $invoiceData['id'],
                'payment_link' => $invoiceData['invoice_url']
            ]);

            $item->book->decrement('stock', $item->quantity);
        }

        Cart::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'invoice_url' => $invoiceData['invoice_url'],
            'order_number' => $orderNumber
        ]);
    }

    public function checkStatus($orderNumber)
    {
        $transactions = Transaction::where('order_number', $orderNumber)->get();
        if ($transactions->isEmpty()) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // If already paid, just return
        if ($transactions->first()->status === 'PAID' || $transactions->first()->status === 'COMPLETED') {
            return response()->json(['status' => $transactions->first()->status]);
        }

        $secretKey = env('XENDIT_SECRET_KEY');
        $invoiceId = $transactions->first()->external_id;

        // Call Xendit to get latest status
        $response = Http::withBasicAuth($secretKey, '')
            ->get("https://api.xendit.co/v2/invoices/{$invoiceId}");

        if ($response->successful()) {
            $data = $response->json();
            $newStatus = $data['status']; // PAID, EXPIRED, SETTLED

            if ($newStatus === 'PAID' || $newStatus === 'SETTLED') {
                Transaction::where('order_number', $orderNumber)->update(['status' => 'PAID']);
                return response()->json(['status' => 'PAID', 'updated' => true]);
            } elseif ($newStatus === 'EXPIRED') {
                foreach ($transactions as $trx) {
                    Book::where('id', $trx->book_id)->increment('stock', $trx->quantity);
                }
                Transaction::where('order_number', $orderNumber)->update(['status' => 'EXPIRED']);
                return response()->json(['status' => 'EXPIRED', 'updated' => true]);
            }
        }

        return response()->json(['status' => $transactions->first()->status, 'updated' => false]);
    }

    public function webhook(Request $request)
    {
        $data = $request->all();
        Log::info('Xendit Webhook Received:', $data);

        $externalId = $data['external_id'];
        $status = $data['status'];

        if ($status === 'PAID' || $status === 'SETTLED') {
            Transaction::where('order_number', $externalId)->update(['status' => 'PAID']);
        } elseif ($status === 'EXPIRED') {
            $transactions = Transaction::where('order_number', $externalId)->get();
            foreach ($transactions as $trx) {
                Book::where('id', $trx->book_id)->increment('stock', $trx->quantity);
            }
            Transaction::where('order_number', $externalId)->update(['status' => 'EXPIRED']);
        }

        return response()->json(['message' => 'Webhook received successfully']);
    }
}
