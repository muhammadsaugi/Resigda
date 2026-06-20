import { Regulasi } from "../data/types";
import { regulasiData } from "../data/regulasi";

export interface SearchResult {
  regulasi: Regulasi;
  score: number;
  matchedPasal?: { nomor: string; isi: string }[];
}

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function scoreText(haystack: string, terms: string[]): number {
  const h = normalize(haystack);
  let score = 0;
  for (const t of terms) {
    if (!t) continue;
    const occurrences = h.split(t).length - 1;
    if (occurrences > 0) score += occurrences * (t.length > 4 ? 3 : 1.5);
  }
  return score;
}

export function searchRegulasi(query: string, opts?: { jenis?: string; status?: string }): SearchResult[] {
  const q = normalize(query).trim();
  if (!q) return [];
  const terms = q.split(/\s+/).filter((t) => t.length > 1);

  let pool = regulasiData;
  if (opts?.jenis) pool = pool.filter((r) => r.jenis === opts.jenis);
  if (opts?.status) pool = pool.filter((r) => r.status === opts.status);

  const results: SearchResult[] = [];

  for (const r of pool) {
    let score = 0;
    score += scoreText(r.judul, terms) * 4;
    score += scoreText(r.ringkasan, terms) * 2;
    score += scoreText(r.tags.join(" "), terms) * 3;
    score += scoreText(r.opd, terms) * 1.5;
    score += scoreText(`${r.jenis} ${r.nomor} ${r.tahun}`, terms) * 2;

    const matchedPasal: { nomor: string; isi: string }[] = [];
    for (const p of r.pasalUtama) {
      const pScore = scoreText(p.isi, terms);
      if (pScore > 0) {
        score += pScore;
        matchedPasal.push({ nomor: p.nomor, isi: p.isi });
      }
    }

    if (score > 0) {
      results.push({ regulasi: r, score, matchedPasal: matchedPasal.length ? matchedPasal : undefined });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export function getTopRegulasiForTopic(tags: string[], limit = 5): Regulasi[] {
  const scored = regulasiData.map((r) => {
    const overlap = r.tags.filter((t) => tags.includes(t)).length;
    return { r, overlap };
  });
  return scored
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((s) => s.r);
}
