import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/* ---------- TIPOS ---------- */
type AuthMode = 'login' | 'cadastro';

interface HeaderProps {
  onOpenAuth: (mode: AuthMode) => void;
}

interface User {
  tipo: 'cliente' | 'prestador';
}

interface AuthContext {
  user: User | null;
  logout: () => void;
}
/* --------------------------- */

const Header = ({ onOpenAuth }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth() as AuthContext;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">PBTE</h1>
              <span className="ml-2 text-sm text-gray-500 hidden sm:block">
                Transporte Escolar
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/busca" className="text-gray-700 hover:text-purple-600 transition">
              Buscar
            </Link>
            <a href="#como-funciona" className="text-gray-700 hover:text-purple-600 transition">
              Como Funciona
            </a>
            <a href="#contato" className="text-gray-700 hover:text-purple-600 transition">
              Contato
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={user.tipo === 'prestador' ? '/dashboard/prestador' : '/dashboard/cliente'}
                  className="text-purple-600 hover:text-purple-700 font-medium transition"
                >
                  Meu Painel
                </Link>
                <Link
                  to="/perfil"
                  className="text-gray-700 hover:text-purple-600 transition"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-purple-600 hover:text-purple-700 font-medium transition"
                >
                  Entrar
                </button>
                <button
                  onClick={() => onOpenAuth('cadastro')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link to="/busca" className="block text-gray-700 hover:text-purple-600">
              Buscar
            </Link>
            <a href="#como-funciona" className="block text-gray-700 hover:text-purple-600">
              Como Funciona
            </a>
            <a href="#contato" className="block text-gray-700 hover:text-purple-600">
              Contato
            </a>
            {user ? (
              <>
                <Link
                  to={user.tipo === 'prestador' ? '/dashboard/prestador' : '/dashboard/cliente'}
                  className="block text-purple-600 font-medium"
                >
                  Meu Painel
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-purple-600 font-medium"
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('cadastro');
                    setMenuOpen(false);
                  }}
                  className="block w-full bg-purple-600 text-white px-6 py-2 rounded-lg"
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