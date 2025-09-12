<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Configuración del Sistema
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Gestiona las configuraciones globales de nexaBase
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="initializeConfigs"
          :disabled="initializing"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            v-if="initializing"
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {{ initializing ? "Inicializando..." : "Inicializar Configs" }}
        </button>
      </div>
    </div>

    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4"
    >
      {{ error }}
    </div>

    <div v-if="loading" class="bg-white border border-gray-200 rounded-lg p-4">
      Cargando configuraciones...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="category in categories"
        :key="category"
        class="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 capitalize">
            {{ category }}
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div
            v-for="config in getConfigsByCategory(category)"
            :key="config.key"
            class="flex items-center justify-between"
          >
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">{{
                config.key
                  .replace(/\./g, " ")
                  .replace(/([A-Z])/g, " $1")
                  .trim()
              }}</label>
              <p v-if="config.description" class="text-xs text-gray-500 mt-1">
                {{ config.description }}
              </p>
            </div>
            <div class="ml-4">
              <input
                v-if="typeof config.value === 'boolean'"
                :checked="config.value"
                @change="updateConfig(config.key, $event.target.checked)"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <input
                v-else-if="typeof config.value === 'number'"
                :value="config.value"
                @blur="
                  updateConfig(config.key, parseInt($event.target.value) || 0)
                "
                type="number"
                class="px-3 py-2 border border-gray-300 rounded-lg w-32 text-sm"
              />
              <input
                v-else
                :value="config.value"
                @blur="updateConfig(config.key, $event.target.value)"
                type="text"
                class="px-3 py-2 border border-gray-300 rounded-lg w-48 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { configAPI } from "../../services/api";

const loading = ref(true);
const initializing = ref(false);
const error = ref<string | null>(null);
const configurations = ref<any[]>([]);

const categories = computed(() => {
  const cats = [...new Set(configurations.value.map((c) => c.category))];
  return cats.sort();
});

const getConfigsByCategory = (category: string) => {
  return configurations.value.filter((c) => c.category === category);
};

async function loadConfigurations() {
  try {
    loading.value = true;
    error.value = null;
    const { data } = await configAPI.getAll();
    configurations.value = data;
  } catch (e: any) {
    console.error("Error loading configurations:", e);
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Error cargando configuraciones";
  } finally {
    loading.value = false;
  }
}

async function updateConfig(key: string, value: any) {
  try {
    await configAPI.update(key, value);
    const config = configurations.value.find((c) => c.key === key);
    if (config) {
      config.value = value;
    }
  } catch (e: any) {
    console.error("Error updating configuration:", e);
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Error actualizando configuración";
  }
}

async function initializeConfigs() {
  try {
    initializing.value = true;
    error.value = null;
    await configAPI.initialize();
    await loadConfigurations();
  } catch (e: any) {
    console.error("Error initializing configurations:", e);
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Error inicializando configuraciones";
  } finally {
    initializing.value = false;
  }
}

onMounted(loadConfigurations);
</script>
