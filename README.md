# API Automation Testing - Mocha`r`n- Visual Studio Code (VS Code)

## Deskripsi
Project ini merupakan tugas automation testing API menggunakan JavaScript dan Mocha.

## Base URL
https://belajar-bareng.onrender.com

## Test Scenarios
1. **POST Login** - Menguji proses login dan menyimpan token autentikasi.
2. **GET User** - Mengambil data user menggunakan token login.
3. **POST Add User (Positive Case)** - Menguji penambahan user dengan data valid.
4. **POST Add User (Negative Case)** - Menguji penambahan user dengan data tidak valid.

## Assertions
Setiap request memiliki dua jenis assertion:
- **Status Code** - Memvalidasi status respons API.
- **Response Body** - Memvalidasi isi respons API.

## Tools
- JavaScript
- Node.js
- Mocha`r`n- Visual Studio Code (VS Code)

## How to Run
Jalankan perintah berikut di terminal:

```bash
npx mocha Tugas.js
```

## Notes
Token dari proses login digunakan untuk request selanjutnya.
Endpoint, request body, dan ekspektasi respons mengikuti implementasi API pada file tugas.

