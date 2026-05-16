<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Book::create([
            'title' => 'Pulang',
            'description' => 'Petualangan seorang pemuda yang kembali ke desa kelahirannya.',
            'price' => 40000,
            'stock' => 15,
            'cover_photo' => 'pulang.jpg',
            'genre_id' => 2,
            'author_id' => 1
        ]);

        Book::create([
            'title' => 'Sebuah seni untuk bersikap bodoamat',
            'description' => 'Buku yang membahas tentang kehidupan dan filosofi hidup seseorang.',
            'price' => 25000,
            'stock' => 5,
            'cover_photo' => 'sebuah_seni.png',
            'genre_id' => 1,
            'author_id' => 2
        ]);

        Book::create([
            'title' => 'Naruto',
            'description' => 'Buku yang membahas tentang jalan ninja seseorang.',
            'price' => 30000,
            'stock' => 55,
            'cover_photo' => 'naruto.jpg',
            'genre_id' => 1,
            'author_id' => 3
        ]);

        Book::create([
            'title' => 'Laskar Pelangi',
            'description' => 'Buku yang membahas tentang perjuangan anak-anak di Belitung untuk mendapatkan pendidikan.',
            'price' => 35000,
            'stock' => 10,
            'cover_photo' => 'laskar_pelangi.jpg',
            'genre_id' => 2,
            'author_id' => 1
        ]);

        Book::create([
            'title' => 'Supernova',
            'description' => 'Buku yang membahas tentang kehidupan dan filosofi hidup seseorang.',
            'price' => 25000,
            'stock' => 5,
            'cover_photo' => 'supernova.jpg',
            'genre_id' => 2,
            'author_id' => 2
        ]);
    }
}
