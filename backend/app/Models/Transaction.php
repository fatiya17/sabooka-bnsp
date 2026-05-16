<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'order_number',
        'customer_id',
        'book_id',
        'quantity',
        'amount',
        'status',
        'external_id',
        'payment_link',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
}
