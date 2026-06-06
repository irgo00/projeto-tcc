import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./pages/Home";
import Busca from "./pages/Busca";
import MeuPerfil from "./pages/MeuPerfil";
import DashboardCliente from "./pages/Dashboard/Cliente";
import DashboardPrestador from "./pages/Dashboard/Prestador";
import DashboardAdmin from "./pages/Dashboard/Admin";
import AuthModal from "./components/features/AuthModal";

import type { AuthMode } from "./types";
import PainelAdminExemplo from "./pages/PainelAdminExemplo";

function useUserTipo(): string | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw)?.tipo ?? null;
  } catch {
    return null;
  }
}

function DashboardRedirect({ onOpenAuth }: { onOpenAuth: (m: AuthMode) => void }) {
  const tipo = useUserTipo();
  if (tipo === "prestador") return <DashboardPrestador onOpenAuth={onOpenAuth} />;
  if (tipo === "admin")     return <DashboardAdmin     onOpenAuth={onOpenAuth} />;
  if (tipo === "cliente")   return <DashboardCliente   onOpenAuth={onOpenAuth} />;
  return <Navigate to="/" replace />;
}

function App() {
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);

  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"     element={<Home  onOpenAuth={setAuthModal} />} />
          <Route path="/busca" element={<Busca onOpenAuth={setAuthModal} />} />
          <Route path="/perfil" element={<MeuPerfil onOpenAuth={() => setAuthModal("login")} onNavigate={() => {}} />} />

          <Route path="/dashboard/cliente"   element={<DashboardCliente   onOpenAuth={setAuthModal} />} />
          <Route path="/dashboard/prestador" element={<DashboardPrestador onOpenAuth={setAuthModal} />} />
          <Route path="/dashboard/admin"     element={<DashboardAdmin     onOpenAuth={setAuthModal} />} />

          <Route path="/dashboard" element={<DashboardRedirect onOpenAuth={setAuthModal} />} />

          <Route path="/painel-exemplo" element={<PainelAdminExemplo />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <AuthModal
          isOpen={!!authModal}
          onClose={() => setAuthModal(null)}
          initialMode={authModal ?? undefined}
        />
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
