<!-- src/pages/OAuthCallback.vue - TU CÓDIGO ORIGINAL (PERFECTO) -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div v-if="loading" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 class="text-2xl font-bold text-gray-900">Completing authentication...</h2>
          <p class="text-gray-600">Please wait while we sign you in.</p>
        </div>

        <div v-else-if="error" class="space-y-4">
          <div class="text-red-600">
            <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Authentication failed</h2>
          <p class="text-gray-600">{{ error }}</p>
          <button @click="goToLogin" 
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Try again
          </button>
        </div>

        <div v-else class="space-y-4">
          <div class="text-green-600">
            <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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

// ✅ TUS INTERFACES ORIGINALES
interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  tenantId?: string | null;
  exp: number;
  iat: number;
}

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref<string | undefined>(undefined);

const goToLogin = (): void => {
  router.push("/login");
};

onMounted(async (): Promise<void> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      error.value = "No authentication token received";
      loading.value = false;
      return;
    }

    // ✅ TU DECODIFICACIÓN ORIGINAL - PERFECTA
    const tokenPayload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    
    // ✅ TU ACTUALIZACIÓN DE TOKENS - PERFECTA
    authStore.tokens = { 
      access_token: token, 
      token_type: "Bearer" 
    };
    localStorage.setItem('nexa_tokens', JSON.stringify(authStore.tokens));
    
    // ✅ TU ACTUALIZACIÓN DE USER - PERFECTA
    authStore.user = {
      id: tokenPayload.sub,
      email: tokenPayload.email,
      first_name: '',
      last_name: '',
      role: tokenPayload.role as "user" | "admin" | "developer",
      tenantId: tokenPayload.tenantId || undefined,
      status: 'active',
      is_active: true,
      created_at: new Date().toISOString(),
      avatar_url: undefined,
      last_login_at: undefined,
    };
    localStorage.setItem('nexa_user', JSON.stringify(authStore.user));

    loading.value = false;
    
    // ✅ TU REDIRECCIÓN ORIGINAL - PERFECTA
    if (tokenPayload.tenantId) {
      await router.replace("/");
    } else {
      await router.replace("/create-organization");
    }
  } catch (e: any) {
    console.error('OAuth callback error:', e);
    error.value = e.message || "Authentication failed";
    loading.value = false;
  }
});
</script>
