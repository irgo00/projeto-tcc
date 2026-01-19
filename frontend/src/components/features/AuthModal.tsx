import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

/* ---------- TIPOS ---------- */
type AuthMode = "login" | "cadastro";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  senha: string;
  confirmarSenha: string;
  tipo: "cliente" | "prestador";
}

type FormErrors = Partial<Record<keyof FormData | "submit", string>>;

const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    tipo: "cliente",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, register } = useAuth();

  const isLogin = mode === "login";

  /* =====================
     SINCRONIZA O MODO
  ===================== */
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  /* =====================
     RESET AO ABRIR
  ===================== */
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setFormData({
        nome: "",
        email: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        senha: "",
        confirmarSenha: "",
        tipo: "cliente",
      });
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!isLogin) {
      if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
      if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
      if (!formData.dataNascimento)
        newErrors.dataNascimento = "Data de nascimento é obrigatória";
      if (!formData.telefone.trim())
        newErrors.telefone = "Telefone é obrigatório";

      if (formData.senha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = "As senhas não coincidem";
      }

      if (formData.dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(formData.dataNascimento);
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        if (idade < 13) {
          newErrors.dataNascimento = "É necessário ter 13 anos ou mais";
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.senha.trim()) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await login(formData.email, formData.senha);
      } else {
        await register(formData);
      }
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao processar requisição";
      setErrors({ submit: message });
    }
  };

  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "cadastro" : "login");
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? "Bem-vindo de volta!" : "Criar Conta"}
      size="sm"
    >
      <div className="space-y-4">
        {!isLogin && (
          <Input
            label="Nome Completo"
            type="text"
            value={formData.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Digite seu nome"
            error={errors.nome}
            required
          />
        )}

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="seu@email.com"
          error={errors.email}
          required
        />

        {!isLogin && (
          <>
            <Input
              label="CPF"
              type="text"
              value={formData.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              placeholder="000.000.000-00"
              error={errors.cpf}
              required
            />

            <Input
              label="Data de Nascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => handleChange("dataNascimento", e.target.value)}
              error={errors.dataNascimento}
              required
            />
            {!errors.dataNascimento && (
              <p className="text-xs text-gray-500 -mt-2">
                É necessário ter 13 anos ou mais para criar uma conta
              </p>
            )}

            <Input
              label="Telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleChange("telefone", e.target.value)}
              placeholder="(00) 00000-0000"
              error={errors.telefone}
              required
            />

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tipo de Cadastro <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("tipo", "cliente")}
                  className={`py-3 rounded-lg font-medium transition ${
                    formData.tipo === "cliente"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("tipo", "prestador")}
                  className={`py-3 rounded-lg font-medium transition ${
                    formData.tipo === "prestador"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Prestador
                </button>
              </div>
            </div>
          </>
        )}

        <Input
          label="Senha"
          type="password"
          value={formData.senha}
          onChange={(e) => handleChange("senha", e.target.value)}
          placeholder="Digite sua senha"
          error={errors.senha}
          required
        />

        {!isLogin && (
          <Input
            label="Confirmar Senha"
            type="password"
            value={formData.confirmarSenha}
            onChange={(e) => handleChange("confirmarSenha", e.target.value)}
            placeholder="Digite sua senha novamente"
            error={errors.confirmarSenha}
            required
          />
        )}

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          className="w-full"
        >
          {isLogin ? "Entrar" : "Cadastrar"}
        </Button>

        {isLogin && (
          <div className="text-center">
            <a
              href="#"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Esqueci minha senha
            </a>
          </div>
        )}

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              onClick={toggleMode}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
