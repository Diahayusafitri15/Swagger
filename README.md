# Projek PKL - API Modern Post & Auth

Sistem RESTful API untuk manajemen postingan dengan fitur autentikasi JWT dan Upload Gambar.

## Fitur Utama
- **CRUD Postingan**: Manajemen data judul, isi, dan gambar.
- **Autentikasi**: Register & Login menggunakan Argon2 hashing.
- **Security**: JWT Access & Refresh Token.
- **Dokumentasi**: Swagger UI interaktif.

## Cara Instalasi
1. Clone repositori ini.
2. Jalankan `npm install`.
3. Duplikat file `.env.example` menjadi `.env` dan sesuaikan konfigurasinya.
4. Pastikan PostgreSQL sudah berjalan dan database sudah dibuat.
5. Jalankan server dengan `node index.js` atau `npm start`.

## Endpoint Dokumentasi
Buka `http://localhost:3000/api-docs` setelah server berjalan.