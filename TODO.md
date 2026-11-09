# Todo: Menyiapkan Debt Track untuk Database dan Publikasi

Kerjakan berurutan. Tandai `[x]` setelah langkah selesai dan sudah diuji.

## 1. Rapikan konfigurasi database

- [ ] Pindahkan username, password, host, dan nama database dari `config/config.json` ke file `.env`.
- [ ] Tambahkan `.env` ke `.gitignore`; jangan unggah kredensial database ke GitHub.
- [ ] Buat `.env.example` berisi nama variabel tanpa nilai rahasia.
- [ ] Pastikan konfigurasi development, test, dan production menggunakan database/akun yang sesuai.
- [ ] Tambahkan pemeriksaan koneksi database saat server mulai; tampilkan error jika koneksi gagal.

## 2. Pastikan skema database benar

- [ ] Periksa migration untuk tabel `users`, `debtors`, `debts`, dan `transactions`.
- [ ] Pastikan foreign key dan aturan hapus data sudah sesuai agar catatan utang/transaksi tidak terhapus tanpa sengaja.
- [ ] Pastikan nominal memakai tipe desimal dan validasi menolak nominal nol atau negatif.
- [ ] Jalankan migration dari database kosong, lalu pastikan seluruh tabel terbentuk.
- [ ] Buat seeder data contoh untuk development; jangan gunakan data contoh di production.

## 3. Amankan akun dan kepemilikan data

- [ ] Ganti MD5 sebelum aplikasi dipublikasikan; gunakan bcrypt atau Argon2 untuk password.
- [ ] Buat endpoint register dan login yang tervalidasi.
- [ ] Tambahkan autentikasi token/session dan middleware untuk membaca user yang sedang login.
- [ ] Ambil `user_id` dari identitas login di server, bukan dari body request.
- [ ] Pastikan semua operasi debtor, debt, dan transaction hanya mengakses data milik user tersebut.
- [ ] Jangan pernah mengirim `password_hash` pada respons API, termasuk endpoint daftar user.

## 4. Selesaikan alur utang dan pembayaran

- [ ] Rapikan pembuatan utang: temukan atau buat debtor berdasarkan nama dan user yang login.
- [ ] Pastikan utang baru mengisi `remaining_amount` dari `initial_amount`.
- [ ] Selesaikan endpoint `POST /transactions` dan route-nya.
- [ ] Untuk pembayaran, ambil utang dari `debt_id`, validasi jumlah terhadap `remaining_amount`, lalu kurangi sisa utang.
- [ ] Simpan transaksi dan perbarui utang dalam satu transaksi database agar keduanya berhasil atau batal bersama.
- [ ] Hitung status utang secara konsisten: `unpaid`, `partial`, `paid`, atau `overdue`.
- [ ] Tambahkan endpoint riwayat transaksi per utang.
- [ ] Jangan izinkan perubahan `user_id`, `debt_id`, status, atau nominal melalui update umum tanpa aturan yang jelas.

## 5. Validasi dan uji API

- [ ] Validasi field wajib, format email/tanggal, ID, nominal, dan panjang teks.
- [ ] Gunakan HTTP status yang sesuai untuk input tidak valid, data tidak ditemukan, dan error server.
- [ ] Uji register, login, buat debtor, buat debt, bayar sebagian, dan lunasi utang.
- [ ] Uji pembayaran melebihi sisa utang, utang tidak ditemukan, nominal negatif, dan akses user lain.
- [ ] Pastikan gagal menyimpan transaksi tidak mengubah sisa utang, dan sebaliknya.
- [ ] Jalankan test pada database khusus test, bukan database production.

## 6. Persiapan publikasi

- [ ] Tambahkan script `start` untuk production dan pastikan server memakai port dari environment.
- [ ] Batasi CORS ke alamat frontend yang diizinkan.
- [ ] Matikan detail error internal pada respons production; simpan log server tanpa password/token.
- [ ] Siapkan database production dengan user terbatas hak aksesnya dan koneksi terenkripsi bila didukung.
- [ ] Jalankan migration production melalui proses deployment yang terkontrol.
- [ ] Siapkan backup database dan uji cara memulihkannya.
- [ ] Uji endpoint health, startup, dan alur utama pada environment staging sebelum publikasi.
- [ ] Pastikan `.env`, dump database, password, token, dan data pribadi tidak ikut terunggah.

## Kriteria siap dipublikasikan

- [ ] Aplikasi hanya memakai konfigurasi environment untuk rahasia.
- [ ] Password disimpan dengan bcrypt/Argon2, autentikasi aktif, dan data tiap user terisolasi.
- [ ] Migration dapat membuat database dari awal; seeder hanya untuk development/test.
- [ ] Pembayaran memperbarui transaksi dan sisa utang secara atomik.
- [ ] Tes utama lulus di staging dan backup database dapat dipulihkan.
