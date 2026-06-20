import { Lock } from "lucide-react";
import { useRole, ROLE_INFO } from "../context/RoleContext";

export default function AccessRestricted({ requiredRoleLabel }: { requiredRoleLabel: string }) {
  const { role } = useRole();
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
        <Lock className="h-5 w-5" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">Akses Terbatas</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        Halaman ini khusus untuk peran <strong>{requiredRoleLabel}</strong>. Anda saat ini
        disimulasikan sebagai <strong>{ROLE_INFO[role].label}</strong>, yang tidak memiliki
        akses ke area ini.
      </p>
      <p className="mt-3 text-xs text-ink-400">
        Ubah simulasi peran melalui menu "Simulasi peran" pada navigasi untuk melihat tampilan ini.
      </p>
    </div>
  );
}
