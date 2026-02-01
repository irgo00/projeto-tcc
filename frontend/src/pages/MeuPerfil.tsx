import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { User, Mail, Phone, Calendar, Edit2, Save, X } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

interface MeuPerfilProps {
  onNavigate: (page: string, filters?: unknown) => void;
  onOpenAuth: () => void;
}

function MeuPerfil({ onOpenAuth }: MeuPerfilProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
    cpf: user?.cpf || "",
  });

  const handleSave = () => {
    // Chamar API para salvar
    console.log("Salvando dados:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nome: user?.nome || "",
      email: user?.email || "",
      telefone: user?.telefone || "",
      cpf: user?.cpf || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={onOpenAuth} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-purple-600 to-purple-800 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-purple-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{user?.nome}</h1>
                <p className="text-purple-100">
                  {user?.tipo === "prestador"
                    ? "Prestador de Serviço"
                    : "Cliente"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Informações Pessoais
              </h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <Input
                    label="Nome Completo"
                    icon={User}
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                  />
                  <Input
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Input
                    label="Telefone"
                    icon={Phone}
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                  />
                  <Input label="CPF" value={formData.cpf} disabled />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium text-gray-900">{user?.nome}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium text-gray-900">
                        {user?.telefone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">CPF</p>
                      <p className="font-medium text-gray-900">{user?.cpf}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Segurança
              </h3>
              <Button variant="outline" className="w-full sm:w-auto">
                Alterar Senha
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MeuPerfil;
