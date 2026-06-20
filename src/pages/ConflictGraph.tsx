import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Network, AlertTriangle, CheckCircle2, HelpCircle, X, Filter, Info } from "lucide-react";
import { getRegulasiById } from "../data/regulasi";
import { conflictEdges } from "../data/graph";
import { ConflictEdge, JenisRegulasi } from "../data/types";
import { regulasiLabel, relasiLabel } from "../lib/format";
import { useRole, ROLE_INFO } from "../context/RoleContext";
import AdminLayout from "../components/AdminLayout";

// Node hanya yang punya minimal satu edge
const nodeIds = Array.from(
  new Set(conflictEdges.flatMap((e) => [e.sourceId, e.targetId]))
);

const jenisColor: Record<JenisRegulasi, string> = {
  Perda: "#b9852f",
  Perbup: "#465c66",
  SE: "#7c9d5b",
  "Instruksi Bupati": "#9f3f29",
};

function computeLayout(ids: string[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 70;
  const positions: Record<string, { x: number; y: number }> = {};
  ids.forEach((id, i) => {
    const angle = (i / ids.length) * 2 * Math.PI - Math.PI / 2;
    positions[id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return positions;
}

const relasiColor: Record<ConflictEdge["jenisRelasi"], string> = {
  mencabut: "#9f3f29",
  mengubah: "#b9852f",
  merujuk: "#647a83",
  berpotensi_konflik: "#bd5940",
};

export default function ConflictGraph() {
  const { canEditGraph, role } = useRole();
  const [selectedEdge, setSelectedEdge] = useState<ConflictEdge | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"semua" | "konflik" | "valid">("semua");

  const width = 760;
  const height = 520;
  const positions = useMemo(() => computeLayout(nodeIds, width, height), []);

  const visibleEdges = conflictEdges.filter((e) => {
    if (filter === "konflik") return e.jenisRelasi === "berpotensi_konflik";
    if (filter === "valid") return e.statusTinjau === "valid";
    return true;
  });

  const unresolvedConflicts = conflictEdges.filter(
    (e) => e.jenisRelasi === "berpotensi_konflik" && e.statusTinjau === "belum_ditinjau"
  );

  const filterOptions = [
    { key: "semua", label: "Semua Relasi", count: conflictEdges.length },
    { key: "konflik", label: "Berpotensi Konflik", count: conflictEdges.filter(e => e.jenisRelasi === "berpotensi_konflik").length },
    { key: "valid", label: "Sudah Divalidasi", count: conflictEdges.filter(e => e.statusTinjau === "valid").length },
  ] as const;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-600">
            <Network className="h-3.5 w-3.5" />
            Conflict & Redundancy Graph Engine
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900 lg:text-3xl">
            Peta Relasi Regulasi
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-500">
            Visualisasi jaringan hubungan antar-regulasi: pencabutan, perubahan, rujukan, dan
            potensi konflik. Setiap relasi memiliki skor keyakinan (confidence).
          </p>
        </div>

        {/* Role banner */}
        {!canEditGraph && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Info className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              Anda masuk sebagai <strong>{ROLE_INFO[role].label}</strong> — mode lihat saja.
              Hanya <strong>Bagian Hukum Setda</strong> yang dapat memvalidasi relasi.
            </span>
          </div>
        )}

        {/* Filter pills */}
        <div className="mb-6 flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-400" />
          <div className="flex gap-2">
            {filterOptions.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
                  filter === f.key
                    ? "border-ink-900 bg-ink-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-slate-50"
                }`}
              >
                {f.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filter === f.key ? "bg-white/20 text-white" : "bg-slate-100 text-ink-500"
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Graph canvas */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-800">Visualisasi Jaringan</h3>
              <span className="text-xs text-ink-400">{nodeIds.length} node · {visibleEdges.length} relasi ditampilkan</span>
            </div>
            <div className="p-4">
              <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#94a5ac" />
                  </marker>
                </defs>

                {visibleEdges.map((e) => {
                  const s = positions[e.sourceId];
                  const t = positions[e.targetId];
                  if (!s || !t) return null;
                  const isDashed = e.confidence < 0.6;
                  const isHighlighted = hoveredNode === e.sourceId || hoveredNode === e.targetId;
                  return (
                    <g key={e.id} className="cursor-pointer" onClick={() => setSelectedEdge(e)}>
                      <line
                        x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                        stroke={relasiColor[e.jenisRelasi]}
                        strokeWidth={isHighlighted ? 3 : 1.5}
                        strokeDasharray={isDashed ? "5,4" : undefined}
                        opacity={isHighlighted || !hoveredNode ? 0.9 : 0.12}
                        markerEnd="url(#arrow)"
                      />
                      <circle
                        cx={(s.x + t.x) / 2} cy={(s.y + t.y) / 2} r={10}
                        fill="white" stroke={relasiColor[e.jenisRelasi]} strokeWidth={1.5}
                        opacity={isHighlighted || !hoveredNode ? 1 : 0.15}
                      />
                      <text
                        x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 + 3.5}
                        textAnchor="middle" fontSize="9.5" fontWeight="700"
                        fill={relasiColor[e.jenisRelasi]}
                        opacity={isHighlighted || !hoveredNode ? 1 : 0.15}
                      >
                        {Math.round(e.confidence * 100)}
                      </text>
                    </g>
                  );
                })}

                {nodeIds.map((id) => {
                  const pos = positions[id];
                  const reg = getRegulasiById(id);
                  if (!pos || !reg) return null;
                  const isHovered = hoveredNode === id;
                  return (
                    <g
                      key={id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle r={isHovered ? 28 : 23} fill={jenisColor[reg.jenis]} opacity={0.12} />
                      <circle r={10} fill={jenisColor[reg.jenis]} stroke="white" strokeWidth={2.5} />
                      <text
                        y={isHovered ? -32 : 20}
                        textAnchor="middle" fontSize="10.5" fontWeight={700}
                        fill="#283740"
                      >
                        {reg.jenis === "Instruksi Bupati" ? "Instr." : reg.jenis} {reg.nomor}/{reg.tahun}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-3">
                {Object.entries(jenisColor).map(([k, c]) => (
                  <span key={k} className="flex items-center gap-1.5 text-xs text-ink-500">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                    {k}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 text-xs text-ink-400">
                  <span className="h-px w-5 border-t border-dashed border-ink-400" />
                  Confidence &lt;60%
                </span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Alert card */}
            <div className="rounded-xl border border-sirah-200 bg-sirah-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-sirah-800">
                <AlertTriangle className="h-4 w-4" />
                {unresolvedConflicts.length} Konflik Belum Ditinjau
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-sirah-700">
                Memerlukan verifikasi staf hukum. Klik relasi (lingkaran di tengah garis)
                untuk melihat detail.
              </p>
            </div>

            {/* Selected edge detail */}
            {selectedEdge ? (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {selectedEdge.jenisRelasi === "berpotensi_konflik" ? (
                      <AlertTriangle className="h-4 w-4 text-sirah-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-sawo-600" />
                    )}
                    <span className="text-sm font-bold text-ink-900">
                      {relasiLabel(selectedEdge.jenisRelasi)}
                    </span>
                  </div>
                  <button onClick={() => setSelectedEdge(null)} className="rounded p-1 text-ink-400 hover:bg-slate-100 hover:text-ink-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <Link to={`/regulasi/${selectedEdge.sourceId}`} className="block rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-medium text-ink-700 hover:border-brass-300 hover:bg-brass-50">
                    {regulasiLabel(getRegulasiById(selectedEdge.sourceId)!)}
                  </Link>
                  <div className="flex items-center gap-2 px-2 text-xs text-ink-400">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span style={{ color: relasiColor[selectedEdge.jenisRelasi] }}>
                      {relasiLabel(selectedEdge.jenisRelasi)}
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <Link to={`/regulasi/${selectedEdge.targetId}`} className="block rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 font-medium text-ink-700 hover:border-brass-300 hover:bg-brass-50">
                    {regulasiLabel(getRegulasiById(selectedEdge.targetId)!)}
                  </Link>
                </div>

                {/* Confidence bar */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-ink-500">
                    <span>Confidence Score</span>
                    <span className="font-mono font-bold text-ink-700">{Math.round(selectedEdge.confidence * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${selectedEdge.confidence * 100}%`,
                        background: relasiColor[selectedEdge.jenisRelasi],
                      }}
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-ink-600">{selectedEdge.alasan}</p>

                {/* Actions */}
                {selectedEdge.statusTinjau === "belum_ditinjau" && canEditGraph && (
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg bg-sawo-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-sawo-700">
                      ✓ Tandai Valid
                    </button>
                    <button className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-ink-600 transition-colors hover:bg-slate-50">
                      Tidak Relevan
                    </button>
                  </div>
                )}
                {selectedEdge.statusTinjau === "belum_ditinjau" && !canEditGraph && (
                  <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-ink-500">
                    Peran <strong>{ROLE_INFO[role].label}</strong> tidak dapat memvalidasi.
                  </div>
                )}
                {selectedEdge.statusTinjau !== "belum_ditinjau" && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-sawo-50 px-3 py-2.5 text-xs font-medium text-sawo-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {selectedEdge.statusTinjau === "valid" ? "Sudah divalidasi staf hukum" : "Ditandai tidak relevan"}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <HelpCircle className="h-5 w-5 text-ink-400" />
                </div>
                <p className="text-xs text-ink-400">
                  Klik salah satu relasi (lingkaran kecil pada garis) untuk melihat
                  detail dan alasan deteksi AI.
                </p>
              </div>
            )}

            {/* Info note */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-ink-500">
              <strong className="text-ink-700">Catatan validasi:</strong> Setiap edge konflik
              disertai confidence score dan dapat dikoreksi manual oleh staf hukum
              (human-in-the-loop). Garis putus-putus = confidence di bawah 60%.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
