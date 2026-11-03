# TODO - debt-track

> Catatan perbaikan & pengembangan project.
> Centang `[x]` kalau sudah selesai.

---

## A. Rapikan kode yang sudah ada

- [ ] **A1. Status code HTTP** - semua controller masih membalas `200` walau error  
  Ubah `response.json(...)` menjadi `response.status(500).json(...)`, `400` untuk input salah, `404` untuk data tidak ditemukan.
- [ ] **A2. `GET /debts/:id`** - belum ada  
  Tambah `getDebtById` di `debt.controller.js` (contek `getUserById`), lalu daftarkan di `routes/debt.route.js`.
- [ ] **A3. Hash password** - `user.controller.js` baris 7 masih menyimpan password mentah  
  Pakai `bcrypt.hash(request.body.password, 10)` sebelum `User.create()`.
- [x] **A4. Cek hasil `destroy`** - `deleteUser` & `deleteDebt`  
  Kalau `result === 0` (data tidak ada / ditolak FK), balas `404` bukan pesan `"has deleted"`.
- [ ] **A5. Validasi FK sebelum insert** - `addNewDebt`  
  Cek `Debtor.findByPk(debtor_id)` dan `User.findByPk(user_id)`. Kalau tidak ada, balas `404`.
- [x] **A6. Update hanya field yang dikirim** - ternyata BUKAN bug  
  Sequelize v6 otomatis membuang nilai `undefined` (`node_modules/sequelize/lib/model.js:1906`), jadi tidak ada kolom yang ter-NULL. Tidak perlu diubah.
- [x] **A7. Indentasi** - `debt.controller.js` baris 49 (`debtor_id` menjorok 9 spasi).
- [ ] **A8. Port dari env** - `index.js`: `const PORT = process.env.PORT || 8000`.
- [ ] **A9. `GET /debts` belum memfilter pemilik** - hasil uji route: utang semua akun ikut tampil  
  `Debt.findAll()` -> `Debt.findAll({where: {user_id: ...}})`. Sementara bisa lewat query `?user_id=2`.
- [ ] **A10. Balasan 404 masih HTML** - route yang tidak terdaftar membalas halaman HTML bawaan Express  
  Tambah di `index.js` sebelum `app.listen`: `app.use((req, res) => res.status(404).json({success: false, message: 'route not found'}))`.

---

## B. Tambahkan fitur baru

### Wajib (inti aplikasi)

- [x] **B1. Modul Debtor**  — SELESAI & diuji
  File baru: `controllers/debtor.controller.js`, `routes/debtor.route.js`  
  Endpoint: `GET /debtors`, `POST /debtors`, `GET /debtors/:id`, `PUT /debtors/:id`, `DELETE /debtors/:id`  
  Mount di `index.js`: `app.use('/debtors', debtorRoute)`  
  Field: `user_id`, `name`, `phone`, `email`, `address`, `notes`  
  Bonus: filter `?user_id=`, nama dirapikan otomatis (Title Case), hapus ditolak kalau debtor masih punya utang.

- [x] **B1b. `POST /debts` sekaligus mengisi data debtor** — SELESAI
  Body tambahan: `debtor_name`, `debtor_phone`, `debtor_email`, `debtor_address`, `debtor_notes`.  
  Debtor baru dibuat lengkap; kalau debtor sudah ada, hanya field yang masih kosong yang diisi (data lama tidak ditimpa).

- [ ] **B2. Modul Transaction**  
  File baru: `controllers/transaction.controller.js`, `routes/transaction.route.js`  
  Endpoint: `GET /transactions`, `POST /transactions`, `DELETE /transactions/:id`  
  Mount di `index.js`: `app.use('/transactions', transactionRoute)`

- [ ] **B3. Logika pembayaran (paling penting)**  
  Di dalam `POST /transactions` saat `type === 'payment'`:  
  - `remaining_amount = remaining_amount - amount`  
  - `status = 'partial'` kalau sisa > 0  
  - `status = 'paid'` kalau sisa = 0  
  - Tolak dengan `400` kalau `amount > remaining_amount`  
  - Bungkus insert + update dalam `sequelize.transaction()`

### Nilai tambah (pilih 1-2 saja)

- [ ] **B4. Filter** - `GET /debts?status=unpaid`
- [ ] **B5. Ringkasan** - `GET /debts/summary` total utang per debtor
- [ ] **B6. Koreksi transaksi** - `PUT /transactions/:id`
- [ ] **B7. Login + JWT** - `user_id` diambil dari token, bukan dari body

---

## C. Urutan pengerjaan

1. [ ] A2 - `GET /debts/:id` (pemanasan)
2. [ ] A1 + A4 + A5 + A6 - status code & validasi
3. [ ] B1 - modul Debtor
4. [ ] B2 + B3 - modul Transaction & logika pembayaran
5. [ ] A3 - bcrypt
6. [ ] B4 / B5 - fitur tambahan

---

## D. Checklist sebelum presentasi

- [ ] `npx sequelize-cli db:migrate` sudah dijalankan
- [ ] MySQL hidup, database `debt-track` ada
- [ ] Alur Postman lengkap: user -> debtor -> debt -> cicil -> lunas
- [ ] `GET /debts` membuktikan `remaining_amount` berubah
- [ ] `GET /users` tidak menampilkan `password_hash`
- [ ] README: latar belakang masalah + screenshot

---

## E. Jangan dikerjakan dulu

Frontend, Docker, deploy online, notifikasi WA/email.  
Logika cicilan belum benar = fitur tambahan tidak ada gunanya.