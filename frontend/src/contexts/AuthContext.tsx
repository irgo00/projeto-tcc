import { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { User } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<User>;
  register: (data: Partial<User>) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

/* =====================
   Context
===================== */

export const AuthContext = createContext<AuthContextData | null>(null);

/* =====================
   Provider
===================== */

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, senha: string): Promise<User> => {
    const { user } = await authService.login(email, senha);
    setUser(user);
    return user;
  };

  const register = async (userData: Partial<User>): Promise<User> => {
    const { user } = await authService.register(userData);
    setUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};