import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Share2, GitBranch } from "lucide-react";
import { getRegulasiById } from "../data/regulasi";
import { conflictEdges } from "../data/graph";
import { Badge } from "../components/ui";
import { statusColor, regulasiLabel, formatTanggal, relasiLabel, decayColor, decayLabel } from "../lib/format";

export default function RegulasiDetail() {
  const { id } = useParams<{ id: string }>();
  const regulasi = id ? getRegulasiById(id) : undefined;

  if (!regulasi) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-ink-600">Regulasi tidak ditemukan.</p>
        <Link to="/cari" className="mt-4 inline-block text-sm font-medium text-brass-700">
          Kembali ke pencarian
        </Link>
      </div>
    );
  }

  const relatedEdges = conflictEdges.filter(
    (e) => e.sourceId === regulasi.id || e.targetId === regulasi.id
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/cari" className="flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft className="h-4 w-4" /> Kembali ke pencarian
      </Link>

      <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-7 shadow-card sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-brass-700">{regulasiLabel(regulasi)}</span>
          <Badge className={statusColor(regulasi.status)}>{regulasi.status}</Badge>
        </div>

        <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink-900 sm:text-3xl">
          {regulasi.judul}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-500">
          <span>OPD Pengampu: <strong className="text-ink-700">{regulasi.opd}</strong></span>
          <span>·</span>
          <span>Diterbitkan {formatTanggal(regulasi.tanggalTerbit)}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {regulasi.tags.map((t) => (
            <span key={t} className="rounded-full bg-ink-100 px-2.5 py-1 text-xs text-ink-600">
              #{t}
            </span>
          ))}
        </div>

        <p className="mt-6 leading-relaxed text-ink-700">{regulasi.ringkasan}</p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <button className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50">
            <Download className="h-3.5 w-3.5" /> Unduh PDF Asli
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50">
            <Share2 className="h-3.5 w-3.5" /> Bagikan Tautan
          </button>
        </div>
      </div>

      {/* Breadcrumb hukum / relasi */}
      {(regulasi.dicabutOleh || (regulasi.mencabut && regulasi.mencabut.length > 0) || relatedEdges.length > 0) && (
        <div className="mt-6 rounded-xl border border-ink-200 bg-ink-50/60 p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-ink-500">
            <GitBranch className="h-3.5 w-3.5" /> Breadcrumb Hukum
          </div>
          <div className="mt-3 space-y-2">
            {regulasi.dicabutOleh && (
              <Link
                to={`/regulasi/${regulasi.dicabutOleh}`}
                className="block rounded-md border border-sirah-200 bg-sirah-50 p-3 text-sm text-sirah-800 hover:border-sirah-300"
              >
                Dicabut oleh {regulasiLabel(getRegulasiById(regulasi.dicabutOleh)!)} — {getRegulasiById(regulasi.dicabutOleh)?.judul}
              </Link>
            )}
            {regulasi.mencabut?.map((mid) => {
              const m = getRegulasiById(mid);
              if (!m) return null;
              return (
                <Link key={mid} to={`/regulasi/${mid}`} className="block rounded-md border border-ink-200 bg-white p-3 text-sm text-ink-700 hover:border-brass-300">
                  Mencabut {regulasiLabel(m)} — {m.judul}
                </Link>
              );
            })}
            {relatedEdges.map((e) => {
              const otherId = e.sourceId === regulasi.id ? e.targetId : e.sourceId;
              const other = getRegulasiById(otherId);
              if (!other) return null;
              const isConflict = e.jenisRelasi === "berpotensi_konflik";
              return (
                <Link
                  key={e.id}
                  to={`/regulasi/${otherId}`}
                  className={`block rounded-md border p-3 text-sm hover:opacity-90 ${
                    isConflict ? "border-sirah-200 bg-sirah-50 text-sirah-800" : "border-ink-200 bg-white text-ink-700"
                  }`}
                >
                  {relasiLabel(e.jenisRelasi)} — {regulasiLabel(other)} ({Math.round(e.confidence * 100)}% yakin)
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Pasal */}
      <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-7 sm:p-9">
        <h2 className="font-display text-lg font-semibold text-ink-900">Ketentuan Utama</h2>
        <div className="mt-4 space-y-4">
          {regulasi.pasalUtama.map((p) => (
            <div key={p.id} className="border-l-2 border-brass-300 pl-4">
              <div className="font-mono text-xs font-semibold text-brass-700">{p.nomor}</div>
              <p className="mt-1 leading-relaxed text-ink-700">{p.isi}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrik tata kelola */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ink-200 bg-white p-5">
          <div className={`font-display text-2xl font-semibold ${decayColor(regulasi.decayScore)}`}>
            {regulasi.decayScore}
          </div>
          <div className="mt-1 text-xs text-ink-500">Decay Score — {decayLabel(regulasi.decayScore)}</div>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white p-5">
          <div className="font-display text-2xl font-semibold text-ink-900">{regulasi.jumlahDilihat.toLocaleString("id-ID")}</div>
          <div className="mt-1 text-xs text-ink-500">Total dilihat</div>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white p-5">
          <div className="font-display text-2xl font-semibold text-ink-900">{regulasi.jumlahDitanyakan.toLocaleString("id-ID")}</div>
          <div className="mt-1 text-xs text-ink-500">Pertanyaan AI terkait / bulan</div>
        </div>
      </div>
    </div>
  );
}
