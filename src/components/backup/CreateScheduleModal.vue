<!-- components/backup/CreateScheduleModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    @click="$emit('close')"
  >
    <div
      class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900 flex items-center">
            <svg
              class="w-6 h-6 text-green-600 mr-2"
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
            Nueva Programación de Backup
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
      </div>

      <!-- Form -->
      <div class="px-6 py-4 space-y-6">
        <!-- Basic Info -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900">Información Básica</h4>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la programación *
            </label>
            <input
              v-model="form.schedule_name"
              type="text"
              placeholder="ej: Backup Diario Base de Datos"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Descripción de la programación..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>

        <!-- Schedule Type -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900">Frecuencia</h4>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="preset in schedulePresets"
              :key="preset.value"
              @click="selectPreset(preset)"
              :class="[
                'p-3 border rounded-lg text-sm font-medium transition-all',
                selectedPreset === preset.value
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400',
              ]"
            >
              <div class="text-center">
                <div class="font-semibold">{{ preset.name }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ preset.description }}
                </div>
              </div>
            </button>
          </div>

          <div v-if="selectedPreset === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Expresión Cron personalizada
            </label>
            <div class="flex gap-2">
              <input
                v-model="form.cron_expression"
                type="text"
                placeholder="0 2 * * *"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                @click="showCronHelper = !showCronHelper"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                Ayuda
              </button>
            </div>

            <div
              v-if="showCronHelper"
              class="mt-2 p-3 bg-blue-50 rounded-lg text-sm"
            >
              <div class="font-medium text-blue-800 mb-2">
                Formato Cron: minuto hora día mes día_semana
              </div>
              <div class="space-y-1 text-blue-700">
                <div><code>0 2 * * *</code> - Todos los días a las 2:00 AM</div>
                <div><code>0 0 * * 0</code> - Cada domingo a medianoche</div>
                <div><code>0 0 1 * *</code> - Primer día de cada mes</div>
                <div><code>*/30 * * * *</code> - Cada 30 minutos</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Options -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900">Opciones Avanzadas</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Retención (días)
              </label>
              <input
                v-model.number="form.retention_days"
                type="number"
                min="1"
                max="365"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                Backups automáticos más antiguos se eliminarán
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Max backups a mantener
              </label>
              <input
                v-model.number="form.max_backups"
                type="number"
                min="1"
                max="50"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                Límite máximo de backups por esta programación
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                v-model="form.enabled"
                type="checkbox"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700"
                >Activar programación inmediatamente</span
              >
            </label>

            <label class="flex items-center">
              <input
                v-model="form.compress"
                type="checkbox"
                class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span class="ml-2 text-sm text-gray-700">Comprimir backups</span>
            </label>
          </div>
        </div>

        <!-- Preview -->
        <div
          v-if="cronDescription"
          class="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-green-400 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm text-green-800">
              <strong>Programación:</strong> {{ cronDescription }}
              <div class="mt-1 text-green-700">
                Próximo backup: {{ nextRunTime }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl"
      >
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleCreate"
            :disabled="!canCreate || creating"
            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            <svg
              v-if="creating"
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
            {{ creating ? "Creando..." : "Crear Programación" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { backupAPI } from "../../services/api";

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const creating = ref(false);
const showCronHelper = ref(false);
const selectedPreset = ref("daily");

const form = ref({
  schedule_name: "",
  description: "",
  cron_expression: "0 2 * * *",
  retention_days: 30,
  max_backups: 10,
  enabled: true,
  compress: true,
});

const schedulePresets = [
  {
    value: "hourly",
    name: "Cada Hora",
    description: "Cada hora",
    cron: "0 * * * *",
  },
  { value: "daily", name: "Diario", description: "2:00 AM", cron: "0 2 * * *" },
  {
    value: "weekly",
    name: "Semanal",
    description: "Domingos 2:00 AM",
    cron: "0 2 * * 0",
  },
  {
    value: "monthly",
    name: "Mensual",
    description: "Día 1, 2:00 AM",
    cron: "0 2 1 * *",
  },
  {
    value: "custom",
    name: "Personalizado",
    description: "Cron personalizado",
    cron: "",
  },
];

const canCreate = computed(() => {
  return form.value.schedule_name.trim() && form.value.cron_expression.trim();
});

const cronDescription = computed(() => {
  const preset = schedulePresets.find(
    (p) => p.cron === form.value.cron_expression
  );
  if (preset) return preset.description;

  // Descripción básica para cron personalizado
  const parts = form.value.cron_expression.split(" ");
  if (parts.length === 5) {
    return `Programación personalizada: ${form.value.cron_expression}`;
  }
  return "Expresión cron inválida";
});

const nextRunTime = computed(() => {
  // Calculación básica del próximo tiempo de ejecución
  // En producción podrías usar una librería como cron-parser
  return "Calculando...";
});

function selectPreset(preset: any) {
  selectedPreset.value = preset.value;
  if (preset.cron) {
    form.value.cron_expression = preset.cron;
  }
}

async function handleCreate() {
  try {
    creating.value = true;

    await backupAPI.createSchedule({
      schedule_name: form.value.schedule_name,
      description: form.value.description,
      cron_expression: form.value.cron_expression,
      retention_days: form.value.retention_days,
      max_backups: form.value.max_backups,
      enabled: form.value.enabled,
      options: {
        compress: form.value.compress,
      },
    });

    emit("created");
  } catch (error: any) {
    console.error("Error creating schedule:", error);
    // El error se maneja en el componente padre
  } finally {
    creating.value = false;
  }
}
</script>
