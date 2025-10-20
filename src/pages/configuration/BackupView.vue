<template>
  <div class="space-y-6 min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Backup & Restore</h1>
        <p class="mt-2 text-sm text-gray-600">
          Gestiona copias de seguridad de tu base de datos
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <button
          @click="createBackup"
          :disabled="creatingBackup"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            v-if="creatingBackup"
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
          <svg
            v-else
            class="w-5 h-5 mr-2"
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
          {{ creatingBackup ? "Creando..." : "Crear Backup" }}
        </button>
        <button
          @click="loadBackups"
          :disabled="loading"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          Crea una copia de seguridad completa de la base de datos
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
          <h3 class="text-lg font-semibold text-gray-900">Restaurar</h3>
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-4">
          Restaura la base de datos desde un backup
        </p>
        <button
          @click="showRestoreModal = true"
          :disabled="backups.length === 0"
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          Restaurar
        </button>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Limpieza</h3>
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-4">
          Elimina backups antiguos automáticamente
        </p>
        <button
          @click="cleanupBackups"
          :disabled="cleaning"
          class="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white rounded-lg transition-colors"
        >
          {{ cleaning ? "Limpiando..." : "Limpiar Antiguos" }}
        </button>
      </div>
    </div>

    <!-- Error/Success Messages -->
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

    <!-- Backups List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Backups Disponibles
          </h2>
          <span class="text-sm text-gray-500"
            >{{ backups.length }} backups</span
          >
        </div>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Cargando backups...</p>
      </div>

      <div v-else-if="backups.length === 0" class="p-8 text-center">
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

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="backup in backups"
          :key="backup.filename"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900">
                  {{ backup.filename }}
                </h3>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ formatFileSize(backup.size) }}</span>
                  <span>•</span>
                  <span>{{ formatDateTime(backup.created_at) }}</span>
                  <span
                    v-if="backup.type"
                    class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                  >
                    {{ backup.type }}
                  </span>
                  <span
                    v-if="backup.method"
                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {{ backup.method }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="restoreBackup(backup.filename)"
                :disabled="restoring"
                class="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm rounded-lg transition-colors"
              >
                {{ restoring ? "Restaurando..." : "Restaurar" }}
              </button>
              <button
                @click="confirmDeleteBackup(backup)"
                class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Restore Modal -->
    <div
      v-if="showRestoreModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showRestoreModal = false"
    >
      <div
        class="relative top-6 mx-auto p-5 w-full max-w-md shadow-lg rounded-md bg-white border"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Restaurar Base de Datos
        </h3>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Seleccionar backup:</label
          >
          <select
            v-model="selectedBackupFile"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seleccionar backup --</option>
            <option
              v-for="backup in backups"
              :key="backup.filename"
              :value="backup.filename"
            >
              {{ backup.filename }} ({{ formatFileSize(backup.size) }})
            </option>
          </select>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div class="flex">
            <svg
              class="w-5 h-5 text-yellow-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Esta acción reemplazará todos los
              datos actuales de la base de datos.
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="showRestoreModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmRestore"
            :disabled="!selectedBackupFile || restoring"
            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors"
          >
            {{ restoring ? "Restaurando..." : "Restaurar" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white border rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h4 class="text-lg font-semibold text-gray-900">Eliminar Backup</h4>
        <p class="text-sm text-gray-600 mt-2">
          ¿Estás seguro de que deseas eliminar el backup
          <strong>{{ backupToDelete?.filename }}</strong
          >? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3 mt-6">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            @click="deleteBackup"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded"
          >
            {{ deleting ? "Eliminando..." : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { backupAPI } from "../../services/api";

// State
const loading = ref(true);
const creatingBackup = ref(false);
const restoring = ref(false);
const cleaning = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Data
const backups = ref<any[]>([]);

// Modals
const showRestoreModal = ref(false);
const showDeleteModal = ref(false);
const selectedBackupFile = ref("");
const backupToDelete = ref<any>(null);

// ✅ FUNCTIONS CORREGIDAS

async function loadBackups() {
  try {
    loading.value = true;
    error.value = null;

    console.log('🔍 Frontend: Calling backup list API...');
    const response = await backupAPI.list();
    
    console.log('🔍 Frontend: Full response:', response);
    console.log('🔍 Frontend: response.data:', response.data);
    console.log('🔍 Frontend: response.data.data:', response.data?.data);

    // ✅ CORRECCIÓN: Acceso correcto a la estructura de respuesta
    const responseData = response.data;
    
    if (responseData?.data?.backups) {
      // Estructura: { success: true, data: { backups: [...] } }
      backups.value = responseData.data.backups;
    } else if (responseData?.backups) {
      // Estructura: { backups: [...] }
      backups.value = responseData.backups;
    } else if (Array.isArray(responseData)) {
      // Estructura: [...]
      backups.value = responseData;
    } else {
      backups.value = [];
    }
    
    console.log(`✅ Frontend: Loaded ${backups.value.length} backups`);
    console.log('🔍 Frontend: Final backups array:', backups.value);
  } catch (e: any) {
    console.error("Error loading backups:", e);
    error.value = e?.response?.data?.message || e?.message || "Error cargando backups";
  } finally {
    loading.value = false;
  }
}

async function createBackup() {
  try {
    creatingBackup.value = true;
    error.value = null;
    successMessage.value = null;

    console.log('🔍 Frontend: Creating backup...');
    const response = await backupAPI.create("manual");
    
    console.log('🔍 Frontend: Create backup response:', response);
    console.log('🔍 Frontend: Create backup response.data:', response.data);

    // ✅ CORRECCIÓN: El backend devuelve data directamente
    const backup = response.data;

    // ✅ CORRECCIÓN: Acceso correcto al filename
    successMessage.value = `Backup creado exitosamente: ${backup.filename}`;
    setTimeout(() => (successMessage.value = null), 5000);

    // ✅ RECARGAR LISTA
    await loadBackups();
  } catch (e: any) {
    console.error("Error creating backup:", e);
    error.value = e?.response?.data?.message || e?.message || "Error creando backup";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    creatingBackup.value = false;
  }
}

async function restoreBackup(filename: string) {
  if (
    !confirm(
      "¿Estás seguro de que deseas restaurar este backup? Se perderán todos los datos actuales."
    )
  ) {
    return;
  }

  try {
    restoring.value = true;
    error.value = null;
    successMessage.value = null;

    await backupAPI.restoreByFilename(filename);

    successMessage.value = "Base de datos restaurada exitosamente";
    setTimeout(() => (successMessage.value = null), 5000);

    showRestoreModal.value = false;
    selectedBackupFile.value = "";
  } catch (e: any) {
    console.error("Error restoring backup:", e);
    error.value = e?.response?.data?.message || e?.message || "Error restaurando backup";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    restoring.value = false;
  }
}

function confirmRestore() {
  if (selectedBackupFile.value) {
    restoreBackup(selectedBackupFile.value);
  }
}

function confirmDeleteBackup(backup: any) {
  backupToDelete.value = backup;
  showDeleteModal.value = true;
}

async function deleteBackup() {
  if (!backupToDelete.value) return;

  try {
    deleting.value = true;
    await backupAPI.delete(backupToDelete.value.filename);

    successMessage.value = `Backup ${backupToDelete.value.filename} eliminado`;
    setTimeout(() => (successMessage.value = null), 5000);

    showDeleteModal.value = false;
    backupToDelete.value = null;
    await loadBackups();
  } catch (e: any) {
    console.error("Error deleting backup:", e);
    error.value = e?.response?.data?.message || e?.message || "Error eliminando backup";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    deleting.value = false;
  }
}

async function cleanupBackups() {
  if (!confirm("¿Limpiar backups antiguos (más de 30 días)?")) return;

  try {
    cleaning.value = true;
    error.value = null;
    successMessage.value = null;

    const response = await backupAPI.cleanup(30);
    const data = response.data;

    successMessage.value = data.message || `Limpieza completada`;
    setTimeout(() => (successMessage.value = null), 5000);

    await loadBackups();
  } catch (e: any) {
    console.error("Error cleaning backups:", e);
    error.value = e?.response?.data?.message || e?.message || "Error limpiando backups";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    cleaning.value = false;
  }
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

onMounted(loadBackups);
</script>
