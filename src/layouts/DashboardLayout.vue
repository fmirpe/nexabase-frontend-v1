<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-xl',
        sidebarOpen ? 'w-64' : 'w-16',
      ]"
    >
      <!-- Logo/Header -->
      <div class="p-4 border-b border-blue-500/20">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
          </div>
          <div v-show="sidebarOpen" class="transition-all duration-300">
            <h1 class="font-bold text-lg">NexaBase</h1>
            <p class="text-xs text-blue-200">Dashboard v1</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-2 overflow-y-auto">
        <div class="space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative',
              $route.path === item.path
                ? 'bg-white/10 text-white shadow-sm border-r-2 border-white/30'
                : 'text-blue-100 hover:bg-white/5 hover:text-white',
            ]"
          >
            <svg
              class="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="item.iconPath"
              />
            </svg>
            <span v-show="sidebarOpen" class="transition-all duration-300">
              {{ item.label }}
            </span>
            <div
              v-if="item.badge && sidebarOpen"
              class="ml-auto text-xs px-2 py-1 rounded-full font-medium bg-blue-400 text-white"
            >
              {{ item.badge }}
            </div>
          </router-link>
        </div>

        <!-- Admin Section -->
        <div v-if="authStore.isAdmin && sidebarOpen" class="mt-8">
          <div
            class="px-3 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider"
          >
            Administración
          </div>
          <router-link
            v-for="adminItem in adminNavigationItems"
            :key="adminItem.name"
            :to="adminItem.path"
            :class="[
              'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
              $route.path === adminItem.path
                ? 'bg-white/10 text-white shadow-sm border-r-2 border-white/30'
                : 'text-blue-100 hover:bg-white/5 hover:text-white',
            ]"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="adminItem.iconPath"
              />
            </svg>
            <span>{{ adminItem.label }}</span>
          </router-link>
        </div>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-blue-500/20">
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <span class="text-sm font-semibold">
              {{
                getUserInitials(
                  authStore.user?.first_name,
                  authStore.user?.last_name,
                  authStore.user?.email
                )
              }}
            </span>
          </div>
          <div v-show="sidebarOpen" class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
            </p>
            <p class="text-xs text-blue-200 truncate">
              {{ authStore.user?.email }}
            </p>
          </div>
          <div v-show="sidebarOpen" class="flex items-center gap-1">
            <button
              @click="loadSystemStats"
              :disabled="statsLoading"
              class="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Actualizar estadísticas"
            >
              <svg
                :class="['w-4 h-4', statsLoading ? 'animate-spin' : '']"
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
            <button
              @click="logout"
              class="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Cerrar sesión"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div class="flex items-center space-x-2 text-sm">
              <span class="text-gray-500">NexaBase</span>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-gray-900 font-medium">
                {{ currentPageTitle }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <span v-if="lastUpdated" class="text-xs text-gray-500">
              Actualizado: {{ formatRelativeTime(lastUpdated) }}
            </span>

            <button
              class="p-2 hover:bg-gray-100 rounded-lg relative"
              @click="showNotifications = !showNotifications"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <div
                v-if="notifications.length > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium"
              >
                {{ notifications.length > 9 ? "9+" : notifications.length }}
              </div>
            </button>

            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                authStore.isAdmin
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800',
              ]"
            >
              {{ authStore.user?.role?.toUpperCase() || "USER" }}
            </span>
          </div>
        </div>

        <!-- Notifications Dropdown -->
        <div
          v-if="showNotifications"
          class="absolute right-6 top-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-medium text-gray-900">Notificaciones</h3>
          </div>
          <div class="max-h-64 overflow-y-auto">
            <div
              v-if="notifications.length === 0"
              class="p-4 text-center text-gray-500"
            >
              No hay notificaciones
            </div>
            <div v-else>
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="p-4 border-b border-gray-100 hover:bg-gray-50"
              >
                <div class="flex items-start">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full mt-2 mr-3',
                      notification.type === 'success'
                        ? 'bg-green-500'
                        : notification.type === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500',
                    ]"
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ notification.title }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ notification.message }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ formatRelativeTime(notification.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6">
        <div class="max-w-7xl mx-auto">
          <div
            v-if="statsLoading"
            class="mb-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 mr-2 animate-spin"
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
              Actualizando estadísticas del sistema...
            </div>
          </div>

          <router-view />
        </div>
      </main>
    </div>

    <!-- Click outside to close notifications -->
    <div
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
// Tu script existente se mantiene igual - solo agrega esta función helper:
function getUserInitials(
  firstName?: string,
  lastName?: string,
  email?: string
): string {
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (email) {
    const parts = email.split("@")[0].split(".");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : email.slice(0, 2).toUpperCase();
  }
  return "?";
}

// Tu script existente completo va aquí...
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { adminCollections, usersAPI } from "../services/api";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Tu código existente se mantiene exactamente igual
const sidebarOpen = ref(true);
const statsLoading = ref(false);
const showNotifications = ref(false);
const lastUpdated = ref<string | null>(null);

const systemStats = ref<{
  totalCollections: number;
  totalRecords: number;
  totalUsers: number;
  apiHealth: "online" | "offline";
} | null>(null);

const notifications = ref([
  {
    id: 1,
    type: "success",
    title: "Sistema iniciado",
    message: "NexaBase está funcionando correctamente",
    created_at: new Date().toISOString(),
  },
]);

const currentPageTitle = computed(() => {
  return (route.meta?.title as string) || "Dashboard";
});

const navigationItems = computed(() => [
  {
    name: "dashboard",
    path: "/",
    label: "Dashboard",
    iconPath:
      "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z",
    badge: null,
    badgeLoading: false,
  },
  {
    name: "collections",
    path: "/collections",
    label: "Collections",
    iconPath:
      "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    badge: systemStats.value?.totalCollections?.toString() || "0",
    badgeLoading: statsLoading.value,
  },
]);

const adminNavigationItems = computed(() => [
  {
    name: "users",
    path: "/users",
    label: "Usuarios",
    iconPath:
      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  },
  {
    name: "storage",
    path: "/storage",
    label: "Archivos",
    iconPath:
      "M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z",
  },
  // ✅ NUEVO - Webhooks
  {
    name: "webhooks",
    path: "/webhooks",
    label: "Webhooks",
    iconPath:
      "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  },

  {
    name: "configuration",
    path: "/configuration",
    label: "Configuración",
    iconPath:
      "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    name: "activity-logs",
    path: "/activity-logs",
    label: "Logs de Actividad",
    iconPath:
      "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    name: "backup",
    path: "/backup",
    label: "Backup & Restore",
    iconPath:
      "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    name: "api-keys",
    path: "/api-keys",
    label: "API Keys",
    iconPath:
      "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  },
]);

async function loadSystemStats() {
  try {
    statsLoading.value = true;

    const [collectionsRes, usersRes] = await Promise.all([
      adminCollections
        .list({ page: 1, limit: 1 })
        .catch(() => ({ data: { meta: { total: 0 } } })),
      authStore.isAdmin
        ? usersAPI
            .getAll({ page: 1, limit: 1 })
            .catch(() => ({ data: { meta: { total: 0 } } }))
        : Promise.resolve({ data: { meta: { total: 0 } } }),
    ]);

    const collectionsCount = collectionsRes.data?.meta?.total || 0;
    const usersCount = usersRes.data?.meta?.total || 0;

    let totalRecords = 0;
    if (collectionsCount > 0) {
      try {
        const allCollectionsRes = await adminCollections
          .list({
            page: 1,
            limit: 100,
          })
          .catch(() => ({ data: { data: [] } }));
        const collections = allCollectionsRes.data?.data || [];
        totalRecords = collections.reduce((sum: number, collection: any) => {
          return sum + (collection.record_count || 0);
        }, 0);
      } catch (e) {
        console.warn("Error calculating total records:", e);
      }
    }

    systemStats.value = {
      totalCollections: collectionsCount,
      totalRecords,
      totalUsers: usersCount,
      apiHealth: "online",
    };

    lastUpdated.value = new Date().toISOString();
  } catch (error: any) {
    console.error("Error loading system stats:", error);

    if (systemStats.value) {
      systemStats.value.apiHealth = "offline";
    }
  } finally {
    statsLoading.value = false;
  }
}

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace un momento";
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
  return `hace ${Math.floor(diffInSeconds / 86400)}d`;
}

let refreshInterval: NodeJS.Timeout;
onMounted(() => {
  loadSystemStats();
  refreshInterval = setInterval(loadSystemStats, 5 * 60 * 1000);
});

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (refreshInterval) clearInterval(refreshInterval);
  });
}

watch(
  () => route.path,
  () => {
    showNotifications.value = false;
  }
);
</script>
