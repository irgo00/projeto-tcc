// Formatar CPF
export const formatCPF = (cpf: string) => {
  if (!cpf) return '';

  cpf = cpf.replace(/\D/g, '').slice(0, 11);

  return cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};


// Formatar telefone
export const formatTelefone = (telefone: string): string => {
  if (!telefone) return "";
  return telefone
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

// Validar email
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar telefone (mínimo 10 dígitos, máximo 11)
export const isValidTelefone = (telefone: string): boolean => {
  const digits = telefone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
};

// Validar senha — retorna mensagem de erro ou null se válida
export const validateSenha = (senha: string): string | null => {
  if (!senha) return "Senha é obrigatória";
  if (senha.length < 8) return "A senha deve ter no mínimo 8 caracteres";
  if (!/[A-Z]/.test(senha)) return "A senha deve conter pelo menos uma letra maiúscula";
  if (!/[a-z]/.test(senha)) return "A senha deve conter pelo menos uma letra minúscula";
  if (!/[0-9]/.test(senha)) return "A senha deve conter pelo menos um número";
  if (!/[@$!%*?&_\-#]/.test(senha)) return "A senha deve conter pelo menos um caractere especial (@$!%*?&_-#)";
  return null;
};

// Validar CPF
export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

export const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}; // Formatar data

export const formatarData = (data: Date | string): string => {
  if (!data) return "";
  const date = new Date(data);
  return date.toLocaleDateString("pt-BR");
}; // Truncar texto

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}; // Debounce

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
