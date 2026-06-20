import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 text-white/60">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
                <svg viewBox="0 0 32 32" className="h-5 w-5">
                  <path d="M16 6 L25 10 V16 C25 22 21 26 16 28 C11 26 7 22 7 16 V10 Z" fill="none" stroke="#cd9f44" strokeWidth="1.8" />
                  <path d="M12 15 H20 M12 19 H20 M12 11 H20" stroke="#e9d4a1" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-display text-base font-bold text-white">REGSIDA</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30">Kabupaten Sidoarjo</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/45">
              Regulasi Daerah Satu Data & AI Navigator — prototipe E-Government
              untuk Pemerintah Kabupaten Sidoarjo.
            </p>
            <div className="mt-5 space-y-2 text-xs text-white/35">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/25" />
                Jl. Pahlawan No.1, Sidoarjo, Jawa Timur
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-white/25" />
                (031) 894 1003
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-white/25" />
                info@sidoarjokab.go.id
              </div>
            </div>
          </div>

          {/* Portal Warga */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest2 text-white/40">Portal Warga</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/cari", label: "Cari Regulasi" },
                { href: "/tanya", label: "Tanya REGS (AI)" },
                { href: "/verifikasi", label: "Verifikasi Klaim Petugas" },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="transition-colors hover:text-white hover:pl-1 transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal ASN */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest2 text-white/40">Portal ASN</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/admin", label: "Dasbor Bagian Hukum" },
                { href: "/admin/graf", label: "Conflict Graph Engine" },
                { href: "/admin/decay", label: "Regulatory Decay Tracker" },
                { href: "/admin/inspektorat", label: "Dasbor Inspektorat" },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="transition-colors hover:text-white hover:pl-1 transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tentang */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest2 text-white/40">Sumber Resmi</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "https://jdih.sidoarjokab.go.id", label: "JDIH Kab. Sidoarjo" },
                { href: "https://peraturan.bpk.go.id", label: "Peraturan BPK" },
                { href: "https://www.lapor.go.id", label: "SP4N-LAPOR!" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    {l.label}
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-brass-500/20 bg-brass-500/8 p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brass-400">Kompetisi</div>
              <p className="mt-1.5 text-xs leading-relaxed text-white/50">
                Dibangun untuk KMIPN VIII 2026 — Kategori E-Government.
                Data regulasi disusun merujuk nomenklatur resmi Kab. Sidoarjo
                untuk keperluan demonstrasi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Prototipe REGSIDA — Tidak terafiliasi resmi dengan Pemerintah Kabupaten Sidoarjo.</span>
            <span>Inovasi Informatika Vokasional untuk Transformasi Digital Berkelanjutan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
