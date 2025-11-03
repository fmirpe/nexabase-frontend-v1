<!-- views/ApiView.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Page Header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              API & Integración
            </h1>
            <p class="text-gray-600">
              Gestiona tu endpoint personalizado, API keys y documentación
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-sm text-gray-500">Estado de la API</p>
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                ></div>
                <span class="text-sm font-semibold text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Information Card -->
      <ApiInformation />

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link
          to="/api-keys"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-7 h-7 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">API Keys</h3>
              <p class="text-sm text-gray-600">Gestionar llaves de acceso</p>
            </div>
          </div>
        </router-link>

        <a
          :href="`${apiUrl}/docs`"
          target="_blank"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-7 h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Documentación</h3>
              <p class="text-sm text-gray-600">Swagger UI interactivo</p>
            </div>
          </div>
        </a>

        <router-link
          to="/collections"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-7 h-7 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Collections</h3>
              <p class="text-sm text-gray-600">Gestionar tus datos</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import ApiInformation from "@/components/ApiInformation.vue";

const authStore = useAuthStore();
const organization = computed(() => authStore.user?.organization);
const apiUrl = computed(() =>
  organization.value?.subdomain
    ? `https://${organization.value.subdomain}.api.nexabase.online`
    : "https://api.nexabase.online"
);
</script>
