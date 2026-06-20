import { useEffect, useRef, useState } from "react";
import { Send, Mic, Square, Volume2, Sparkles, AlertTriangle, MessageCircleQuestion, BookOpen } from "lucide-react";
import { askRegsida } from "../lib/rag";
import { ChatMessage } from "../data/types";
import { useVoiceInput, speakText } from "../lib/voice";
import ExplainabilityPanel from "../components/ExplainabilityPanel";

const SUGGESTIONS = [
  "Apakah warung makan saya perlu izin khusus?",
  "Berapa tarif Pajak Restoran di Sidoarjo?",
  "Apa saja insentif fiskal untuk UMKM?",
  "Apa benar ada biaya tambahan untuk PBG?",
];

const hasGeminiKey = Boolean((import.meta as any).env?.VITE_GEMINI_API_KEY);

export default function Tanya() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo, saya REGS — asisten regulasi daerah Kabupaten Sidoarjo. Anda dapat bertanya tentang pajak, retribusi, izin usaha, atau regulasi lain dalam bahasa sehari-hari. Saya hanya menjawab berdasarkan regulasi yang terindeks dalam sistem.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, isSupported, start, stop } = useVoiceInput();
  const [ragMetaMap, setRagMetaMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: q, timestamp: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const res = await askRegsida(q);

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: res.answer,
      confidence: res.confidence,
      sources: res.sources.map((s) => ({ regulasiId: s.regulasiId, pasal: s.pasal, score: s.score })),
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, assistantMsg]);
    setRagMetaMap((prev) => ({ ...prev, [assistantMsg.id]: res }));
    setLoading(false);
  }

  return (
    <div>
      {/* Page header */}
      <div className="border-b border-slate-200 bg-ink-900">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-400">
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            Asisten AI Regulasi
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">Tanya REGS</h1>
          <p className="mt-2 text-base text-white/60">
            Asisten AI regulasi daerah — jawaban berbasis dokumen, dengan kutipan pasal yang dapat diverifikasi.
          </p>

          {!hasGeminiKey && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-500/15 p-3 text-xs text-amber-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Mode demo: VITE_GEMINI_API_KEY belum diatur. Sistem berjalan dengan mesin jawaban
                rule-based berbasis dokumen. Tambahkan API key Gemini gratis untuk jawaban AI generatif.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8" style={{ minHeight: "calc(100vh - 280px)" }}>
        {/* Chat area */}
        <div className="flex flex-1 gap-6">
          {/* Chat column */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div
              ref={scrollRef}
              className="scrollbar-thin flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              style={{ maxHeight: "55vh" }}
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900">
                      <Sparkles className="h-3.5 w-3.5 text-brass-400" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${m.role === "user" ? "" : "min-w-[60%]"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "rounded-tr-sm bg-ink-900 text-white"
                          : "rounded-tl-sm border border-slate-200 bg-slate-50 text-ink-800"
                      }`}
                    >
                      {m.role === "assistant" && (
                        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-brass-600">
                          REGS · Asisten Regulasi
                        </div>
                      )}
                      <p className="whitespace-pre-line">{m.content}</p>
                      {m.role === "assistant" && (
                        <button
                          onClick={() => speakText(m.content)}
                          className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-ink-400 hover:text-ink-700"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          Dengarkan jawaban
                        </button>
                      )}
                    </div>
                    {m.role === "assistant" && ragMetaMap[m.id] && (
                      <ExplainabilityPanel
                        sources={ragMetaMap[m.id].sources}
                        consideredCount={ragMetaMap[m.id].consideredCount}
                        confidence={ragMetaMap[m.id].confidence}
                        groundedFromAI={ragMetaMap[m.id].groundedFromAI}
                      />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900">
                    <Sparkles className="h-3.5 w-3.5 text-brass-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-600 shadow-sm transition-all hover:border-brass-300 hover:bg-brass-50 hover:text-brass-800"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-brass-400 focus-within:shadow-md transition-all">
              <div className="flex items-center gap-2 px-3 py-2.5">
                {isSupported && (
                  <button
                    onClick={isListening ? stop : start}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isListening
                        ? "bg-sirah-500 text-white animate-pulse-ring"
                        : "bg-slate-100 text-ink-600 hover:bg-slate-200"
                    }`}
                    aria-label={isListening ? "Hentikan rekam suara" : "Mulai input suara"}
                  >
                    {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isListening ? "Mendengarkan..." : "Ketik atau ucapkan pertanyaan Anda..."}
                  className="flex-1 bg-transparent px-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-white transition-all hover:bg-brass-600 disabled:opacity-30 active:scale-95"
                  aria-label="Kirim pertanyaan"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-ink-400">
              Jawaban bersifat informatif berdasarkan regulasi yang terindeks. Untuk kepastian hukum,
              konsultasikan dengan Bagian Hukum Pemda.
            </p>
          </div>

          {/* Info sidebar */}
          <div className="hidden w-56 shrink-0 space-y-4 xl:block">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-700">
                <BookOpen className="h-3.5 w-3.5 text-brass-500" />
                Basis Pengetahuan
              </div>
              <div className="mt-3 space-y-2.5 text-xs text-ink-500">
                <div className="flex justify-between">
                  <span>Perda</span>
                  <span className="font-bold text-ink-700">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Perbup</span>
                  <span className="font-bold text-ink-700">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Surat Edaran</span>
                  <span className="font-bold text-ink-700">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Instruksi Bupati</span>
                  <span className="font-bold text-ink-700">5</span>
                </div>
                <div className="my-2 h-px bg-slate-100" />
                <div className="flex justify-between font-bold">
                  <span className="text-ink-700">Total</span>
                  <span className="text-ink-900">20</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-brass-200 bg-brass-50 p-4 text-xs text-brass-800">
              <div className="font-bold">💡 Tips bertanya</div>
              <ul className="mt-2 space-y-1.5 text-brass-700">
                <li>• Sebutkan jenis layanan secara spesifik</li>
                <li>• Tanyakan nominal biaya jika ada</li>
                <li>• Sebutkan nama OPD yang bersangkutan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
