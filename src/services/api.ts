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
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

// Response: intenta refresh una vez en 401
apiClient.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config as any & {
      _retry?: boolean;
    };

    // Solo procesar 401 que no sean refresh ni login
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      // Si ya estamos refreshing, agregar a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const raw = localStorage.getItem("nexa_tokens");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.refresh_token) {
            const resp = await axios.post(`${BASE_URL}/auth/refresh`, {
              refresh_token: parsed.refresh_token,
            });
            const newTokens = resp.data as {
              access_token: string;
              refresh_token: string;
            };

            localStorage.setItem("nexa_tokens", JSON.stringify(newTokens));

            // Procesar la cola con el nuevo token
            processQueue(null, newTokens.access_token);

            // Reintentar el request original
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
            return apiClient(originalRequest);
          }
        }

        throw new Error("No refresh token available");
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Procesar la cola con error
        processQueue(refreshError, null);

        // Limpiar tokens
        localStorage.removeItem("nexa_tokens");
        localStorage.removeItem("nexa_user");

        // Redirigir al login después de un pequeño delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
  (config: any) => {
    console.log("🔍 REQUEST:", config.method?.toUpperCase(), config.url);

    const raw = localStorage.getItem("nexa_tokens");
    console.log("📦 Raw tokens:", raw ? "EXISTS" : "NOT FOUND");

    if (raw) {
      try {
        const tokens = JSON.parse(raw);
        console.log("🎫 Tokens parsed:", {
          has_access_token: !!tokens?.access_token,
          has_refresh_token: !!tokens?.refresh_token,
          access_token_start: tokens?.access_token?.substring(0, 50) || "NONE",
        });

        if (tokens?.access_token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${tokens.access_token}`;
          console.log("✅ Authorization header set");
        } else {
          console.log("❌ No access token found");
        }
      } catch (e) {
        console.error("❌ Failed to parse tokens:", e);
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
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
  refresh: (refreshToken: string) =>
    apiClient.post("/auth/refresh", { refresh_token: refreshToken }),
  changePassword: (data: { current_password: string; new_password: string }) =>
    apiClient.patch("/auth/change-password", data),
  updateProfile: (data: any) => apiClient.patch("/auth/profile", data),
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
  update: (name: string, payload: any) =>
    apiClient.put(
      `/api/admin/collections/${encodeURIComponent(name)}`,
      payload
    ),
  delete: (name: string) =>
    apiClient.delete(`/api/admin/collections/${encodeURIComponent(name)}`),
  getSchema: (name: string) =>
    apiClient.get(`/api/admin/collections/${encodeURIComponent(name)}/schema`),
  updateSchema: (name: string, schema: any) =>
    apiClient.put(
      `/api/admin/collections/${encodeURIComponent(name)}/schema`,
      schema
    ),

  async getOptions() {
    const response = await apiClient.get("/api/admin/collections/options");
    return response.data;
  },
};

// Dynamic Collections API
export const dynamicCollections = {
  list: (collectionName: string, params?: Record<string, unknown>) =>
    apiClient.get(`/api/collections/${encodeURIComponent(collectionName)}`, {
      params,
    }),
  create: (collectionName: string, data: any) =>
    apiClient.post(
      `/api/collections/${encodeURIComponent(collectionName)}`,
      data
    ),
  getById: (collectionName: string, id: string) =>
    apiClient.get(
      `/api/collections/${encodeURIComponent(
        collectionName
      )}/${encodeURIComponent(id)}`
    ),
  update: (collectionName: string, id: string, data: any) =>
    apiClient.put(
      `/api/collections/${encodeURIComponent(
        collectionName
      )}/${encodeURIComponent(id)}`,
      data
    ),
  remove: (collectionName: string, id: string) =>
    apiClient.delete(
      `/api/collections/${encodeURIComponent(
        collectionName
      )}/${encodeURIComponent(id)}`
    ),
};

// Users API
export const usersAPI = {
  getAll: (params?: any) => apiClient.get("/api/admin/users", { params }),
  create: (data: any) => apiClient.post("/api/admin/users", data),
  update: (id: string, data: any) =>
    apiClient.put(`/api/admin/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/admin/users/${id}`),
  getById: (id: string) => apiClient.get(`/api/admin/users/${id}`),
  toggleStatus: (id: string) =>
    apiClient.patch(`/api/admin/users/${id}/toggle-status`),
};

// Configuration API
export const configAPI = {
  getAll: () => apiClient.get("/api/admin/configuration"),
  getByCategory: (category: string) =>
    apiClient.get(`/api/admin/configuration/category/${category}`),
  update: (key: string, value: any) =>
    apiClient.patch(`/api/admin/configuration/${key}`, { value }),
  initialize: () => apiClient.post("/api/admin/configuration/initialize"),
};

// Activity Logs API
export const activityLogsAPI = {
  getAll: (params?: any) =>
    apiClient.get("/api/admin/activity-logs", { params }),
  getStats: () => apiClient.get("/api/admin/activity-logs/stats"),
  create: (data: any) => apiClient.post("/api/admin/activity-logs", data),
};

// Backup API
export const backupAPI = {
  create: (type: string = "manual") =>
    apiClient.post("/api/admin/backup", { type }),
  restore: (backupPath: string) =>
    apiClient.post("/api/admin/backup/restore", { backupPath }),
  restoreByFilename: (filename: string) =>
    apiClient.post(`/api/admin/backup/restore/${filename}`),
  list: () => apiClient.get("/api/admin/backup"),
  delete: (filename: string) =>
    apiClient.delete(`/api/admin/backup/${filename}`),
  cleanup: (retentionDays: number = 30) =>
    apiClient.post("/api/admin/backup/cleanup", { retentionDays }),
};

// API Keys API
export const apiKeysAPI = {
  getAll: () => apiClient.get("/api/admin/api-keys"),
  getStats: () => apiClient.get("/api/admin/api-keys/stats"),
  create: (data: any) => apiClient.post("/api/admin/api-keys", data),
  update: (id: string, data: any) =>
    apiClient.patch(`/api/admin/api-keys/${id}`, data),
  toggle: (id: string) => apiClient.patch(`/api/admin/api-keys/${id}/toggle`),
  regenerate: (id: string) =>
    apiClient.patch(`/api/admin/api-keys/${id}/regenerate`),
  delete: (id: string) => apiClient.delete(`/api/admin/api-keys/${id}`),
  validate: (key: string) =>
    apiClient.post("/api/admin/api-keys/validate", { key }),
};

// Dashboard/Stats API
export const dashboardAPI = {
  getStats: () => apiClient.get("/api/admin/dashboard/stats"),
  getActivity: (params?: any) =>
    apiClient.get("/api/admin/dashboard/activity", { params }),
  getUsage: (params?: any) =>
    apiClient.get("/api/admin/dashboard/usage", { params }),
  getSystemInfo: () => apiClient.get("/api/admin/system/info"),
};

// Webhooks API
export const webhooksAPI = {
  getAll: () => apiClient.get("/api/admin/webhooks"),
  create: (data: {
    name: string;
    url: string;
    events: string[];
    collections?: string[];
    secret?: string;
    headers?: Record<string, string>;
  }) => apiClient.post("/api/admin/webhooks", data),
  update: (id: string, data: any) =>
    apiClient.patch(`/api/admin/webhooks/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/admin/webhooks/${id}`),
  toggle: (id: string) => apiClient.patch(`/api/admin/webhooks/${id}/toggle`),
  test: (id: string) => apiClient.post(`/api/admin/webhooks/${id}/test`),
  getDeliveries: (webhookId?: string, params?: any) =>
    apiClient.get(`/api/admin/webhooks/deliveries`, {
      params: { webhook_id: webhookId, ...params },
    }),
  getStats: (webhookId: string) =>
    apiClient.get(`/api/admin/webhooks/${webhookId}/stats`),
  retryDelivery: (deliveryId: string) =>
    apiClient.post(`/api/admin/webhooks/deliveries/${deliveryId}/retry`),
};

// Analytics API
export const analyticsAPI = {
  getUsage: (params?: { hours?: number; apiKeyId?: string }) =>
    apiClient.get("/api/admin/analytics/usage", { params }),
  getApiKeyAnalytics: (params?: { days?: number }) =>
    apiClient.get("/api/admin/analytics/api-keys", { params }),
  getApiKeyUsage: (apiKeyId: string, params?: { hours?: number }) =>
    apiClient.get(`/api/admin/analytics/api-keys/${apiKeyId}`, { params }),
  getRealtime: () => apiClient.get("/api/admin/analytics/realtime"),
  getDashboard: () => apiClient.get("/api/admin/analytics/dashboard"),
};

// Storage API
export const storageAPI = {
  upload: (file: File, options?: any) => {
    const formData = new FormData();
    formData.append("file", file);

    const params = new URLSearchParams();
    if (options?.folder) params.append("folder", options.folder);
    if (options?.collection) params.append("collection", options.collection);
    if (options?.record_id) params.append("record_id", options.record_id);

    return apiClient.post(
      `/api/storage/upload?${params.toString()}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  uploadMultiple: (formData: FormData, params?: URLSearchParams) => {
    return apiClient.post(
      `/api/storage/upload/multiple?${params?.toString() || ""}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },

  list: (params?: any) => apiClient.get("/api/storage", { params }),

  getStats: () => apiClient.get("/api/storage/stats"),

  delete: (fileId: string) => apiClient.delete(`/api/storage/${fileId}`),

  getUrl: (fileId: string, expires?: number) =>
    apiClient.get(`/api/storage/${fileId}/url`, { params: { expires } }),

  move: (fileId: string, folder: string) =>
    apiClient.post(`/api/storage/${fileId}/move`, { folder }),

  cleanup: () => apiClient.post("/api/storage/cleanup"),
};

export default apiClient;
