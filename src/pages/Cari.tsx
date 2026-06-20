import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, Calendar, Building, ChevronRight, Filter, X } from "lucide-react";
import { searchRegulasi } from "../lib/search";
import { regulasiData } from "../data/regulasi";
import { Badge } from "../components/ui";
import { statusColor, regulasiLabel, formatTanggal } from "../lib/format";
import { JenisRegulasi } from "../data/types";

const jenisOptions: (JenisRegulasi | "Semua")[] = ["Semua", "Perda", "Perbup", "SE", "Instruksi Bupati"];

const jenisIcon: Record<string, string> = {
  Perda: "P",
  Perbup: "B",
  SE: "S",
  "Instruksi Bupati": "I",
};

const jenisColor: Record<string, string> = {
  Perda: "bg-brass-100 text-brass-800",
  Perbup: "bg-ink-100 text-ink-700",
  SE: "bg-sawo-100 text-sawo-700",
  "Instruksi Bupati": "bg-sirah-100 text-sirah-700",
};

export default function Cari() {
  const [query, setQuery] = useState("");
  const [jenis, setJenis] = useState<JenisRegulasi | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) {
      return regulasiData
        .filter((r) => jenis === "Semua" || r.jenis === jenis)
        .map((r) => ({ regulasi: r, score: 0, matchedPasal: undefined }));
    }
    return searchRegulasi(query, jenis === "Semua" ? undefined : { jenis }).filter(
      (res) => jenis === "Semua" || res.regulasi.jenis === jenis
    );
  }, [query, jenis]);

  const jenisCounts = regulasiData.reduce<Record<string, number>>((acc, r) => {
    acc[r.jenis] = (acc[r.jenis] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Page hero */}
      <div className="border-b border-slate-200 bg-ink-900">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-400">
            <FileText className="h-3.5 w-3.5" />
            Basis Data Regulasi
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Cari Regulasi Daerah
          </h1>
          <p className="mt-2 text-base text-white/60">
            Telusuri seluruh Perda, Perbup, Surat Edaran, dan Instruksi Bupati Kabupaten Sidoarjo.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur focus-within:border-brass-400 focus-within:bg-white/15 transition-all">
            <Search className="h-5 w-5 shrink-0 text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: tarif pajak restoran, izin usaha mikro, jam layanan ramadan..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-white/40 hover:text-white/70">
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                showFilter ? "bg-brass-500 text-white" : "border border-white/20 text-white/60 hover:text-white"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>

          {showFilter && (
            <div className="mt-3 flex flex-wrap gap-2">
              {jenisOptions.map((j) => (
                <button
                  key={j}
                  onClick={() => setJenis(j)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    jenis === j
                      ? "border-brass-400 bg-brass-500 text-white"
                      : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {j === "SE" ? "Surat Edaran" : j}
                  {j !== "Semua" && (
                    <span className="ml-1.5 opacity-60">({jenisCounts[j as string] ?? 0})</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <span className="font-bold text-ink-800">{results.length}</span>
            regulasi ditemukan
            {query && (
              <span>
                {" "}untuk{" "}
                <span className="rounded-md bg-brass-100 px-2 py-0.5 text-xs font-semibold text-brass-800">
                  "{query}"
                </span>
              </span>
            )}
            {jenis !== "Semua" && (
              <Badge className="border-ink-200 bg-ink-100 text-ink-600">{jenis}</Badge>
            )}
          </div>

          {/* Quick type filters */}
          <div className="flex gap-1.5">
            {(["Semua", "Perda", "Perbup", "SE", "Instruksi Bupati"] as const).map((j) => (
              <button
                key={j}
                onClick={() => setJenis(j)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  jenis === j
                    ? "bg-ink-900 text-white"
                    : "text-ink-500 hover:bg-slate-100 hover:text-ink-800"
                }`}
              >
                {j === "SE" ? "Surat Edaran" : j === "Instruksi Bupati" ? "Instruksi" : j}
              </button>
            ))}
          </div>
        </div>

        {/* Result cards */}
        <div className="space-y-3">
          {results.map(({ regulasi: r, matchedPasal }) => (
            <Link
              key={r.id}
              to={`/regulasi/${r.id}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brass-300/60 hover:shadow-elevated"
            >
              <div className="flex items-start gap-4 p-5">
                {/* Jenis badge */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${jenisColor[r.jenis] ?? "bg-slate-100 text-ink-600"}`}>
                  {jenisIcon[r.jenis] ?? "R"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brass-700">{regulasiLabel(r)}</span>
                    <Badge className={statusColor(r.status)}>{r.status}</Badge>
                    {matchedPasal && matchedPasal.length > 0 && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-100">Cocok dalam pasal</Badge>
                    )}
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-ink-900 group-hover:text-brass-800 transition-colors">
                    {r.judul}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{r.ringkasan}</p>

                  {matchedPasal && matchedPasal.length > 0 && (
                    <div className="mt-2.5 rounded-lg border border-brass-200 bg-brass-50 px-3 py-2 text-xs text-brass-800">
                      <span className="font-mono font-bold">{matchedPasal[0].nomor}</span>
                      {" "}— {matchedPasal[0].isi}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {r.opd}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatTanggal(r.tanggalTerbit)}
                    </span>
                  </div>
                </div>

                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brass-500" />
              </div>

              {/* Bottom accent line on hover */}
              <div className="h-0.5 bg-gradient-to-r from-brass-300 to-brass-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}

          {results.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-6 w-6 text-ink-400" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-700">
                Tidak ada regulasi yang cocok
              </h3>
              <p className="mt-2 text-sm text-ink-400">
                Coba kata kunci lain atau gunakan fitur{" "}
                <Link to="/tanya" className="font-semibold text-brass-600 hover:underline">
                  Tanya REGS
                </Link>{" "}
                untuk pertanyaan yang lebih bebas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
