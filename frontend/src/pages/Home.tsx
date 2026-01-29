import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchSection from "../components/features/SearchSection";
import AuthModal from "../components/features/AuthModal";
import { useNavigate } from "react-router-dom";
import ComoFuncionaSection from "../components/features/ComoFuncionaSection";
import type { AuthMode } from "../types";

const Home = () => {
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);
  const navigate = useNavigate();

  const handleSearch = (filters: any) => {
    navigate("/busca", { state: { filters } });
  };

  const handleOpenAuth = (type: string) => {
    setAuthModal(type as AuthMode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={handleOpenAuth} />

      <SearchSection onSearch={handleSearch} />

      {/* 👇 AQUI */}
      <ComoFuncionaSection onOpenAuth={handleOpenAuth} />

      <AuthModal
        isOpen={!!authModal}
        onClose={() => setAuthModal(null)}
        initialMode={authModal ?? undefined}
      />

      <Footer />
    </div>
  );
};

export default Home;
