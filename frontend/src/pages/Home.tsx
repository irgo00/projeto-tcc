import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchSection from "../components/features/SearchSection";
import ComoFuncionaSection from "../components/features/ComoFuncionaSection";
import type { SearchFilters, AuthMode } from "../types";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  onNavigate: (page: string, filters?: SearchFilters) => void;
  onOpenAuth: (mode: AuthMode) => void;
}

function HomePage({ onOpenAuth }: HomePageProps) {
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFilters) => {
    navigate("/busca", {
      state: { filters },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />
      <SearchSection onSearch={handleSearch} />
      <ComoFuncionaSection onOpenAuth={onOpenAuth} />
      <Footer />
    </div>
  );
}

export default HomePage;
