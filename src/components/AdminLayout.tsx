import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, Search, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useRole, ROLE_INFO } from "../context/RoleContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { role } = useRole();
  const roleInfo = ROLE_INFO[role];
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation in mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:z-0 lg:translate-x-0 lg:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "w-72" : sidebarOpen ? "w-64" : "w-16"}
        `}
      >
        <div className="h-full w-full overflow-hidden">
          <AdminSidebar collapsed={!isMobile && !sidebarOpen} />
        </div>
        
        {/* Mobile close button */}
        {isMobile && sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-4 rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 sm:gap-4 border-b border-slate-200 bg-white/95 px-3 sm:px-4 shadow-sm backdrop-blur">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb / Title area */}
          <div className="flex flex-1 items-center gap-2 text-sm">
            <span className="hidden font-semibold text-ink-700 sm:inline-block">Portal ASN</span>
            <span className="hidden text-slate-300 sm:inline-block">/</span>
            <span className="truncate font-medium text-slate-700 sm:font-normal sm:text-slate-500">
              {isMobile ? roleInfo.label : roleInfo.instansi}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="hidden rounded-md p-1.5 text-slate-500 hover:bg-slate-100 sm:block">
              <Search className="h-4.5 w-4.5" />
            </button>
            <button className="relative rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sirah-500" />
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-700">
                <span className="text-[10px] font-bold text-brass-300">
                  {roleInfo.label.charAt(0)}
                </span>
              </div>
              <span className="text-xs font-medium text-ink-700">{roleInfo.label}</span>
            </div>
            <Link
              to="/"
              className="ml-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:px-3"
            >
              <span className="hidden sm:inline">Portal Warga</span>
              <span className="sm:hidden">Warga</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
