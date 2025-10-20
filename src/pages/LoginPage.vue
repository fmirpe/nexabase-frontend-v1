<template>
  <div class="h-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- FONDO DINÁMICO ESTILO COMET (DÍA/NOCHE) + TU CONTENIDO ORIGINAL -->
    <div
      class="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-8 text-white relative overflow-hidden"
      :style="dynamicBackground"
    >
      <!-- Efectos atmosféricos dinámicos -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Estrellas de noche -->
        <div v-if="isNightTime" class="absolute inset-0">
          <div v-for="star in stars" :key="star.id" 
              class="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              :style="{
                left: star.x + '%',
                top: star.y + '%',
                opacity: star.opacity,
                animationDelay: star.delay + 's'
              }">
          </div>
        </div>
        
        <!-- Nubes suaves para día -->
        <div v-if="!isNightTime" class="absolute inset-0">
          <div class="absolute top-20 left-10 w-32 h-16 bg-white/5 rounded-full blur-xl animate-float"></div>
          <div class="absolute top-32 right-16 w-24 h-12 bg-white/3 rounded-full blur-lg animate-float-delay"></div>
        </div>
        
        <!-- Overlay de brillo según hora -->
        <div class="absolute inset-0" :style="timeOverlay"></div>
      </div>

      <!-- Icono clima dinámico arriba-derecha -->
      <div class="absolute top-6 right-6 z-20">
        <svg class="w-10 h-10 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <use :xlink:href="`#${weatherIcon}`" />
        </svg>
      </div>

      <!-- Cabecera clima estilo Comet -->
      <div class="absolute top-6 left-6 z-20 text-left">
        <div class="text-3xl font-semibold tracking-tight text-white/95">
          {{ weather.temp ?? '28' }}° C
        </div>
        <div class="mt-1 text-base leading-5 text-white/80">
          <div>{{ weather.desc ?? 'Parcialmente' }}</div>
          <div>{{ weather.desc2 ?? 'nublado' }}</div>
        </div>
      </div>

      <!-- Ciudad abajo-izquierda -->
      <div class="absolute bottom-6 left-6 z-20">
        <div class="text-xl font-semibold text-white/95">
          {{ weather.city ?? 'Barranquilla, Colombia' }}
        </div>
      </div>

      <!-- Tu contenido original centrado (logo, textos, etc.) -->
      <div class="relative z-10 text-center max-w-md">
        <!-- Enhanced Logo -->
        <div class="mb-8 flex justify-center">
          <div class="relative">
            <div class="absolute inset-0 bg-white/20 rounded-2xl blur-xl transform scale-110"></div>
            <div class="relative bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
              <img
                v-if="!showFallback"
                :src="logoUrl"
                alt="NexaBase Logo"
                class="h-32 w-32 object-contain drop-shadow-2xl"
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

        <!-- Enhanced Brand Text -->
        <div class="space-y-4">
          <div>
            <h1 class="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              NexaBase Dashboard
            </h1>
            <p class="text-lg text-white/80">
              Professional BaaS Management
            </p>
          </div>

          <!-- Feature highlights -->
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

        <!-- Enhanced Footer -->
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

      <!-- SVG icons para diferentes condiciones climáticas -->
      <svg style="display:none;">
        <symbol id="sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" fill="currentColor"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
        </symbol>
        <symbol id="moon" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
        </symbol>
        <symbol id="cloud-sun" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
        </symbol>
        <symbol id="cloud" viewBox="0 0 24 24">
          <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" fill="currentColor"/>
        </symbol>
        <symbol id="rain" viewBox="0 0 24 24">
          <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" fill="currentColor"/>
          <polyline points="8,19 10,21" stroke="currentColor" stroke-width="2"/>
          <polyline points="12,19 14,21" stroke="currentColor" stroke-width="2"/>
          <polyline points="16,19 18,21" stroke="currentColor" stroke-width="2"/>
        </symbol>
      </svg>
    </div>


    <!-- Enhanced Right Side - Login premium intacto -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgb(148 163 184) 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>

      <div class="w-full max-w-md px-4 relative z-10">
        <!-- Enhanced Mobile Logo -->
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

        <!-- Enhanced Welcome Section -->
        <div class="text-center mb-6">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Welcome to <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">NexaBase</span>
          </h1>
          <p class="text-gray-600">
            {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
          </p>
        </div>

        <!-- Enhanced Login Form Container -->
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
            <!-- Enhanced Register Fields -->
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

            <!-- Enhanced Email -->
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

            <!-- Enhanced Password -->
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

          <!-- Enhanced OAuth2 Buttons -->
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

        <!-- Enhanced Mobile Footer -->
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
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Assets
const logoUrl = "/logo_peq.png";
const fondoUrl = "/fondo.png";

const authStore = useAuthStore();
const router = useRouter();

// Estado dinámico para efectos día/noche
const currentHour = ref(new Date().getHours());
const isNightTime = computed(() => currentHour.value >= 19 || currentHour.value <= 6);


// Fondo dinámico según hora
const dynamicBackground = computed(() => {
  if (isNightTime.value) {
    // Noche: gradiente oscuro con tonos azul/púrpura
    return {
      background: 'radial-gradient(100% 100% at 50% 0%, #1a1d29 0%, #2d3142 45%, #4f5d75 100%)'
    };
  } else {
    // Día: gradiente más claro con tonos cálidos
    return {
      background: 'radial-gradient(100% 100% at 50% 0%, #4a90e2 0%, #7cb9e8 45%, #b8d4f0 100%)'
    };
  }
});

// Overlay de brillo según hora del día
const timeOverlay = computed(() => {
  if (isNightTime.value) {
    return {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 60%)'
    };
  } else {
    return {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 80%)'
    };
  }
});

// Icono climático según hora y condición
const weatherIcon = computed(() => {
  if (isNightTime.value) {
    // Noche: luna o nubes nocturnas
    return weather.value.desc === 'Despejado' ? 'moon' : 'cloud';
  } else {
    // Día: sol o variaciones diurnas
    if (weather.value.desc === 'Despejado') return 'sun';
    if (weather.value.desc === 'Parcialmente') return 'cloud-sun';
    if (weather.value.desc?.includes('lluvia')) return 'rain';
    return 'cloud';
  }
});


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

// Weather state para widget Comet
const weather = ref<{temp:number|null, city:string|null, desc:string|null, desc2:string|null}>({
  temp: null,
  city: null,
  desc: null,
  desc2: null
});

// Generar estrellas aleatorias para la noche
const stars = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  opacity: 0.3 + Math.random() * 0.7,
  delay: Math.random() * 3
})));

function mapWeather(code:number){
  // Mapea a 2 líneas como Comet
  const map:any = {
    0:['Despejado',''],
    1:['Despejado',''],
    2:['Parcialmente','nublado'],
    3:['Nublado',''],
    45:['Niebla',''],
    51:['Llovizna','ligera'],
    53:['Llovizna',''],
    55:['Llovizna','intensa'],
    61:['Lluvia','ligera'],
    63:['Lluvia',''],
    65:['Lluvia','intensa'],
    80:['Chubascos',''],
    95:['Tormenta',''],
  };
  return map[code] ?? ['Parcialmente','nublado'];
}

async function loadCometWidget() {
  try {
    const locRes = await fetch('https://ipapi.co/json/');
    const loc = await locRes.json();
    weather.value.city = `${loc.city}, ${loc.country_name}`;

    const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`);
    const wx = await wxRes.json();
    weather.value.temp = Math.round(wx.current_weather.temperature);
    const [l1,l2] = mapWeather(wx.current_weather.weathercode);
    weather.value.desc = l1;
    weather.value.desc2 = l2;
  } catch {
    weather.value.city = 'Barranquilla, Colombia';
    weather.value.temp = 28;
    [weather.value.desc, weather.value.desc2] = ['Parcialmente','nublado'];
  }
}

onMounted(() => {
  loadCometWidget();
  // Actualizar hora cada minuto para cambios dinámicos
  setInterval(() => {
    currentHour.value = new Date().getHours();
  }, 60000);
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

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-10px) translateX(5px); }
}

@keyframes float-delay {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-8px) translateX(-3px); }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delay {
  animation: float-delay 10s ease-in-out infinite 2s;
}
</style>
