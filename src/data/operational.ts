import { ClosedLoopItem, PungliReport } from "./types";

export const closedLoopItems: ClosedLoopItem[] = [
  {
    id: "cl1",
    regulasiId: "instruksi-7-2021",
    judulRegulasi: "Instruksi Bupati No. 7 Tahun 2021 — Disiplin Protokol Kesehatan",
    status: "direkomendasikan_revisi",
    catatan: "Decay Score 88 — konteks pandemi sudah tidak relevan. Direkomendasikan untuk dicabut dan diganti pedoman pelayanan publik normal.",
    ditugaskanKe: "Bagian Hukum Setda — Kabid Produk Hukum Daerah",
    tanggalUpdate: "2026-05-02",
    riwayat: [
      { status: "baru_terdeteksi", tanggal: "2026-03-10", catatan: "Terdeteksi otomatis oleh Decay Tracker — usia 5 tahun, frekuensi pertanyaan sangat rendah." },
      { status: "sedang_ditinjau", tanggal: "2026-04-08", catatan: "Ditinjau oleh staf hukum, dikonfirmasi konteks pandemi sudah berakhir." },
      { status: "direkomendasikan_revisi", tanggal: "2026-05-02", catatan: "Direkomendasikan pencabutan formal kepada Kepala Bagian Hukum." },
    ],
  },
  {
    id: "cl2",
    regulasiId: "perbup-11-2014",
    judulRegulasi: "Perda No. 11 Tahun 2014 — Retribusi Perpanjangan Izin TKA",
    status: "sedang_ditinjau",
    catatan: "Tarif belum disesuaikan dengan standar nasional terbaru terkait tenaga kerja asing. Sedang dikoordinasikan dengan Disnaker.",
    ditugaskanKe: "Bagian Hukum Setda — Tim Harmonisasi Regulasi",
    tanggalUpdate: "2026-04-22",
    riwayat: [
      { status: "baru_terdeteksi", tanggal: "2026-03-10", catatan: "Decay Score 78 — usia 12 tahun, frekuensi pertanyaan rendah." },
      { status: "sedang_ditinjau", tanggal: "2026-04-22", catatan: "Dikoordinasikan dengan Dinas Tenaga Kerja untuk verifikasi relevansi tarif." },
    ],
  },
  {
    id: "cl3",
    regulasiId: "perbup-49-2018",
    judulRegulasi: "Perbup No. 49 Tahun 2018 — Tata Cara Pemungutan Pajak Restoran",
    status: "diproses_dprd",
    catatan: "Potensi konflik dengan kewenangan insentif fiskal Perda terbaru sudah dikonfirmasi valid. Draf revisi sudah diajukan ke Bapemperda DPRD.",
    ditugaskanKe: "Bapenda — dikoordinasikan dengan Bapemperda DPRD",
    tanggalUpdate: "2026-05-18",
    riwayat: [
      { status: "baru_terdeteksi", tanggal: "2026-02-14", catatan: "Conflict Graph Engine mendeteksi potensi konflik dengan Perda No. 1 Tahun 2024 (confidence 62%)." },
      { status: "sedang_ditinjau", tanggal: "2026-03-20", catatan: "Staf hukum mengonfirmasi relasi konflik valid setelah verifikasi manual." },
      { status: "direkomendasikan_revisi", tanggal: "2026-04-15", catatan: "Direkomendasikan penyesuaian klausul pengecualian UMKM." },
      { status: "diproses_dprd", tanggal: "2026-05-18", catatan: "Draf revisi resmi diajukan ke Bapemperda DPRD Kabupaten Sidoarjo." },
    ],
  },
  {
    id: "cl4",
    regulasiId: "perda-5-2019",
    judulRegulasi: "Perda No. 5 Tahun 2019 — RDTR Zonasi Balongbendo",
    status: "baru_terdeteksi",
    catatan: "Decay Score 61 dengan potensi konflik teknis terhadap mekanisme PBG. Belum ditugaskan ke staf peninjau.",
    ditugaskanKe: "Belum ditugaskan",
    tanggalUpdate: "2026-06-01",
    riwayat: [
      { status: "baru_terdeteksi", tanggal: "2026-06-01", catatan: "Terdeteksi otomatis oleh sistem — kombinasi Decay Score tinggi dan edge konflik confidence 54% dari Conflict Graph Engine." },
    ],
  },
  {
    id: "cl5",
    regulasiId: "instruksi-3-2022",
    judulRegulasi: "Instruksi Bupati No. 3 Tahun 2022 — Pemulihan Ekonomi Pasca Pandemi",
    status: "selesai_direvisi",
    catatan: "Telah digantikan dengan kebijakan dukungan UMKM yang lebih relevan dengan konteks pasca-pandemi melalui Instruksi Bupati terbaru.",
    ditugaskanKe: "Dinas Koperasi dan UKM",
    tanggalUpdate: "2026-01-30",
    riwayat: [
      { status: "baru_terdeteksi", tanggal: "2025-11-12", catatan: "Decay Score 58 — konteks pandemi sudah tidak relevan." },
      { status: "sedang_ditinjau", tanggal: "2025-12-05", catatan: "Dikoordinasikan dengan Dinas Koperasi dan UKM." },
      { status: "direkomendasikan_revisi", tanggal: "2025-12-28", catatan: "Disepakati penggantian kebijakan." },
      { status: "selesai_direvisi", tanggal: "2026-01-30", catatan: "Instruksi Bupati pengganti telah diterbitkan." },
    ],
  },
];

export const pungliReports: PungliReport[] = [
  { id: "pl1", kecamatan: "Krian", layanan: "Perpanjangan Izin Usaha Mikro", opd: "DPMPTSP", tanggal: "2026-05-02", klaimDiajukan: "Petugas meminta biaya tambahan Rp150.000 untuk 'percepatan proses'", hasilVerifikasi: "tidak_ditemukan" },
  { id: "pl2", kecamatan: "Krian", layanan: "Perpanjangan Izin Usaha Mikro", opd: "DPMPTSP", tanggal: "2026-05-09", klaimDiajukan: "Diminta membayar Rp100.000 di luar tarif resmi untuk proses PBG", hasilVerifikasi: "tidak_ditemukan" },
  { id: "pl3", kecamatan: "Krian", layanan: "Pengesahan PBG Rumah Tinggal", opd: "DPMPTSP", tanggal: "2026-05-15", klaimDiajukan: "Biaya survei lokasi yang tidak tercantum di brosur retribusi", hasilVerifikasi: "tidak_ditemukan" },
  { id: "pl4", kecamatan: "Krian", layanan: "Perpanjangan Izin Usaha Mikro", opd: "DPMPTSP", tanggal: "2026-05-20", klaimDiajukan: "Petugas loket meminta uang 'jasa percepatan' Rp75.000", hasilVerifikasi: "tidak_ditemukan" },
  { id: "pl5", kecamatan: "Waru", layanan: "Pajak Restoran", opd: "Bapenda", tanggal: "2026-04-18", klaimDiajukan: "Diminta membayar denda tambahan tanpa surat ketetapan resmi", hasilVerifikasi: "tidak_ditemukan" },
  { id: "pl6", kecamatan: "Taman", layanan: "Pengurusan PBB", opd: "Bapenda", tanggal: "2026-03-22", klaimDiajukan: "Verifikasi nilai objek pajak ditagih biaya konsultasi tambahan", hasilVerifikasi: "ditemukan_berbeda" },
  { id: "pl7", kecamatan: "Sidoarjo Kota", layanan: "Pajak Hotel", opd: "Bapenda", tanggal: "2026-04-02", klaimDiajukan: "Klarifikasi tarif Pajak Hotel sesuai Perda", hasilVerifikasi: "ditemukan_sesuai" },
  { id: "pl8", kecamatan: "Krian", layanan: "Perpanjangan Izin Usaha Mikro", opd: "DPMPTSP", tanggal: "2026-05-27", klaimDiajukan: "Diminta menyertakan 'biaya administrasi tambahan' tunai", hasilVerifikasi: "tidak_ditemukan" },
  { id: "pl9", kecamatan: "Buduran", layanan: "Pajak Reklame", opd: "Bapenda", tanggal: "2026-02-14", klaimDiajukan: "Klarifikasi denda keterlambatan pemasangan reklame", hasilVerifikasi: "ditemukan_sesuai" },
  { id: "pl10", kecamatan: "Krian", layanan: "Pengesahan PBG Rumah Tinggal", opd: "DPMPTSP", tanggal: "2026-06-03", klaimDiajukan: "Diminta jasa pengurusan cepat senilai Rp200.000", hasilVerifikasi: "tidak_ditemukan" },
];

export const heatmapByKecamatan = [
  { kecamatan: "Krian", jumlahKasus: 6, rataRataNasional: 1.4 },
  { kecamatan: "Waru", jumlahKasus: 1, rataRataNasional: 1.4 },
  { kecamatan: "Taman", jumlahKasus: 1, rataRataNasional: 1.4 },
  { kecamatan: "Sidoarjo Kota", jumlahKasus: 1, rataRataNasional: 1.4 },
  { kecamatan: "Buduran", jumlahKasus: 1, rataRataNasional: 1.4 },
];
