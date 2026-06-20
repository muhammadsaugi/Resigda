import { Link } from "react-router-dom";
import {
  Network,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
  FileText,
  BarChart2,
} from "lucide-react";
import { regulasiData } from "../data/regulasi";
import { conflictEdges } from "../data/graph";
import { closedLoopItems } from "../data/operational";
import { closedLoopColor, closedLoopLabel, decayColor } from "../lib/format";
import { useRole, ROLE_INFO } from "../context/RoleContext";
import AdminLayout from "../components/AdminLayout";

export default function AdminDashboard() {
  const { role, canViewInspektorat } = useRole();
  const totalRegulasi = regulasiData.length;
  const conflictCount = conflictEdges.filter((e) => e.jenisRelasi === "berpotensi_konflik").length;
  const highDecay = regulasiData.filter((r) => r.decayScore >= 60).length;
  const openLoop = closedLoopItems.filter((c) => !["selesai_direvisi", "ditolak"].includes(c.status)).length;

  const topDecay = [...regulasiData].sort((a, b) => b.decayScore - a.decayScore).slice(0, 5);

  const statsData = [
    {
      label: "Total Regulasi Terindeks",
      value: totalRegulasi,
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
      sub: "dokumen aktif",
      trend: "+2 bulan ini",
      trendUp: true,
    },
    {
      label: "Potensi Konflik",
      value: conflictCount,
      icon: AlertCircle,
      color: "text-sirah-600 bg-sirah-50",
      sub: "perlu verifikasi manual",
      trend: "Perlu tindakan",
      trendUp: false,
    },
    {
      label: "Decay Score Tinggi",
      value: highDecay,
      icon: TrendingDown,
      color: "text-amber-600 bg-amber-50",
      sub: "kandidat revisi (≥60)",
      trend: "Prioritas tinjau",
      trendUp: false,
    },
    {
      label: "Tindak Lanjut Aktif",
      value: openLoop,
      icon: Activity,
      color: "text-sawo-600 bg-sawo-50",
      sub: "closed-loop tracking",
      trend: "Dalam proses",
      trendUp: true,
    },
  ];

  const moduleCards = [
    {
      to: "/admin/graf",
      icon: Network,
      title: "Conflict Graph Engine",
      desc: "Jelajahi jaringan relasi antar-regulasi dan tinjau potensi konflik. Deteksi tumpang tindih antar-produk hukum secara visual.",
      color: "from-indigo-500 to-indigo-600",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      available: true,
    },
    {
      to: "/admin/decay",
      icon: TrendingDown,
      title: "Regulatory Decay Tracker",
      desc: "Pantau regulasi yang usang dan kelola status tindak lanjutnya dengan closed-loop workflow.",
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      available: true,
    },
    {
      to: "/admin/inspektorat",
      icon: ShieldAlert,
      title: "Dasbor Inspektorat",
      desc: "Peta panas indikasi pungutan tidak resmi berdasarkan data Verifikasi Klaim warga yang teragregasi.",
      color: "from-sirah-500 to-sirah-600",
      bgLight: "bg-sirah-50",
      textColor: "text-sirah-600",
      available: canViewInspektorat,
      restricted: !canViewInspektorat,
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-600">
            <BarChart2 className="h-3.5 w-3.5" />
            Portal ASN — {ROLE_INFO[role].instansi}
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900 lg:text-3xl">
            Dasbor Tata Kelola Regulasi
          </h1>
          <p className="mt-1.5 text-sm text-ink-500 max-w-2xl">
            Ringkasan kondisi basis regulasi Kabupaten Sidoarjo: dokumen terindeks,
            potensi konflik, regulasi yang perlu ditinjau, dan status tindak lanjut.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsData.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm stat-card-accent"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">{s.label}</div>
                  <div className="mt-2 font-display text-3xl font-bold text-ink-900">{s.value}</div>
                  <div className="mt-1 text-xs text-ink-400">{s.sub}</div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className={`mt-3 flex items-center gap-1 text-[11px] font-medium ${s.trendUp ? "text-sawo-600" : "text-sirah-600"}`}>
                {s.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink-400">Modul Tata Kelola</h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {moduleCards.map((m) => (
              <Link
                key={m.to}
                to={m.restricted ? "#" : m.to}
                onClick={(e) => m.restricted && e.preventDefault()}
                className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 ${
                  m.restricted
                    ? "cursor-not-allowed border-slate-200 opacity-60"
                    : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-elevated"
                }`}
              >
                {/* Card header gradient */}
                <div className={`bg-gradient-to-br ${m.color} p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white">
                      <m.icon className="h-5 w-5" />
                    </div>
                    {m.restricted && (
                      <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Akses Terbatas
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-ink-900">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{m.desc}</p>
                  {!m.restricted ? (
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink-700 opacity-0 transition-opacity group-hover:opacity-100">
                      Buka modul <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <p className={`mt-4 text-xs font-medium ${m.textColor}`}>Khusus peran Inspektorat Daerah</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom 2-col */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Regulasi Prioritas */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-display text-sm font-bold text-ink-900">Regulasi Prioritas Tinjau</h3>
                <p className="mt-0.5 text-xs text-ink-400">Decay Score tertinggi</p>
              </div>
              <Link to="/admin/decay" className="text-xs font-semibold text-brass-600 hover:text-brass-700">
                Lihat semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {topDecay.map((r, i) => (
                <Link
                  key={r.id}
                  to={`/regulasi/${r.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-ink-500">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-800">{r.judul}</div>
                    <div className="text-xs text-ink-400">{r.jenis} · {r.nomor}/{r.tahun}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${r.decayScore >= 70 ? "bg-sirah-500" : r.decayScore >= 50 ? "bg-amber-500" : "bg-sawo-500"}`}
                        style={{ width: `${r.decayScore}%` }}
                      />
                    </div>
                    <span className={`font-mono text-xs font-bold ${decayColor(r.decayScore)}`}>
                      {r.decayScore}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Closed-loop tracking */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-display text-sm font-bold text-ink-900">Status Closed-Loop Tracking</h3>
                <p className="mt-0.5 text-xs text-ink-400">Tindak lanjut berjalan</p>
              </div>
              <Link to="/admin/decay" className="text-xs font-semibold text-brass-600 hover:text-brass-700">
                Lihat semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {closedLoopItems.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    c.status === "selesai_direvisi"
                      ? "bg-sawo-100 text-sawo-600"
                      : c.status === "ditolak"
                      ? "bg-sirah-100 text-sirah-600"
                      : "bg-amber-100 text-amber-600"
                  }`}>
                    {c.status === "selesai_direvisi" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-800">{c.judulRegulasi}</div>
                    <div className="text-xs text-ink-400">{c.ditugaskanKe}</div>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${closedLoopColor(c.status)}`}>
                    {closedLoopLabel(c.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-brass-200 bg-brass-50 p-4 text-sm text-brass-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
          <p>
            Data pada dasbor ini disusun untuk keperluan demonstrasi prototipe kompetisi.
            Pada implementasi produksi, seluruh metrik dihitung otomatis dari pipeline
            ingestion dan log penggunaan sistem secara real-time.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
