import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Busca from "./pages/Busca";
import AuthModal from "./components/features/AuthModal";

import type { AuthMode, SearchFilters } from "./types";

function App() {
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);

  const handleNavigate = (page: string, filters?: SearchFilters) => {
    if (page === "busca" && filters) {
      window.location.href = `/busca?filters=${JSON.stringify(filters)}`;
    }
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home onNavigate={handleNavigate} onOpenAuth={setAuthModal} />
            }
          />
          <Route path="/busca" element={<Busca onOpenAuth={setAuthModal} onNavigate={function (_page: string): void {
            throw new Error("Function not implemented.");
          } } />} />

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
