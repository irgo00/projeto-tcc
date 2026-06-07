import { useState } from "react";
import { Menu, X, ShieldCheck, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";
import type { AuthMode } from "../../types";

interface HeaderProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const Header = ({ onOpenAuth }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    if ((user as any).tipo === "admin")     return "/dashboard/admin";
    if ((user as any).tipo === "prestador") return "/dashboard/prestador";
    return "/dashboard/cliente";
  };

  const getDashboardLabel = () => {
    if (!user) return "Meu Painel";
    if ((user as any).tipo === "admin") return "Painel Admin";
    return "Meu Painel";
  };

  const goHome = () => {
    navigate("/");
    setMenuOpen(false);
    document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToComoFunciona = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const goToContato = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const isAdmin = (user as any)?.tipo === "admin";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer gap-3" onClick={goHome}>
            <img
              src="/logo-pbte.svg"
              alt="PBTE"
              className="h-12 w-auto"
            />
            {isAdmin && (
              <span className="hidden sm:flex items-center gap-1 text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            )}
            {!isAdmin && (
              <div className="hidden sm:flex flex-col gap-1 items-start w-15">
                <img
                  src="/logo-pbte-sigla.svg"
                  alt="PBTE"
                  className="w-auto dark:brightness-0 dark:invert"
                  style={{ height: '0.9rem' }}
                />
                <span className="text-[0.50rem] font-bold tracking-widest text-gray-800 uppercase leading-tight">
                  Plataforma de Busca<br />de Transporte Escolar
                </span>
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {!isAdmin && (
              <>
                <button onClick={goHome} className="text-gray-700 hover:text-purple-600">
                  Início
                </button>
                <button onClick={goToComoFunciona} className="text-gray-700 hover:text-purple-600">
                  Como Funciona
                </button>
                <button onClick={goToContato} className="text-gray-700 hover:text-purple-600">
                  Contato
                </button>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggle}
              aria-label="Alternar tema"
              className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-gray-100 transition"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className={`font-medium ${isAdmin ? 'text-purple-700' : 'text-purple-600'}`}
                >
                  {getDashboardLabel()}
                </button>

                {!isAdmin && (
                  <button
                    onClick={() => navigate("/perfil")}
                    className="text-gray-700 hover:text-purple-600"
                  >
                    Perfil
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-gray-200 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="text-purple-600 font-medium"
                >
                  Entrar
                </button>
                <button
                  onClick={() => onOpenAuth("cadastro")}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              aria-label="Alternar tema"
              className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-gray-100 transition"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            {!isAdmin && (
              <>
                <button onClick={goHome} className="block w-full text-left text-gray-700">
                  Início
                </button>
                <a href="#como-funciona" className="block text-gray-700">Como Funciona</a>
                <a href="#contato" className="block text-gray-700">Contato</a>
              </>
            )}

            {user ? (
              <>
                <button
                  onClick={() => { navigate(getDashboardPath()); setMenuOpen(false); }}
                  className="block text-purple-600 font-medium"
                >
                  {getDashboardLabel()}
                </button>
                {!isAdmin && (
                  <button
                    onClick={() => { navigate("/perfil"); setMenuOpen(false); }}
                    className="block text-gray-700"
                  >
                    Perfil
                  </button>
                )}
                <button onClick={handleLogout} className="block text-gray-700">
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onOpenAuth("login"); setMenuOpen(false); }}
                  className="block text-purple-600 font-medium"
                >
                  Entrar
                </button>
                <button
                  onClick={() => { onOpenAuth("cadastro"); setMenuOpen(false); }}
                  className="block bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;