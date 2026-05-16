<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');

// public payment webhook
Route::post('/payment/webhook', [PaymentController::class, 'webhook']);

// books
Route::apiResource('books', BookController::class)->only(['index','show']);
// genres
Route::apiResource('genres', GenreController::class)->only(['index','show']);
// authors
Route::apiResource('authors', AuthorController::class)->only(['index','show']);

Route::middleware('auth:api')->group(function () {
    // transactions
    Route::get('/transactions/history', [TransactionController::class, 'userHistory']);
    Route::post('/transactions/confirm-receipt/{id}', [TransactionController::class, 'confirmReceipt']);
    Route::apiResource('transactions', TransactionController::class)->only(['show', 'store']);
    
    // cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // checkout / payment
    Route::post('/checkout', [PaymentController::class, 'createInvoice']);
    Route::get('/payment/status/{orderNumber}', [PaymentController::class, 'checkStatus']);

    // hanya admin yang dapat akses
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('books', BookController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('genres', GenreController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('authors', AuthorController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('transactions', TransactionController::class)->only(['index','update', 'destroy']);
        Route::apiResource('users', UserController::class)->only(['index', 'update', 'destroy']);
    });
});
