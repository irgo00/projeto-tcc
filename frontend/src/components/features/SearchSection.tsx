import { useState } from "react";
import { Search, MapPin, Clock } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

interface SearchSectionProps {
  onSearch: (filters: {
    instituicao: string;
    periodo: string;
  }) => void;
  showResultsCount?: boolean;
  resultsCount?: number;
}

const SearchSection = ({
  onSearch,
  showResultsCount = false,
  resultsCount = 0,
}: SearchSectionProps) => {
  const [instituicao, setInstituicao] = useState("");
  const [periodo, setPeriodo] = useState("");

  const handleSubmit = () => {
    onSearch({ instituicao, periodo });
  };

  return (
    <div
      id="busca"
      className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20"
    >
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
            <div className="grid md:grid-cols-1 gap-4">
              <Input
                label="Instituição de Ensino"
                icon={MapPin}
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
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Qualquer horário", value: "" },
                  { label: "Manhã", value: "manha" },
                  { label: "Tarde", value: "tarde" },
                  { label: "Noite", value: "noite" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriodo(p.value)}
                    className={`py-3 rounded-lg font-medium transition ${
                      periodo === p.value
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p.label}
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
