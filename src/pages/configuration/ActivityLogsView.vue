<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Logs de Actividad</h1>
        <p class="mt-2 text-sm text-gray-600">
          Monitorea toda la actividad del sistema
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <button
          @click="loadStats"
          class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
        >
          Ver Estadísticas
        </button>
        <button
          @click="refreshLogs"
          :disabled="loading"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Refrescar"
        >
          <svg
            :class="['w-5 h-5 text-gray-600', loading ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="stats"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-blue-50 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ stats.total_logs || 0 }}
            </h3>
            <p class="text-sm text-gray-500">Total Logs</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-green-50 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ stats.today_logs || 0 }}
            </h3>
            <p class="text-sm text-gray-500">Hoy</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-purple-50 rounded-lg">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3a4 4 0 118 0v4m-4 4v8m-6-4h12"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ stats.week_logs || 0 }}
            </h3>
            <p class="text-sm text-gray-500">Esta Semana</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-orange-50 rounded-lg">
            <svg
              class="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ stats.top_actions?.[0]?.action || "N/A" }}
            </h3>
            <p class="text-sm text-gray-500">Acción Top</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Búsqueda</label
          >
          <input
            v-model="filters.search"
            @input="handleSearch"
            type="text"
            placeholder="Usuario, acción..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Acción</label
          >
          <select
            v-model="filters.action"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Recurso</label
          >
          <select
            v-model="filters.resource_type"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="user">Usuario</option>
            <option value="collection">Collection</option>
            <option value="record">Registro</option>
            <option value="configuration">Configuración</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Estado</label
          >
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="success">Éxito</option>
            <option value="failed">Error</option>
            <option value="warning">Advertencia</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Desde</label
          >
          <input
            v-model="filters.date_from"
            @change="applyFilters"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Hasta</label
          >
          <input
            v-model="filters.date_to"
            @change="applyFilters"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4"
    >
      {{ error }}
      <button
        @click="loadLogs"
        class="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="bg-white border border-gray-200 rounded-lg p-8 text-center"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Cargando logs de actividad...</p>
    </div>

    <!-- Activity Logs Table -->
    <div
      v-else-if="logs.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Usuario
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acción
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Recurso
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                IP
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3"
                  >
                    <span class="text-white text-sm font-semibold">
                      {{ getUserInitials(log.user_email) }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ log.user_email || "Sistema" }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ log.user_id?.slice(0, 8) || "N/A" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getActionBadgeClass(log.action)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ log.action?.toUpperCase() || "N/A" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ log.resource_type }}</div>
                <div v-if="log.resource_name" class="text-sm text-gray-500">
                  {{ log.resource_name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ log.ip_address }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusBadgeClass(log.status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ log.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(log.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
    >
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
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay logs</h3>
      <p class="mt-1 text-sm text-gray-500">
        No se encontraron logs de actividad con los filtros actuales.
      </p>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && meta.pages > 1"
      class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
    >
      <div class="text-sm text-gray-600">
        Página {{ meta.page }} de {{ meta.pages }} • {{ meta.total }} total
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(meta.page - 1)"
          :disabled="meta.page <= 1"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          @click="goToPage(meta.page + 1)"
          :disabled="meta.page >= meta.pages"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { activityLogsAPI } from "../../services/api";

// State
const loading = ref(true);
const error = ref<string | null>(null);
const logs = ref<any[]>([]);
const stats = ref<any>(null);
const meta = ref({ page: 1, limit: 50, total: 0, pages: 0 });

// Filters
const filters = ref({
  search: "",
  action: "",
  resource_type: "",
  status: "",
  date_from: "",
  date_to: "",
});

// Debounce
let searchTimeout: NodeJS.Timeout;

// API Functions
async function loadLogs() {
  try {
    loading.value = true;
    error.value = null;

    const params: any = {
      page: meta.value.page,
      limit: meta.value.limit,
      ...filters.value,
    };

    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    const { data } = await activityLogsAPI.getAll(params);
    logs.value = data.data || [];
    meta.value = data.meta || { page: 1, limit: 50, total: 0, pages: 0 };
  } catch (e: any) {
    console.error("Error loading activity logs:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cargando logs";
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  try {
    const { data } = await activityLogsAPI.getStats();
    stats.value = data;
  } catch (e: any) {
    console.error("Error loading stats:", e);
  }
}

// UI Functions
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    meta.value.page = 1;
    loadLogs();
  }, 500);
}

function applyFilters() {
  meta.value.page = 1;
  loadLogs();
}

function refreshLogs() {
  loadLogs();
  loadStats();
}

function goToPage(page: number) {
  if (page >= 1 && page <= meta.value.pages) {
    meta.value.page = page;
    loadLogs();
  }
}

// Utility Functions
function getUserInitials(email: string): string {
  if (!email) return "?";
  const parts = email.split("@")[0].split(".");
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : email.slice(0, 2).toUpperCase();
}

function getActionBadgeClass(action: string): string {
  const classes = {
    create: "bg-green-100 text-green-800",
    update: "bg-blue-100 text-blue-800",
    delete: "bg-red-100 text-red-800",
    login: "bg-purple-100 text-purple-800",
    logout: "bg-gray-100 text-gray-800",
  };
  return classes[action as keyof typeof classes] || "bg-gray-100 text-gray-800";
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800";
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(() => {
  loadLogs();
  loadStats();
});
</script>
