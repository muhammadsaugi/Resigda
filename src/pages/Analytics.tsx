import { BarChart3, TrendingUp, Users, Download, Activity } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export default function Analytics() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-600">
            <BarChart3 className="h-3.5 w-3.5" />
            Dasbor Analitik
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900 lg:text-3xl">
            Analitik Penggunaan Portal
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-500">
            Statistik pencarian regulasi, pertanyaan warga via AI, dan penggunaan fitur verifikasi.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Pencarian Regulasi", value: "1,240", icon: Activity, trend: "+12%" },
            { label: "Pertanyaan Tanya REGS", value: "856", icon: Users, trend: "+25%" },
            { label: "Klaim Diverifikasi", value: "312", icon: TrendingUp, trend: "-5%" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-ink-400">{s.label}</div>
                  <div className="mt-2 font-display text-3xl font-bold text-ink-900">{s.value}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-ink-600">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className={`mt-3 text-xs font-semibold ${s.trend.startsWith("+") ? "text-sawo-600" : "text-sirah-600"}`}>
                {s.trend} dibanding bulan lalu
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <BarChart3 className="h-8 w-8 text-ink-400" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-ink-900">
            Modul Analitik Lanjutan sedang dalam pengembangan
          </h3>
          <p className="mt-2 text-sm text-ink-500">
            Visualisasi grafik kunjungan, tren topik regulasi yang paling sering dicari warga,
            dan laporan unduhan akan segera hadir.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brass-600">
            <Download className="h-4 w-4" />
            Ekspor Laporan PDF
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
