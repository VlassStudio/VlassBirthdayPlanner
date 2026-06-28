# Project Overview: Vlass PartyBox
**Tanggal Pembaruan Terakhir**: Juni 2026

## Ringkasan Proyek
Vlass PartyBox adalah platform *all-in-one* berbasis web yang berfungsi sebagai **Perencana Pesta (Birthday Planner)** yang interaktif. Platform ini dirancang untuk memecahkan kerumitan mengelola acara ulang tahun dengan memisahkan pengalaman pengguna ke dalam **Dua Dunia (Two Worlds)**:
1. **Mode Anak 🧒**: Fokus pada aspek keamanan (pelacakan alergi, konfirmasi *drop-off* anak, registri hadiah mainan) dan desain yang ceria (Dinosaurus, Unicorn).
2. **Mode Dewasa 🥂**: Fokus pada keanggunan (manajemen anggaran/minuman, instruksi *dress-code*, integrasi kalender) dan desain elegan (Minimalist, Neon, Retro).

## Model Bisnis (Monetisasi)
Menggunakan strategi **Pembayaran Per-Event (Pay-per-Event)**:
- **Akun Gratis Selamanya**: Pengguna dapat mendaftar dan menggunakan platform tanpa batas waktu.
- **Paket Basic (Gratis)**: Terbatas untuk acara kecil. Maksimal 10 tamu, fitur RSVP standar, ada *watermark*, dan pilihan tema terbatas.
- **Paket PRO (Rp 99.000 / Pesta)**: Pembelian satu kali untuk *satu acara spesifik*. Membuka tamu *unlimited*, notifikasi WhatsApp, 50+ tema VIP, tanpa *watermark*, dan ekspor laporan tamu.

## Status Pengembangan (Saat Ini)
Saat ini proyek berada di fase purwarupa fungsional (Fungsional Prototype) menggunakan **Next.js (App Router)** dan desain **Glassmorphism/Modern UI** tanpa TailwindCSS.

### ✅ Fitur yang Sudah Selesai
- **Landing Page Interaktif**: Animasi 3D, *Hero Section*, *Bento Grid* fitur, dan Tabel Harga yang responsif. Mendukung terjemahan EN/ID dengan `next-intl`.
- **Halaman Galeri Tema Publik**: Halaman *showcase* independen tempat pengunjung dapat memfilter dan melihat seluruh koleksi tema (Anak-anak & Dewasa) tanpa harus login.
- **Setup Wizard (Buat Pesta)**: Formulir 4 langkah untuk membuat pesta:
  1. Pilih Mode (Anak/Dewasa)
  2. Pilih Waktu & Lokasi (dengan Kalender Kustom yang intuitif)
  3. **Paywall**: Pilih Paket (Basic / PRO) dengan simulasi pembayaran
  4. Galeri Tema (Terfiltrasi berdasarkan Mode dan dikunci berdasarkan Paket)
- **Dasbor Utama (State Management)**: Menampilkan statistik pesta yang baru saja dibuat. Data disimpan menggunakan `localStorage`.
- **Manajemen Tamu & RSVP (Guest List)**: Tabel dinamis untuk menambah tamu, mencatat alergi/catatan, menghitung *Plus-one*. Dilengkapi penguncian 10 tamu jika menggunakan paket Basic.
- **Halaman To-Do Checklist**: Daftar tugas interaktif yang dikelompokkan berdasarkan rentang waktu. Memiliki batas tugas kustom untuk paket Basic dan simulasi AI Generator untuk paket PRO.
- **Halaman Pelacak Anggaran (Budget)**: Kalkulator interaktif dengan deteksi batas anggaran (*over-budget*). Memiliki fitur "Bar & Beverage Tracker" khusus untuk Pesta Dewasa.
- **Visual Builder (Editor Undangan)**: UI terpisah (Mirip *Canva*) dengan Layout Mobile split-screen untuk mengedit teks dan warna undangan secara Live Preview.
- **Integrasi Undangan WhatsApp (Mockup)**: Tombol dan pop-up simulasi untuk membagikan undangan via WA.
- **Ekspor Laporan Tamu**: Kemampuan untuk mengekspor data tamu ke PDF (via `jspdf`) dan Excel (via `xlsx`).

### 🚧 Fitur yang Sedang Dalam Antrean (To-Do)
*(Belum ada fitur frontend tersisa. Tahap selanjutnya adalah integrasi Backend/Database/Payment).*

## Teknologi Utama
- Framework: **Next.js 14+ (App Router)**
- Terjemahan: **next-intl**
- Styling: **CSS Vanilla (Custom Utility) & Inline Styles** (Tidak menggunakan Tailwind agar estetika lebih mudah dikontrol secara spesifik).
- Animasi: **Framer Motion** untuk transisi *micro-interactions*.
- Ikonografi: **Lucide React**.
