import { Users, UserPlus, Shield, Mail } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { Badge } from "../components/ui";

const asnData = [
  { id: 1, name: "Budi Santoso", role: "Bagian Hukum Setda", email: "budi.s@sidoarjokab.go.id", status: "Aktif" },
  { id: 2, name: "Siti Rahmawati", role: "Inspektorat Daerah", email: "siti.r@sidoarjokab.go.id", status: "Aktif" },
  { id: 3, name: "Agus Pranoto", role: "Bapenda", email: "agus.p@sidoarjokab.go.id", status: "Aktif" },
  { id: 4, name: "Dina Marlina", role: "DPMPTSP", email: "dina.m@sidoarjokab.go.id", status: "Tidak Aktif" },
];

export default function ManajemenASN() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brass-600">
              <Users className="h-3.5 w-3.5" />
              Manajemen ASN
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink-900 lg:text-3xl">
              Pengguna Portal ASN
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-500">
              Kelola akses pengguna, peran (role), dan pengaturan otentikasi SSO ASN Kabupaten Sidoarjo.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brass-600">
            <UserPlus className="h-4 w-4" />
            Tambah Pengguna
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_150px_100px_80px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-400">
              <span>Nama & Kontak</span>
              <span>Peran</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {asnData.map((user) => (
                <div key={user.id} className="grid grid-cols-[1fr_150px_100px_80px] items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink-900">{user.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-ink-700">
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <Badge className={user.status === "Aktif" ? "bg-sawo-100 text-sawo-700 border-sawo-200" : "bg-slate-100 text-slate-500 border-slate-200"}>
                      {user.status}
                    </Badge>
                  </div>
                  <div>
                    <button className="text-xs font-semibold text-ink-600 hover:text-brass-600">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-700">
                <Shield className="h-3.5 w-3.5 text-brass-500" />
                Sistem Keamanan
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Otentikasi terintegrasi dengan Single Sign-On (SSO) ASN Nasional. 
                Hak akses fitur didasarkan pada pemetaan jabatan (SOTK).
              </p>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-ink-500">
                Pada versi prototipe ini, Anda dapat menggunakan menu dropdown di sudut 
                kiri bawah (sidebar) untuk mensimulasikan login sebagai peran yang berbeda.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
