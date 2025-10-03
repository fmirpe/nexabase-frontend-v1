<!-- src/pages/OAuthCallback.vue - ARCHIVO NUEVO -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div v-if="loading" class="space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
          ></div>
          <h2 class="text-2xl font-bold text-gray-900">
            Completing authentication...
          </h2>
          <p class="text-gray-600">Please wait while we sign you in.</p>
        </div>

        <div v-else-if="error" class="space-y-4">
          <div class="text-red-600">
            <svg
              class="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            Authentication failed
          </h2>
          <p class="text-gray-600">{{ error }}</p>
          <button
            @click="goToLogin"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>

        <div v-else class="space-y-4">
          <div class="text-green-600">
            <svg
              class="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Success!</h2>
          <p class="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref<string | null>(null);

const goToLogin = () => {
  router.push("/login");
};

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const errorParam = urlParams.get("error");

    if (errorParam) {
      error.value = decodeURIComponent(errorParam);
      loading.value = false;
      return;
    }

    if (!token) {
      error.value = "No authentication token received";
      loading.value = false;
      return;
    }

    // Procesar el callback OAuth2
    const result = await authStore.handleOAuthCallback(token);

    if (result.success) {
      // Éxito - redirigir al dashboard después de un breve delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      error.value = result.error || "Authentication failed";
    }
  } catch (e: any) {
    error.value = e.message || "Unexpected error occurred";
  } finally {
    loading.value = false;
  }
});
</script>
