# REGSIDA — Regulasi Daerah Satu Data & AI Navigator

Prototipe untuk Kompetisi KMIPN VIII 2026, Kategori E-Government.
Implementasi atas nama **Kabupaten Sidoarjo**.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Mengaktifkan chatbot AI generatif (Gemini API — gratis)

Secara default, fitur "Tanya REGS" berjalan dengan mesin jawaban rule-based
berbasis dokumen (tanpa API key, tanpa biaya, langsung berfungsi). Untuk
mengaktifkan jawaban berbasis AI generatif:

1. Buka https://aistudio.google.com/app/apikey, login dengan akun Google.
2. Klik **Create API key** — gratis, tanpa kartu kredit untuk tier gratis Gemini Flash.
3. Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Isi `VITE_GEMINI_API_KEY=AIzaSy...` dengan key yang didapat.
5. Jalankan ulang `npm run dev`.

## Deploy ke Vercel

### Opsi A — via GitHub (disarankan)

1. Buat repository baru di GitHub, lalu push folder ini:
   ```bash
   git init
   git add .
   git commit -m "REGSIDA prototype KMIPN VIII 2026"
   git branch -M main
   git remote add origin <url-repo-anda>
   git push -u origin main
   ```
2. Buka https://vercel.com, klik **Add New → Project**, pilih repo tersebut.
3. Vercel otomatis mendeteksi framework Vite — biarkan default (`npm run build`, output `dist`).
4. Pada bagian **Environment Variables**, tambahkan:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: API key dari Google AI Studio (opsional — boleh dikosongkan, mode demo tetap berjalan)
5. Klik **Deploy**.

### Opsi B — via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
# Ikuti prompt, lalu untuk deploy production:
vercel --prod
```

Jika menggunakan Gemini API key, tambahkan sebelum deploy:
```bash
vercel env add VITE_GEMINI_API_KEY
```

## Struktur fitur

- **Portal Warga**: Pencarian regulasi, Tanya REGS (chatbot + suara), Verifikasi Klaim Petugas (anti-pungli). Tidak memerlukan login — sesuai semangat anti-pungli, warga yang melapor tidak perlu mengidentifikasi diri.
- **Portal ASN / Bagian Hukum**: Dasbor tata kelola, Conflict Graph Engine (peta relasi antar-regulasi), Regulatory Decay Tracker (closed-loop tindak lanjut), Dasbor Inspektorat (peta panas indikasi pungli).

### Simulasi peran ASN (role-based access)

Prototipe ini **belum memiliki sistem login/autentikasi sungguhan** — ini akan
diimplementasikan pada fase produksi menggunakan SSO ASN. Sebagai gantinya,
Portal ASN menyediakan **dropdown "Simulasi peran"** di navbar yang
mendemonstrasikan konsep role-based access control dengan 3 peran:

| Peran | Akses Dasbor & Graf | Validasi Graf | Kelola Closed-Loop | Dasbor Inspektorat |
|---|---|---|---|---|
| **Staf OPD** | Lihat saja | ✗ | ✗ | ✗ (disembunyikan dari menu) |
| **Bagian Hukum Setda** | Penuh | ✓ | ✓ | ✗ |
| **Inspektorat Daerah** | Lihat saja | ✗ | ✗ | ✓ (penuh) |

Saat peran tanpa akses mencoba membuka halaman yang dibatasi (misalnya
mengetik langsung URL `/admin/inspektorat` saat bersimulasi sebagai Staf
OPD), sistem menampilkan halaman "Akses Terbatas". Untuk aksi yang
dibatasi (seperti tombol "Tandai Valid" pada Conflict Graph Engine),
sistem menampilkan banner mode lihat saja alih-alih menyembunyikan
konten sepenuhnya, supaya juri/reviewer tetap bisa melihat keberadaan
fitur tersebut.

Status peran disimpan di memori sesi (React Context) dan akan kembali ke
default ("Bagian Hukum Setda") setiap kali halaman di-refresh — ini wajar
untuk prototipe tanpa backend.

## Catatan tentang data

Dataset 20 regulasi (5 Perda, 5 Perbup, 5 Surat Edaran, 5 Instruksi Bupati) pada
prototipe ini disusun merujuk pada nomenklatur resmi produk hukum Kabupaten
Sidoarjo (JDIH Kab. Sidoarjo, peraturan.bpk.go.id) untuk keperluan demonstrasi.
Teks pasal ditulis ulang sebagai representasi struktural, bukan kutipan literal
dari naskah resmi. Untuk implementasi produksi, lihat Bab 9 PRD ("Strategi Data
Nyata") mengenai pengumpulan dataset asli dari portal JDIH.
