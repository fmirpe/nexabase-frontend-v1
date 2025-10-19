<template>
  <div class="space-y-8 min-h-screen bg-gray-50 p-6">
    <!-- Header Mejorado -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">API Keys</h1>
            <p class="mt-1 text-lg text-gray-600">Gestiona las claves de acceso a tu API</p>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Acceso seguro a la API
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Control de permisos granular
              </span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 lg:mt-0 flex items-center space-x-3">
          <button
            @click="loadStats"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Estadísticas
          </button>
          
          <button
            @click="refreshApiKeys"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
          >
            <svg :class="['w-5 h-5', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="ml-2 hidden sm:inline">Actualizar</span>
          </button>
          
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva API Key
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards Mejoradas -->
    <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Keys</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +{{ stats.created_this_month || 0 }} este mes
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Activas</p>
            <p class="text-3xl font-bold text-green-700 mt-2">{{ stats.active }}</p>
            <div class="flex items-center mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(stats.active / stats.total) * 100}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 ml-2">{{ Math.round((stats.active / stats.total) * 100) }}%</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Expiradas</p>
            <p class="text-3xl font-bold text-orange-600 mt-2">{{ stats.expired }}</p>
            <div class="flex items-center mt-2">
              <span v-if="stats.expiring_soon > 0" class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                {{ stats.expiring_soon }} por expirar
              </span>
              <span v-else class="text-xs text-gray-500">Todas al día</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Uso Total</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ formatNumber(stats.total_usage) }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-gray-500">
                {{ formatNumber(stats.usage_this_month || 0) }} este mes
              </span>
              <svg class="w-3 h-3 ml-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas Mejoradas -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800 font-medium">{{ error }}</p>
      </div>
    </div>

    <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-green-800 font-medium">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Loading Mejorado -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Cargando API Keys</h3>
        <p class="text-gray-600">Obteniendo la información más reciente...</p>
      </div>
    </div>

    <!-- API Keys List Mejorada -->
    <div v-else-if="apiKeys.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">
            API Keys Activas ({{ apiKeys.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Ordenar por:</span>
            <select class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500">
              <option>Fecha de creación</option>
              <option>Último uso</option>
              <option>Más usadas</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="divide-y divide-gray-100">
        <div
          v-for="apiKey in apiKeys"
          :key="apiKey.id"
          class="p-6 hover:bg-gray-50 transition-colors duration-200 group"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4 flex-1">
              <!-- Status Icon Mejorado -->
              <div class="flex-shrink-0 relative">
                <div
                  :class="[
                    'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105',
                    apiKey.is_active 
                      ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30' 
                      : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  ]"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div v-if="isExpired(apiKey)" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <!-- Header con badges -->
                <div class="flex items-center flex-wrap gap-2 mb-2">
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ apiKey.name }}
                  </h3>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                      apiKey.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    <div :class="['w-2 h-2 rounded-full mr-1.5', apiKey.is_active ? 'bg-green-500' : 'bg-gray-500']"></div>
                    {{ apiKey.is_active ? "Activa" : "Inactiva" }}
                  </span>
                  <span v-if="isExpired(apiKey)" class="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Expirada
                  </span>
                  <span v-if="apiKey.rate_limit && apiKey.rate_limit !== 'unlimited'" class="inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {{ apiKey.rate_limit }}
                  </span>
                </div>

                <p v-if="apiKey.description" class="text-gray-600 mb-3 text-sm leading-relaxed">
                  {{ apiKey.description }}
                </p>

                <!-- Estadísticas mejoradas -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <div class="text-lg font-bold text-gray-900">{{ formatDate(apiKey.created_at) }}</div>
                    <div class="text-xs text-gray-500">Creada</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <div class="text-lg font-bold text-gray-900">
                      {{ apiKey.last_used_at ? formatRelativeTime(apiKey.last_used_at) : 'Nunca' }}
                    </div>
                    <div class="text-xs text-gray-500">Último uso</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <div class="text-lg font-bold text-blue-600">{{ formatNumber(apiKey.usage_count) }}</div>
                    <div class="text-xs text-gray-500">Usos totales</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <div class="text-lg font-bold text-gray-900">
                      {{ apiKey.expires_at ? formatDate(apiKey.expires_at) : 'Sin límite' }}
                    </div>
                    <div class="text-xs text-gray-500">Expira</div>
                  </div>
                </div>

                <!-- API Key Display Mejorado -->
                <div class="bg-gray-900 rounded-2xl p-4 mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-400 text-sm font-mono">API Key</span>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="toggleKeyVisibility(apiKey.id)"
                        class="text-gray-400 hover:text-white transition-colors p-1"
                      >
                        <svg v-if="visibleKeys.has(apiKey.id)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878A3 3 0 1012 6l4.242 4.242M12 6c-4.478 0-8.268 2.943-9.543 7a10.025 10.025 0 001.563 3.029m5.858.908a3 3 0 114.243 4.243" />
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        @click="copyToClipboard(apiKey.key)"
                        class="text-gray-400 hover:text-white transition-colors p-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="font-mono text-green-400 text-sm break-all">
                    <span v-if="visibleKeys.has(apiKey.id)">{{ apiKey.key }}</span>
                    <span v-else>{{ "•".repeat(32) }}<span class="text-gray-500">{{ apiKey.key.slice(-8) }}</span></span>
                  </div>
                </div>

                <!-- Permissions mejorados -->
                <div v-if="apiKey.permissions && apiKey.permissions.length > 0" class="mb-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Permisos</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="permission in apiKey.permissions"
                      :key="permission"
                      class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.99-2A9 9 0 1121 12a9 9 0 01-.01 0z" />
                      </svg>
                      {{ permission }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions mejoradas -->
            <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click="openEditModal(apiKey)"
                class="inline-flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              
              <button
                @click="toggleApiKeyStatus(apiKey)"
                :disabled="actionLoading"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                :class="apiKey.is_active
                  ? 'bg-red-50 hover:bg-red-100 text-red-700'
                  : 'bg-green-50 hover:bg-green-100 text-green-700'"
              >
                <svg v-if="apiKey.is_active" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14L5 9m0 0l5-5m-5 5h10a4 4 0 110 8h-10z" />
                </svg>
                <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l5 5m0 0l-5 5m5-5H10a4 4 0 110-8h14z" />
                </svg>
                {{ apiKey.is_active ? "Desactivar" : "Activar" }}
              </button>
              
              <button
                @click="regenerateApiKey(apiKey)"
                :disabled="actionLoading"
                class="inline-flex items-center px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerar
              </button>
              
              <button
                @click="confirmDeleteApiKey(apiKey)"
                class="inline-flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State Mejorado -->
    <div v-else class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay API Keys</h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Crea tu primera API Key para comenzar a usar la API de Nexabase. Podrás controlar permisos y monitorear el uso.
      </p>
      <button
        @click="openCreateModal"
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Crear Primera API Key
      </button>
    </div>

    <!-- Create/Edit Modal Mejorado -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-8 pb-8"
      @click="closeModal"
    >
      <div
        class="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        @click.stop
      >
        <!-- Modal Header - VISIBLE Y FIJO -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white">
                {{ isEditing ? "Editar API Key" : "Nueva API Key" }}
              </h3>
              <p class="text-blue-100 mt-1">
                {{ isEditing ? "Modifica la configuración de tu API Key" : "Configura los permisos y límites de acceso" }}
              </p>
            </div>
            <!-- Botón de cerrar en header -->
            <button
              @click="closeModal"
              class="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content con Scroll -->
        <div class="max-h-[70vh] overflow-y-auto">
          <div class="p-8">
            <!-- Error Alert -->
            <div
              v-if="formError"
              class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-800 font-medium">{{ formError }}</p>
              </div>
            </div>

            <form @submit.prevent="saveApiKeyWithValidation" class="space-y-8">
              <!-- Información Básica -->
              <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div class="flex items-center mb-4">
                  <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 class="text-lg font-bold text-gray-900">Información Básica</h4>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la API Key *
                    </label>
                    <input
                      v-model="apiKeyForm.name"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      placeholder="Mi API Key de Producción"
                    />
                    <p class="text-xs text-gray-500 mt-1">Mínimo 3 caracteres, descriptivo</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Límite de Velocidad
                    </label>
                    <select
                      v-model="apiKeyForm.rate_limit"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="unlimited">🚀 Sin límite</option>
                      <option value="100/hour">⏱️ 100 por hora</option>
                      <option value="1000/hour">⚡ 1000 por hora</option>
                      <option value="100/day">📅 100 por día</option>
                      <option value="1000/day">📈 1000 por día</option>
                    </select>
                  </div>
                </div>
                
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    v-model="apiKeyForm.description"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white"
                    placeholder="Describe para qué se usará esta API Key..."
                  ></textarea>
                </div>
              </div>

              <!-- Permisos -->
              <div class="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
                <div class="flex items-center mb-4">
                  <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">Permisos de Acceso</h4>
                    <p class="text-sm text-gray-600">Selecciona los permisos que tendrá esta API Key</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    v-for="permission in availablePermissions"
                    :key="permission"
                    class="flex items-start p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  >
                    <input
                      type="checkbox"
                      :value="permission"
                      v-model="apiKeyForm.permissions"
                      class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div class="ml-3 min-w-0">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getPermissionIcon(permission)" />
                        </svg>
                        <span class="text-sm font-medium text-gray-900">{{ permission }}</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">{{ getPermissionDescription(permission) }}</p>
                    </div>
                  </label>
                </div>
                
                <!-- Preview de permisos seleccionados -->
                <div v-if="apiKeyForm.permissions.length > 0" class="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h5 class="text-sm font-medium text-purple-900 mb-2">Permisos seleccionados ({{ apiKeyForm.permissions.length }}):</h5>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="permission in apiKeyForm.permissions"
                      :key="permission"
                      class="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                    >
                      {{ permission }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Expiración -->
              <div class="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-2xl p-6 border border-gray-200">
                <div class="flex items-center mb-4">
                  <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">Configuración de Expiración</h4>
                    <p class="text-sm text-gray-600">Establece cuándo expirará esta API Key</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Expiración (opcional)
                    </label>
                    <input
                      v-model="apiKeyForm.expires_at"
                      type="datetime-local"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    />
                    <p class="text-xs text-gray-500 mt-1">Deja vacío para que no expire nunca</p>
                  </div>
                  
                  <div class="flex items-center justify-center">
                    <div class="bg-white rounded-xl p-4 border border-gray-200 text-center">
                      <svg class="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-sm font-medium text-gray-900">Sin expiración</p>
                      <p class="text-xs text-gray-500">Recomendado para producción</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal Footer - FIJO -->
        <div class="bg-white px-8 py-6 border-t border-gray-200">
          <div class="flex gap-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="saveApiKeyWithValidation"
              :disabled="saving"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <span v-if="saving" class="flex items-center">
                <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
              <span v-else class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isEditing ? "Actualizar API Key" : "Crear API Key" }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal Mejorado -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200"
        @click.stop
      >
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">Eliminar API Key</h4>
          <p class="text-gray-600 mb-2">
            ¿Estás seguro de que deseas eliminar la API Key
          </p>
          <p class="font-semibold text-gray-900 mb-6">
            "{{ apiKeyToDelete?.name }}"?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p class="text-red-800 text-sm">
              ⚠️ Esta acción no se puede deshacer. Todas las aplicaciones que usen esta API Key dejarán de funcionar inmediatamente.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="deleteApiKey"
              :disabled="deleting"
              class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {{ deleting ? "Eliminando..." : "Eliminar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "../../services/api";

// State
const loading = ref(true);
const saving = ref(false);
const actionLoading = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Data
const apiKeys = ref<any[]>([]);
const stats = ref<any>(null);
const visibleKeys = ref(new Set<string>());

// Modals
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const apiKeyToDelete = ref<any>(null);

// Form
interface ApiKeyForm {
  name: string;
  description: string;
  permissions: string[];
  expires_at?: string;
  rate_limit: string;
}

const apiKeyForm = ref<ApiKeyForm>({
  name: "",
  description: "",
  permissions: [],
  rate_limit: "unlimited",
});

const editingApiKey = ref<any>(null);

const availablePermissions = [
  "users:read",
  "users:write",
  "collections:read",
  "collections:write",
  "records:read",
  "records:write",
  "admin:read",
  "admin:write",
];

// API Functions
async function loadApiKeys() {
  try {
    loading.value = true;
    error.value = null;

    const response = await apiClient.get("/api/admin/api-keys");
    
    // ✅ Manejar la estructura de respuesta del backend
    const data = response.data as { success?: boolean; data?: any };
    if (data.success && Array.isArray(data.data)) {
      apiKeys.value = data.data;
    } else if (Array.isArray(data)) {
      // Fallback si viene la estructura antigua
      apiKeys.value = data;
    } else {
      apiKeys.value = [];
    }
    
    console.log('API Keys loaded:', apiKeys.value);
  } catch (e: any) {
    console.error("Error loading API keys:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cargando API keys";
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  try {
    const response = await apiClient.get("/api/admin/api-keys/stats");
    // ✅ Manejar la estructura de respuesta del backend
    const data = response.data as { success?: boolean; data?: any };
    if (data.success && data.data) {
      stats.value = data.data;
    } else {
      // Fallback si viene la estructura antigua
      stats.value = data;
    }
    console.log('Stats loaded:', stats.value);
  } catch (e: any) {
    console.error("Error loading stats:", e);
  }
}

async function saveApiKey() {
  try {
    saving.value = true;
    formError.value = null;

    const formData = { ...apiKeyForm.value };
    if (formData.expires_at) {
      formData.expires_at = new Date(formData.expires_at).toISOString();
    } else {
      delete formData.expires_at;
    }

    let responseData;
    if (isEditing.value && editingApiKey.value) {
      const response = await apiClient.patch(
        `/api/admin/api-keys/${editingApiKey.value.id}`,
        formData
      );
      const data = response.data as { success?: boolean; data?: any };
      responseData = data.success ? data.data : data;
      successMessage.value = "API Key actualizada exitosamente";
    } else {
      const response = await apiClient.post("/api/admin/api-keys", formData);
      const data = response.data as { success?: boolean; data?: any };
      responseData = data.success ? data.data : data;
      successMessage.value = `API Key creada: ${responseData.name}`;
      // Mostrar la key recién creada
      visibleKeys.value.add(responseData.id);
    }

    setTimeout(() => (successMessage.value = null), 5000);
    closeModal();
    await loadApiKeys();
  } catch (e: any) {
    console.error("Error saving API key:", e);
    formError.value =
      e?.response?.data?.message || e?.message || "Error guardando API key";
  } finally {
    saving.value = false;
  }
}

async function toggleApiKeyStatus(apiKey: any) {
  try {
    actionLoading.value = true;
    await apiClient.patch(`/api/admin/api-keys/${apiKey.id}/toggle`);

    successMessage.value = `API Key ${
      apiKey.is_active ? "desactivada" : "activada"
    }`;
    setTimeout(() => (successMessage.value = null), 3000);

    await loadApiKeys();
  } catch (e: any) {
    console.error("Error toggling API key status:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cambiando estado";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    actionLoading.value = false;
  }
}

async function regenerateApiKey(apiKey: any) {
  if (
    !confirm(
      `¿Regenerar la API Key "${apiKey.name}"? La key actual dejará de funcionar.`
    )
  )
    return;

  try {
    actionLoading.value = true;
    const response = await apiClient.patch(
      `/api/admin/api-keys/${apiKey.id}/regenerate`
    );
    
    const data = response.data as { success?: boolean; data?: any };
    const responseData = data.success ? data.data : data;

    successMessage.value = `API Key regenerada para ${apiKey.name}`;
    setTimeout(() => (successMessage.value = null), 5000);

    // Mostrar la nueva key
    visibleKeys.value.add(responseData.id);

    await loadApiKeys();
  } catch (e: any) {
    console.error("Error regenerating API key:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error regenerando API key";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    actionLoading.value = false;
  }
}

function confirmDeleteApiKey(apiKey: any) {
  apiKeyToDelete.value = apiKey;
  showDeleteModal.value = true;
}

async function deleteApiKey() {
  if (!apiKeyToDelete.value) return;

  try {
    deleting.value = true;
    await apiClient.delete(`/api/admin/api-keys/${apiKeyToDelete.value.id}`);

    successMessage.value = `API Key ${apiKeyToDelete.value.name} eliminada`;
    setTimeout(() => (successMessage.value = null), 5000);

    showDeleteModal.value = false;
    apiKeyToDelete.value = null;
    await loadApiKeys();
  } catch (e: any) {
    console.error("Error deleting API key:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error eliminando API key";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    deleting.value = false;
  }
}

// UI Functions
function openCreateModal() {
  isEditing.value = false;
  editingApiKey.value = null;
  apiKeyForm.value = {
    name: "",
    description: "",
    permissions: [],
    rate_limit: "unlimited",
  };
  showModal.value = true;
}

function openEditModal(apiKey: any) {
  isEditing.value = true;
  editingApiKey.value = apiKey;
  apiKeyForm.value = {
    name: apiKey.name,
    description: apiKey.description || "",
    permissions: apiKey.permissions || [],
    expires_at: apiKey.expires_at
      ? new Date(apiKey.expires_at).toISOString().slice(0, 16)
      : "",
    rate_limit: apiKey.rate_limit || "unlimited",
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  formError.value = null;
}

function refreshApiKeys() {
  loadApiKeys();
  loadStats();
}

function toggleKeyVisibility(keyId: string) {
  if (visibleKeys.value.has(keyId)) {
    visibleKeys.value.delete(keyId);
  } else {
    visibleKeys.value.add(keyId);
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    successMessage.value = "API Key copiada al portapapeles";
    setTimeout(() => (successMessage.value = null), 2000);
  } catch (err) {
    console.error("Error copying to clipboard:", err);
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      successMessage.value = "API Key copiada al portapapeles";
      setTimeout(() => (successMessage.value = null), 2000);
    } catch (fallbackErr) {
      console.error("Fallback copy failed:", fallbackErr);
    }
    document.body.removeChild(textArea);
  }
}

// Utility Functions
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha inválida";
  }
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "hace menos de 1 minuto";
    if (diffInSeconds < 3600)
      return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400)
      return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800)
      return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    if (diffInSeconds < 2592000)
      return `hace ${Math.floor(diffInSeconds / 604800)} semanas`;
    return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Tiempo desconocido";
  }
}

function formatNumber(num: number): string {
  try {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("es-ES").format(num);
  } catch (error) {
    console.error("Error formatting number:", error);
    return num?.toString() || "0";
  }
}

function isExpired(apiKey: any): boolean {
  try {
    return apiKey.expires_at && new Date(apiKey.expires_at) < new Date();
  } catch (error) {
    console.error("Error checking expiration:", error);
    return false;
  }
}

function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    'users:read': 'Ver información de usuarios',
    'users:write': 'Crear y modificar usuarios',
    'collections:read': 'Ver collections y schemas',
    'collections:write': 'Crear y modificar collections',
    'records:read': 'Leer registros de collections',
    'records:write': 'Crear y modificar registros',
    'admin:read': 'Acceso de solo lectura al admin',
    'admin:write': 'Acceso completo de administrador'
  };
  return descriptions[permission] || 'Permiso del sistema';
}

// ✅ Funciones adicionales para mejorar la UX
function getPermissionIcon(permission: string): string {
  const icons: Record<string, string> = {
    'users:read': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'users:write': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'collections:read': 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    'collections:write': 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    'records:read': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'records:write': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'admin:read': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    'admin:write': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
  };
  return icons[permission] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
}

function getUsageColor(usageCount: number): string {
  if (usageCount === 0) return 'text-gray-500';
  if (usageCount < 100) return 'text-green-600';
  if (usageCount < 1000) return 'text-blue-600';
  if (usageCount < 10000) return 'text-yellow-600';
  return 'text-red-600';
}

function getRateLimitBadgeColor(rateLimit: string): string {
  switch (rateLimit) {
    case 'unlimited': return 'bg-green-100 text-green-800';
    case '100/hour': 
    case '100/day': return 'bg-yellow-100 text-yellow-800';
    case '1000/hour':
    case '1000/day': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// ✅ Funciones para validación del formulario
function validateForm(): boolean {
  if (!apiKeyForm.value.name.trim()) {
    formError.value = "El nombre es obligatorio";
    return false;
  }
  
  if (apiKeyForm.value.name.length < 3) {
    formError.value = "El nombre debe tener al menos 3 caracteres";
    return false;
  }
  
  if (apiKeyForm.value.permissions.length === 0) {
    formError.value = "Debe seleccionar al menos un permiso";
    return false;
  }
  
  if (apiKeyForm.value.expires_at) {
    const expirationDate = new Date(apiKeyForm.value.expires_at);
    const now = new Date();
    
    if (expirationDate <= now) {
      formError.value = "La fecha de expiración debe ser futura";
      return false;
    }
  }
  
  return true;
}

// ✅ Función mejorada para guardar API Key con validación
async function saveApiKeyWithValidation() {
  formError.value = null;
  
  if (!validateForm()) {
    return;
  }
  
  await saveApiKey();
}

// ✅ Auto-clear de mensajes
function setupAutoClears() {
  // Auto-clear success messages
  setTimeout(() => {
    if (successMessage.value) {
      successMessage.value = null;
    }
  }, 5000);
  
  // Auto-clear error messages
  setTimeout(() => {
    if (error.value) {
      error.value = null;
    }
  }, 8000);
}

// ✅ Cleanup función
function cleanup() {
  // Limpiar intervals, timeouts, etc. si los hay
  visibleKeys.value.clear();
  error.value = null;
  successMessage.value = null;
  formError.value = null;
}

// ✅ Lifecycle hooks
onMounted(async () => {
  try {
    await Promise.all([loadApiKeys(), loadStats()]);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// ✅ Watch para cleanup automático
import { onUnmounted } from 'vue';

onUnmounted(() => {
  cleanup();
});
</script>

