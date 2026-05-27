import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { User, Mail, Phone, Calendar, Edit2, Save, X, Lock, KeyRound } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { isValidEmail, isValidTelefone, validateSenha } from "../utils/helpers";
import type { AuthMode } from "../types";

interface MeuPerfilProps {
  onOpenAuth: (mode: AuthMode) => void;
  onNavigate?: () => void;
}

function MeuPerfil({ onOpenAuth }: MeuPerfilProps) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSenhaForm, setShowSenhaForm] = useState(false);
  const [senhaData, setSenhaData] = useState({ senha_atual: "", nova_senha: "", confirmar_senha: "" });
  const [senhaErrors, setSenhaErrors] = useState<{ senha_atual?: string; nova_senha?: string; confirmar_senha?: string }>({});
  const [senhaLoading, setSenhaLoading] = useState(false);
  const [senhaFeedback, setSenhaFeedback] = useState<{ tipo: "sucesso" | "erro"; mensagem: string } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ nome?: string; email?: string; telefone?: string }>({});
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
    cpf: user?.cpf || "",
  });

  const handleSave = async () => {
    const errors: { nome?: string; email?: string; telefone?: string } = {};
    if (!formData.nome.trim()) errors.nome = "Nome é obrigatório";
    if (!isValidEmail(formData.email)) errors.email = "E-mail inválido";
    if (!isValidTelefone(formData.telefone)) errors.telefone = "Telefone inválido — informe DDD + número";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setSaveError(null);
    try {
      const response = await api.put("/profile", {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      });
      updateUser(response.data.user);
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(
        err.response?.data?.message || "Erro ao salvar. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
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

  const handleAlterarSenha = async () => {
    const errors: typeof senhaErrors = {};
    if (!senhaData.senha_atual) errors.senha_atual = "Informe a senha atual";
    const novaSenhaErro = validateSenha(senhaData.nova_senha);
    if (novaSenhaErro) errors.nova_senha = novaSenhaErro;
    else if (senhaData.nova_senha === senhaData.senha_atual)
      errors.nova_senha = "A nova senha deve ser diferente da atual";
    if (!senhaData.confirmar_senha) errors.confirmar_senha = "Confirme a nova senha";
    else if (senhaData.nova_senha !== senhaData.confirmar_senha)
      errors.confirmar_senha = "As senhas não coincidem";
    setSenhaErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSenhaLoading(true);
    setSenhaFeedback(null);
    try {
      await api.post("/change-password", {
        senha_atual: senhaData.senha_atual,
        nova_senha: senhaData.nova_senha,
      });
      setSenhaFeedback({ tipo: "sucesso", mensagem: "Senha alterada com sucesso!" });
      setSenhaData({ senha_atual: "", nova_senha: "", confirmar_senha: "" });
      setSenhaErrors({});
      setTimeout(() => {
        setShowSenhaForm(false);
        setSenhaFeedback(null);
      }, 2000);
    } catch (err: any) {
      setSenhaFeedback({
        tipo: "erro",
        mensagem: err.response?.data?.message || "Erro ao alterar senha. Tente novamente.",
      });
    } finally {
      setSenhaLoading(false);
    }
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
              <div className="text-black">
                <h1 className="text-3xl font-bold mb-2">{user?.nome}</h1>
                <p className="text-black">
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
                    loading={saving}
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
            {saveError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {saveError}
              </div>
            )}

            <div className="space-y-6">
              {isEditing ? (
                <>
                  <Input
                    label="Nome Completo"
                    icon={User}
                    value={formData.nome}
                    error={fieldErrors.nome}
                    onChange={(e) => {
                      setFormData({ ...formData, nome: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, nome: undefined }));
                    }}
                  />
                  <Input
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    error={fieldErrors.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                  />
                  <Input
                    label="Telefone"
                    icon={Phone}
                    type="tel"
                    value={formData.telefone}
                    placeholder="(00) 00000-0000"
                    error={fieldErrors.telefone}
                    onChange={(e) => {
                      setFormData({ ...formData, telefone: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, telefone: undefined }));
                    }}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Segurança</h3>
                {!showSenhaForm && (
                  <Button
                    variant="outline"
                    onClick={() => { setShowSenhaForm(true); setSenhaFeedback(null); }}
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Alterar Senha
                  </Button>
                )}
              </div>

              {showSenhaForm && (
                <div className="space-y-4">
                  {senhaFeedback && (
                    <div className={`px-4 py-3 rounded-lg text-sm ${
                      senhaFeedback.tipo === "sucesso"
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}>
                      {senhaFeedback.mensagem}
                    </div>
                  )}

                  <Input
                    label="Senha Atual"
                    type="password"
                    icon={KeyRound}
                    value={senhaData.senha_atual}
                    error={senhaErrors.senha_atual}
                    placeholder="Digite sua senha atual"
                    onChange={(e) => {
                      setSenhaData((prev) => ({ ...prev, senha_atual: e.target.value }));
                      setSenhaErrors((prev) => ({ ...prev, senha_atual: undefined }));
                    }}
                  />
                  <Input
                    label="Nova Senha"
                    type="password"
                    icon={Lock}
                    value={senhaData.nova_senha}
                    error={senhaErrors.nova_senha}
                    placeholder="Mínimo 8 caracteres"
                    onChange={(e) => {
                      setSenhaData((prev) => ({ ...prev, nova_senha: e.target.value }));
                      setSenhaErrors((prev) => ({ ...prev, nova_senha: undefined }));
                    }}
                  />
                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    icon={Lock}
                    value={senhaData.confirmar_senha}
                    error={senhaErrors.confirmar_senha}
                    placeholder="Repita a nova senha"
                    onChange={(e) => {
                      setSenhaData((prev) => ({ ...prev, confirmar_senha: e.target.value }));
                      setSenhaErrors((prev) => ({ ...prev, confirmar_senha: undefined }));
                    }}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      loading={senhaLoading}
                      onClick={handleAlterarSenha}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Nova Senha
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowSenhaForm(false);
                        setSenhaData({ senha_atual: "", nova_senha: "", confirmar_senha: "" });
                        setSenhaErrors({});
                        setSenhaFeedback(null);
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MeuPerfil;
