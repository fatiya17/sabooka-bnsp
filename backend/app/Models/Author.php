<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $table = 'authors';
    protected $fillable = [
        'name',
        'photo',
        'bio'
    ];

    public function getAuthors() {
        return $this->authors;
    }
}
