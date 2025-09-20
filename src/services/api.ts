// frontend/services/api.ts - VERSIÓN COMPLETA MULTI-TENANT
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

// ✅ RESPONSE INTERCEPTOR ACTUALIZADO CON MULTI-TENANT
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

            // ✅ AGREGAR TENANT AL RETRY DESDE LA COLA
            const rawUserRetry = localStorage.getItem("nexa_user");
            if (rawUserRetry) {
              try {
                const userRetry = JSON.parse(rawUserRetry);
                if (userRetry?.tenantId) {
                  originalRequest.headers["X-Tenant-ID"] = userRetry.tenantId;
                }
              } catch {
                // Ignorar errores de parsing
              }
            }

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

            // ✅ TYPE ASSERTION para arreglar TypeScript
            const refreshData = resp.data as {
              access_token: string;
              refresh_token: string;
              expires_in?: number;
              token_type?: string;
              user?: any;
            };

            const newTokens = {
              access_token: refreshData.access_token,
              refresh_token: refreshData.refresh_token,
              expires_in: refreshData.expires_in,
              token_type: refreshData.token_type || "Bearer",
            };

            localStorage.setItem("nexa_tokens", JSON.stringify(newTokens));

            // ✅ Si viene user data actualizada, guardarla
            if (refreshData.user) {
              localStorage.setItem(
                "nexa_user",
                JSON.stringify(refreshData.user)
              );
            }

            // Procesar la cola con el nuevo token
            processQueue(null, newTokens.access_token);

            // Reintentar el request original
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;

            // ✅ AGREGAR TENANT AL RETRY
            const rawUserRetry = localStorage.getItem("nexa_user");
            if (rawUserRetry) {
              try {
                const userRetry = JSON.parse(rawUserRetry);
                if (userRetry?.tenantId) {
                  originalRequest.headers["X-Tenant-ID"] = userRetry.tenantId;
                }
              } catch {
                // Ignorar errores de parsing
              }
            }

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

// ✅ REQUEST INTERCEPTOR ACTUALIZADO CON MULTI-TENANT
apiClient.interceptors.request.use(
  (config: any) => {
    // ✅ AGREGAR TOKEN
    const rawTokens = localStorage.getItem("nexa_tokens");
    if (rawTokens) {
      try {
        const tokens = JSON.parse(rawTokens);
        if (tokens?.access_token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${tokens.access_token}`;
        }
      } catch (e) {
        console.error("Failed to parse tokens:", e);
      }
    }

    // ✅ AGREGAR TENANT-ID AUTOMÁTICO
    const rawUser = localStorage.getItem("nexa_user");
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        if (user?.tenantId) {
          config.headers = config.headers ?? {};
          config.headers["X-Tenant-ID"] = user.tenantId;
        }
      } catch (e) {
        console.error("Failed to parse user for tenant:", e);
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

// ✅ ACTUALIZADO: Admin Collections API con filtros avanzados
export const adminCollections = {
  // Lista simple (original)
  list: (params?: { page?: number; limit?: number; q?: string }) =>
    apiClient.get("/api/admin/collections", { params }),

  // ✅ NUEVO: Lista con filtros avanzados
  listAdvanced: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: string; // JSON string
    sort?: string; // JSON string
    relations?: string[]; // JSON string
  }) => apiClient.get("/api/admin/collections/advanced", { params }),

  // ✅ NUEVO: Estadísticas generales de collections
  getStats: () => apiClient.get("/api/admin/collections/stats"),

  findByName: (name: string) =>
    apiClient.get(`/api/admin/collections/${encodeURIComponent(name)}`),

  updateByName: (name: string, payload: any) =>
    apiClient.put(
      `/api/admin/collections/${encodeURIComponent(name)}`,
      payload
    ),

  removeByName: (name: string) =>
    apiClient.delete(`/api/admin/collections/${encodeURIComponent(name)}`),

  getByName: (name: string) =>
    apiClient.get(`/api/admin/collections/${encodeURIComponent(name)}`),

  stats: (name: string) =>
    apiClient.get(`/api/admin/collections/${encodeURIComponent(name)}/stats`),

  // ✅ NUEVO: Schema con metadatos de filtros
  getSchema: (name: string) =>
    apiClient.get(`/api/admin/collections/${encodeURIComponent(name)}/schema`),

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

// ✅ ACTUALIZADO: Dynamic Collections API con filtros avanzados
export const dynamicCollections = {
  // Lista simple (original)
  list: (collectionName: string, params?: Record<string, unknown>) =>
    apiClient.get(`/api/collections/${encodeURIComponent(collectionName)}`, {
      params,
    }),

  // ✅ NUEVO: Lista con filtros avanzados
  listAdvanced: (
    collectionName: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      filters?: string; // JSON string
      sort?: string; // JSON string
    }
  ) =>
    apiClient.get(
      `/api/collections/${encodeURIComponent(collectionName)}/advanced`,
      {
        params,
      }
    ),

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

// ✅ ACTUALIZADO: External Collections API con filtros avanzados
export const externalCollections = {
  // Lista simple (original)
  list: (
    collectionName: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ) =>
    apiClient.get(
      `/api/data/collections/${encodeURIComponent(collectionName)}`,
      {
        params,
      }
    ),

  // ✅ NUEVO: Lista con filtros avanzados para API externa
  listAdvanced: (
    collectionName: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      filters?: string; // JSON string
      sort?: string; // JSON string
    }
  ) =>
    apiClient.get(
      `/api/data/collections/${encodeURIComponent(collectionName)}/advanced`,
      {
        params,
      }
    ),

  getById: (collectionName: string, id: string) =>
    apiClient.get(
      `/api/data/collections/${encodeURIComponent(
        collectionName
      )}/${encodeURIComponent(id)}`
    ),

  create: (collectionName: string, data: any) =>
    apiClient.post(
      `/api/data/collections/${encodeURIComponent(collectionName)}`,
      data
    ),
};

// ✅ ACTUALIZADO COMPLETO: Users API con filtros avanzados
export const usersAPI = {
  // Lista simple (original)
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    user_id?: string;
    user_email?: string;
  }) => apiClient.get("/api/admin/users", { params }),

  // ✅ NUEVO: Lista con filtros avanzados
  getAdvanced: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: string; // JSON string con filtros avanzados
    sort?: string; // JSON string con ordenamiento
    relations?: string[]; // Relaciones a incluir
  }) => apiClient.get("/api/admin/users/advanced", { params }),

  // ✅ NUEVO: Estadísticas de usuarios
  getStats: () => apiClient.get("/api/admin/users/stats"),

  // ✅ NUEVO: Sugerencias de búsqueda
  getSearchSuggestions: (query: string) =>
    apiClient.get("/api/admin/users/search/suggestions", {
      params: { q: query },
    }),

  // ✅ NUEVO: Mi perfil
  getMyProfile: () => apiClient.get("/api/admin/users/profile/me"),

  // Operaciones CRUD (originales)
  create: (data: any) => apiClient.post("/api/admin/users", data),

  update: (id: string, data: any) =>
    apiClient.patch(`/api/admin/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/api/admin/users/${id}`),

  getById: (id: string) => apiClient.get(`/api/admin/users/${id}`),

  // ✅ NUEVO: Toggle status
  toggleStatus: (id: string) =>
    apiClient.patch(`/api/admin/users/${id}/toggle-status`),

  // ✅ NUEVO: Operaciones masivas
  bulkActivate: (userIds: string[]) =>
    apiClient.post("/api/admin/users/bulk/activate", { userIds }),

  bulkDeactivate: (userIds: string[]) =>
    apiClient.post("/api/admin/users/bulk/deactivate", { userIds }),

  // ✅ NUEVO: Logs por usuario específico
  getUserLogs: (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      filters?: string;
      sort?: string;
    }
  ) => apiClient.get(`/api/admin/activity-logs/user/${userId}`, { params }),
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

// ✅ ACTUALIZADO COMPLETO: Activity Logs API con filtros avanzados
export const activityLogsAPI = {
  // Obtener todos los logs con filtros simples (original)
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

  // ✅ NUEVO: Filtros avanzados
  getAdvanced: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: string; // JSON string con filtros avanzados
    sort?: string; // JSON string con ordenamiento
    relations?: string[]; // Relaciones a incluir
  }) => apiClient.get("/api/admin/activity-logs/advanced", { params }),

  // ✅ NUEVO: Logs de auditoría con filtros específicos
  getAuditLogs: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    userId?: string;
    actions?: string; // Comma-separated
    entityTypes?: string; // Comma-separated
  }) => apiClient.get("/api/admin/activity-logs/audit", { params }),

  // Estadísticas básicas (original)
  getStats: () => apiClient.get("/api/admin/activity-logs/stats"),

  // ✅ NUEVO: Estadísticas avanzadas con período personalizable
  getAdvancedStats: (days: number = 30) =>
    apiClient.get("/api/admin/activity-logs/stats/advanced", {
      params: { days },
    }),

  // Estadísticas detalladas (original)
  getDetailedStats: () =>
    apiClient.get("/api/admin/activity-logs/stats/detailed"),

  // Exportar logs (original)
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

  // ✅ NUEVO: Export avanzado con filtros complejos
  exportAdvanced: (params?: {
    format?: "csv" | "json";
    limit?: number;
    filters?: string; // JSON string
    sort?: string; // JSON string
  }) => apiClient.get("/api/admin/activity-logs/export/advanced", { params }),

  // Obtener usuarios únicos (para filtros)
  getUniqueUsers: () => apiClient.get("/api/admin/activity-logs/users"),

  // Obtener tipos de recursos únicos (para filtros)
  getUniqueResourceTypes: () =>
    apiClient.get("/api/admin/activity-logs/resource-types"),

  // ✅ NUEVO: Obtener acciones únicas
  getUniqueActions: () => apiClient.get("/api/admin/activity-logs/actions"),

  // ✅ NUEVO: Logs por usuario específico
  getUserLogs: (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      filters?: string;
      sort?: string;
    }
  ) => apiClient.get(`/api/admin/activity-logs/user/${userId}`, { params }),

  // Crear log manual (original)
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
  getSystemInfo: () => apiClient.get("/api/admin/dashboard/system-info"),
  getActivity: (params?: { limit?: number }) =>
    apiClient.get("/api/admin/dashboard/activity", { params }),
  getHealth: () => apiClient.get("/api/admin/dashboard/health"),
};

// ✅ ACTUALIZADO: Webhooks API con filtros avanzados
export const webhooksAPI = {
  // Obtener todos los webhooks (original)
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get("/api/webhooks", { params }),

  // ✅ NUEVO: Webhooks con filtros avanzados
  getAdvanced: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: string; // JSON string
    sort?: string; // JSON string
  }) => apiClient.get("/api/webhooks/advanced", { params }),

  // ✅ NUEVO: Estadísticas de webhooks
  getStats: () => apiClient.get("/api/webhooks/stats"),

  // Crear webhook (original)
  create: (data: {
    name: string;
    url: string;
    events: string[];
    collections?: string[];
    secret?: string;
    headers?: Record<string, string>;
  }) => apiClient.post("/api/webhooks", data),

  // Actualizar webhook (original)
  update: (id: string, data: any) => apiClient.put(`/api/webhooks/${id}`, data),

  // Eliminar webhook (original)
  delete: (id: string) => apiClient.delete(`/api/webhooks/${id}`),

  // Alternar estado activo/inactivo (original)
  toggle: (id: string) => apiClient.patch(`/api/webhooks/${id}/toggle`),

  // Probar webhook (original)
  test: (webhookId: string) => {
    console.log("🔌 API: Llamando test webhook para ID:", webhookId);
    return apiClient.post(`/api/webhooks/${webhookId}/test`);
  },

  // ✅ ACTUALIZADO: Obtener entregas/deliveries con filtros
  getDeliveries: (params?: {
    webhookId?: string;
    page?: number;
    limit?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }) => apiClient.get(`/api/webhooks/deliveries`, { params }),

  // ✅ NUEVO: Entregas con filtros avanzados
  getDeliveriesAdvanced: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: string; // JSON string
    sort?: string; // JSON string
  }) => apiClient.get(`/api/webhooks/deliveries/advanced`, { params }),

  // Estadísticas de webhook específico (original)
  getWebhookStats: (webhookId: string) =>
    apiClient.get(`/api/webhooks/${webhookId}/stats`),

  // Reintentar entrega (original)
  retryDelivery: (deliveryId: string) =>
    apiClient.post(`/api/webhooks/deliveries/${deliveryId}/retry`),

  // ✅ NUEVO: Estadísticas globales detalladas
  getGlobalStats: (days: number = 30) =>
    apiClient.get("/api/webhooks/stats/global", { params: { days } }),

  // ✅ NUEVO: Eventos únicos (para filtros)
  getUniqueEvents: () => apiClient.get("/api/webhooks/events/unique"),

  // ✅ NUEVO: Collections únicas (para filtros)
  getUniqueCollections: () => apiClient.get("/api/webhooks/collections/unique"),

  // ✅ NUEVO: URLs únicas (para filtros)
  getUniqueUrls: () => apiClient.get("/api/webhooks/urls/unique"),
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

// ✅ Realtime API
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

export const recordsAPI = {
  // Mapea a tu dynamic.controller.ts endpoints
  getAll: (
    collectionName: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      filters?: string;
      sort?: string;
    }
  ) => dynamicCollections.list(collectionName, params),

  // Crear registro
  create: (collectionName: string, data: any) =>
    dynamicCollections.create(collectionName, data),

  // Obtener por ID
  getById: (collectionName: string, id: string) =>
    dynamicCollections.getById(collectionName, id),

  // Actualizar registro
  update: (collectionName: string, id: string, data: any) =>
    dynamicCollections.update(collectionName, id, data),

  // Eliminar registro (nota: tu controller usa 'remove', dynamicCollections también)
  delete: (collectionName: string, id: string) =>
    dynamicCollections.remove(collectionName, id),

  // Estadísticas de registros (si las implementas en el controller)
  getStats: (collectionName: string) => {
    // Puedes implementar esto más tarde o usar las stats del collection
    return adminCollections.stats(collectionName);
  },
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

// ✅ NUEVOS: Helper types para filtros avanzados
export interface AdvancedFilter {
  field: string;
  operator:
    | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "not_like"
    | "starts_with"
    | "ends_with"
    | "in"
    | "not_in"
    | "between"
    | "is_null"
    | "is_not_null";
  value: any;
}

export interface AdvancedSort {
  field: string;
  direction: "ASC" | "DESC";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: AdvancedFilter[];
  sort?: AdvancedSort[];
  search?: string;
}

// ✅ NUEVO: Helper para construir filtros
export const filterHelpers = {
  buildFiltersString: (filters: AdvancedFilter[]): string => {
    return JSON.stringify(filters);
  },

  buildSortString: (sort: AdvancedSort[]): string => {
    return JSON.stringify(sort);
  },

  // Filtros comunes predefinidos
  common: {
    // Filtros de fecha
    lastDays: (field: string, days: number): AdvancedFilter => ({
      field,
      operator: "gte",
      value: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }),

    thisWeek: (field: string): AdvancedFilter => {
      const today = new Date();
      const firstDay = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      return {
        field,
        operator: "gte",
        value: firstDay.toISOString().split("T")[0],
      };
    },

    thisMonth: (field: string): AdvancedFilter => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        field,
        operator: "gte",
        value: firstDay.toISOString().split("T")[0],
      };
    },

    // Filtros de estado
    activeOnly: (): AdvancedFilter => ({
      field: "is_active",
      operator: "eq",
      value: true,
    }),

    inactiveOnly: (): AdvancedFilter => ({
      field: "is_active",
      operator: "eq",
      value: false,
    }),

    // Filtros de rol
    byRole: (role: string): AdvancedFilter => ({
      field: "role",
      operator: "eq",
      value: role,
    }),

    // Filtros de estado de webhook/logs
    successOnly: (): AdvancedFilter => ({
      field: "status",
      operator: "eq",
      value: "success",
    }),

    failedOnly: (): AdvancedFilter => ({
      field: "status",
      operator: "eq",
      value: "failed",
    }),
  },
};

export default apiClient;
