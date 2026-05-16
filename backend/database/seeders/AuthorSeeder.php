<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Author::create([
            'name' => 'Tere Liye',
            'photo' => 'tereliye.jpg',
            'bio' => 'Penulis novel Indonesia produktif yang dikenal dengan karya-karya fiksi inspiratif dan emosional.'
        ]);

        Author::create([
            'name' => 'Mark Manson',
            'photo' => 'mark.jpg',
            'bio' => 'Penulis dan blogger asal Amerika yang fokus pada pengembangan diri dengan pendekatan realistis dan to the point.'
        ]);

        Author::create([
            'name' => 'Masashi Kishimoto',
            'photo' => 'masashi.jpg',
            'bio' => 'Mangaka asal Jepang yang terkenal sebagai pencipta seri manga populer Naruto.'
        ]);

        Author::create([
            'name' => 'J.K. Rowling',
            'photo' => 'jk_rowling.jpg',
            'bio' => 'Penulis novel asal Inggris yang terkenal sebagai pencipta seri novel Harry Potter.'
        ]);

        Author::create([
            'name' => 'Stephen King',
            'photo' => 'stephen_king.jpg',
            'bio' => 'Penulis novel asal Amerika yang terkenal sebagai pencipta seri novel Harry Potter.'
        ]);
    }
}
