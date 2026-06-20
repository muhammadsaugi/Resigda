import { useState } from "react";
import { ChevronDown, UserCog, Check } from "lucide-react";
import { useRole, ROLE_INFO, AsnRole } from "../context/RoleContext";

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 py-2.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80"
      >
        <UserCog className="h-3.5 w-3.5 text-brass-400 shrink-0" />
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[10px] text-white/35 uppercase tracking-wider">Simulasi Peran</div>
          <div className="truncate text-xs font-semibold text-white/70">{ROLE_INFO[role].label}</div>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-xl border border-slate-200 bg-white p-2 shadow-elevated">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-400">
              Pilih Simulasi Peran ASN
            </div>
            {(Object.keys(ROLE_INFO) as AsnRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors ${
                  role === r ? "bg-brass-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  {role === r && <Check className="h-3.5 w-3.5 text-brass-600" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-ink-900">{ROLE_INFO[r].label}</div>
                  <div className="text-[11px] text-ink-400">{ROLE_INFO[r].instansi}</div>
                  <div className="mt-0.5 text-[11px] text-ink-500">{ROLE_INFO[r].deskripsi}</div>
                </div>
              </button>
            ))}
            <div className="mt-1 border-t border-slate-100 px-2.5 pt-2 text-[10px] leading-relaxed text-ink-400">
              Simulasi untuk demonstrasi. Versi produksi menggunakan SSO ASN.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
