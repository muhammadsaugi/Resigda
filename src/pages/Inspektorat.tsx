import { useState } from "react";
import { ShieldAlert, MapPin, AlertTriangle, BarChart2, TrendingUp, Filter, Eye } from "lucide-react";
import { pungliReports, heatmapByKecamatan } from "../data/operational";
import { Badge } from "../components/ui";
import { useRole } from "../context/RoleContext";
import AccessRestricted from "../components/AccessRestricted";
import AdminLayout from "../components/AdminLayout";

const hasilColor: Record<string, string> = {
  tidak_ditemukan: "bg-sirah-100 text-sirah-700 border-sirah-200",
  ditemukan_sesuai: "bg-sawo-100 text-sawo-700 border-sawo-200",
  ditemukan_berbeda: "bg-brass-100 text-brass-700 border-brass-200",
};
const hasilLabel: Record<string, string> = {
  tidak_ditemukan: "Tidak Ditemukan",
  ditemukan_sesuai: "Ditemukan Sesuai",
  ditemukan_berbeda: "Ditemukan Berbeda",
};
const hasilDot: Record<string, string> = {
  tidak_ditemukan: "bg-sirah-500",
  ditemukan_sesuai: "bg-sawo-500",
  ditemukan_berbeda: "bg-brass-500",
};

export default function Inspektorat() {
  const { canViewInspektorat } = useRole();
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
  const maxKasus = Math.max(...heatmapByKecamatan.map((h) => h.jumlahKasus));

  const filteredReports = selectedKecamatan
    ? pungliReports.filter((p) => p.kecamatan === selectedKecamatan)
    : pungliReports;

  const tidakDitemukanCount = pungliReports.filter((p) => p.hasilVerifikasi === "tidak_ditemukan").length;
  const ditemukanSesuaiCount = pungliReports.filter((p) => p.hasilVerifikasi === "ditemukan_sesuai").length;
  const ditemukanBerbedaCount = pungliReports.filter((p) => p.hasilVerifikasi === "ditemukan_berbeda").length;

  if (!canViewInspektorat) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <AccessRestricted requiredRoleLabel="Inspektorat Daerah" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sirah-600">
            <ShieldAlert className="h-3.5 w-3.5" />
            Dasbor Inspektorat Daerah
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900 lg:text-3xl">
            Peta Indikasi Pungutan Tidak Resmi
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-500">
            Diagregasi otomatis dari fitur Verifikasi Klaim warga — tanpa identitas pelapor.
            Konsentrasi kasus pada satu wilayah/layanan menjadi sinyal dini bagi pengawasan internal.
          </p>
        </div>

        {/* Summary alert */}
        <div className="mb-6 rounded-xl border border-sirah-200 bg-sirah-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sirah-600" />
            <div>
              <div className="text-sm font-bold text-sirah-800">
                {tidakDitemukanCount} dari {pungliReports.length} klaim tidak ditemukan dalam regulasi resmi
              </div>
              <p className="mt-1 text-xs leading-relaxed text-sirah-700">
                Kecamatan Krian menunjukkan konsentrasi kasus 4× lebih tinggi dari rata-rata
                kecamatan lain, terutama pada layanan Perpanjangan Izin Usaha Mikro dan
                Pengesahan PBG di DPMPTSP.
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-sirah-200 bg-sirah-50 p-5 stat-card-accent">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sirah-600">Indikasi Pungli</div>
                <div className="mt-2 font-display text-3xl font-bold text-sirah-700">{tidakDitemukanCount}</div>
                <div className="mt-0.5 text-xs text-sirah-500">Tidak ditemukan dalam regulasi</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sirah-100">
                <ShieldAlert className="h-5 w-5 text-sirah-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-sirah-600">
              <TrendingUp className="h-3 w-3" />
              Perlu investigasi lapangan
            </div>
          </div>

          <div className="rounded-xl border border-sawo-200 bg-sawo-50 p-5 stat-card-accent">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sawo-600">Klaim Sesuai</div>
                <div className="mt-2 font-display text-3xl font-bold text-sawo-700">{ditemukanSesuaiCount}</div>
                <div className="mt-0.5 text-xs text-sawo-500">Ditemukan dalam regulasi resmi</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sawo-100">
                <BarChart2 className="h-5 w-5 text-sawo-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brass-200 bg-brass-50 p-5 stat-card-accent">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-brass-600">Ditemukan Berbeda</div>
                <div className="mt-2 font-display text-3xl font-bold text-brass-700">{ditemukanBerbedaCount}</div>
                <div className="mt-0.5 text-xs text-brass-500">Klaim berbeda dari regulasi</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brass-100">
                <AlertTriangle className="h-5 w-5 text-brass-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Heatmap list */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sirah-500" />
                <h3 className="text-sm font-bold text-ink-900">Konsentrasi per Kecamatan</h3>
              </div>
              <p className="mt-0.5 text-xs text-ink-400">
                Klik kecamatan untuk memfilter laporan di bawah
              </p>
            </div>
            <div className="p-4 space-y-2">
              {heatmapByKecamatan
                .slice()
                .sort((a, b) => b.jumlahKasus - a.jumlahKasus)
                .map((h) => {
                  const isHighAlert = h.jumlahKasus > h.rataRataNasional * 2;
                  const isSelected = selectedKecamatan === h.kecamatan;
                  return (
                    <button
                      key={h.kecamatan}
                      onClick={() => setSelectedKecamatan(isSelected ? null : h.kecamatan)}
                      className={`w-full rounded-lg border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-sirah-300 bg-sirah-50 shadow-sm"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isHighAlert && (
                            <span className="h-2 w-2 rounded-full bg-sirah-500 flex-shrink-0" />
                          )}
                          <span className="text-sm font-semibold text-ink-800">{h.kecamatan}</span>
                        </div>
                        <span className={`font-mono text-sm font-bold ${isHighAlert ? "text-sirah-600" : "text-ink-700"}`}>
                          {h.jumlahKasus}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isHighAlert ? "bg-sirah-500" : "bg-brass-400"
                          }`}
                          style={{ width: `${(h.jumlahKasus / maxKasus) * 100}%` }}
                        />
                      </div>
                      <div className="mt-1.5 text-[11px] text-ink-400">
                        Rata-rata: {h.rataRataNasional.toFixed(1)} kasus
                        {isHighAlert && <span className="ml-2 font-bold text-sirah-600">⚠ Tinggi</span>}
                      </div>
                    </button>
                  );
                })}
            </div>
            {selectedKecamatan && (
              <div className="border-t border-slate-100 px-5 py-3">
                <button
                  onClick={() => setSelectedKecamatan(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-800"
                >
                  <Filter className="h-3 w-3" />
                  Tampilkan semua kecamatan
                </button>
              </div>
            )}
          </div>

          {/* Reports list */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-ink-900">
                    Riwayat Verifikasi{" "}
                    {selectedKecamatan && (
                      <span className="text-sirah-600">— {selectedKecamatan}</span>
                    )}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-400">{filteredReports.length} entri ditemukan</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-400">
                  <Eye className="h-3.5 w-3.5" />
                  Data anonim
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 border-b border-slate-100 px-5 py-3">
              {Object.entries(hasilLabel).map(([key, label]) => (
                <span key={key} className="flex items-center gap-1.5 text-[11px] text-ink-500">
                  <span className={`h-2 w-2 rounded-full ${hasilDot[key]}`} />
                  {label}
                </span>
              ))}
            </div>

            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto scrollbar-thin">
              {filteredReports.map((p) => (
                <div key={p.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${hasilDot[p.hasilVerifikasi]}`} />
                      <div>
                        <div className="text-sm font-semibold text-ink-800">{p.layanan}</div>
                        <p className="mt-1 text-sm text-ink-600 italic">"{p.klaimDiajukan}"</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-ink-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {p.kecamatan}
                          </span>
                          <span>·</span>
                          <span>{p.opd}</span>
                          <span>·</span>
                          <span>
                            {new Date(p.tanggal).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={hasilColor[p.hasilVerifikasi]}>
                      {hasilLabel[p.hasilVerifikasi]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology note */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-ink-500">
          <strong className="text-ink-700">Catatan metodologi:</strong> Dashboard ini bersifat
          indikatif, bukan bukti hukum. Setiap konsentrasi kasus yang signifikan perlu
          ditindaklanjuti dengan investigasi lapangan oleh Inspektorat sebelum diambil
          tindakan administratif maupun hukum.
        </div>
      </div>
    </AdminLayout>
  );
}
