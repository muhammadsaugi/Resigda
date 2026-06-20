import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Search, ShieldCheck, Home, FileText, MessageCircleQuestion, ShieldAlert } from "lucide-react";

const navLinks = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/cari", label: "Cari Regulasi", icon: FileText },
  { to: "/tanya", label: "Tanya REGS", icon: MessageCircleQuestion },
  { to: "/verifikasi", label: "Verifikasi Klaim", icon: ShieldAlert },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAdminArea) return null;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md"
            : "border-b border-slate-200/60 bg-white"
        }`}
      >

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 ring-1 ring-ink-700 transition-transform group-hover:scale-105">
              <svg viewBox="0 0 32 32" className="h-6 w-6">
                <path d="M16 6 L25 10 V16 C25 22 21 26 16 28 C11 26 7 22 7 16 V10 Z" fill="none" stroke="#cd9f44" strokeWidth="1.8" />
                <path d="M12 15 H20 M12 19 H20 M12 11 H20" stroke="#e9d4a1" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-tight text-ink-900">REGSIDA</div>
              <div className="-mt-0.5 text-[10px] font-semibold uppercase tracking-widest2 text-ink-400">
                Kabupaten Sidoarjo
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "text-ink-900"
                      : "text-ink-500 hover:bg-slate-50 hover:text-ink-800"
                  }`}
                >
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brass-500" />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right action */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/cari"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-slate-100 hover:text-ink-800 transition-colors"
              aria-label="Cari regulasi"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-md active:scale-95"
            >
              <ShieldCheck className="h-4 w-4 text-brass-400" />
              Portal ASN
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="rounded-md p-2 text-ink-700 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <span className="font-display text-base font-semibold text-ink-900">Menu Navigasi</span>
              <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((l) => {
                const active = location.pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-ink-900 text-white"
                        : "text-ink-700 hover:bg-slate-50 hover:text-ink-900"
                    }`}
                  >
                    <l.icon className={`h-4 w-4 ${active ? "text-brass-400" : "text-ink-400"}`} />
                    {l.label}
                  </Link>
                );
              })}
              <div className="my-2 border-t border-slate-200" />
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg bg-ink-900 px-4 py-3 text-sm font-semibold text-white"
              >
                <ShieldCheck className="h-4 w-4 text-brass-400" />
                Portal ASN / Bagian Hukum
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
