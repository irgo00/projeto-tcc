import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Busca from "./pages/Busca";
import MeuPerfil from "./pages/MeuPerfil";
import DashboardCliente from "./pages/Dashboard/Cliente";
import DashboardPrestador from "./pages/Dashboard/Prestador";
import AuthModal from "./components/features/AuthModal";

import type { AuthMode } from "./types";

function App() {
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home onOpenAuth={setAuthModal} />}
          />

          <Route
            path="/busca"
            element={<Busca onOpenAuth={setAuthModal} />}
          />
          <Route
            path="/perfil"
            element={<MeuPerfil onOpenAuth={() => setAuthModal("login")} onNavigate={() => {}} />}
          />
          <Route
            path="/dashboard/cliente"
            element={<DashboardCliente />}
          />
          <Route
            path="/dashboard/prestador"
            element={<DashboardPrestador />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <AuthModal
          isOpen={!!authModal}
          onClose={() => setAuthModal(null)}
          initialMode={authModal ?? undefined}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
