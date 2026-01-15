import { Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">PBTE</h3>
            <p className="text-gray-400 text-sm">
              Conectando estudantes aos melhores serviços de transporte escolar em Irati-PR
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/busca" className="hover:text-white transition">
                  Buscar Transporte
                </Link>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#prestadores" className="hover:text-white transition">
                  Para Prestadores
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#contato" className="hover:text-white transition">
                  Contato
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#termos" className="hover:text-white transition">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contato@pbte.com.br
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Irati - PR
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 PBTE - Plataforma de Busca de Transporte Escolar. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Desenvolvido como TCC - Instituto Federal do Paraná
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;