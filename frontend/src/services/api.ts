import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Alguns servidores de hospedagem bloqueiam PUT/PATCH/DELETE.
    // Usamos method spoofing via header X-HTTP-Method-Override (lido pelo middleware do Laravel).
    const method = config.method?.toUpperCase();
    if (method === "PUT" || method === "PATCH" || method === "DELETE") {
      config.headers["X-HTTP-Method-Override"] = method;
      config.method = "post";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    const publicRoutes = [
      "/login",
      "/register",
      "/me",
      "/vans",
      "/vans/buscar",
    ];

    const isPublic = publicRoutes.some((route) =>
      url.includes(route)
    );

    if (status === 401 && !isPublic) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
