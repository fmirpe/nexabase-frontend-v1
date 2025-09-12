<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Logs de Actividad</h1>
        <p class="text-gray-600 mt-2">
          Timeline completo de todas las acciones administrativas y eventos del
          sistema
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="exportLogs"
          :disabled="exporting"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <svg
            v-if="!exporting"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 animate-spin"
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
          <span>{{ exporting ? "Exportando..." : "Exportar" }}</span>
        </button>
        <button
          @click="loadActivityLogs"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <svg
            v-if="!loading"
            class="w-5 h-5"
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
          <svg
            v-else
            class="w-5 h-5 animate-spin"
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
          <span>{{ loading ? "Cargando..." : "Actualizar" }}</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total de Eventos</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ stats.totalEvents }}
            </p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Hoy</p>
            <p class="text-3xl font-bold text-green-600 mt-2">
              {{ stats.todayEvents }}
            </p>
          </div>
          <div class="p-3 bg-green-50 rounded-lg">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Errores</p>
            <p class="text-3xl font-bold text-red-600 mt-2">
              {{ stats.errorEvents }}
            </p>
          </div>
          <div class="p-3 bg-red-50 rounded-lg">
            <svg
              class="w-6 h-6 text-red-600"
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
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">
              {{ stats.activeUsers }}
            </p>
          </div>
          <div class="p-3 bg-purple-50 rounded-lg">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Evento
          </label>
          <select
            v-model="filters.action"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="create">Creación</option>
            <option value="update">Actualización</option>
            <option value="delete">Eliminación</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="admin">Admin</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <select
            v-model="filters.user_email"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los usuarios</option>
            <option v-for="user in uniqueUsers" :key="user" :value="user">
              {{ user }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Fecha Desde
          </label>
          <input
            v-model="filters.date_from"
            @change="applyFilters"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Fecha Hasta
          </label>
          <input
            v-model="filters.date_to"
            @change="applyFilters"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center space-x-4">
          <button
            @click="clearFilters"
            class="text-gray-600 hover:text-gray-800 text-sm"
          >
            Limpiar filtros
          </button>
          <span class="text-sm text-gray-500">
            {{ filteredLogs.length }} de {{ allLogs.length }} eventos
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600">Auto-refresh:</label>
          <button
            @click="toggleAutoRefresh"
            :class="[
              'px-3 py-1 rounded text-sm font-medium',
              autoRefresh
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ autoRefresh ? "ON" : "OFF" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Timeline de Actividad</h3>
      </div>

      <div class="p-6">
        <div v-if="loading" class="space-y-6">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="flex items-start space-x-4">
              <div class="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredLogs.length === 0" class="text-center py-12">
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
            {{
              allLogs.length === 0
                ? "No se han registrado eventos aún."
                : "No hay eventos que coincidan con los filtros."
            }}
          </p>
        </div>

        <div v-else class="space-y-6">
          <!-- Group by date -->
          <div
            v-for="(dayLogs, date) in groupedLogs"
            :key="date"
            class="space-y-4"
          >
            <div class="flex items-center">
              <div class="flex-1 border-t border-gray-200"></div>
              <div
                class="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600"
              >
                {{ formatDateGroup(date) }}
              </div>
              <div class="flex-1 border-t border-gray-200"></div>
            </div>

            <div class="space-y-4">
              <div
                v-for="log in dayLogs"
                :key="log.id"
                class="flex items-start space-x-4 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <!-- Status indicator -->
                <div class="mt-2">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full border-2 border-white shadow',
                      getStatusColor(log.action, log.details),
                    ]"
                  ></div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-medium text-gray-900">{{
                          log.action
                        }}</span>
                        <span
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-full',
                            getActionBadgeColor(log.action),
                          ]"
                        >
                          {{ log.action.toUpperCase() }}
                        </span>
                      </div>

                      <p class="text-sm text-gray-600 mb-2">
                        {{ log.description }}
                      </p>

                      <!-- Details -->
                      <div
                        class="flex items-center space-x-4 text-xs text-gray-500"
                      >
                        <span v-if="log.user_email">
                          👤 {{ log.user_email }}
                        </span>
                        <span v-if="log.entity_type">
                          📄 {{ log.entity_type }}
                        </span>
                        <span v-if="log.entity_id">
                          🔗 {{ log.entity_id.substring(0, 8) }}...
                        </span>
                        <span>{{ formatRelativeTime(log.created_at) }}</span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="log.details"
                        @click="showLogDetails(log)"
                        class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Ver detalles"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>

                      <span class="text-xs text-gray-400">
                        {{ new Date(log.created_at).toLocaleTimeString() }}
                      </span>
                    </div>
                  </div>

                  <!-- Error details -->
                  <div
                    v-if="log.action === 'error' && log.details"
                    class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                  >
                    {{ JSON.stringify(log.details, null, 2) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load more -->
        <div v-if="hasMore && !loading" class="text-center pt-6">
          <button
            @click="loadMore"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg"
          >
            Cargar más eventos
          </button>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      @click="selectedLog = null"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              Detalles del Evento
            </h2>
            <button
              @click="selectedLog = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Acción</label
            >
            <p class="text-sm text-gray-900 mt-1">{{ selectedLog.action }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Descripción</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ selectedLog.description }}
            </p>
          </div>

          <div v-if="selectedLog.user_email">
            <label class="block text-sm font-medium text-gray-700"
              >Usuario</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ selectedLog.user_email }}
            </p>
          </div>

          <div v-if="selectedLog.entity_type">
            <label class="block text-sm font-medium text-gray-700"
              >Tipo de Entidad</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ selectedLog.entity_type }}
            </p>
          </div>

          <div v-if="selectedLog.entity_id">
            <label class="block text-sm font-medium text-gray-700"
              >ID de Entidad</label
            >
            <p class="text-sm text-gray-900 mt-1 font-mono">
              {{ selectedLog.entity_id }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Fecha y Hora</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ new Date(selectedLog.created_at).toLocaleString() }}
            </p>
          </div>

          <div v-if="selectedLog.details">
            <label class="block text-sm font-medium text-gray-700"
              >Detalles</label
            >
            <pre
              class="text-xs bg-gray-50 p-3 rounded border mt-1 overflow-x-auto"
              >{{ JSON.stringify(selectedLog.details, null, 2) }}</pre
            >
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
        <div class="flex justify-end">
          <button
            @click="error = null"
            class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { activityLogsAPI } from "../../services/api";

// State
const loading = ref(true);
const exporting = ref(false);
const error = ref<string | null>(null);
const selectedLog = ref<any>(null);

const allLogs = ref<any[]>([]);
const currentPage = ref(1);
const hasMore = ref(true);
const autoRefresh = ref(false);
let refreshInterval: NodeJS.Timeout | null = null;

const filters = ref({
  action: "",
  user_email: "",
  date_from: "",
  date_to: "",
});

const stats = ref({
  totalEvents: 0,
  todayEvents: 0,
  errorEvents: 0,
  activeUsers: 0,
});

// Computed
const filteredLogs = computed(() => {
  let filtered = allLogs.value;

  if (filters.value.action) {
    filtered = filtered.filter((log) =>
      log.action.toLowerCase().includes(filters.value.action.toLowerCase())
    );
  }

  if (filters.value.user_email) {
    filtered = filtered.filter(
      (log) => log.user_email === filters.value.user_email
    );
  }

  if (filters.value.date_from) {
    const fromDate = new Date(filters.value.date_from);
    filtered = filtered.filter((log) => new Date(log.created_at) >= fromDate);
  }

  if (filters.value.date_to) {
    const toDate = new Date(filters.value.date_to);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter((log) => new Date(log.created_at) <= toDate);
  }

  return filtered;
});

const groupedLogs = computed(() => {
  const groups: { [key: string]: any[] } = {};

  filteredLogs.value.forEach((log) => {
    const date = new Date(log.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
  });

  // Sort each group by time (newest first)
  Object.keys(groups).forEach((date) => {
    groups[date].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  return groups;
});

const uniqueUsers = computed(() => {
  const users = new Set();
  allLogs.value.forEach((log) => {
    if (log.user_email) {
      users.add(log.user_email);
    }
  });
  return Array.from(users).sort();
});

// Methods
async function loadActivityLogs(reset = true) {
  try {
    loading.value = reset;

    if (reset) {
      currentPage.value = 1;
      allLogs.value = [];
    }

    const response = await activityLogsAPI.getAll({
      page: currentPage.value,
      limit: 50,
    });

    const newLogs = response.data?.data || [];

    if (reset) {
      allLogs.value = newLogs;
    } else {
      allLogs.value.push(...newLogs);
    }

    hasMore.value = newLogs.length === 50;

    // Load stats
    await loadStats();
  } catch (e: any) {
    console.error("Error loading activity logs:", e);
    error.value =
      e?.response?.data?.message || "Error cargando logs de actividad";
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  try {
    const statsResponse = await activityLogsAPI.getStats();
    stats.value = {
      totalEvents: allLogs.value.length,
      todayEvents: allLogs.value.filter((log) => {
        const today = new Date();
        const logDate = new Date(log.created_at);
        return logDate.toDateString() === today.toDateString();
      }).length,
      errorEvents: allLogs.value.filter((log) => log.action === "error").length,
      activeUsers: uniqueUsers.value.length,
    };
  } catch (e) {
    console.error("Error loading stats:", e);
  }
}

async function loadMore() {
  currentPage.value++;
  await loadActivityLogs(false);
}

function applyFilters() {
  // The computed filteredLogs will automatically update
}

function clearFilters() {
  filters.value = {
    action: "",
    user_email: "",
    date_from: "",
    date_to: "",
  };
}

async function exportLogs() {
  try {
    exporting.value = true;

    // Create CSV content
    const headers = [
      "Fecha",
      "Hora",
      "Acción",
      "Descripción",
      "Usuario",
      "Tipo Entidad",
      "ID Entidad",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.value.map((log) =>
        [
          new Date(log.created_at).toLocaleDateString(),
          new Date(log.created_at).toLocaleTimeString(),
          log.action,
          `"${log.description.replace(/"/g, '""')}"`,
          log.user_email || "",
          log.entity_type || "",
          log.entity_id || "",
        ].join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `activity_logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e: any) {
    console.error("Error exporting logs:", e);
    error.value = "Error exportando logs";
  } finally {
    exporting.value = false;
  }
}

function toggleAutoRefresh() {
  autoRefresh.value = !autoRefresh.value;

  if (autoRefresh.value) {
    refreshInterval = setInterval(() => {
      loadActivityLogs();
    }, 30000); // Refresh every 30 seconds
  } else {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }
}

function showLogDetails(log: any) {
  selectedLog.value = log;
}

function getStatusColor(action: string, details: any): string {
  if (action === "error" || details?.error) {
    return "bg-red-500";
  }
  if (action === "create") {
    return "bg-green-500";
  }
  if (action === "update") {
    return "bg-blue-500";
  }
  if (action === "delete") {
    return "bg-red-400";
  }
  if (action === "login") {
    return "bg-green-400";
  }
  if (action === "logout") {
    return "bg-gray-400";
  }
  return "bg-purple-500";
}

function getActionBadgeColor(action: string): string {
  if (action === "error") return "bg-red-100 text-red-800";
  if (action === "create") return "bg-green-100 text-green-800";
  if (action === "update") return "bg-blue-100 text-blue-800";
  if (action === "delete") return "bg-red-100 text-red-800";
  if (action === "login") return "bg-green-100 text-green-800";
  if (action === "logout") return "bg-gray-100 text-gray-800";
  return "bg-purple-100 text-purple-800";
}

function formatDateGroup(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer";
  }
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
  loadActivityLogs();
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
