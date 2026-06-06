import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <div id="contato">
            <h3 className="text-xl font-bold text-purple-400">PBTE</h3>
            <p className="text-gray-400 text-xs mt-1">
              Plataforma de Busca de Transporte Escolar — Irati-PR
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-gray-400">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              contato@pbte.com.br
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Irati - PR
            </span>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs text-gray-500">
          © 2025 PBTE — Desenvolvido por Igor Mazo e Matheus Xavier
        </div>
      </div>
    </footer>
  );
};

export default Footer;
