// frontend/services/api.ts - REEMPLAZAR LA SECCIÓN Activity Logs API COMPLETA
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
    const raw = localStorage.getItem("nexa_tokens");
    if (raw) {
      try {
        const tokens = JSON.parse(raw);
        if (tokens?.access_token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${tokens.access_token}`;
        }
      } catch (e) {
        console.error("Failed to parse tokens:", e);
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

// ✅ Activity Logs API - SECCIÓN ACTUALIZADA COMPLETA
export const activityLogsAPI = {
  // Obtener todos los logs con filtros y paginación
  getAll: (params?: {
    page?: number;
    limit?: number;
    action?: string;
    user_email?: string;
    user_id?: string;
    resource_type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }) => apiClient.get("/api/admin/activity-logs", { params }),

  // Estadísticas básicas
  getStats: () => apiClient.get("/api/admin/activity-logs/stats"),

  // Estadísticas detalladas
  getDetailedStats: () =>
    apiClient.get("/api/admin/activity-logs/stats/detailed"),

  // Exportar logs
  export: (params?: {
    format?: "csv" | "json";
    action?: string;
    user_email?: string;
    user_id?: string;
    resource_type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }) => apiClient.get("/api/admin/activity-logs/export", { params }),

  // Obtener usuarios únicos (para filtros)
  getUniqueUsers: () => apiClient.get("/api/admin/activity-logs/users"),

  // Obtener tipos de recursos únicos (para filtros)
  getUniqueResourceTypes: () =>
    apiClient.get("/api/admin/activity-logs/resource-types"),

  // Crear log manual
  create: (data: {
    user_id: string;
    user_email?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    resource_name?: string;
    metadata?: any;
    ip_address?: string;
    user_agent?: string;
    status?: "success" | "failed" | "warning";
  }) => apiClient.post("/api/admin/activity-logs", data),
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
  // Obtener todos los webhooks
  getAll: () => apiClient.get("/api/webhooks"),

  // Crear webhook
  create: (data: {
    name: string;
    url: string;
    events: string[];
    collections?: string[];
    secret?: string;
    headers?: Record<string, string>;
  }) => apiClient.post("/api/webhooks", data),

  // Actualizar webhook
  update: (id: string, data: any) => apiClient.put(`/api/webhooks/${id}`, data),

  // Eliminar webhook
  delete: (id: string) => apiClient.delete(`/api/webhooks/${id}`),

  // Alternar estado activo/inactivo
  toggle: (id: string) => apiClient.patch(`/api/webhooks/${id}/toggle`),

  // Probar webhook
  test: (id: string) => apiClient.post(`/api/webhooks/${id}/test`),

  // Obtener entregas/deliveries
  getDeliveries: (webhookId?: string, params?: any) =>
    apiClient.get(`/api/webhooks/deliveries`, {
      params: { webhookid: webhookId, ...params },
    }),

  // Estadísticas de webhook
  getStats: (webhookId: string) =>
    apiClient.get(`/api/webhooks/${webhookId}/stats`),

  // Reintentar entrega
  retryDelivery: (deliveryId: string) =>
    apiClient.post(`/api/webhooks/deliveries/${deliveryId}/retry`),

  // Obtener estadísticas globales
  getGlobalStats: () => apiClient.get("/api/webhooks/stats/global"),
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

// ✅ Realtime API - NUEVA SECCIÓN
export const realtimeAPI = {
  // Estadísticas de conexiones en tiempo real
  getStats: () => apiClient.get("/api/realtime/stats"),

  // Habilitar/deshabilitar realtime en colecciones
  enableCollection: (collectionName: string) =>
    apiClient.post(`/api/realtime/collections/${collectionName}/enable`),

  disableCollection: (collectionName: string) =>
    apiClient.delete(`/api/realtime/collections/${collectionName}/disable`),

  // Obtener triggers activos en una colección
  getCollectionTriggers: (collectionName: string) =>
    apiClient.get(`/api/realtime/collections/${collectionName}/triggers`),

  // Test de broadcasting
  testBroadcast: (data: {
    collection: string;
    operation: "created" | "updated" | "deleted";
    data: any;
  }) => apiClient.post("/api/realtime/test/broadcast", data),

  // Test de notificación de sistema
  testSystemNotification: (notification: {
    title: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    data?: any;
  }) => apiClient.post("/api/realtime/test/notification", notification),

  // Historial de eventos
  getEventHistory: (limit: number = 50) =>
    apiClient.get("/api/realtime/events/history", { params: { limit } }),

  // Canales activos
  getActiveChannels: () => apiClient.get("/api/realtime/channels"),

  // Health check
  getHealth: () => apiClient.get("/api/realtime/health"),

  // Cleanup
  cleanup: () => apiClient.post("/api/realtime/cleanup"),
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
