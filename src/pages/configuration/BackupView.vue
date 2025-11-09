<template>
  <div class="space-y-6 min-h-screen bg-gray-50 p-6">
    <!-- Header con Estadísticas -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3">
        <h1 class="text-2xl font-bold text-gray-900">Backup & Restore</h1>
        <p class="mt-2 text-sm text-gray-600">
          Gestiona copias de seguridad y programación automática
        </p>
      </div>
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ stats.total_backups || 0 }}
          </div>
          <div class="text-sm text-gray-500">Total Backups</div>
          <div class="text-xs text-gray-400 mt-1">
            {{ stats.total_size_formatted || "0 B" }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Backup Manual</h3>
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-4">
          Crea una copia de seguridad completa
        </p>
        <button
          @click="createBackup"
          :disabled="creatingBackup"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
        >
          {{ creatingBackup ? "Creando..." : "Crear Ahora" }}
        </button>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Programado</h3>
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
        </div>
        <p class="text-sm text-gray-600 mb-4">
          {{ schedules.filter((s) => s.enabled).length }} activos
        </p>
        <button
          @click="activeTab = 'schedules'"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Gestionar
        </button>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Restaurar</h3>
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-4">Desde backup existente</p>
        <button
          @click="showRestoreModal = true"
          :disabled="backups.length === 0"
          class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          Restaurar
        </button>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Estadísticas</h3>
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-4">Ver métricas detalladas</p>
        <button
          @click="loadStats"
          :disabled="loadingStats"
          class="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white rounded-lg transition-colors"
        >
          {{ loadingStats ? "Cargando..." : "Ver Stats" }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.count !== undefined"
              class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Backups List Tab -->
      <div v-if="activeTab === 'backups'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            Backups Disponibles
          </h2>
          <div class="flex items-center gap-3">
            <select
              v-model="backupFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos los tipos</option>
              <option value="manual">Manual</option>
              <option value="scheduled">Programado</option>
            </select>
            <button
              @click="loadBackups"
              :disabled="loading"
              class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg
                :class="[
                  'w-5 h-5 text-gray-600',
                  loading ? 'animate-spin' : '',
                ]"
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

        <div v-if="loading" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Cargando backups...</p>
        </div>

        <div v-else-if="filteredBackups.length === 0" class="text-center py-8">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay backups</h3>
          <p class="mt-1 text-sm text-gray-500">
            Crea tu primer backup para comenzar.
          </p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="backup in filteredBackups"
            :key="backup.filename"
            class="bg-gray-50 rounded-lg p-4 border hover:border-gray-300 transition-colors"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-medium text-gray-900 text-sm">
                  {{ backup.filename }}
                </h3>
                <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{{
                    backup.size_formatted || formatFileSize(backup.size)
                  }}</span>
                  <span>•</span>
                  <span>{{
                    backup.age || formatDateTime(backup.created_at)
                  }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="backup.status"
                  :class="getStatusColor(backup.status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ backup.status }}
                </span>
                <span
                  v-if="backup.type"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {{ backup.type }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500">
                <div v-if="backup.estimated_restore_time">
                  Restore: {{ backup.estimated_restore_time }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="restoreBackup(backup.filename)"
                  :disabled="restoring"
                  class="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs rounded transition-colors"
                >
                  Restaurar
                </button>
                <button
                  @click="confirmDeleteBackup(backup)"
                  class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedules Tab -->
      <div v-if="activeTab === 'schedules'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            Programación Automática
          </h2>
          <button
            @click="showCreateScheduleModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
          >
            Nueva Programación
          </button>
        </div>

        <div v-if="loadingSchedules" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Cargando programaciones...</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="schedule in schedules"
            :key="schedule.id"
            class="bg-gray-50 rounded-lg p-4 border"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-gray-900">
                  {{ schedule.schedule_name }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ schedule.cron_description }}
                </p>
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Próximo: {{ schedule.next_run_formatted }}</span>
                  <span v-if="schedule.last_run_formatted">•</span>
                  <span v-if="schedule.last_run_formatted"
                    >Último: {{ schedule.last_run_formatted }}</span
                  >
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="
                    schedule.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                  class="px-2 py-1 rounded-full text-xs"
                >
                  {{ schedule.enabled ? "Activo" : "Inactivo" }}
                </span>
                <button
                  @click="runScheduleNow(schedule.id)"
                  :disabled="runningSchedule"
                  class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded"
                >
                  Ejecutar
                </button>
                <button
                  @click="confirmDeleteSchedule(schedule)"
                  class="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4"
    >
      <div class="flex">
        <svg
          class="w-5 h-5 mr-2 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        {{ error }}
      </div>
    </div>

    <div
      v-if="successMessage"
      class="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4"
    >
      <div class="flex">
        <svg
          class="w-5 h-5 mr-2 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        {{ successMessage }}
      </div>
    </div>

    <!-- Modals -->
    <!-- Restore Modal -->
    <RestoreModal
      v-if="showRestoreModal"
      :backups="backups"
      :restoring="restoring"
      @close="showRestoreModal = false"
      @restore="handleRestore"
    />

    <!-- Create Schedule Modal -->
    <CreateScheduleModal
      v-if="showCreateScheduleModal"
      @close="showCreateScheduleModal = false"
      @created="handleScheduleCreated"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      :confirming="deleting"
      @close="showDeleteModal = false"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { backupAPI } from "../../services/api";

// Components
import RestoreModal from "../../components/backup/RestoreModal.vue";
import CreateScheduleModal from "../../components/backup/CreateScheduleModal.vue";
import ConfirmModal from "../../components/ConfirmModal.vue";

// State
const loading = ref(true);
const loadingSchedules = ref(false);
const loadingStats = ref(false);
const creatingBackup = ref(false);
const restoring = ref(false);
const deleting = ref(false);
const runningSchedule = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Data
const backups = ref<any[]>([]);
const schedules = ref<any[]>([]);
const stats = ref<any>({});

// UI State
const activeTab = ref("backups");
const backupFilter = ref("");
const showRestoreModal = ref(false);
const showCreateScheduleModal = ref(false);
const showDeleteModal = ref(false);
const deleteModalTitle = ref("");
const deleteModalMessage = ref("");
const itemToDelete = ref<any>(null);
const deleteType = ref<"backup" | "schedule">("backup");

// Computed
const filteredBackups = computed(() => {
  if (!backupFilter.value) return backups.value;
  return backups.value.filter((backup) => backup.type === backupFilter.value);
});

const tabs = computed(() => [
  { id: "backups", label: "Backups", count: backups.value.length },
  { id: "schedules", label: "Programación", count: schedules.value.length },
]);

// Functions
async function loadBackups() {
  try {
    loading.value = true;
    error.value = null;

    const response = await backupAPI.list();
    const responseData = response.data;

    if (
      responseData &&
      typeof responseData === "object" &&
      responseData !== null &&
      "data" in responseData &&
      responseData.data &&
      typeof responseData.data === "object" &&
      responseData.data !== null &&
      "backups" in responseData.data &&
      responseData.data.backups
    ) {
      backups.value = responseData.data.backups as any[];
    } else if (
      responseData &&
      typeof responseData === "object" &&
      "backups" in responseData &&
      responseData.backups
    ) {
      backups.value = responseData.backups as any[];
    } else if (Array.isArray(responseData)) {
      backups.value = responseData;
    } else {
      backups.value = [];
    }
  } catch (e: any) {
    console.error("Error loading backups:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cargando backups";
  } finally {
    loading.value = false;
  }
}

async function loadSchedules() {
  try {
    loadingSchedules.value = true;
    const response = await backupAPI.getSchedules();
    schedules.value = (response as any).data?.data?.schedules || [];
  } catch (e: any) {
    console.error("Error loading schedules:", e);
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Error cargando programaciones";
  } finally {
    loadingSchedules.value = false;
  }
}

async function loadStats() {
  try {
    loadingStats.value = true;
    const response = await backupAPI.getStats();
    stats.value = (response as any).data?.data || {};
  } catch (e: any) {
    console.error("Error loading stats:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cargando estadísticas";
  } finally {
    loadingStats.value = false;
  }
}

async function createBackup() {
  try {
    creatingBackup.value = true;
    error.value = null;
    successMessage.value = null;

    const response = await backupAPI.create();
    const backup = (response as any).data?.data || (response as any).data;

    successMessage.value = `Backup creado: ${backup.filename}`;
    setTimeout(() => (successMessage.value = null), 5000);

    await loadBackups();
    await loadStats();
  } catch (e: any) {
    console.error("Error creating backup:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error creando backup";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    creatingBackup.value = false;
  }
}

async function restoreBackup(filename: string) {
  try {
    restoring.value = true;
    error.value = null;
    successMessage.value = null;

    await backupAPI.restore(filename);

    successMessage.value = "Base de datos restaurada exitosamente";
    setTimeout(() => (successMessage.value = null), 5000);
    showRestoreModal.value = false;
  } catch (e: any) {
    console.error("Error restoring backup:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error restaurando backup";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    restoring.value = false;
  }
}

function handleRestore(filename: string) {
  restoreBackup(filename);
}

async function runScheduleNow(scheduleId: string) {
  try {
    runningSchedule.value = true;
    await backupAPI.runSchedule(scheduleId);
    successMessage.value = "Programación ejecutada en segundo plano";
    setTimeout(() => (successMessage.value = null), 3000);
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Error ejecutando programación";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    runningSchedule.value = false;
  }
}

function confirmDeleteBackup(backup: any) {
  itemToDelete.value = backup;
  deleteType.value = "backup";
  deleteModalTitle.value = "Eliminar Backup";
  deleteModalMessage.value = `¿Eliminar el backup ${backup.filename}? Esta acción no se puede deshacer.`;
  showDeleteModal.value = true;
}

function confirmDeleteSchedule(schedule: any) {
  itemToDelete.value = schedule;
  deleteType.value = "schedule";
  deleteModalTitle.value = "Eliminar Programación";
  deleteModalMessage.value = `¿Eliminar la programación "${schedule.schedule_name}"?`;
  showDeleteModal.value = true;
}

async function executeDelete() {
  try {
    deleting.value = true;

    if (deleteType.value === "backup") {
      await backupAPI.delete(itemToDelete.value.filename);
      successMessage.value = `Backup ${itemToDelete.value.filename} eliminado`;
      await loadBackups();
    } else {
      await backupAPI.deleteSchedule(itemToDelete.value.id);
      successMessage.value = `Programación "${itemToDelete.value.schedule_name}" eliminada`;
      await loadSchedules();
    }

    setTimeout(() => (successMessage.value = null), 3000);
    showDeleteModal.value = false;
  } catch (e: any) {
    error.value =
      e?.response?.data?.message || e?.message || "Error eliminando";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    deleting.value = false;
  }
}

async function handleScheduleCreated() {
  showCreateScheduleModal.value = false;
  await loadSchedules();
  successMessage.value = "Programación creada exitosamente";
  setTimeout(() => (successMessage.value = null), 3000);
}

// Utility functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

function getStatusColor(status: string) {
  const colors = {
    fresh: "bg-green-100 text-green-800",
    aging: "bg-yellow-100 text-yellow-800",
    old: "bg-orange-100 text-orange-800",
    corrupted: "bg-red-100 text-red-800",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
}

onMounted(async () => {
  await Promise.all([loadBackups(), loadSchedules(), loadStats()]);
});
</script>
