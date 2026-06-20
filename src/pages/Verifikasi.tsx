import { useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle, ExternalLink, Mic, Square, ShieldCheck, Info, AlertTriangle } from "lucide-react";
import { verifyClaim, RagResponse } from "../lib/rag";
import { useVoiceInput } from "../lib/voice";
import { Link } from "react-router-dom";
import { regulasiLabel } from "../lib/format";
import { getRegulasiById } from "../data/regulasi";

const exampleClaims = [
  "Petugas minta biaya tambahan Rp150.000 untuk percepatan proses izin usaha mikro",
  "Diminta bayar Rp500.000 untuk pengurusan PBG di DPMPTSP",
  "Ada biaya administrasi Rp200.000 untuk perpanjangan SIUP",
];

export default function Verifikasi() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<RagResponse | null>(null);
  const { isListening, transcript, isSupported, start, stop } = useVoiceInput();

  function handleVoiceToggle() {
    if (isListening) {
      stop();
      if (transcript) setClaim(transcript);
    } else {
      start();
    }
  }

  function handleCheck() {
    if (!claim.trim()) return;
    setResult(verifyClaim(claim));
  }

  const notFound = result && result.confidence < 0.4;

  return (
    <div>
      {/* Page hero */}
      <div className="border-b border-slate-200 bg-ink-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sirah-500/20 ring-1 ring-sirah-400/30">
              <ShieldAlert className="h-5 w-5 text-sirah-400" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest text-sirah-400">
              Fitur Anti-Pungutan Tidak Resmi
            </div>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Verifikasi Klaim Petugas
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/60">
            Diminta membayar biaya atau memenuhi prosedur yang terasa tidak biasa? REGSIDA
            akan memeriksa apakah hal itu diatur dalam regulasi resmi Kabupaten Sidoarjo.
          </p>

          {/* Trust badges */}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { icon: ShieldCheck, label: "100% Anonim" },
              { icon: Info, label: "Tanpa Login" },
              { icon: ShieldAlert, label: "Data Tidak Disimpan" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs text-white/60">
                <b.icon className="h-3.5 w-3.5" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main form */}
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Tuliskan klaim yang disampaikan petugas
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Deskripsikan biaya atau prosedur yang diminta secara spesifik, termasuk nominalnya jika ada.
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-brass-400 focus-within:bg-white transition-all">
                <textarea
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder='Contoh: "Petugas minta biaya tambahan Rp150.000 untuk percepatan proses izin usaha mikro."'
                  rows={4}
                  className="w-full resize-none bg-transparent px-4 pt-4 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
                <div className="flex items-center justify-between px-3 pb-3 pt-1">
                  <span className="text-xs text-ink-400">{claim.length} karakter</span>
                  {isSupported && (
                    <button
                      onClick={handleVoiceToggle}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isListening
                          ? "bg-sirah-500 text-white animate-pulse-ring"
                          : "border border-slate-200 text-ink-600 hover:bg-slate-100"
                      }`}
                    >
                      {isListening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                      {isListening ? "Hentikan" : "Input Suara"}
                    </button>
                  )}
                </div>
              </div>

              {/* Example claims */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-ink-400">Contoh klaim untuk dicoba:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {exampleClaims.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setClaim(ex)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-ink-600 shadow-sm transition-all hover:border-brass-300 hover:bg-brass-50 hover:text-brass-800"
                    >
                      {ex.length > 50 ? ex.slice(0, 50) + "…" : ex}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCheck}
                disabled={!claim.trim()}
                className="mt-6 w-full rounded-xl bg-ink-900 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brass-700 hover:shadow-md active:scale-[0.99] disabled:opacity-30"
              >
                Periksa Klaim Ini →
              </button>
            </div>

            {/* Result */}
            {result && (
              <div
                className={`mt-6 overflow-hidden rounded-2xl border shadow-sm ${
                  notFound
                    ? "border-sirah-300 bg-sirah-50"
                    : "border-sawo-300 bg-sawo-50"
                }`}
              >
                {/* Result header */}
                <div className={`flex items-center gap-3 px-6 py-4 ${notFound ? "bg-sirah-100" : "bg-sawo-100"}`}>
                  {notFound ? (
                    <XCircle className="h-6 w-6 text-sirah-600" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-sawo-600" />
                  )}
                  <h3 className={`font-display text-lg font-bold ${notFound ? "text-sirah-800" : "text-sawo-800"}`}>
                    {notFound ? "⚠ Tidak Ditemukan dalam Regulasi" : "✓ Regulasi Terkait Ditemukan"}
                  </h3>
                </div>

                <div className="p-6">
                  <p className={`text-sm leading-relaxed ${notFound ? "text-sirah-700" : "text-sawo-700"}`}>
                    {result.answer}
                  </p>

                  {result.sources.length > 0 && (
                    <div className="mt-5 space-y-2">
                      <p className={`text-xs font-bold uppercase tracking-wider ${notFound ? "text-sirah-600" : "text-sawo-600"}`}>
                        Regulasi yang ditemukan:
                      </p>
                      {result.sources.map((s, i) => {
                        const reg = getRegulasiById(s.regulasiId);
                        if (!reg) return null;
                        return (
                          <Link
                            key={i}
                            to={`/regulasi/${s.regulasiId}`}
                            className="flex items-center justify-between rounded-lg border border-white/60 bg-white/60 px-4 py-3 text-sm hover:bg-white transition-colors"
                          >
                            <span className="font-semibold text-ink-700">
                              {regulasiLabel(reg)} — {reg.judul}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {notFound && (
                    <div className="mt-6 rounded-xl border border-sirah-200 bg-white/60 p-4">
                      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-sirah-700">
                        Langkah yang dapat Anda ambil:
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="https://www.lapor.go.id"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-lg bg-sirah-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sirah-800 transition-colors"
                        >
                          Laporkan via SP4N-LAPOR!
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <div className="flex items-center gap-2 rounded-lg border border-sirah-200 bg-white px-4 py-2.5 text-xs font-semibold text-sirah-700">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Minta dasar hukum tertulis
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right info sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-700">
                <ShieldCheck className="h-3.5 w-3.5 text-sawo-600" />
                Hak Anda sebagai Warga
              </div>
              <ul className="mt-3 space-y-2.5 text-xs text-ink-600">
                <li className="flex gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-sawo-100 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-sawo-700">1</span>
                  </span>
                  Anda berhak meminta dasar hukum tertulis sebelum membayar biaya apapun.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-sawo-100 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-sawo-700">2</span>
                  </span>
                  Semua biaya resmi harus tertera dalam regulasi yang telah dipublikasikan.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-sawo-100 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-sawo-700">3</span>
                  </span>
                  Laporan pungutan tidak resmi dilindungi dan tidak memerlukan identitas.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-ink-700">Cara Kerja</div>
              <div className="mt-3 space-y-3 text-xs text-ink-500">
                <div className="flex gap-2.5">
                  <span className="mt-0.5 font-mono font-bold text-brass-600">01.</span>
                  <span>Tuliskan klaim atau biaya yang diminta petugas</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-0.5 font-mono font-bold text-brass-600">02.</span>
                  <span>REGSIDA mencari dalam 20 regulasi resmi Kabupaten Sidoarjo</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-0.5 font-mono font-bold text-brass-600">03.</span>
                  <span>Hasil dan kutipan pasal terkait ditampilkan secara transparan</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-0.5 font-mono font-bold text-brass-600">04.</span>
                  <span>Jika tidak ditemukan, Anda dapat melaporkan ke SP4N-LAPOR!</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-ink-400">
              Data hasil pemeriksaan dicatat secara anonim dan diagregasi pada Dasbor
              Inspektorat sebagai indikator dini pengawasan layanan publik.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
