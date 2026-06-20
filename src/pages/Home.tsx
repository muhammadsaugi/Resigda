import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MessageCircleQuestion,
  ShieldAlert,
  Network,
  TrendingDown,
  Mic,
  FileSearch,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { regulasiData } from "../data/regulasi";

const jenisCounts = regulasiData.reduce<Record<string, number>>((acc, r) => {
  acc[r.jenis] = (acc[r.jenis] ?? 0) + 1;
  return acc;
}, {});

const features = [
  {
    icon: Search,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    title: "Pencarian Semantik",
    desc: "Cari berdasarkan judul, nomor, topik, atau isi pasal — bukan sekadar kecocokan kata kunci.",
    to: "/cari",
    badge: "Publik",
  },
  {
    icon: MessageCircleQuestion,
    color: "bg-brass-50 text-brass-700 border-brass-100",
    title: "Tanya REGS (AI)",
    desc: "Tanyakan apa pun tentang regulasi daerah dalam bahasa sehari-hari, lengkap kutipan pasal sumber.",
    to: "/tanya",
    badge: "Publik",
  },
  {
    icon: ShieldAlert,
    color: "bg-sirah-50 text-sirah-700 border-sirah-100",
    title: "Verifikasi Klaim Petugas",
    desc: "Periksa apakah biaya atau prosedur yang diminta petugas benar-benar diatur dalam regulasi resmi.",
    to: "/verifikasi",
    badge: "Anti-Pungli",
  },
  {
    icon: Network,
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    title: "Conflict Graph Engine",
    desc: "Visualisasi jaringan relasi antar-regulasi untuk mendeteksi konflik dan redundansi.",
    to: "/admin/graf",
    badge: "ASN",
  },
  {
    icon: TrendingDown,
    color: "bg-amber-50 text-amber-700 border-amber-100",
    title: "Regulatory Decay Tracker",
    desc: "Deteksi proaktif regulasi usang yang perlu ditinjau ulang, lengkap pelacakan tindak lanjut.",
    to: "/admin/decay",
    badge: "ASN",
  },
  {
    icon: Mic,
    color: "bg-sawo-50 text-sawo-700 border-sawo-100",
    title: "Input Suara Inklusif",
    desc: "Akses inklusif bagi warga lansia atau dengan literasi digital terbatas — cukup berbicara.",
    to: "/tanya",
    badge: "Aksesibilitas",
  },
];

const stats = [
  { value: "20", label: "Dokumen Regulasi", sub: "Terindeks dalam sistem" },
  { value: "4", label: "Jenis Produk Hukum", sub: "Perda, Perbup, SE, Instr." },
  { value: "<30s", label: "Waktu Pencarian", sub: "vs. 15-30 menit manual" },
  { value: "100%", label: "Tanpa Login", sub: "Warga tidak perlu daftar" },
];

const masalahList = [
  "Warga membaca puluhan halaman PDF untuk satu jawaban sederhana.",
  "Petugas dapat mengklaim \"prosedur tambahan\" tanpa bisa diverifikasi warga.",
  "Regulasi yang saling bertentangan tidak terdeteksi hingga menimbulkan masalah.",
  "Regulasi usang dibiarkan tanpa tinjauan karena tidak ada yang memantau.",
];

const badgeColor: Record<string, string> = {
  "Publik": "bg-sawo-100 text-sawo-700",
  "Anti-Pungli": "bg-sirah-100 text-sirah-700",
  "ASN": "bg-ink-100 text-ink-600",
  "Aksesibilitas": "bg-blue-100 text-blue-700",
};

export default function Home() {
  return (
    <div>
      {/* ───── Hero Section with Photo Background ───── */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/sidoarjo2.jpg')" }}
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/70 to-ink-900/95" />
        {/* Subtle grid pattern on top */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-10" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-center text-center">
          <div className="max-w-3xl flex flex-col items-center">
            <h1 className="animate-fade-up-delay-1 font-display text-4xl font-semibold leading-tight text-white drop-shadow-md sm:text-5xl">
              Satu pintu untuk{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-brass-300 via-brass-400 to-brass-500 bg-clip-text text-transparent drop-shadow-sm">seluruh regulasi</span>{" "}
              daerah Sidoarjo.
            </h1>

            <p className="animate-fade-up-delay-2 mt-5 max-w-lg font-sans text-lg font-normal leading-relaxed text-white/90 drop-shadow">
              REGSIDA mengumpulkan seluruh Perda, Perbup, SE, dan Instruksi Bupati Sidoarjo ke satu tempat yang bisa dicari, ditanya, dan diverifikasi kapan pun butuh.
            </p>

            <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/tanya"
                className="group flex items-center gap-2 rounded-lg bg-brass-500 px-6 py-3 text-sm font-semibold text-ink-900 shadow-lg transition-all hover:bg-brass-400 hover:shadow-xl active:scale-95"
              >
                Tanyakan ke REGS
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/cari"
                className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Search className="h-4 w-4" />
                Jelajahi Regulasi
              </Link>
              <Link
                to="/verifikasi"
                className="flex items-center gap-2 rounded-lg border border-sirah-400/40 bg-sirah-500/20 px-6 py-3 text-sm font-medium text-sirah-200 backdrop-blur-sm transition-all hover:bg-sirah-500/30"
              >
                <ShieldAlert className="h-4 w-4" />
                Cek Pungli
              </Link>
            </div>
          </div>
        </div>

        {/* Stat pills floating at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-ink-950/70 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
              {(["Perda", "Perbup", "SE", "Instruksi Bupati"] as const).map((j) => (
                <div key={j} className="py-4 px-5 text-center">
                  <div className="font-display text-2xl font-bold text-white">{jenisCounts[j] ?? 0}</div>
                  <div className="mt-0.5 text-xs text-white/50">{j === "SE" ? "Surat Edaran" : j}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Stats Row ───── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-8 py-6 text-center ${i < stats.length - 1 ? "border-r border-slate-100" : ""}`}
              >
                <div className="font-display text-3xl font-bold text-ink-900">{s.value}</div>
                <div className="mt-1 text-sm font-semibold text-ink-700">{s.label}</div>
                <div className="mt-0.5 text-xs text-ink-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Masalah Section ───── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-brass-400" />
                <span className="text-xs font-bold uppercase tracking-widest2 text-brass-600">
                  Mengapa REGSIDA Dibutuhkan
                </span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
                Regulasi yang tersebar{" "}
                <span className="text-brass-600">adalah regulasi yang tidak berdaya.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-600">
                Kabupaten Sidoarjo, seperti kebanyakan daerah di Indonesia, menerbitkan
                ratusan produk hukum dari berbagai OPD setiap tahunnya. Warga tidak
                tahu hak dan kewajibannya. ASN membuat keputusan tanpa rujukan yang
                pasti. Dan celah ketidaktahuan ini menjadi ladang bagi praktik pungutan
                tidak resmi.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="font-display text-3xl font-bold text-ink-900">20</div>
                  <div className="mt-1 text-sm font-medium text-ink-700">Dokumen regulasi</div>
                  <div className="mt-0.5 text-xs text-ink-400">terindeks dalam prototipe</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="font-display text-3xl font-bold text-ink-900">{"<30 dtk"}</div>
                  <div className="mt-1 text-sm font-medium text-ink-700">Waktu pencarian</div>
                  <div className="mt-0.5 text-xs text-ink-400">vs. 15-30 menit manual</div>
                </div>
              </div>
            </div>

            {/* Problem card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-gov-stat">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-sirah-100 flex items-center justify-center">
                  <ShieldAlert className="h-4 w-4 text-sirah-600" />
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-sirah-700">
                  Kondisi Saat Ini — Tanpa REGSIDA
                </div>
              </div>
              <ul className="space-y-4">
                {masalahList.map((m, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sirah-100 text-sirah-700">
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    </span>
                    <span className="text-sm leading-relaxed text-ink-700">{m}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sawo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sawo-700">
                    Dengan REGSIDA
                  </span>
                </div>
                <p className="text-sm text-ink-600">
                  Warga dapat mengakses dan memahami regulasi kapan saja, petugas
                  tidak dapat lagi mengklaim prosedur tanpa dasar hukum, dan ASN
                  memiliki alat pemantauan regulasi yang proaktif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features Grid ───── */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-brass-400" />
              <span className="text-xs font-bold uppercase tracking-widest2 text-brass-600">Kapabilitas Sistem</span>
              <span className="h-px w-8 bg-brass-400" />
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              Bukan sekadar mesin pencari —
              <br />
              <span className="text-brass-600">navigator penalaran hukum daerah.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-ink-600">
              Ditenagai AI dan dibangun di atas prinsip transparansi, REGSIDA mengubah
              dokumen hukum yang kompleks menjadi informasi yang dapat diakses semua orang.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-elevated"
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-ink-900">{f.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColor[f.badge]}`}>
                    {f.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.desc}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-brass-700 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:gap-2">
                  Lihat selengkapnya
                  <ArrowRight className="h-4 w-4" />
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brass-400 to-brass-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Anti-pungli CTA ───── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-ink-900">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern bg-[size:36px_36px] opacity-10" />
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sirah-500/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-brass-500/10 blur-3xl" />

            <div className="relative px-8 py-12 sm:px-14 sm:py-16">
              <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest2 text-sirah-300">
                    <FileSearch className="h-3.5 w-3.5" />
                    Pencegahan Pungutan Tidak Resmi
                  </div>
                  <h3 className="mt-3 font-display text-3xl font-bold text-white">
                    Diminta membayar biaya yang terasa tidak biasa?
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white/65">
                    Periksa dulu apakah biaya tersebut benar-benar diatur dalam regulasi resmi
                    Kabupaten Sidoarjo, sebelum membayar. <strong className="text-white/90">Gratis, anonim, tanpa login.</strong>
                  </p>
                  <div className="mt-5 flex items-center gap-4 text-sm text-white/50">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Tanpa identitas pelapor</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Hasil instan</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/verifikasi"
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-sirah-600 px-7 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-sirah-500 hover:shadow-xl active:scale-95"
                  >
                    Verifikasi Klaim Sekarang <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="text-center text-xs text-white/30">atau hubungi SP4N-LAPOR!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
