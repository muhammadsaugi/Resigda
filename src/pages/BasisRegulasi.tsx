import { BookOpen, Search, Filter, Plus } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { regulasiData } from "../data/regulasi";
import { regulasiLabel, formatTanggal, statusColor } from "../lib/format";
import { Badge } from "../components/ui";

export default function BasisRegulasi() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-600">
              <BookOpen className="h-3.5 w-3.5" />
              Basis Regulasi
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink-900 lg:text-3xl">
              Manajemen Dokumen Hukum
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-500">
              Kelola seluruh dokumen regulasi, sinkronisasi dengan JDIH, dan perbarui metadata.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brass-600">
            <Plus className="h-4 w-4" />
            Tambah Regulasi Baru
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-brass-400">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              placeholder="Cari regulasi berdasarkan judul atau nomor..." 
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_120px_100px_100px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-400">
            <span>Informasi Regulasi</span>
            <span>Tanggal</span>
            <span>Status</span>
            <span>Aksi</span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {regulasiData.map((r) => (
              <div key={r.id} className="grid grid-cols-[1fr_120px_100px_100px] items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-brass-700">{regulasiLabel(r)}</div>
                  <div className="mt-1 truncate font-medium text-ink-900">{r.judul}</div>
                  <div className="mt-0.5 truncate text-xs text-ink-500">{r.opd}</div>
                </div>
                <div className="text-xs text-ink-600">
                  {formatTanggal(r.tanggalTerbit)}
                </div>
                <div>
                  <Badge className={statusColor(r.status)}>{r.status}</Badge>
                </div>
                <div>
                  <button className="text-xs font-semibold text-ink-600 hover:text-brass-600">
                    Edit Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
