import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Network,
  TrendingDown,
  ShieldAlert,
  ChevronRight,
  Users,
  BarChart3,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { useRole, ROLE_INFO } from "../context/RoleContext";
import RoleSwitcher from "./RoleSwitcher";

const navItems = [
  {
    group: "Dashboard",
    items: [
      { to: "/admin", label: "Dasbor Utama", icon: LayoutDashboard, exact: true },
      { to: "/admin/analytics", label: "Analitik", icon: BarChart3 },
    ],
  },
  {
    group: "Tata Kelola Regulasi",
    items: [
      { to: "/admin/graf", label: "Conflict Graph Engine", icon: Network, requiresBagianHukum: false },
      { to: "/admin/decay", label: "Decay Tracker", icon: TrendingDown, requiresBagianHukum: false },
      { to: "/admin/docs", label: "Basis Regulasi", icon: BookOpen },
    ],
  },
  {
    group: "Pengawasan",
    items: [
      { to: "/admin/inspektorat", label: "Dasbor Inspektorat", icon: ShieldAlert, requiresInspektorat: true },
      { to: "/admin/asn", label: "Manajemen ASN", icon: Users },
    ],
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
}

export default function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const location = useLocation();
  const { role, canViewInspektorat } = useRole();
  const roleInfo = ROLE_INFO[role];

  function isActive(to: string, exact = false) {
    if (exact) return location.pathname === to;
    return location.pathname === to;
  }

  return (
    <aside
      className={`sidebar-gradient flex flex-col shadow-sidebar transition-all duration-300 w-full min-h-full`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/8 px-5 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brass-500/20 ring-1 ring-brass-400/30">
          <svg viewBox="0 0 32 32" className="h-5 w-5">
            <path d="M16 6 L25 10 V16 C25 22 21 26 16 28 C11 26 7 22 7 16 V10 Z" fill="none" stroke="#cd9f44" strokeWidth="1.8" />
            <path d="M12 15 H20 M12 19 H20 M12 11 H20" stroke="#e9d4a1" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div className="font-display text-sm font-semibold text-white">REGSIDA</div>
            <div className="text-[10px] tracking-wider text-white/40 uppercase">Portal ASN</div>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="mx-3 mt-4 rounded-lg border border-brass-500/20 bg-brass-500/10 px-3 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brass-400">Sesi Aktif</div>
          <div className="mt-0.5 text-xs font-medium text-white/80">{roleInfo.label}</div>
          <div className="mt-0.5 text-[10px] text-white/40 truncate">{roleInfo.instansi}</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navItems.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !('requiresInspektorat' in item && item.requiresInspektorat && !canViewInspektorat)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.group} className="mb-5">
              {!collapsed && (
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {group.group}
                </div>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.to, ('exact' in item && item.exact) || false);
                  const disabled = 'disabled' in item && item.disabled;

                  return (
                    <Link
                      key={item.to}
                      to={disabled ? "#" : item.to}
                      onClick={(e) => disabled && e.preventDefault()}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                        active
                          ? "bg-brass-500/15 text-brass-300 ring-1 ring-brass-500/20"
                          : disabled
                          ? "cursor-not-allowed text-white/20"
                          : "text-white/50 hover:bg-white/6 hover:text-white/80"
                      }`}
                    >
                      <item.icon
                        className={`h-4.5 w-4.5 shrink-0 ${
                          active ? "text-brass-400" : disabled ? "text-white/15" : "text-white/35 group-hover:text-white/60"
                        }`}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 font-medium">{item.label}</span>
                          {active && <ChevronRight className="h-3.5 w-3.5 text-brass-400" />}
                          {disabled && (
                            <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/30">
                              Soon
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/8 p-3 space-y-2">
        {!collapsed && (
          <div className="px-1">
            <RoleSwitcher />
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-white/40 transition-colors hover:bg-white/6 hover:text-white/70"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && "Kembali ke Portal Warga"}
        </Link>
      </div>
    </aside>
  );
}
