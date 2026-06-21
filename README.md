# POS-RK

Aplikasi kasir (Point of Sale) modern berbasis web untuk UMKM Indonesia.
Dibangun dengan React 18 + TypeScript + Tailwind CSS. Berjalan **offline-first**.

## Prasyarat

- Node.js v20 atau lebih baru
- npm v10 atau lebih baru

## Memulai

```bash
# 1. Clone repositori
git clone https://github.com/ilhamfirmansyah-git/pos-rk.git
cd pos-rk

# 2. Install dependensi
npm install

# 3. Salin file environment
cp .env.example .env.local

# 4. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.local
#    (opsional untuk pengembangan lokal tanpa sinkronisasi cloud)

# 5. Jalankan development server
npm run dev
```

Buka http://localhost:3000 di browser.

## Perintah Tersedia

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build produksi |
| `npm run preview` | Preview hasil build |
| `npm run typecheck` | Cek TypeScript tanpa build |
| `npm run lint` | Jalankan ESLint |
| `npm run lint:fix` | Perbaiki error ESLint otomatis |
| `npm run format` | Format kode dengan Prettier |
| `npm run test` | Jalankan semua test |
| `npm run test:watch` | Test mode watch |
| `npm run test:coverage` | Test dengan laporan coverage |

## Arsitektur

```
src/
├── app/              # Entry point, router, provider global
├── features/         # Fitur-fitur utama (satu folder per fitur)
│   ├── pos/          # Layar kasir
│   ├── products/     # Manajemen produk
│   ├── transactions/ # Riwayat transaksi
│   ├── inventory/    # Manajemen stok
│   ├── reports/      # Laporan penjualan
│   └── settings/     # Pengaturan toko
├── shared/           # Komponen, hooks, dan utils yang dipakai bersama
│   ├── components/   # UI components (layout, ui/)
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Helpers dan formatters
│   └── types/        # TypeScript interfaces & enums
├── db/               # Schema dan query Dexie.js (IndexedDB)
└── lib/              # Konfigurasi library (Supabase)
```

Selengkapnya di [CLAUDE.md](./CLAUDE.md).

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Database Lokal**: Dexie.js (IndexedDB, offline-first)
- **Sinkronisasi**: Supabase
- **Build**: Vite
- **Testing**: Vitest + React Testing Library
