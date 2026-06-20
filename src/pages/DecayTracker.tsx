import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowUpDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { regulasiData } from "../data/regulasi";
import { closedLoopItems } from "../data/operational";
import { decayBarColor, decayColor, decayLabel, regulasiLabel, closedLoopColor, closedLoopLabel } from "../lib/format";
import { Badge } from "../components/ui";
import { useRole, ROLE_INFO } from "../context/RoleContext";
import AdminLayout from "../components/AdminLayout";

const STATUS_FLOW = [
  { key: "baru_terdeteksi", label: "Terdeteksi" },
  { key: "sedang_ditinjau", label: "Ditinjau" },
  { key: "direkomendasikan_revisi", label: "Direkomendasikan" },
  { key: "diproses_dprd", label: "Di DPRD" },
  { key: "selesai_direvisi", label: "Selesai" },
] as const;

export default function DecayTracker() {
  const { canEditCloseLoop, role } = useRole();
  const [sortDesc, setSortDesc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"closedloop" | "tabel">("closedloop");

  const sorted = useMemo(() => {
    const arr = [...regulasiData];
    arr.sort((a, b) => (sortDesc ? b.decayScore - a.decayScore : a.decayScore - b.decayScore));
    return arr;
  }, [sortDesc]);

  const avgDecay = Math.round(regulasiData.reduce((a, r) => a + r.decayScore, 0) / regulasiData.length);

  const summaryStats = [
    {
      label: "Rata-rata Decay Score",
      value: avgDecay,
      icon: Activity,
      color: "text-ink-700 bg-slate-100",
      valueColor: "text-ink-900",
    },
    {
      label: "Prioritas Tinggi (≥70)",
      value: regulasiData.filter((r) => r.decayScore >= 70).length,
      icon: AlertTriangle,
      color: "text-sirah-600 bg-sirah-50",
      valueColor: "text-sirah-700",
    },
    {
      label: "Sedang (50–69)",
      value: regulasiData.filter((r) => r.decayScore >= 50 && r.decayScore < 70).length,
      icon: TrendingDown,
      color: "text-amber-600 bg-amber-50",
      valueColor: "text-amber-700",
    },
    {
      label: "Selesai Direvisi",
      value: closedLoopItems.filter((c) => c.status === "selesai_direvisi").length,
      icon: CheckCircle2,
      color: "text-sawo-600 bg-sawo-50",
      valueColor: "text-sawo-700",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-600">
            <TrendingDown className="h-3.5 w-3.5" />
            Regulatory Decay Tracker
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900 lg:text-3xl">
            Daftar Prioritas Revisi
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-500">
            Decay Score dihitung dari kombinasi usia regulasi, frekuensi pertanyaan warga/ASN,
            dan tingkat keyakinan AI saat menjawab — skor tinggi = perlu segera ditinjau.
          </p>
        </div>

        {/* Role banner */}
        {!canEditCloseLoop && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Info className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              Anda masuk sebagai <strong>{ROLE_INFO[role].label}</strong> — mode lihat saja.
              Hanya <strong>Bagian Hukum Setda</strong> yang dapat mengelola status tindak lanjut.
            </span>
          </div>
        )}

        {/* Summary stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm stat-card-accent">
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
                  <s.icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className={`mt-3 font-display text-3xl font-bold ${s.valueColor}`}>{s.value}</div>
              <div className="mt-0.5 text-xs text-ink-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("closedloop")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "closedloop"
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            Status Closed-Loop Tracking
          </button>
          <button
            onClick={() => setActiveTab("tabel")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "tabel"
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            Seluruh Regulasi (Tabel Decay Score)
          </button>
        </div>

        {activeTab === "closedloop" && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-ink-500">
                Setiap temuan dilacak hingga tuntas — bukan sekadar terdeteksi lalu dibiarkan.
              </p>
            </div>
            <div className="space-y-3">
              {closedLoopItems.map((c) => {
                const flowIndex = STATUS_FLOW.findIndex((s) => s.key === c.status);
                const isExpanded = expandedId === c.id;
                const isSelesai = c.status === "selesai_direvisi";

                return (
                  <div key={c.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isSelesai ? "bg-sawo-100 text-sawo-600" : "bg-amber-100 text-amber-600"
                      }`}>
                        {isSelesai ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-ink-800">{c.judulRegulasi}</div>
                        <div className="mt-0.5 text-xs text-ink-400">{c.ditugaskanKe}</div>
                      </div>
                      <Badge className={`shrink-0 ${closedLoopColor(c.status)}`}>
                        {closedLoopLabel(c.status)}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-ink-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-ink-400" />
                      )}
                    </button>

                    {/* Progress bar */}
                    {c.status !== "ditolak" && (
                      <div className="px-5 pb-2">
                        <div className="flex items-center gap-0.5">
                          {STATUS_FLOW.map((s, i) => (
                            <div key={s.key} className="flex flex-1 flex-col items-center gap-1">
                              <div className={`h-1.5 w-full rounded-full transition-colors ${
                                i <= flowIndex ? "bg-brass-500" : "bg-slate-100"
                              }`} />
                              <span className="hidden text-[9px] text-ink-400 lg:block">{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isExpanded && (
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                        <p className="mb-4 text-sm text-ink-600">{c.catatan}</p>
                        <div className="space-y-2.5">
                          {c.riwayat.map((h, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex items-start gap-2 text-xs text-ink-400 pt-0.5">
                                <Clock className="h-3 w-3 mt-0.5 shrink-0" />
                                <span className="w-20 shrink-0 font-mono">
                                  {new Date(h.tanggal).toLocaleDateString("id-ID", {
                                    day: "2-digit", month: "short", year: "2-digit",
                                  })}
                                </span>
                              </div>
                              <div className="text-xs">
                                <span className="font-semibold text-ink-700">{closedLoopLabel(h.status)}</span>
                                <span className="text-ink-500"> — {h.catatan}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {canEditCloseLoop && (
                          <div className="mt-4 flex gap-2">
                            <button className="flex-1 rounded-lg bg-brass-600 py-2 text-xs font-bold text-white hover:bg-brass-500">
                              Update Status
                            </button>
                            <button className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-ink-600 hover:bg-slate-50">
                              Tambah Catatan
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "tabel" && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-ink-500">{regulasiData.length} regulasi dalam basis data</p>
              <button
                onClick={() => setSortDesc((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink-600 hover:bg-slate-50"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortDesc ? "Tertinggi dulu" : "Terendah dulu"}
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Table header */}
              <div className="grid grid-cols-[80px_1fr_120px_80px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                <span>Score</span>
                <span>Regulasi</span>
                <span className="hidden sm:block">OPD</span>
                <span>Kategori</span>
              </div>

              {sorted.map((r) => (
                <Link
                  key={r.id}
                  to={`/regulasi/${r.id}`}
                  className="grid grid-cols-[80px_1fr_120px_80px] items-center gap-4 border-b border-slate-50 px-5 py-4 last:border-0 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <div className={`font-mono text-sm font-bold ${decayColor(r.decayScore)}`}>
                      {r.decayScore}
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${decayBarColor(r.decayScore)}`}
                        style={{ width: `${r.decayScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink-800">{r.judul}</div>
                    <div className="text-xs text-ink-400">{regulasiLabel(r)}</div>
                  </div>
                  <div className="hidden truncate text-xs text-ink-400 sm:block">{r.opd}</div>
                  <Badge className={`shrink-0 text-[10px] ${decayColor(r.decayScore)} border-current/20 bg-current/5`}>
                    {decayLabel(r.decayScore)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
