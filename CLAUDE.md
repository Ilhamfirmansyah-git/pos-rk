# CLAUDE.md — Panduan Proyek POS-RK

Dokumen ini adalah panduan utama bagi Claude dalam membangun aplikasi **Point of Sale (POS) RK**. Baca seluruh dokumen ini sebelum menulis kode.

---

## Gambaran Proyek

**POS-RK** adalah aplikasi kasir modern berbasis web yang dirancang untuk UMKM (Usaha Mikro Kecil Menengah). Aplikasi ini harus berjalan mulus di tablet (layar sentuh) maupun desktop kasir.

### Tujuan Utama
- Transaksi penjualan cepat dan bebas error
- Manajemen produk dan stok yang mudah
- Laporan penjualan yang actionable
- Operasi offline-first (tetap berjalan tanpa internet)

---

## Tech Stack

| Layer | Pilihan |
|-------|---------|
| Frontend | React 18 + TypeScript |
| State Management | Zustand |
| Styling | Tailwind CSS + shadcn/ui |
| Database Lokal | IndexedDB via Dexie.js |
| Sinkronisasi | Supabase (opsional, untuk multi-device) |
| Build | Vite |
| Testing | Vitest + React Testing Library |

### Prinsip Pemilihan Stack
- Prioritas performa di hardware mid-range (tablet Rp 2-3 juta)
- Bundle size kecil, load cepat
- Offline-first: semua operasi kasir harus jalan tanpa internet

---

## Arsitektur Aplikasi

```
src/
├── app/              # Entry point, router, global providers
├── features/         # Fitur-fitur utama (satu folder per fitur)
│   ├── pos/          # Layar kasir utama
│   ├── products/     # Manajemen produk & kategori
│   ├── transactions/ # Riwayat & detail transaksi
│   ├── inventory/    # Stok & peringatan stok
│   ├── reports/      # Laporan penjualan
│   └── settings/     # Pengaturan toko, printer, user
├── shared/           # Komponen, hooks, utils yang dipakai banyak fitur
│   ├── components/   # UI components generik
│   ├── hooks/        # Custom hooks
│   └── lib/          # Helpers, formatters, validators
└── db/               # Schema & queries Dexie.js
```

### Pola yang Harus Diikuti
- **Feature-first**: kode satu fitur ada di satu folder, tidak tersebar
- **Server components**: gunakan kalau pakai Next.js; kalau Vite, semua client
- **Custom hooks untuk logic**: logika bisnis di hook, bukan di komponen
- **Presentational vs Container**: pisahkan UI murni dari logika

---

## Fitur Inti

### 1. Layar Kasir (POS Screen)
- Grid produk dengan gambar, nama, harga
- Filter/search produk by kategori atau nama
- Keranjang belanja dengan edit qty, hapus item
- Kalkulasi total otomatis (subtotal, diskon, pajak, kembalian)
- Shortcut keyboard untuk kasir desktop

### 2. Manajemen Produk
- CRUD produk: nama, SKU, harga jual, harga modal, stok, kategori, gambar
- Import produk dari CSV/Excel
- Varian produk (ukuran, warna, dll)
- Barcode scanner support

### 3. Transaksi & Pembayaran
- Metode pembayaran: tunai, QRIS, kartu debit/kredit, transfer
- Cetak struk (thermal printer 58mm/80mm)
- Transaksi pending / hold
- Retur/refund

### 4. Laporan
- Ringkasan harian / mingguan / bulanan
- Produk terlaris
- Grafik omzet
- Export ke PDF/Excel

### 5. Manajemen Stok
- Update stok otomatis saat transaksi
- Peringatan stok menipis
- Log perubahan stok (masuk/keluar)

### 6. Multi-User
- Role: Owner, Admin, Kasir
- Kasir: hanya bisa transaksi
- Admin: + manajemen produk & stok
- Owner: akses penuh + laporan keuangan

---

## Standar Kode

### TypeScript
- Selalu gunakan `strict: true`
- Definisikan interface/type untuk semua data model di `src/shared/types/`
- Hindari `any` — gunakan `unknown` dan lakukan type narrowing

### Komponen React
- Functional components dengan hooks
- Props interface eksplisit, tidak ada `React.FC<>`
- Default export untuk komponen utama, named export untuk sub-komponen
- Komponen max ~150 baris; pecah jika lebih besar

### Naming
- Komponen: `PascalCase` (`ProductCard`, `CartItem`)
- Hooks: `useCamelCase` (`useCart`, `useProductSearch`)
- File: sama dengan nama export utama (`ProductCard.tsx`)
- Konstanta: `UPPER_SNAKE_CASE`
- Fungsi/variabel: `camelCase`

### Styling
- Gunakan Tailwind utility classes
- Hindari inline style kecuali untuk nilai dinamis (width dari JS, dll)
- Gunakan `cn()` helper untuk conditional classes
- Variabel warna & spacing lewat Tailwind config, bukan hardcode

### State Management
- Zustand store per-fitur: `useCartStore`, `useProductStore`, dll
- State UI lokal (modal buka/tutup, input value) pakai `useState`
- State server/async pakai TanStack Query (jika ada backend)

---

## Panduan Database Lokal (Dexie.js)

```typescript
// Contoh schema
const db = new Dexie('pos-rk');
db.version(1).stores({
  products: '++id, sku, name, categoryId, *barcode',
  transactions: '++id, createdAt, cashierId, status',
  transactionItems: '++id, transactionId, productId',
  categories: '++id, name',
  stockLogs: '++id, productId, createdAt',
});
```

- Selalu buat index untuk field yang sering di-query atau di-filter
- Gunakan transaksi Dexie (`db.transaction()`) untuk operasi multi-tabel
- Validasi data sebelum `db.add()` / `db.put()`

---

## Offline & Sinkronisasi

- Semua operasi POS harus jalan tanpa internet
- Tandai record yang belum tersinkron dengan field `syncedAt: null`
- Background sync saat koneksi kembali
- Conflict resolution: last-write-wins untuk produk; append-only untuk transaksi

---

## Aksesibilitas & Performa

- Touch target minimum 44×44px untuk semua tombol interaktif
- Kontras warna minimum WCAG AA (4.5:1 untuk teks normal)
- Lazy load gambar produk
- Virtualisasi list produk jika > 200 item (pakai `react-virtual`)
- First Contentful Paint < 2s di jaringan 3G

---

## Workflow Pengembangan

1. Buat branch dari `main` dengan nama `feat/nama-fitur` atau `fix/nama-bug`
2. Tulis atau update test sebelum/bersamaan dengan implementasi
3. Jalankan `npm run lint` dan `npm run test` sebelum commit
4. Commit message format: `feat: deskripsi singkat` / `fix: deskripsi singkat`
5. Buka PR ke `main` dengan deskripsi fitur dan screenshot jika ada UI change

---

## File yang Tidak Boleh Dimodifikasi Tanpa Diskusi

- `db/schema.ts` — perubahan schema butuh migrasi
- `src/shared/types/index.ts` — tipe data inti
- Konfigurasi Tailwind dan shadcn theme

---

## Referensi Skill

Lihat `.claude/skills/ui-ux.md` untuk panduan detail desain antarmuka POS.
