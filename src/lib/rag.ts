import { searchRegulasi, SearchResult } from "./search";

export interface RagSource {
  regulasiId: string;
  judul: string;
  jenis: string;
  nomor: string;
  tahun: number;
  pasal: string;
  isi: string;
  score: number;
}

export interface RagResponse {
  answer: string;
  confidence: number; // 0-1
  sources: RagSource[];
  consideredCount: number;
  groundedFromAI: boolean; // true jika dijawab oleh Gemini, false jika fallback rule-based
}

function buildSourcesFromResults(results: SearchResult[], limit = 5): RagSource[] {
  const sources: RagSource[] = [];
  for (const res of results.slice(0, limit)) {
    const pasal = res.matchedPasal?.[0] ?? res.regulasi.pasalUtama[0];
    if (!pasal) continue;
    sources.push({
      regulasiId: res.regulasi.id,
      judul: res.regulasi.judul,
      jenis: res.regulasi.jenis,
      nomor: res.regulasi.nomor,
      tahun: res.regulasi.tahun,
      pasal: pasal.nomor,
      isi: pasal.isi,
      score: Math.min(0.97, 0.5 + res.score / 40),
    });
  }
  return sources;
}

function fallbackAnswer(_query: string, results: SearchResult[]): RagResponse {
  if (results.length === 0) {
    return {
      answer:
        "Belum ditemukan regulasi yang mengatur hal ini dalam basis data REGSIDA. Silakan hubungi Bagian Hukum Sekretariat Daerah Kabupaten Sidoarjo atau OPD terkait untuk informasi lebih lanjut.",
      confidence: 0.15,
      sources: [],
      consideredCount: 0,
      groundedFromAI: false,
    };
  }

  const sources = buildSourcesFromResults(results, 3);
  const top = results[0].regulasi;
  const topPasal = results[0].matchedPasal?.[0] ?? top.pasalUtama[0];

  const answer = `Berdasarkan ${top.jenis} Nomor ${top.nomor} Tahun ${top.tahun} tentang "${top.judul}", ${topPasal ? `pada ${topPasal.nomor} dinyatakan: ${topPasal.isi}` : top.ringkasan} ${results.length > 1 ? `\n\nRegulasi lain yang relevan dengan pertanyaan Anda: ${results.slice(1, 3).map((r) => `${r.regulasi.jenis} No. ${r.regulasi.nomor}/${r.regulasi.tahun}`).join(", ")}.` : ""}`;

  const avgScore = results.slice(0, 3).reduce((a, r) => a + r.score, 0) / Math.min(3, results.length);
  const confidence = Math.min(0.93, 0.45 + avgScore / 30);

  return {
    answer,
    confidence,
    sources,
    consideredCount: results.length,
    groundedFromAI: false,
  };
}

const GEMINI_MODEL = "gemini-1.5-flash-latest";

async function askGemini(query: string, results: SearchResult[], apiKey: string): Promise<RagResponse> {
  const sources = buildSourcesFromResults(results, 5);

  if (results.length === 0) {
    return fallbackAnswer(query, results);
  }

  const context = results
    .slice(0, 5)
    .map((r, i) => {
      const pasal = r.matchedPasal?.[0] ?? r.regulasi.pasalUtama[0];
      return `[Dokumen ${i + 1}] ${r.regulasi.jenis} No. ${r.regulasi.nomor} Tahun ${r.regulasi.tahun} — "${r.regulasi.judul}" (Status: ${r.regulasi.status})\n${pasal ? `${pasal.nomor}: ${pasal.isi}` : r.regulasi.ringkasan}`;
    })
    .join("\n\n");

  const systemPrompt = `Anda adalah REGS, asisten AI navigasi regulasi daerah untuk Kabupaten Sidoarjo dalam sistem REGSIDA. 
ATURAN KETAT:
1. Jawab HANYA berdasarkan dokumen konteks yang diberikan di bawah. JANGAN gunakan pengetahuan umum di luar konteks ini.
2. Jika konteks tidak cukup untuk menjawab, katakan dengan jelas bahwa regulasi terkait belum ditemukan dalam basis data, jangan mengarang.
3. Jawab dalam Bahasa Indonesia yang sederhana dan mudah dipahami warga awam, hindari jargon hukum berlebihan.
4. WAJIB sebutkan secara eksplisit sumber regulasi (jenis, nomor, tahun) yang menjadi dasar jawaban Anda.
5. Jawaban singkat dan padat, maksimal 4-5 kalimat.
6. Akhiri dengan kalimat: "Jawaban ini bersifat informatif berdasarkan regulasi yang terindeks. Untuk kepastian hukum, konsultasikan dengan Bagian Hukum Pemda."

KONTEKS DOKUMEN REGULASI:
${context}

PERTANYAAN WARGA: ${query}`;

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
        }),
      }
    );

    if (!resp.ok) {
      console.warn("Gemini API error, falling back to rule-based:", resp.status);
      return fallbackAnswer(query, results);
    }

    const data = await resp.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return fallbackAnswer(query, results);
    }

    const avgScore = results.slice(0, 3).reduce((a, r) => a + r.score, 0) / Math.min(3, results.length);
    const confidence = Math.min(0.95, 0.5 + avgScore / 30);

    return {
      answer: text.trim(),
      confidence,
      sources,
      consideredCount: results.length,
      groundedFromAI: true,
    };
  } catch (err) {
    console.warn("Gemini API request failed, falling back:", err);
    return fallbackAnswer(query, results);
  }
}

export async function askRegsida(query: string): Promise<RagResponse> {
  const results = searchRegulasi(query);
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

  if (apiKey && apiKey.length > 10) {
    return askGemini(query, results, apiKey);
  }
  return fallbackAnswer(query, results);
}

export function verifyClaim(claimText: string): RagResponse {
  const results = searchRegulasi(claimText);
  if (results.length === 0) {
    return {
      answer:
        "Biaya atau prosedur yang Anda sebutkan TIDAK DITEMUKAN dalam regulasi yang berlaku di basis data REGSIDA. Anda berhak meminta dasar hukum tertulis dari petugas, dan dapat melaporkan kejadian ini melalui kanal pengaduan resmi.",
      confidence: 0.2,
      sources: [],
      consideredCount: 0,
      groundedFromAI: false,
    };
  }
  const top = results[0];
  const hasStrongMatch = top.score > 8;
  if (!hasStrongMatch) {
    return {
      answer:
        "Biaya atau prosedur yang Anda sebutkan TIDAK DITEMUKAN secara spesifik dalam regulasi resmi yang terindeks. Anda berhak meminta dasar hukum tertulis dari petugas sebelum melakukan pembayaran apa pun di luar tarif resmi.",
      confidence: 0.3,
      sources: buildSourcesFromResults(results, 2),
      consideredCount: results.length,
      groundedFromAI: false,
    };
  }
  return {
    answer: `Ditemukan regulasi terkait: ${top.regulasi.jenis} No. ${top.regulasi.nomor}/${top.regulasi.tahun} tentang "${top.regulasi.judul}". Silakan bandingkan tarif/prosedur resmi pada regulasi ini dengan klaim yang disampaikan petugas.`,
    confidence: 0.7,
    sources: buildSourcesFromResults(results, 2),
    consideredCount: results.length,
    groundedFromAI: false,
  };
}
