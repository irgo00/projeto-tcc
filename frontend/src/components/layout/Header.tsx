import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type AuthMode = 'login' | 'cadastro';

interface HeaderProps {
  onOpenAuth: (mode: AuthMode) => void;
}

const Header = ({ onOpenAuth }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const goHome = () => {
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={goHome}
          >
            <h1 className="text-2xl font-bold text-purple-600">PBTE</h1>
            <span className="ml-2 text-sm text-gray-500 hidden sm:block">
              Transporte Escolar
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={goHome} className="text-gray-700 hover:text-purple-600">
              Início
            </button>
            <a href="#como-funciona" className="text-gray-700 hover:text-purple-600">
              Como Funciona
            </a>
            <a href="#contato" className="text-gray-700 hover:text-purple-600">
              Contato
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() =>
                    navigate(
                      user.tipo === 'prestador'
                        ? '/dashboard/prestador'
                        : '/dashboard/cliente'
                    )
                  }
                  className="text-purple-600 font-medium"
                >
                  Meu Painel
                </button>

                <button
                  onClick={() => navigate('/perfil')}
                  className="text-gray-700 hover:text-purple-600"
                >
                  Perfil
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-gray-200 px-6 py-2 rounded-lg"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-purple-600 font-medium"
                >
                  Entrar
                </button>
                <button
                  onClick={() => onOpenAuth('cadastro')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg"
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
            <button onClick={goHome} className="block w-full text-left">
              Início
            </button>

            <a href="#como-funciona" className="block">
              Como Funciona
            </a>

            <a href="#contato" className="block">
              Contato
            </a>

            {user ? (
              <>
                <button
                  onClick={() =>
                    navigate(
                      user.tipo === 'prestador'
                        ? '/dashboard/prestador'
                        : '/dashboard/cliente'
                    )
                  }
                  className="block text-purple-600 font-medium"
                >
                  Meu Painel
                </button>

                <button onClick={handleLogout} className="block">
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
                  className="block text-purple-600 font-medium"
                >
                  Entrar
                </button>

                <button
                  onClick={() => {
                    onOpenAuth('cadastro');
                    setMenuOpen(false);
                  }}
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
