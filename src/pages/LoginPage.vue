<template>
  <div class="h-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Enhanced Left Side - Compacto -->
    <div
      class="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-8 text-white relative overflow-hidden"
    >
      <!-- Background with overlay -->
      <div 
        class="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-blue-700/90"
        :style="{
          backgroundImage: `url(${fondoUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-900/40"></div>
      
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white/3 rounded-full animate-pulse delay-1000"></div>
        <div class="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce delay-500"></div>
      </div>

      <div class="relative z-10 text-center max-w-md">
        <!-- Enhanced Logo - Más compacto -->
        <div class="mb-8 flex justify-center">
          <div class="relative">
            <div class="absolute inset-0 bg-white/20 rounded-2xl blur-xl transform scale-110"></div>
            <div class="relative bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
              <img
                v-if="!showFallback"
                :src="logoUrl"
                alt="NexaBase Logo"
                class="h-56 w-56 object-contain drop-shadow-2xl"
                @error="showFallback = true"
              />
              <svg
                v-else
                class="w-16 h-16 text-white drop-shadow-2xl"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Enhanced Brand Text - Más compacto -->
        <div class="space-y-4">
          <div>
            <h1 class="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              NexaBase Dashboard
            </h1>
            <p class="text-lg text-white/80">
              Professional BaaS Management
            </p>
          </div>

          <!-- Feature highlights - Más compacto -->
          <div class="space-y-2 mt-6">
            <div class="flex items-center justify-center space-x-3 text-white/70 text-sm">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time Database</span>
            </div>
            <div class="flex items-center justify-center space-x-3 text-white/70 text-sm">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>Advanced Authentication</span>
            </div>
            <div class="flex items-center justify-center space-x-3 text-white/70 text-sm">
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
              <span>API Management</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Footer - Más compacto -->
        <div class="mt-8 pt-6 border-t border-white/10">
          <p class="text-xs text-white/60">
            © 2025 NexaBase v2.0 • 
            <a 
              href="https://fabricadealgoritmos.site" 
              class="text-blue-300 hover:text-blue-200 underline transition-colors"
              target="_blank"
            >
              Fabrica de Algoritmos
            </a>
          </p>
        </div>
      </div>
    </div>

    <!-- Enhanced Right Side - Optimizado para no hacer scroll -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgb(148 163 184) 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>

      <div class="w-full max-w-md px-4 relative z-10">
        <!-- Enhanced Mobile Logo - Más compacto -->
        <div class="lg:hidden text-center mb-4">
          <div class="mb-3 flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 bg-indigo-500/20 rounded-xl blur-lg transform scale-110"></div>
              <div class="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <img
                  v-if="!showFallback"
                  :src="logoUrl"
                  alt="NexaBase Logo"
                  class="h-8 w-8 object-contain"
                  @error="showFallback = true"
                />
                <svg
                  v-else
                  class="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </div>
          <h1 class="text-lg font-bold text-gray-900">NexaBase Dashboard</h1>
        </div>

        <!-- Enhanced Welcome Section - Más compacto -->
        <div class="text-center mb-6">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Welcome to <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">NexaBase</span>
          </h1>
          <p class="text-gray-600">
            {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
          </p>
        </div>

        <!-- Enhanced Login Form Container - Optimizado -->
        <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
          
          <!-- Enhanced Toggle Login/Register -->
          <div class="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              type="button"
              @click="isLogin = true"
              :class="[
                'flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200',
                isLogin
                  ? 'bg-white text-indigo-600 shadow-md transform scale-[1.02]'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Sign In
            </button>
            <button
              type="button"
              @click="isLogin = false"
              :class="[
                'flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200',
                !isLogin
                  ? 'bg-white text-indigo-600 shadow-md transform scale-[1.02]'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Sign Up
            </button>
          </div>

          <!-- Enhanced Error Message -->
          <div
            v-if="authStore.error"
            class="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-4"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-red-800">{{ authStore.error }}</p>
            </div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Enhanced Register Fields - Compacto -->
            <div v-if="!isLogin" class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                <input
                  v-model="form.last_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <!-- Enhanced Email - Compacto -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                placeholder="admin@nexabase.com"
              />
            </div>

            <!-- Enhanced Password - Compacto -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  :minlength="isLogin ? 1 : 6"
                  class="w-full px-3 py-2 pr-10 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  :placeholder="isLogin ? 'Enter your password' : 'Min 6 characters'"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    v-if="!showPassword"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Enhanced Submit Button -->
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6"
            >
              <span
                v-if="authStore.loading"
                class="flex items-center justify-center"
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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

          <!-- Enhanced OAuth2 Buttons - Compacto -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-3 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3">
              <button
                @click="handleOAuthLogin('google')"
                :disabled="authStore.loading"
                class="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                @click="handleOAuthLogin('github')"
                :disabled="authStore.loading"
                class="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced Mobile Footer - Más compacto -->
        <div class="lg:hidden mt-4 text-center">
          <p class="text-xs text-gray-500">
            © 2025 NexaBase v2.0 • 
            <a 
              href="https://fabricadealgoritmos.site" 
              class="text-indigo-600 hover:text-indigo-500 underline"
              target="_blank"
            >
              Fabrica de Algoritmos
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Assets
const logoUrl = "/logo_peq.png";
const fondoUrl = "/fondo.png";

const authStore = useAuthStore();
const router = useRouter();

// State
const isLogin = ref(true);
const showPassword = ref(false);
const showFallback = ref(false);

const form = reactive({
  email: "",
  password: "",
  first_name: "",
  last_name: "",
});

// Functions
async function handleLogin() {
  authStore.clearError?.();

  try {
    const result = isLogin.value
      ? await authStore.login({ email: form.email, password: form.password })
      : await authStore.register({
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
        });

    if (result.success) {
      router.push("/");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
}

function handleOAuthLogin(provider: "google" | "github") {
  window.location.href = `${import.meta.env.VITE_API_URL}/oauth/${provider}`;
}
</script>

<style scoped>
/* Enhanced animations */
@keyframes moveBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-background {
  animation: moveBackground 20s ease-in-out infinite;
}

/* Gradient text */
.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}

/* Enhanced hover effects */
.hover\:-translate-y-0\.5:hover {
  transform: translateY(-2px);
}

/* Custom focus styles */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}

/* Enhanced button animations */
button {
  transform-origin: center;
}

button:active {
  transform: scale(0.98);
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(16px)) {
  .backdrop-blur-xl {
    backdrop-filter: blur(16px);
  }
}
</style>
