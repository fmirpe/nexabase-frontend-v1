<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Left Side - Logo and Branding -->
    <div
      class="hidden lg:flex lg:w-1/2 animated-background flex-col justify-center items-center p-12 text-white"
      :style="{ backgroundImage: `url(${fondoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
    >
      <div class="text-center">
        <!-- Logo -->
        <div class="mb-8 flex justify-center">
          <img
            :src="logoUrl"
            alt="NexaBase Logo"
            class="h-74 w-124 object-contain drop-shadow-2xl"
            @error="showFallback = true"
            v-if="!showFallback"
          />
          <svg
            v-else
            class="w-64 h-64 text-white drop-shadow-2xl"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <!-- Brand Text -->
        <h1 class="text-4xl font-bold mb-4">NexaBase Dashboard</h1>
        <p class="text-xl text-blue-100 mb-12">Professional BaaS Management</p>

        <!-- Footer -->
        <p class="text-sm text-blue-200">
          © 2025 NexaBase Dashboard v1. Powered by Vue.js & TypeScript
        </p>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50"
    >
      <div class="w-full max-w-md">
        <!-- Mobile Logo (only visible on small screens) -->
        <div class="lg:hidden text-center mb-8">
          <div class="mb-6 flex justify-center">
            <img
              :src="logoUrl"
              alt="NexaBase Logo"
              class="h-24 w-24 object-contain drop-shadow-lg"
              @error="showFallback = true"
              v-if="!showFallback"
            />
            <svg
              v-else
              class="w-24 h-24 text-blue-600 drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">NexaBase Dashboard</h1>
          <p class="text-gray-600 mt-2">Professional BaaS Management</p>
        </div>

        <!-- Title -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900"><span class="text-blue-600">NexaBase</span> v1</h1>
          <p class="text-xl text-gray-600 mt-2">Welcome back</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Toggle Login/Register -->
            <div class="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                type="button"
                @click="isLogin = true"
                :class="[
                  'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                  isLogin
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Sign In
              </button>
              <button
                type="button"
                @click="isLogin = false"
                :class="[
                  'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                  !isLogin
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Sign Up
              </button>
            </div>

            <!-- Error Message -->
            <div
              v-if="authStore.error"
              class="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div class="flex">
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ authStore.error }}</p>
                </div>
              </div>
            </div>

            <!-- Register Fields -->
            <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >First Name</label
                >
                <input
                  v-model="form.first_name"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Last Name</label
                >
                <input
                  v-model="form.last_name"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Email Address</label
              >
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="admin@nexabase.com"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Password</label
              >
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  :minlength="isLogin ? 1 : 6"
                  class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  :placeholder="
                    isLogin ? 'Enter your password' : 'Minimum 6 characters'
                  "
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    v-if="!showPassword"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="!isLogin" class="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span
                v-if="authStore.loading"
                class="flex items-center justify-center"
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                {{ isLogin ? "Signing In..." : "Creating Account..." }}
              </span>
              <span v-else>
                {{ isLogin ? "Sign In" : "Create Account" }}
              </span>
            </button>
          </form>
        </div>

        <!-- Mobile Footer (only visible on small screens) -->
        <div class="lg:hidden mt-8 text-center">
          <p class="text-sm text-gray-500">
            © 2025 NexaBase Dashboard v1. Built with Vue.js & TypeScript
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router"; // ✅ Agregar router
import { useAuthStore } from "../stores/auth";

// Usamos el logo desde public
const logoUrl = "/logo.png";
const fondoUrl = "/fondo.png";

const authStore = useAuthStore();
const router = useRouter(); // ✅ Agregar router

// State
const isLogin = ref(true);
const showPassword = ref(false);
const showFallback = ref(false);

const form = reactive({
  email: "", // ✅ Valores por defecto para testing
  password: "",
  first_name: "",
  last_name: "",
});

async function handleLogin() {
  authStore.clearError?.();

  try {
    // ✅ Usar la respuesta del store actualizado
    const result = isLogin.value
      ? await authStore.login({ email: form.email, password: form.password })
      : await authStore.register({
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
        });

    // ✅ Verificar si fue exitoso y redirigir
    if (result.success) {
      router.push("/"); // Redirigir al dashboard
    }
    // Si no fue exitoso, el error ya se muestra automáticamente desde el store
  } catch (error) {
    console.error("Login error:", error);
  }
}
</script>

<style scoped>
.animated-background {
  animation: moveBackground 20s ease-in-out infinite;
}

@keyframes moveBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
