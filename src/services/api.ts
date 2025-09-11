import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request: agrega Authorization si hay token
apiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem("nexo_tokens");
    if (raw) {
      try {
        const tokens = JSON.parse(raw);
        if (tokens?.access_token) {
          config.headers = config.headers ?? {};
          (config.headers as any).Authorization = `Bearer ${tokens.access_token}`;
        }
      } catch (e) {
        console.error("Failed to parse tokens:", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: intenta refresh una vez en 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const raw = localStorage.getItem("nexo_tokens");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.refresh_token) {
            const resp = await axios.post(`${BASE_URL}/auth/refresh`, {
              refresh_token: parsed.refresh_token,
            });
            const newTokens = resp.data; // { access_token, refresh_token, ... }
            localStorage.setItem("nexo_tokens", JSON.stringify(newTokens));
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem("nexo_tokens");
        localStorage.removeItem("nexo_user");
        // Opcional: redirigir a login
        // window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post("/auth/login", credentials),
  register: (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => apiClient.post("/auth/register", data),
  logout: () => apiClient.post("/auth/logout"),
  getCurrentUser: () => apiClient.get("/auth/me"),
};

// Admin Collections API
export const adminCollections = {
  list: (params?: { page?: number; limit?: number; q?: string }) =>
    apiClient.get("/api/admin/collections", { params }),
  getByName: (name: string) =>
    apiClient.get(`/api/admin/collections/${encodeURIComponent(name)}`),
  stats: (name: string) =>
    apiClient.get(`/api/admin/collections/${encodeURIComponent(name)}/stats`),
  create: (payload: {
    name: string;
    schema: Record<string, unknown>;
    auth_rules?: Record<string, unknown> | null;
    is_active?: boolean;
    metadata?: Record<string, unknown> | null;
  }) => apiClient.post("/api/admin/collections", payload),
  // Si agregas update/delete admin, se añaden aquí
};

// Dynamic Collections API
export const dynamicCollections = {
  list: (collectionName: string, params?: Record<string, unknown>) =>
    apiClient.get(`/api/collections/${encodeURIComponent(collectionName)}`, {
      params,
    }),
  create: (collectionName: string, data: any) =>
    apiClient.post(`/api/collections/${encodeURIComponent(collectionName)}`, data),
  getById: (collectionName: string, id: string) =>
    apiClient.get(
      `/api/collections/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`
    ),
  update: (collectionName: string, id: string, data: any) =>
    apiClient.put(
      `/api/collections/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`,
      data
    ),
  remove: (collectionName: string, id: string) =>
    apiClient.delete(
      `/api/collections/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`
    ),
};

// Users API (si lo usas)
export const usersAPI = {
  getAll: (params?: any) => apiClient.get("/admin/users", { params }),
  update: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/users/${id}`),
};

export default apiClient;
