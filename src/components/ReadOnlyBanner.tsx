import { Eye } from "lucide-react";
import { useRole, ROLE_INFO } from "../context/RoleContext";

export default function ReadOnlyBanner({ allowedRoleLabel }: { allowedRoleLabel: string }) {
  const { role } = useRole();
  return (
    <div className="mt-4 flex items-center gap-2 rounded-md border border-ink-200 bg-ink-50 px-3.5 py-2 text-xs text-ink-500">
      <Eye className="h-3.5 w-3.5 shrink-0" />
      Anda melihat sebagai <strong className="text-ink-700">{ROLE_INFO[role].label}</strong> —
      mode lihat saja. Aksi edit/validasi hanya tersedia untuk peran {allowedRoleLabel}.
    </div>
  );
}
