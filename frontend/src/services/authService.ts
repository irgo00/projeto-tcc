import api from "./api";
import type { User } from "../types";
import type { AxiosError } from "axios";

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export const authService = {
  async login({
    email,
    senha,
  }: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<AuthResponse>("/login", { email, senha });

      if (!response.data.success) {
        throw new Error(response.data.message || "Email ou senha inválidos");
      }

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      throw new Error(err.response?.data?.message || "Erro ao fazer login");
    }
  },

  async register(
    userData: Partial<User> & { dataNascimento?: string; senha?: string; confirmarSenha?: string },
  ): Promise<{ user: User; token: string }> {
    try {
      const { dataNascimento, confirmarSenha, ...rest } = userData;
      const payload = { ...rest, ...(dataNascimento && { data_nascimento: dataNascimento }) };
      const response = await api.post<AuthResponse>("/register", payload);

      if (!response.data.success) {
        throw new Error(response.data.message || "Erro ao cadastrar");
      }

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      const err = error as AxiosError<any>;

      const data = err.response?.data;

      if (data?.errors) {
        const messages = Object.values(data.errors)
          .flat()
          .join("\n");

        throw new Error(messages);
      }

      if (data?.message) {
        throw new Error(data.message);
      }

      throw new Error("Erro ao criar conta");
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } catch {
      // ignora erro
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!localStorage.getItem("token")) return null;

    try {
      const response = await api.get<{ success: boolean; user: User }>("/me");
      return response.data.success ? response.data.user : null;
    } catch {
      return null;
    }
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};

export default authService;
