import { createContext, useContext, useState, ReactNode } from "react";

export type AsnRole = "staf_opd" | "bagian_hukum" | "inspektorat";

export const ROLE_INFO: Record<AsnRole, { label: string; deskripsi: string; instansi: string }> = {
  staf_opd: {
    label: "Staf OPD",
    deskripsi: "Akses lihat (read-only) ke dasbor, graf regulasi, dan decay tracker.",
    instansi: "OPD Teknis (mis. DPMPTSP, Bapenda)",
  },
  bagian_hukum: {
    label: "Bagian Hukum Setda",
    deskripsi: "Akses penuh — validasi relasi graf dan kelola status tindak lanjut revisi.",
    instansi: "Bagian Hukum Sekretariat Daerah",
  },
  inspektorat: {
    label: "Inspektorat Daerah",
    deskripsi: "Akses penuh ke dasbor pengawasan pungli; graf & decay bersifat lihat saja.",
    instansi: "Inspektorat Kabupaten Sidoarjo",
  },
};

interface RoleContextValue {
  role: AsnRole;
  setRole: (r: AsnRole) => void;
  canEditGraph: boolean;
  canEditCloseLoop: boolean;
  canViewInspektorat: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AsnRole>("bagian_hukum");

  const value: RoleContextValue = {
    role,
    setRole,
    canEditGraph: role === "bagian_hukum",
    canEditCloseLoop: role === "bagian_hukum",
    canViewInspektorat: role === "inspektorat",
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole harus dipakai di dalam RoleProvider");
  return ctx;
}
