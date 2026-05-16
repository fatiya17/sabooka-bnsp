# Modul Praktikum Laravel: Routing, MVC, Migration, Seeder & REST API

Modul ini disusun berdasarkan serangkaian langkah praktikum pembuatan fitur Books, Genres, dan Authors pada project Laravel. Panduan ini membimbing Anda dari pembuatan MVC statis, memindahkan data ke Database menggunakan Migration dan Seeder, hingga menyajikannya sebagai **Web Service / REST API**.

---

## Praktikum 2: Dasar Routing dan MVC

Pada tahap ini, kita bernavigasi dari browser ke aplikasi dengan menggunakan data statis.

### Langkah 1: Membuat Model & Controller (Cara Cepat)
Gunakan satu perintah terminal untuk membuat Model sekaligus Controller:
```bash
php artisan make:model Book -c
```

### Langkah 2: Routing dan Method
Arahkan endpoint sementara di file `routes/web.php` menuju method `index` di controller:
```php
use App\Http\Controllers\BookController;

Route::get('/books', [BookController::class, 'index']);
```
Controller memanggil array dari Model dan mengirimnya ke file `books.blade.php`. Tampilan pada browser menggunakan list html sederhana dan perintah blading `@foreach`.

---

## Praktikum 3: Database, Migration, dan Seeder

Tahap ini memindahkan data kita ke MySQL.

> **Cara Super Cepat (All in One)**
> Membuat Model, Controller, Migration, dan Seeder sekaligus:
> `php artisan make:model Book -c -m -s`

### Langkah 1: Migration & Seeder
Migration mengatur kolom tabel:
```php
Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->integer('price');
    $table->timestamps();
});
```

Seeder akan menjejalkan (suntik) data dummy:
```php
Book::create(['title' => 'Pulang', 'price' => 40000]);
```
Pastikan semua Seeder didaftarkan di `DatabaseSeeder.php`.

### Langkah 2: EKSEKUSI!
Buat database dari awal dan masukkan seluruh data seeder perintah ini:
```bash
php artisan migrate:fresh --seed
```

Selanjutnya, alih-alih data manual, panggil menggunakan format Eloquent `$books = Book::all();` pada Controller.

---

## Praktikum 4: Web Service & REST API

Pada tahap ini kita tidak lagi membutuhkan tampilan View (Blade HTML). Web yang kita buat akan berfungsi murni sebagai penyedia data (`Backend / API`) menggunakan arsitektur REST, dengan respons data berbentuk **JSON**.

### Langkah 1: Menginstal Dependencies API
Pada versi Laravel 11 ke atas, dukungan API tidak terinstal secara bawaan. Jalankan:
```bash
php artisan install:api
```
*(Proses ini akan mengaktifkan skema token Sanctum & membuat file `routes/api.php`)*

### Langkah 2: Pindahkan Route ke api.php
Hapus rute pemanggilan data Anda dari `routes/web.php` dan pindahkan ke `routes/api.php`. Rute yang berada di `api.php` secara otomatis akan diberi prefix `/api/`.

**Contoh isi `routes/api.php`**:
```php
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
// ...

Route::get('/books', [BookController::class, 'index']);
Route::get('/genres', [GenreController::class, 'index']);
```

### Langkah 3: Ubah Controller Mengekspor JSON
Ubah metode `index` pada controller Anda (seperti `BookController` atau `GenreController`) agar mengembalikan *Response JSON* standar profesional alih-alih mereturn `view()`.

```php
class GenreController extends Controller
{
    public function index() {
        $genres = Genre::all();
        
        // Kembalikan sebagai JSON Array
        return response()->json([
            "success" => true,
            "message" => "Get All Resource",
            "data" => $genres
        ], 200);
    }
}
```

### Langkah 4: Uji Coba / Testing dengan POSTMAN
Aplikasi penyedia data seperti REST API **tidak dianjurkan** diakses lewat peramban web karena hasilnya hanya berbentuk teks mentah. Sebagai gantinya, gunakan aplikasi pihak ketiga (klien HTTP) seperti **Postman**.

1. Unduh dan instal Postman dari URL: https://www.postman.com/downloads/
2. Buka Postman.
3. Set metode Request menjadi `GET`.
4. Masukkan endpoint aplikasi (ingat ada tambahan `/api/` di depan rute):
   `http://127.0.0.1:8000/api/genres`
5. Tekan **Send**. Anda akan menerima pesan sukses beserta objek (array) JSON yang terstruktur dan mudah dikelola oleh aplikasi Frontend maupun Mobile (Android/iOS).

---

## Praktikum 5: Read & Create Data (CRUD API) dan Upload File

Berdasarkan implementasi terbaru, kita merancang endpoint untuk menambahkan (Create) data baru beserta fasilitas Upload Gambar, dengan dilengkapi proses Validasi data guna menjaga integritas *database*.

### Langkah 1: Menerapkan Mass Assignment (`$fillable`) pada Model
Untuk mengizinkan penambahan data secara otomatis dari HTTP request (mass assignment), definisikan properti `$fillable` dalam Model Anda, contohnya pada `app/Models/Book.php`:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'books';
    
    // Mengizinkan atribut ini diisi secara massal
    protected $fillable = [
        'title',
        'description',
        'price',
        'stock',
        'cover_photo',
        'genre_id',
        'author_id'
    ];
}
```

### Langkah 2: Menambahkan Method `store` dan Upload Gambar pada Controller
Tambahkan logika validasi, unggah file, dan insert database ke dalam `BookController.php`:

```php
use Illuminate\Support\Facades\Validator;
use App\Models\Book;
// ... (dalam BookController class)

public function store(Request $request) {
    // 1. Validasi Input Data
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:100',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'cover_photo' => 'required|image|mimes:jpeg,jpg,png|max:2048',
        'genre_id' => 'required|exists:genres,id',
        'author_id' => 'required|exists:authors,id'
    ]);

    // 2. Berikan respons jika validasi gagal
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422); // HTTP Code: Unprocessable Entity
    }

    // 3. Upload Gambar
    $image = $request->file('cover_photo');
    $image->store('books', 'public'); // Folder: storage/app/public/books

    // 4. Insert Data menggunakan Eloquent
    $book = Book::create([
        'title' => $request->title,
        'description' => $request->description,
        'price' => $request->price,
        'stock' => $request->stock,
        'cover_photo' => $image->hashName(), // Nama file di-hash
        'genre_id' => $request->genre_id,
        'author_id' => $request->author_id
    ]);
    
    // 5. Response Sukses
    return response()->json([
        'success' => true,
        'message' => 'Resource added successfully',
        'data' => $book
    ], 201); // HTTP Code: Created
}
```

### Langkah 3: Menambahkan Route POST di `api.php`
Untuk mengekspos method `store`, tambahkan HTTP method `POST` di `routes/api.php`:

```php
// Route untuk menambahkan data baru
Route::post('/books', [BookController::class, 'store']);
```
*Catatan: Pastikan anda juga sudah menautkan Storage Link (jika belum) menggunakan perintah: `php artisan storage:link` agar file dalam `storage/app/public` bisa diakses melalui folder `public` aplikasi.*

### Langkah 4: Testing Menggunakan Postman (POST)
1. Buka Postman.
2. Atur jenis HTTP Method menjadi **POST**.
3. Masukkan URL: `http://127.0.0.1:8000/api/books`
4. Pindah ke tab **Body** dan pilih **form-data** (karena kita akan mengunggah file).
5. Masukkan Key - Value:
   * `title` -> Teks
   * `description` -> Teks
   * `price` -> Angka
   * `stock` -> Angka
   * `genre_id` -> ID Valid
   * `author_id` -> ID Valid
   * `cover_photo` -> **Ganti tipe dari Text ke File**, lalu Choose File (gambar jpeg/jpg/png maksimal 2MB).
6. Tekan **Send**.
7. Anda akan melihat response berstatus `201 Created` bersama dengan rincian data buku yang sukses diinput.

---

## Praktikum 6: Show, Update, & Destroy Data (CRUD API Lanjutan)

Melengkapi proses CRUD dasar, di tahap ini kita akan belajar cara mengambil satu data spesifik (Show), mengubah data dan mengganti file gambar (Update), hingga menghapus data permanen (Destroy). Kita juga akan menggunakan `Route::apiResource` agar pendefinisian rute lebih rapi.

Dibutuhkan kelas `Storage` untuk memanipulasi file di penyimpanan:
```php
use Illuminate\Support\Facades\Storage;
```

### Langkah 1: Mengambil Data Spesifik (Show)
Fungsi `show` bertujuan mengambil rincian satu buah data menggunakan metode `GET` dengan parameter ID.

```php
public function show(string $id) {
    $book = Book::find($id);

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
```

### Langkah 2: Mengubah Data & File (Update)
Fungsi `update` (diakses menggunakan metode `PUT` atau `POST` untuk file) akan memvalidasi data baru. Jika terdapat unggahan file gambar baru, server juga akan **menghapus gambar lama** agar menghemat memori.

```php
public function update(string $id, Request $request) {
    $book = Book::find($id);

    if (!$book) {
        return response()->json([
            "success" => false,
            "message" => "Resource not found",
        ], 404);
    }

    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:100',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'cover_photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048', // Bisa kosong jika tak ubah gambar
        'genre_id' => 'required|exists:genres,id',
        'author_id' => 'required|exists:authors,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422);
    }

    $data = [
        'title' => $request->title,
        'description' => $request->description,
        'price' => $request->price,
        'stock' => $request->stock,
        'genre_id' => $request->genre_id,
        'author_id' => $request->author_id
    ];

    // Jika ada file gambar baru yang diunggah
    if ($request->hasFile('cover_photo')) {
        $image = $request->file('cover_photo');
        $image->store('books', 'public');
        
        // Hapus file lama di storage
        if ($book->cover_photo) {
            Storage::disk('public')->delete('books/' . $book->cover_photo);
        }

        $data['cover_photo'] = $image->hashName();
    }

    $book->update($data);

    return response()->json([
        "success" => true,
        "message" => "Resource updated successfully",
    ], 200);
}
```

### Langkah 3: Menghapus Data (Destroy)
Fungsi `destroy` menghapus rekaman di *database* beserta **menghapus file fisiknya** dari Storage. Menggunakan HTTP Method `DELETE`.

```php
public function destroy(string $id) {
    $book = Book::find($id);

    if (!$book) {
        return response()->json([
            "success" => false,
            "message" => "Resource not found",
        ], 404);
    }

    // Hapus file gambar di storage
    if ($book->cover_photo) {
        Storage::disk('public')->delete('books/' . $book->cover_photo);
    }
    
    $book->delete();

    return response()->json([
        "success" => true,
        "message" => "Resource deleted successfully",
    ], 200);
}
```

### Langkah 4: Simplifikasi Rute (API Resource)
Daripada mendaftarkan metode `GET`, `POST`, `PUT`, `DELETE` secara terpisah, gunakan `apiResource` di `routes/api.php` agar lebih profesional dan elegan.

Contoh perubahan yang ada pada file `routes/api.php`:
```php
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthorController;

// Mendefinisikan seluruh operasi CRUD untuk setiap entitas sekaligus!
Route::apiResource('books', BookController::class);
Route::apiResource('genres', GenreController::class);
Route::apiResource('authors', AuthorController::class);
```

Dengan langkah tersebut, Endpoint akan tersetting secara otomatis berdasarkan resource:
- `GET /api/books` -> index
- `POST /api/books` -> store
- `GET /api/books/{id}` -> show
- `PUT /api/books/{id}` -> update
- `DELETE /api/books/{id}` -> destroy

---

## Praktikum 7: Authentication & Authorization (JWT & Role Middleware)

Untuk menjaga keamanan operasi *Create*, *Update*, dan *Destroy* terhadap pengakses gelap, kita menggunakan modul autentikasi JSON Web Token (JWT) dikombinasikan dengan Role-Based Access Control (RBAC) menggunakan Middleware Laravel.

### Langkah 1: Instalasi Paket JWT-Auth
Gunakan terminal untuk menginstal `jwt-auth` dari Tymon dan menerbitkan file konfigurasi:
```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```
*Catatan: Pastikan `jwt:secret` sukses tereksekusi yang nantinya akan membuat `JWT_SECRET` pada file `.env`.*

Selanjutnya, daftarkan `driver` baru untuk API. Buka konfigurasi `config/auth.php` lalu ubah `driver` di bagian `api` (dari `session`/`sanctum` menjadi `jwt`):
```php
'api' => [
    'driver' => 'jwt',
    'provider' => 'users',
]
```

### Langkah 2: Setup Database (Migration & Seeder Role)
Di dalam migration tabel pengguna (terletak di direktori `database/migrations` biasanya pada ujung namanya `_create_users_table.php`), tambahkan `enum` *role*:
```php
$table->enum('role', ['customer', 'admin']);
```

Setelah itu generasikan pengguna bawaan melalui seeder, buat Seeder dengan `php artisan make:seeder UserSeeder`.
Tambahkan data pengguna beserta role-nya pada `database/seeders/UserSeeder.php`:
```php
User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('admin123'),
    'role' => 'admin'
]);
// Buat data lainnya untuk customer
```
Daftarkan `UserSeeder::class` pada `DatabaseSeeder.php` dan jalankan ulang migrasi keseluruhan: `php artisan migrate:fresh --seed`.

### Langkah 3: Implementasi Antarmuka `JWTSubject` pada Model
Agar tabel Model User dapat menghasilkan JWT, Anda harus menerapkan implementasi (Interfacing) `Tymon\JWTAuth\Contracts\JWTSubject` di file Model `app/Models/User.php`.
Jangan lupa berikan izin mass-assignment pada atribut `role`.

```php
use Tymon\JWTAuth\Contracts\JWTSubject;
//...
class User extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    // Method wajib untuk JWT 1
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    // Method wajib untuk JWT 2
    public function getJWTCustomClaims() {
        return [];
    }
}
```

### Langkah 4: Pembuatan AuthController
Buat sebuah Controler bernama `AuthController` untuk melayani rute API Login, Register, dan Logout.
```bash
php artisan make:controller AuthController
```

Pada fungsi `login()`, implementasikan pembuatan Token JWT jika credential (Email & Password valid):
```php
$credentials = $request->only('email', 'password');

// Jika percobaan auth lewat guard 'api' berhasil, ia akan mengembalikan string $token
if (!$token = auth()->guard('api')->attempt($credentials)) {
    return response()->json(['message' => 'Unauthorized'], 401);
}

return response()->json([
    'success' => true,
    'message' => 'Login successfully',
    'user' => auth()->guard('api')->user(),
    'token' => $token,
], 200);
```

### Langkah 5: Penerapan Middleware *Role* (Otorisasi)
Agar rute-rute *modifikasi* di API dikhususkan untuk **admin** semata, kita menjembatani hak akses menggunakan fitur Middleware baru.
```bash
php artisan make:middleware CheckRole
```
Buka file `app/Http/Middleware/CheckRole.php`, ubah kodenya dengan melakukan validasi tipe pengguna dari *Token JWT* yang terkirim di awal *Request*:
```php
use Tymon\JWTAuth\Facades\JWTAuth;
//...
public function handle(Request $request, Closure $next, ...$roles)
{
    try {
        // Dekripsi Token menjadi objek
        $user = JWTAuth::parseToken()->authenticate();   
        
        // Memeriksa letak string role pada konfigurasi parameter di route
        if (!in_array($user->role, $roles)) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
        return $next($request);
    } catch (\Exception $e) {
        return response()->json(["message" => "Token is invalid"], 401);
    }
}
```
Lalu, alias-kan middleware tersebut dalam parameter alias di file `bootstrap/app.php`:
```php
$middleware->alias([
    'role' => \App\Http\Middleware\CheckRole::class
]);
```

### Langkah 6: Routing Autentikasi dan API Bersarang
Integrasikan fitur Register, Login hingga akses khusus pada sistem *Route* API Anda (di file `routes/api.php`). Modifikasi seluruh pendefinisian rute menjadi format kelompok *(grouping)* sebagai berikut:

```php
use App\Http\Controllers\AuthController;

// 1. Rute Terbuka (Public & Auth Registration/Login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Method GET bebas diakses publik
Route::apiResource('books', BookController::class)->only(['index','show']);
Route::apiResource('genres', GenreController::class)->only(['index','show']);
Route::apiResource('authors', AuthorController::class)->only(['index','show']);


// 2. Rute Autentikasi Internal (Hanya Ber-Token / Authenticated Users)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // 3. Rute Otorisasi Hak Akses Role (Hanya Role Admin)
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('books', BookController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('genres', GenreController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('authors', AuthorController::class)->only(['store', 'update', 'destroy']);
    });
});
```

*Langkah ini secara sempurna melindungi aksi penambahan, perubahan, serta penghapusan data agar API Anda tetap aman dan tervalidator.*

---

## Praktikum 8: Implementasi Transaksi dan Business Logic

Pada tahap ini, kita menambahkan fitur utama dari sistem penjulan buku (Book Sales API), yaitu **Transaksi**. Proses ini melibatkan *business logic* yang lebih kompleks seperti pengecekan stok buku, pengurangan stok, dan mengenerate *Order Number* yang unik setiap kali ada transaksi.

### Langkah 1: Generate Komponen Transaksi
Jalankan perintah ini di terminal untuk membuat Model, Migration, Seeder, dan Controller secara bersamaan:

```bash
C:\xampp\htdocs\fullstack-web\laravel\booksales-api>php artisan make:model Transaction -c -m -s

   INFO  Model [C:\xampp\htdocs\fullstack-web\laravel\booksales-api\app\Models\Transaction.php] created successfully.  

   INFO  Migration [C:\xampp\htdocs\fullstack-web\laravel\booksales-api\database\migrations\2026_04_28_012834_create_transactions_table.php] created successfully.  

   INFO  Seeder [C:\xampp\htdocs\fullstack-web\laravel\booksales-api\database\seeders\TransactionSeeder.php] created successfully.  

   INFO  Controller [C:\xampp\htdocs\fullstack-web\laravel\booksales-api\app\Http\Controllers\TransactionController.php] created successfully.  
```

### Langkah 2: Setup Database (Migration & Seeder)
Pertama, kita atur struktur tabel pada file migration terbaru `database/migrations/..._create_transactions_table.php`:
```php
Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->string('order_number');
    $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
    $table->decimal('amount', 10, 2);
    $table->timestamps();
});
```

Selanjutnya, buat data *dummy/seeder* di `database/seeders/TransactionSeeder.php`:
```php
namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        Transaction::create([
            'order_number' => 'ORD-0001',
            'customer_id' => 2,
            'book_id' => 1,
            'amount' => 250000.00,
        ]);

        Transaction::create([
            'order_number' => 'ORD-0002',
            'customer_id' => 1,
            'book_id' => 2,
            'amount' => 150000.00,
        ]);
    }
}
```

Pastikan Anda memanggil class tersebut di file `DatabaseSeeder.php` dengan menambahkan daftar `TransactionSeeder::class`.

### Langkah 3: Eksekusi *Fresh Migration & Seed*
Jalankan perintah ini untuk mereset dan memuat ulang data ke tabel dalam database:
```bash
C:\xampp\htdocs\fullstack-web\laravel\booksales-api>php artisan migrate:fresh --seed
```

### Langkah 4: Hubungkan Model (`Mass Assignment` & Relasi)
Konfigurasikan Model `Transaction.php` untuk membolehkan pengisian kolom (`$fillable`) serta definisikan *Relationship* dengan tabel `User` (berperan sebagai *Customer*) dan tabel `Book`:
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'order_number',
        'customer_id',
        'book_id',
        'amount',
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
```

### Langkah 5: Tulis *Business Logic* dalam Controller
Pada `TransactionController.php`, pastikan Anda mengekstrak *business logic* utamanya dalam tahapan transaksi, salah satunya di metode **store**. Tahap ini validasi, kurangi stok, dan generate ID transaksi dilakukan.

```php
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

    // 2. generate order number unik
    $uniqueCode = 'ORD-' . strtoupper(uniqid());

    // 3. ambil user yang sedang login (JWT Auth API)
    $user = auth('api')->user();
    if (!$user) {
        return response()->json(["success" => false, "message" => "Unauthorized"], 401);
    }

    // 4. mencari data buku dari request
    $book = Book::find($request->book_id);

    // 5. cek stok buku (pastikan mencukupi)
    if ($book->stock < $request->quantity) {
        return response()->json(["success" => false, "message" => "Insufficient stock"], 400);
    }

    // 6. hitung total harga (price * quantity)
    $totalAmount = $book->price * $request->quantity;

    // 7. kurangi stok buku (update) ke basis data
    $book->stock -= $request->quantity;
    $book->save();

    // 8. simpan data transaksi
    $transactions = Transaction::create([
        'order_number' => $uniqueCode,
        'customer_id' => $user->id,
        'book_id' => $book->id,
        'amount' => $totalAmount,
    ]);

    return response()->json([
        "success" => true,
        "message" => "Transaction created successfully",
        "data" => $transactions
    ], 201);
}
```

### Langkah 6: Daftarkan Route Berbasis Hak Akses (Role) di api.php
Setelah itu, amankan *Route resource* di `routes/api.php` agar ada kewenangan:
- *Customer* (auth:api) mengakses pembuatan pemesanan (`store`), memodifikasinya jika diperlukan (`update`), dan melihat resi/detail (`show`).
- *Admin* mendapatkan akses untuk melihat seluruh data transaksi (`index`) dan menghapusnya (`destroy`).

```php
Route::middleware('auth:api')->group(function () {
    // transactions (User / Customer roles bisa show, store, update)
    Route::apiResource('transactions', TransactionController::class)->only(['show', 'store', 'update']);
    
    // ... rute resource entities (books, genres, dll) ...

    // hanya admin yang dapat akses secara penuh
    Route::middleware(['role:admin'])->group(function () {
        // ... rute admin manipulation files ...
        
        // transactions (Admin viewall & destroy permission)
        Route::apiResource('transactions', TransactionController::class)->only(['index', 'destroy']);
    });
});
```
