# Skill: UI/UX — Point of Sale RK

Panduan desain dan antarmuka untuk aplikasi POS-RK. Gunakan skill ini setiap kali membangun atau merevisi layar UI.

---

## Prinsip Desain Utama

1. **Speed First** — Kasir harus bisa menyelesaikan 1 transaksi dalam < 30 detik
2. **Error-Tolerant** — Konfirmasi sebelum aksi destruktif; undo jika memungkinkan
3. **Touch-Optimized** — Semua interaksi harus nyaman di layar sentuh 10"
4. **Glanceable** — Informasi penting terlihat dalam sekali pandang (total, stok, status)
5. **Low Cognitive Load** — Label jelas, icon + teks, tidak ada jargon teknis

---

## Sistem Warna

Gunakan token warna ini secara konsisten di seluruh aplikasi:

```
Primary:    #2563EB  (biru — aksi utama, tombol bayar)
Success:    #16A34A  (hijau — transaksi berhasil, stok aman)
Warning:    #D97706  (kuning — stok menipis, peringatan)
Danger:     #DC2626  (merah — hapus, error, stok habis)
Neutral:    #6B7280  (abu — teks sekunder, border)
Background: #F9FAFB  (layar utama)
Surface:    #FFFFFF  (card, modal, sidebar)
```

### Dark Mode (opsional, prioritas rendah)
- Gunakan Tailwind `dark:` variant
- Background gelap: `#111827`, Surface: `#1F2937`

---

## Tipografi

| Penggunaan | Class Tailwind |
|------------|----------------|
| Judul halaman | `text-2xl font-bold text-gray-900` |
| Subjudul / label section | `text-sm font-semibold text-gray-500 uppercase tracking-wide` |
| Harga produk (besar) | `text-xl font-bold text-gray-900` |
| Total transaksi | `text-3xl font-extrabold text-primary` |
| Body / deskripsi | `text-base text-gray-700` |
| Teks kecil / meta | `text-xs text-gray-400` |

Font: **Inter** (system-ui fallback). Tidak perlu custom font.

---

## Layout Layar Kasir (POS Screen)

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: Logo | Nama Kasir | Shift | Jam          [Menu]  │
├───────────────────────────────┬──────────────────────────┤
│                               │                          │
│   PANEL PRODUK (60%)          │   PANEL KERANJANG (40%)  │
│                               │                          │
│  [Search] [Filter Kategori]   │  Item 1    Rp 15.000  [×]│
│                               │  Item 2    Rp 25.000  [×]│
│  ┌────┐ ┌────┐ ┌────┐        │  ─────────────────────── │
│  │Prod│ │Prod│ │Prod│        │  Subtotal   Rp 40.000    │
│  │ 1  │ │ 2  │ │ 3  │        │  Diskon     Rp  0        │
│  └────┘ └────┘ └────┘        │  Pajak      Rp  0        │
│  ┌────┐ ┌────┐ ┌────┐        │  ═════════════════════   │
│  │Prod│ │Prod│ │Prod│        │  TOTAL    Rp 40.000      │
│  │ 4  │ │ 5  │ │ 6  │        │                          │
│  └────┘ └────┘ └────┘        │  [Diskon]  [Tahan Order] │
│                               │                          │
│                               │  [    BAYAR SEKARANG   ] │
└───────────────────────────────┴──────────────────────────┘
```

### Aturan Layout
- Panel produk: 3 kolom di tablet, 4-5 kolom di desktop
- Panel keranjang: sticky, tidak ikut scroll
- Tombol BAYAR: full-width, minimum height 56px, warna primary
- Responsive: di layar < 768px, tampilkan keranjang sebagai drawer bawah

---

## Kartu Produk

```
┌─────────────────┐
│                 │
│   [Gambar 1:1]  │  ← aspect-ratio square, object-cover
│                 │
│  Nama Produk    │  ← font-medium, max 2 baris, truncate
│  Rp 15.000      │  ← font-bold, text-primary
│  Stok: 24       │  ← text-xs, text-gray-400
└─────────────────┘
```

**State kartu:**
- Default: border transparan, shadow-sm
- Hover: border-primary/30, shadow-md, scale-[1.02]
- Active/pressed: scale-[0.98], shadow-none
- Stok habis: opacity-50, grayscale, tidak bisa diklik, label "Habis"
- Stok menipis (≤5): badge kuning pojok kanan atas "Sisa N"

---

## Modal Pembayaran

```
┌─────────────────────────────────┐
│  Pilih Metode Pembayaran        │
│  ─────────────────────────────  │
│  Total: Rp 40.000               │
│                                 │
│  [Tunai] [QRIS] [Transfer] [···]│
│                                 │
│  Jumlah Bayar:                  │
│  [ Rp ______________ ]         │
│                                 │
│  Kembalian: Rp 10.000           │
│                                 │
│  [Batal]      [Proses Bayar]    │
└─────────────────────────────────┘
```

**Aturan:**
- Tombol nominal cepat: Rp 5rb, 10rb, 20rb, 50rb, 100rb
- Input jumlah bayar: hanya angka, format rupiah otomatis
- Kembalian tampil merah jika bayar kurang, hijau jika lebih
- Tombol "Proses Bayar" disabled jika bayar < total

---

## Komponen Umum

### Tombol (Button)
```
Primer:     bg-primary text-white hover:bg-primary/90         py-3 px-6 rounded-xl
Sekunder:   bg-gray-100 text-gray-700 hover:bg-gray-200       py-3 px-6 rounded-xl
Bahaya:     bg-red-50 text-red-600 hover:bg-red-100 border border-red-200
Ghost:      text-gray-600 hover:bg-gray-100
Ukuran besar (bayar): min-h-[56px] text-lg font-semibold
```

### Input
```
border border-gray-300 rounded-lg px-4 py-2.5
focus:ring-2 focus:ring-primary/20 focus:border-primary
placeholder:text-gray-400
error: border-red-400 focus:ring-red-100
```

### Badge / Status
```
Sukses:    bg-green-50 text-green-700 border border-green-200
Pending:   bg-yellow-50 text-yellow-700 border border-yellow-200
Gagal:     bg-red-50 text-red-700 border border-red-200
Info:      bg-blue-50 text-blue-700 border border-blue-200
Ukuran:    text-xs px-2 py-0.5 rounded-full font-medium
```

### Tabel (Laporan & Riwayat)
- Header: `bg-gray-50 text-xs uppercase text-gray-500 font-semibold`
- Row hover: `hover:bg-gray-50 transition-colors`
- Zebra: tidak perlu, gunakan hover saja
- Pagination: max 25 baris per halaman

---

## Notifikasi & Feedback

| Situasi | Komponen | Durasi |
|---------|----------|--------|
| Transaksi berhasil | Toast hijau + suara | 3 detik |
| Error validasi | Inline di field | Sampai diperbaiki |
| Stok habis | Toast merah | 4 detik |
| Loading data | Skeleton (bukan spinner) | — |
| Aksi hapus | Modal konfirmasi | — |
| Sinkronisasi | Snackbar bawah | Auto-dismiss |

**Toast position:** pojok kanan bawah, tidak menutupi tombol BAYAR.

---

## Layar Struk / Konfirmasi Transaksi

Setelah pembayaran berhasil, tampilkan layar penuh (bukan modal) dengan:
- Animasi centang hijau besar (Lottie atau CSS)
- Detail transaksi ringkas
- Tombol: "Cetak Struk" | "Transaksi Baru" (auto-fokus ke "Transaksi Baru")
- Auto redirect ke POS screen setelah 8 detik jika tidak ada aksi

---

## Halaman Laporan

- Gunakan chart library: **Recharts** (sudah ada di ekosistem shadcn)
- Grafik omzet: Line chart, titik per hari/jam
- Produk terlaris: Bar chart horizontal, top 10
- Summary card: 4 kartu di atas (Omzet, Transaksi, Item Terjual, Rata-rata)
- Filter tanggal: DateRangePicker, preset: Hari ini, 7 hari, 30 hari, Bulan ini

---

## Panduan Animasi

- Gunakan `transition-all duration-150` untuk hover state komponen
- Modal: `animate-in fade-in-0 zoom-in-95` (shadcn default)
- Skeleton loading: `animate-pulse bg-gray-200 rounded`
- Hindari animasi yang delay > 300ms — memperlambat persepsi kasir
- Matikan animasi jika `prefers-reduced-motion: reduce`

---

## Panduan Ikon

Gunakan **Lucide React** (sudah bundled dengan shadcn/ui):
```
ShoppingCart  → keranjang / POS
Package       → produk
BarChart2     → laporan
Settings      → pengaturan
Plus          → tambah item
Trash2        → hapus
Printer       → cetak struk
QrCode        → QRIS
Banknote      → tunai
X             → tutup / batal
Check         → sukses
AlertTriangle → peringatan
```

Ukuran ikon: `size={16}` untuk inline, `size={20}` untuk tombol, `size={24}` untuk navigasi.

---

## Checklist Sebelum Ship UI

- [ ] Semua touch target ≥ 44×44px
- [ ] Tidak ada teks yang terpotong (gunakan truncate/line-clamp)
- [ ] State loading, error, dan empty state sudah ada di semua list/tabel
- [ ] Konfirmasi sebelum aksi hapus atau void transaksi
- [ ] Keyboard navigation berfungsi (Tab, Enter, Escape)
- [ ] Responsive: test di 768px (tablet) dan 1280px (desktop)
- [ ] Kontras warna cukup (gunakan browser accessibility checker)
- [ ] Tidak ada layout shift saat data loading selesai

---

## Anti-Pattern yang Harus Dihindari

- Jangan gunakan `alert()` / `confirm()` bawaan browser — pakai modal custom
- Jangan sembunyikan harga / total di belakang scroll
- Jangan pakai warna selain sistem warna di atas untuk status
- Jangan loading spinner yang memblokir seluruh layar — gunakan skeleton inline
- Jangan form dengan banyak field sekaligus — gunakan step/wizard jika > 5 field
- Jangan tooltip di mobile — info penting harus visible langsung
