# Coralis Auth Test

Project ini merupakan implementasi **Authentication System** (Register, Login, Forgot Password, Reset Password) menggunakan **Node.js (Express) + MySQL** sebagai backend dan **Flutter (Android)** sebagai frontend.

Dokumen README ini ditujukan agar **dapat langsung diikuti dan dieksekusi** sesuai instruksi.

---

## 1. Prasyarat

Pastikan seluruh kebutuhan berikut sudah terinstall di komputer Anda.

### Backend
- Node.js **v18 atau lebih baru**
- NPM
- MySQL Server
- MySQL Client / phpMyAdmin

### Frontend
- Flutter **v3.38.7**
- Dart **v3.10.7**
- Android Studio
- Android Emulator (AVD) atau device Android fisik

Cek instalasi:
```bash
node -v
npm -v
flutter --version
flutter doctor
```

---

## 2. Setup Database

1. Jalankan MySQL Server
2. Buat database baru:
```sql
CREATE DATABASE coralis_auth;
```

3. Import database:
- Gunakan file `database/database.sql`
- Import melalui phpMyAdmin atau MySQL client

---

## 3. Konfigurasi Environment Backend

Project backend menggunakan environment variable.

### File `.env.example`
Buat file `.env` di folder `backend` berdasarkan contoh berikut:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=coralis_auth
```

## 4. Setup & Menjalankan Backend

1. Masuk ke folder backend:
```bash
cd backend
```

2. Install dependency:
```bash
npm install
```

3. Jalankan server:
```bash
npm run dev
```

Jika berhasil, akan muncul log:
```
Server running on port 3000
```

Backend berjalan di:
```
http://localhost:3000
```

---

## 5. Alur Fitur Forgot Password

Fitur **Forgot Password** menggunakan mekanisme **token reset password**.

### Alur Proses
1. User membuka halaman **Forgot Password** di aplikasi Flutter
2. User memasukkan email yang terdaftar
3. Backend:
   - Mengecek email di database
   - Menghasilkan token reset password
   - Menyimpan **hash token** dan waktu kadaluarsa ke database
   - Menampilkan token asli di terminal backend (mode demo)
4. User diarahkan ke halaman **Reset Password**
5. User memasukkan token yang didapat dari terminal backend
6. Sistem memverifikasi token ke backend
7. Jika token valid, form password baru akan terbuka
8. User memasukkan password baru
9. Backend:
   - Mengganti password user
   - Menghapus token reset (one-time use)
10. User dapat login kembali dengan password baru

> Catatan: Token reset **tidak disimpan dalam bentuk asli** di database demi keamanan.

---

## 6. API Endpoint Utama

### Register
**POST** `/api/register`
```json
{
  "email": "user@gmail.com",
  "password": "user1234"
}
```

### Login
**POST** `/api/login`
```json
{
  "email": "user@gmail.com",
  "password": "user1234"
}
```

### Forgot Password
**POST** `/api/forgot-password`
```json
{
  "email": "user@gmail.com"
}
```

### Verify Reset Token
**POST** `/api/verify-reset-token`
```json
{
  "token": "reset_token"
}
```

### Reset Password
**POST** `/api/reset-password`
```json
{
  "token": "reset_token",
  "password": "newpassword123"
}
```

---

## 7. Menjalankan Aplikasi Flutter (Android Emulator)

1. Masuk ke folder Flutter:
```bash
cd flutter_app
```

2. Install dependency:
```bash
flutter pub get
```

3. Jalankan Android Emulator melalui Android Studio

4. Jalankan aplikasi:
```bash
flutter run
```

> Pastikan backend **sudah berjalan** sebelum menjalankan Flutter.

---

## 8. Konfigurasi Endpoint Flutter

Gunakan base URL berikut di Flutter:

```dart
static const baseUrl = "http://10.0.2.2:3000/api";
```

Keterangan:
- `10.0.2.2` digunakan untuk Android Emulator
- Gunakan IP lokal jika menjalankan di device fisik

---

## 9. Akun Testing (Demo)

```
Email    : user@gmail.com
Password : user1234
```

---

## 10. Status Project

- Backend selesai
- Database siap
- Frontend terhubung
- Fitur autentikasi berjalan normal

