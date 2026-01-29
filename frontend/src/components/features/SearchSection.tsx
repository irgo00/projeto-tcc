import { useState } from "react";
import { Search, MapPin, Clock } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

interface SearchParams {
  origem: string;
  instituicao: string;
  periodo: string;
}

interface SearchSectionProps {
  onSearch: (params: SearchParams) => void;
  showResultsCount?: boolean;
  resultsCount?: number;
}

const SearchSection = ({ onSearch, showResultsCount, resultsCount }: SearchSectionProps) => {
  const [origem, setOrigem] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [periodo, setPeriodo] = useState("manha");

  const handleSubmit = () => {
    onSearch({ origem, instituicao, periodo });
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20">
      {/* ↑↑↑ 
        bg-gradient-to-br = gradiente diagonal
        from-purple-600 = roxo claro inicial
        to-purple-800 = roxo escuro final
        text-white = texto branco
        py-20 = padding vertical (espaçamento)
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Encontre seu transporte escolar
          </h2>
          <p className="text-xl text-purple-100">
            Conectando estudantes aos melhores serviços em Irati-PR
          </p>
          {showResultsCount && (
            <p className="text-lg text-purple-200 mt-2">
              {resultsCount}{" "}
              {resultsCount === 1 ? "van encontrada" : "vans encontradas"}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Origem (Bairro/Endereço)"
                icon={MapPin}
                type="text"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Ex: Centro, Alto da Glória..."
              />

              <Input
                label="Instituição de Ensino"
                icon={MapPin}
                type="text"
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                placeholder="Ex: UNICENTRO, IFPR..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Período
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Manhã", "Tarde", "Noite"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriodo(p.toLowerCase())}
                    className={`py-3 rounded-lg font-medium transition ${
                      periodo === p.toLowerCase()
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar Transporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
