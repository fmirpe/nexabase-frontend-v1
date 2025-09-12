<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4"
  >
    <div class="text-center">
      <!-- 404 Icon -->
      <div class="mb-8">
        <svg
          class="mx-auto h-32 w-32 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m6 5H3a2 2 0 01-2-2V5a2 2 0 012-2h18a2 2 0 012 2v14a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <!-- Error Message -->
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">
          Página no encontrada
        </h2>
        <p class="text-gray-500 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver atrás
        </button>

        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Ir al Dashboard
        </router-link>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 text-center">
        <p class="text-sm text-gray-500 mb-4">
          ¿Necesitas ayuda? Contacta con nuestro equipo de soporte.
        </p>
        <div class="flex justify-center space-x-6 text-sm">
          <a
            href="#"
            class="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Documentación
          </a>
          <a
            href="#"
            class="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Soporte
          </a>
          <a
            href="#"
            class="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Estado del Sistema
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 text-center">
      <p class="text-xs text-gray-400">
        © 2025 NexaBase Dashboard - Desarrollado por La Fábrica de Algoritmos
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  // Si hay historial, volver atrás, sino ir al dashboard
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
}
</script>
