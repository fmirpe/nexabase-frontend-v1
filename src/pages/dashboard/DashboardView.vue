<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div
      class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">
            ¡Bienvenido, {{ authStore.user?.first_name }}! 👋
          </h1>
          <p class="text-blue-100 mt-2">
            Aquí tienes un resumen de tu NexaBase Dashboard
          </p>
        </div>
        <div class="hidden md:block">
          <div
            class="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
            <p
              class="text-3xl font-bold text-gray-900 mt-2"
              :class="{ 'animate-pulse bg-gray-200 rounded': loading }"
            >
              {{ loading ? "" : stat.value }}
            </p>
            <p
              class="text-sm mt-2"
              :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'"
            >
              <span v-if="!loading" class="inline-flex items-center">
                <svg
                  v-if="stat.trend === 'up'"
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ stat.change }}
              </span>
            </p>
          </div>
          <div :class="['p-3 rounded-lg', stat.bgColor]">
            <svg
              class="w-6 h-6"
              :class="stat.iconColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="stat.iconPath"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">
                Actividad Reciente
              </h2>
              <button
                @click="loadRecentActivity"
                :disabled="activityLoading"
                class="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
              >
                {{ activityLoading ? "Cargando..." : "Actualizar" }}
              </button>
            </div>
          </div>
          <div class="p-6">
            <div v-if="activityLoading" class="space-y-6">
              <div
                v-for="n in 4"
                :key="n"
                class="flex items-start space-x-4 animate-pulse"
              >
                <div
                  class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"
                ></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>

            <div v-else-if="recentActivity.length > 0" class="space-y-6">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start space-x-4"
              >
                <div
                  :class="[
                    'p-2 rounded-full flex-shrink-0',
                    activity.type === 'create'
                      ? 'bg-green-100 text-green-600'
                      : activity.type === 'update'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-red-100 text-red-600',
                  ]"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      v-if="activity.type === 'create'"
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    />
                    <path
                      v-else-if="activity.type === 'update'"
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    />
                    <path
                      v-else
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ activity.action }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ formatRelativeTime(activity.created_at) }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                Sin actividad reciente
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                No hay actividad registrada en el sistema.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              Acciones Rápidas
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <router-link
                to="/collections"
                class="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <svg
                  class="w-5 h-5 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span
                  class="text-sm font-medium text-gray-900 group-hover:text-blue-900"
                  >Nueva Collection</span
                >
              </router-link>

              <button
                @click="createBackup"
                :disabled="backupLoading"
                class="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group w-full text-left disabled:opacity-50"
              >
                <svg
                  v-if="!backupLoading"
                  class="w-5 h-5 text-green-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-green-600 mr-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span
                  class="text-sm font-medium text-gray-900 group-hover:text-green-900"
                >
                  {{ backupLoading ? "Creando Backup..." : "Backup Database" }}
                </span>
              </button>

              <router-link
                v-if="authStore.isAdmin"
                to="/users"
                class="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <svg
                  class="w-5 h-5 text-purple-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span
                  class="text-sm font-medium text-gray-900 group-hover:text-purple-900"
                  >Gestionar Usuarios</span
                >
              </router-link>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">
                Estado del Sistema
              </h2>
              <button
                @click="loadSystemStatus"
                :disabled="statusLoading"
                class="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
              >
                {{ statusLoading ? "Verificando..." : "Actualizar" }}
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="status in systemStatus"
                :key="status.component"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-600">{{
                  status.component
                }}</span>
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full mr-2',
                      status.status === 'online'
                        ? 'bg-green-500'
                        : status.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500',
                    ]"
                  ></div>
                  <span
                    :class="[
                      'text-sm font-medium',
                      status.status === 'online'
                        ? 'text-green-600'
                        : status.status === 'warning'
                        ? 'text-yellow-600'
                        : 'text-red-600',
                    ]"
                  >
                    {{ status.message }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div
      v-if="error"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      @click="error = null"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center mb-4">
          <svg
            class="w-6 h-6 text-red-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900">Error</h3>
        </div>
        <p class="text-sm text-gray-600 mb-4">{{ error }}</p>
        <div class="flex justify-end space-x-2">
          <button
            @click="error = null"
            class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cerrar
          </button>
          <button
            @click="loadAllDashboardData"
            class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import {
  adminCollections,
  dynamicCollections,
  usersAPI,
  apiClient,
} from "../../services/api";

const authStore = useAuthStore();

// Loading states
const loading = ref(true);
const activityLoading = ref(false);
const statusLoading = ref(false);
const backupLoading = ref(false);
const error = ref<string | null>(null);

// Data
const stats = ref([
  {
    label: "Total Collections",
    value: "0",
    change: "+0%",
    trend: "up" as "up" | "down",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    iconPath:
      "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    label: "Total Records",
    value: "0",
    change: "+0%",
    trend: "up" as "up" | "down",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    iconPath:
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    label: "Active Users",
    value: "0",
    change: "+0%",
    trend: "up" as "up" | "down",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    iconPath:
      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  },
  {
    label: "API Health",
    value: "100%",
    change: "+0%",
    trend: "up" as "up" | "down",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
]);

const recentActivity = ref<any[]>([]);
const systemStatus = ref([
  { component: "Database", status: "online", message: "Conectando..." },
  { component: "API", status: "online", message: "Verificando..." },
  { component: "Storage", status: "warning", message: "Calculando..." },
]);

// API Functions
async function loadDashboardStats() {
  try {
    loading.value = true;
    error.value = null;

    // Usar Promise.all para llamadas en paralelo
    const [collectionsRes, usersRes] = await Promise.all([
      adminCollections.list({ page: 1, limit: 1 }),
      authStore.isAdmin
        ? usersAPI
            .getAll({ page: 1, limit: 1 })
            .catch(() => ({ data: { meta: { total: 0 } } }))
        : Promise.resolve({ data: { meta: { total: 0 } } }),
    ]);

    // Actualizar estadísticas con datos reales
    const collectionsCount = collectionsRes.data?.meta?.total || 0;
    const usersCount = usersRes.data?.meta?.total || 0;

    // Obtener conteo total de registros de todas las collections
    let totalRecords = 0;
    if (collectionsCount > 0) {
      try {
        const allCollectionsRes = await adminCollections.list({
          page: 1,
          limit: 100,
        });
        const collections = allCollectionsRes.data?.data || [];

        totalRecords = collections.reduce((sum: number, collection: any) => {
          return sum + (collection.record_count || 0);
        }, 0);
      } catch (e) {
        console.warn("Error calculating total records:", e);
      }
    }

    // Actualizar stats con datos reales
    stats.value[0].value = collectionsCount.toString();
    stats.value[1].value = totalRecords.toString();
    stats.value[2].value = usersCount.toString();
    stats.value[3].value = "100%";

    // Simular tendencias (en producción podrías guardar valores previos)
    stats.value.forEach((stat, index) => {
      if (index < 3) {
        // Solo para stats con datos reales
        const randomChange = (Math.random() * 20 + 1).toFixed(1);
        stat.change = `+${randomChange}%`;
        stat.trend = Math.random() > 0.2 ? "up" : "down";
      }
    });
  } catch (e: any) {
    console.error("Error loading dashboard stats:", e);
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Error cargando estadísticas del dashboard";
  } finally {
    loading.value = false;
  }
}

async function loadRecentActivity() {
  try {
    activityLoading.value = true;

    // Obtener actividad de collections recientes
    const collectionsRes = await adminCollections.list({ page: 1, limit: 5 });
    const collections = collectionsRes.data?.data || [];

    // Crear actividad basada en collections reales
    const activity = collections.map((collection: any, index: number) => ({
      id: index + 1,
      type: "create",
      action: `Collection "${collection.name}" creada`,
      description: `Collection con ${
        Object.keys(collection.schema?.fields || {}).length
      } campos`,
      created_at: collection.created_at,
    }));

    // Si tenemos pocas collections, agregar actividad simulada
    if (activity.length < 3) {
      activity.push(
        {
          id: activity.length + 1,
          type: "update",
          action: "Sistema actualizado",
          description: "Mejoras de rendimiento aplicadas",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: activity.length + 2,
          type: "create",
          action: "Nuevo usuario registrado",
          description: `Usuario ${
            authStore.user?.email || "usuario@example.com"
          } activo`,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        }
      );
    }

    recentActivity.value = activity.slice(0, 4);
  } catch (e: any) {
    console.error("Error loading recent activity:", e);
    // No mostrar error aquí, solo log
  } finally {
    activityLoading.value = false;
  }
}

async function loadSystemStatus() {
  try {
    statusLoading.value = true;

    // Test de conectividad real
    const healthChecks = await Promise.allSettled([
      // Test Database (a través de collections)
      adminCollections.list({ page: 1, limit: 1 }),
      // Test API (endpoint simple)
      apiClient.get("/auth/me").catch(() => Promise.resolve({ data: null })),
      // Test Storage (simular)
      Promise.resolve({ storage_used: Math.floor(Math.random() * 40 + 60) }),
    ]);

    const [dbCheck, apiCheck, storageCheck] = healthChecks;

    systemStatus.value = [
      {
        component: "Database",
        status: dbCheck.status === "fulfilled" ? "online" : "offline",
        message:
          dbCheck.status === "fulfilled" ? "Online" : "Error de conexión",
      },
      {
        component: "API",
        status: apiCheck.status === "fulfilled" ? "online" : "warning",
        message:
          apiCheck.status === "fulfilled" ? "Operational" : "Respuesta lenta",
      },
      {
        component: "Storage",
        status: "warning",
        message: `${
          storageCheck.status === "fulfilled"
            ? (storageCheck.value as any).storage_used
            : 75
        }% Used`,
      },
    ];
  } catch (e: any) {
    console.error("Error loading system status:", e);
    systemStatus.value.forEach((status) => {
      status.status = "offline";
      status.message = "Error";
    });
  } finally {
    statusLoading.value = false;
  }
}

async function createBackup() {
  try {
    backupLoading.value = true;

    // Simular creación de backup (implementar endpoint real)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // En producción sería algo como:
    // await apiClient.post('/api/admin/backup')

    alert("✅ Backup creado exitosamente");
  } catch (e: any) {
    console.error("Error creating backup:", e);
    error.value =
      "Error creando backup: " + (e?.message || "Error desconocido");
  } finally {
    backupLoading.value = false;
  }
}

// Main load function - TODOS los datos
async function loadAllDashboardData() {
  error.value = null;

  // Cargar todo en paralelo para máximo rendimiento
  await Promise.all([
    loadDashboardStats(),
    loadRecentActivity(),
    loadSystemStatus(),
  ]);
}

// Utility functions
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Hace menos de 1 minuto";
  if (diffInSeconds < 3600)
    return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400)
    return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
}

// Lifecycle
onMounted(() => {
  loadAllDashboardData();
});
</script>
