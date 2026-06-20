import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cari from "./pages/Cari";
import RegulasiDetail from "./pages/RegulasiDetail";
import Tanya from "./pages/Tanya";
import Verifikasi from "./pages/Verifikasi";
import AdminDashboard from "./pages/AdminDashboard";
import ConflictGraph from "./pages/ConflictGraph";
import DecayTracker from "./pages/DecayTracker";
import Inspektorat from "./pages/Inspektorat";
import Analytics from "./pages/Analytics";
import BasisRegulasi from "./pages/BasisRegulasi";
import ManajemenASN from "./pages/ManajemenASN";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  return (
    <div className={`flex min-h-screen flex-col ${isAdminArea ? "bg-slate-100" : "bg-white"}`}>
      {/* Public navbar only shown outside admin */}
      {!isAdminArea && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cari" element={<Cari />} />
          <Route path="/regulasi/:id" element={<RegulasiDetail />} />
          <Route path="/tanya" element={<Tanya />} />
          <Route path="/verifikasi" element={<Verifikasi />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/graf" element={<ConflictGraph />} />
          <Route path="/admin/decay" element={<DecayTracker />} />
          <Route path="/admin/inspektorat" element={<Inspektorat />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/docs" element={<BasisRegulasi />} />
          <Route path="/admin/asn" element={<ManajemenASN />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Public footer only shown outside admin */}
      {!isAdminArea && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </RoleProvider>
  );
}
