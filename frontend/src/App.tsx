import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Busca from './pages/Busca';
import MeuPerfil from './pages/MeuPerfil';
import DashboardCliente from './pages/Dashboard/Cliente';
import DashboardPrestador from './pages/Dashboard/Prestador';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/busca" element={<Busca />} />
          <Route path="/perfil" element={<MeuPerfil />} />
          <Route path="/dashboard/cliente" element={<DashboardCliente />} />
          <Route path="/dashboard/prestador" element={<DashboardPrestador />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;