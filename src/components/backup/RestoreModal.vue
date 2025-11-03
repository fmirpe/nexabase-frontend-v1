<!-- components/backup/RestoreModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    @click="$emit('close')"
  >
    <div
      class="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900 flex items-center">
          <svg
            class="w-6 h-6 text-purple-600 mr-2"
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
          Restaurar Base de Datos
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
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

      <!-- Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar backup:
          </label>
          <select
            v-model="selectedBackup"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">-- Seleccionar backup --</option>
            <option
              v-for="backup in backups"
              :key="backup.filename"
              :value="backup.filename"
            >
              {{ backup.filename }}
              <span class="text-gray-500">
                ({{ backup.size_formatted || formatFileSize(backup.size) }} -
                {{ backup.age || formatDateTime(backup.created_at) }})
              </span>
            </option>
          </select>
        </div>

        <!-- Options -->
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              v-model="options.dryRun"
              type="checkbox"
              class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span class="ml-2 text-sm text-gray-700"
              >Simulación (dry run) - Solo validar el backup</span
            >
          </label>

          <label class="flex items-center">
            <input
              v-model="options.createBackupBefore"
              type="checkbox"
              class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span class="ml-2 text-sm text-gray-700"
              >Crear backup automático antes de restaurar</span
            >
          </label>
        </div>

        <!-- Warning -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div class="flex">
            <svg
              class="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm text-amber-800">
              <strong>⚠️ Advertencia:</strong>
              <span v-if="!options.dryRun">
                Esta acción reemplazará <strong>TODOS</strong> los datos
                actuales de la base de datos. Asegúrate de haber creado un
                backup antes de continuar.
              </span>
              <span v-else>
                El modo simulación solo verificará que el backup sea válido sin
                hacer cambios.
              </span>
            </div>
          </div>
        </div>

        <!-- Confirmation Input -->
        <div v-if="!options.dryRun">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Para confirmar, escribe <strong>"RESTAURAR"</strong>:
          </label>
          <input
            v-model="confirmationText"
            type="text"
            placeholder="Escribe RESTAURAR para confirmar"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="handleRestore"
          :disabled="!canRestore || restoring"
          class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          <svg
            v-if="restoring"
            class="w-4 h-4 mr-2 animate-spin"
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
          {{
            restoring
              ? "Procesando..."
              : options.dryRun
              ? "Validar Backup"
              : "Restaurar"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  backups: any[];
  restoring: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  restore: [filename: string, options: any];
}>();

const selectedBackup = ref("");
const confirmationText = ref("");
const options = ref({
  dryRun: false,
  createBackupBefore: true,
});

const canRestore = computed(() => {
  if (!selectedBackup.value) return false;
  if (options.value.dryRun) return true;
  return confirmationText.value.toUpperCase() === "RESTAURAR";
});

function handleRestore() {
  if (!canRestore.value) return;

  emit("restore", selectedBackup.value, {
    confirm: !options.value.dryRun,
    dry_run: options.value.dryRun,
    create_backup_before: options.value.createBackupBefore,
  });
}

// Utility functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
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
</script>
