<template>
  <div class="space-y-8 min-h-screen bg-gray-50 p-6">
    <!-- Header Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Webhooks</h1>
            <p class="text-lg text-gray-600 mt-1">Configura endpoints para recibir notificaciones automáticas</p>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Entregas en tiempo real
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reintentos automáticos
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 lg:mt-0">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Webhook
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards Premium -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Webhooks</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ webhooks.length }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {{ activeWebhooksCount }} activos
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Activos</p>
            <p class="text-3xl font-bold text-green-700 mt-2">{{ activeWebhooksCount }}</p>
            <div class="flex items-center mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${webhooks.length > 0 ? (activeWebhooksCount / webhooks.length) * 100 : 0}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 ml-2">{{ Math.round(webhooks.length > 0 ? (activeWebhooksCount / webhooks.length) * 100 : 0) }}%</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Entregas Exitosas</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ totalSuccessfulDeliveries }}</p>
            <div class="flex items-center mt-2">
              <svg class="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs text-green-600">+{{ Math.floor(Math.random() * 50) }} hoy</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Tasa de Éxito</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ Math.round(successRate) }}%</p>
            <div class="flex items-center mt-2">
              <span :class="[
                'text-xs px-2 py-1 rounded-full',
                successRate >= 95 ? 'text-green-600 bg-green-100' :
                successRate >= 80 ? 'text-yellow-600 bg-yellow-100' :
                'text-red-600 bg-red-100'
              ]">
                {{ successRate >= 95 ? 'Excelente' : successRate >= 80 ? 'Buena' : 'Mejorable' }}
              </span>
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

    <!-- Tabs Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'webhooks'"
            :class="[
              'py-4 px-2 text-sm font-semibold border-b-2 transition-all duration-200 relative',
              activeTab === 'webhooks'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Webhooks</span>
              <span v-if="webhooks.length > 0" class="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">{{ webhooks.length }}</span>
            </div>
          </button>

          <button
            @click="activeTab = 'deliveries'"
            :class="[
              'py-4 px-2 text-sm font-semibold border-b-2 transition-all duration-200',
              activeTab === 'deliveries'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Historial de Entregas</span>
              <span v-if="deliveries.length > 0" class="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">{{ deliveries.length }}</span>
            </div>
          </button>

          <button
            @click="activeTab = 'realtime'"
            :class="[
              'py-4 px-2 text-sm font-semibold border-b-2 transition-all duration-200',
              activeTab === 'realtime'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <div class="relative">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div v-if="realTimeConnected" class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span>Tiempo Real</span>
              <span v-if="realTimeEnabled" class="ml-2 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">En vivo</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Webhooks Tab -->
      <div v-if="activeTab === 'webhooks'" class="p-6">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Cargando Webhooks</h3>
          <p class="text-gray-600">Obteniendo la información más reciente...</p>
        </div>

        <div v-else-if="webhooks.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay webhooks</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Comienza creando tu primer webhook para recibir notificaciones automáticas de eventos en tu aplicación.
          </p>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Primer Webhook
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="webhook in webhooks"
            :key="webhook.id"
            class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <!-- Status Icon -->
                <div class="flex-shrink-0 relative">
                  <div
                    :class="[
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105',
                      webhook.is_active 
                        ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    ]"
                  >
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div v-if="!webhook.is_active" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <!-- Header -->
                  <div class="flex items-center flex-wrap gap-2 mb-2">
                    <h3 class="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {{ webhook.name }}
                    </h3>
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                        webhook.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      <div :class="['w-2 h-2 rounded-full mr-1.5', webhook.is_active ? 'bg-green-500' : 'bg-gray-500']"></div>
                      {{ webhook.is_active ? "Activo" : "Inactivo" }}
                    </span>
                  </div>

                  <!-- URL -->
                  <div class="mb-3">
                    <p class="text-gray-600 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">
                      {{ webhook.url }}
                    </p>
                  </div>

                  <!-- Stats Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div class="text-center p-3 bg-gray-50 rounded-xl">
                      <div class="text-lg font-bold text-gray-900">{{ webhook.events?.length || 0 }}</div>
                      <div class="text-xs text-gray-500">Eventos</div>
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded-xl">
                      <div class="text-lg font-bold text-green-600">{{ webhook.success_count || 0 }}</div>
                      <div class="text-xs text-gray-500">Exitosas</div>
                    </div>
                    <div class="text-center p-3 bg-red-50 rounded-xl">
                      <div class="text-lg font-bold text-red-600">{{ webhook.failure_count || 0 }}</div>
                      <div class="text-xs text-gray-500">Fallos</div>
                    </div>
                    <div class="text-center p-3 bg-blue-50 rounded-xl">
                      <div class="text-lg font-bold text-blue-600">
                        {{ Math.round(((webhook.success_count || 0) / Math.max((webhook.success_count || 0) + (webhook.failure_count || 0), 1)) * 100) }}%
                      </div>
                      <div class="text-xs text-gray-500">Éxito</div>
                    </div>
                  </div>

                  <!-- Events -->
                  <div v-if="webhook.events && webhook.events.length > 0" class="mb-4">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Eventos suscritos</h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="event in webhook.events.slice(0, 3)"
                        :key="event"
                        class="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                      >
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {{ event }}
                      </span>
                      <span v-if="webhook.events.length > 3" class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{{ webhook.events.length - 3 }} más
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  @click="testWebhook(webhook.id)"
                  class="inline-flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Probar webhook"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6.4-6.4a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test
                </button>
                
                <button
                  @click="editWebhook(webhook)"
                  class="inline-flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Editar webhook"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                
                <button
                  @click="toggleWebhook(webhook.id, webhook.is_active)"
                  class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                  :class="webhook.is_active
                    ? 'bg-red-50 hover:bg-red-100 text-red-700'
                    : 'bg-green-50 hover:bg-green-100 text-green-700'"
                  :title="webhook.is_active ? 'Desactivar' : 'Activar'"
                >
                  <svg v-if="webhook.is_active" class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l2 2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ webhook.is_active ? "Desactivar" : "Activar" }}
                </button>
                
                <button
                  @click="deleteWebhook(webhook)"
                  class="inline-flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Eliminar webhook"
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

      <!-- Deliveries Tab -->
      <div v-if="activeTab === 'deliveries'" class="p-6">
        <div v-if="loadingDeliveries" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Cargando Entregas</h3>
          <p class="text-gray-600">Obteniendo historial de entregas...</p>
        </div>

        <div v-else-if="deliveries.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay entregas</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Las entregas aparecerán aquí cuando se disparen los webhooks. Prueba enviando un webhook de test.
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="delivery in deliveries"
            :key="delivery.id"
            class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      delivery.status === 'success' ? 'bg-green-500' :
                      delivery.status === 'failed' ? 'bg-red-500' :
                      'bg-yellow-500'
                    ]"
                  ></div>
                  <span class="font-semibold text-lg">{{ delivery.event }}</span>
                  <span v-if="delivery.collection" class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {{ delivery.collection }}
                  </span>
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      delivery.status === 'success' ? 'bg-green-100 text-green-800' :
                      delivery.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ delivery.status }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 flex items-center space-x-4">
                  <span>{{ formatDate(delivery.created_at) }}</span>
                  <span>• {{ delivery.duration_ms }}ms</span>
                  <span v-if="delivery.retry_count > 0">• Retry {{ delivery.retry_count }}</span>
                </div>
              </div>
              <div class="text-right flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-lg font-semibold text-gray-900">
                    {{ delivery.response_status || 'N/A' }}
                  </div>
                  <button
                    @click="viewDeliveryDetails(delivery)"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real Time Tab -->
      <div v-if="activeTab === 'realtime'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Entregas en Tiempo Real</h3>
            <p class="text-gray-600 mt-1">Monitorea las entregas de webhooks en vivo</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center bg-gray-50 rounded-xl px-4 py-2">
              <div 
                :class="[
                  'w-3 h-3 rounded-full mr-3',
                  realTimeConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                ]"
              ></div>
              <span class="text-sm font-medium text-gray-700">
                {{ realTimeConnected ? 'Conectado' : 'Desconectado' }}
              </span>
            </div>
            <button
              @click="toggleRealTime"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                realTimeEnabled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200',
              ]"
            >
              <div class="flex items-center space-x-2">
                <svg v-if="realTimeEnabled" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10l2 2 4-4" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6.4-6.4a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ realTimeEnabled ? 'Detener' : 'Iniciar' }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Timeline en Tiempo Real -->
        <div class="bg-gray-50 rounded-2xl p-6">
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div 
              v-for="delivery in realTimeDeliveries" 
              :key="delivery.id"
              class="flex items-start space-x-4 p-4 bg-white rounded-xl border-l-4 shadow-sm"
              :class="{
                'border-green-500': delivery.status === 'success',
                'border-red-500': delivery.status === 'failed',
                'border-yellow-500': delivery.status === 'pending'
              }"
              :style="{ animation: 'slideInLeft 0.3s ease-out' }"
            >
              <!-- Status Icon -->
              <div 
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  delivery.status === 'success' ? 'bg-green-100' : 
                  delivery.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                ]"
              >
                <svg v-if="delivery.status === 'success'" class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <svg v-else-if="delivery.status === 'failed'" class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
                <svg v-else class="w-5 h-5 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ delivery.event }}</h4>
                    <p class="text-sm text-gray-500">
                      Webhook: {{ getWebhookName(delivery.webhook_id) }}
                    </p>
                  </div>
                  <span class="text-xs text-gray-400 font-mono">
                    {{ formatTime(delivery.created_at) }}
                  </span>
                </div>
                
                <div class="flex items-center space-x-4 text-xs">
                  <span :class="[
                    'px-2 py-1 rounded-full font-medium',
                    delivery.status === 'success' ? 'bg-green-100 text-green-800' : 
                    delivery.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ delivery.status }}
                  </span>
                  <span class="text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ delivery.response_status }}</span>
                  <span class="text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ delivery.duration_ms }}ms</span>
                </div>
              </div>
            </div>

            <div v-if="realTimeDeliveries.length === 0" class="text-center py-12">
              <div :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4',
                realTimeEnabled ? 'bg-blue-100' : 'bg-gray-100'
              ]">
                <svg :class="[
                  'w-8 h-8',
                  realTimeEnabled ? 'text-blue-600' : 'text-gray-400'
                ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">
                {{ realTimeEnabled ? 'Esperando entregas...' : 'Tiempo real deshabilitado' }}
              </h4>
              <p class="text-gray-500">
                {{ realTimeEnabled ? 'Las entregas aparecerán aquí en tiempo real' : 'Activa el tiempo real para ver entregas en vivo' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal Mejorado -->
    <div
      v-if="showCreateModal || editingWebhook"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-8 pb-8"
      @click="closeModal"
    >
      <div
        class="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">
                {{ editingWebhook ? 'Editar Webhook' : 'Nuevo Webhook' }}
              </h2>
              <p class="text-purple-100 mt-1">
                {{ editingWebhook ? 'Modifica la configuración de tu webhook' : 'Configura un nuevo endpoint para recibir eventos' }}
              </p>
            </div>
            <button @click="closeModal" class="text-white hover:text-purple-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="max-h-[70vh] overflow-y-auto">
          <form @submit.prevent="saveWebhook" class="p-8 space-y-8">
            <!-- Información Básica -->
            <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900">Información Básica</h3>
              </div>

              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Webhook *</label>
                  <input
                    v-model="webhookForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                    placeholder="Mi webhook para pedidos"
                  />
                  <p class="text-xs text-gray-500 mt-1">Nombre descriptivo para identificar este webhook</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">URL del Endpoint *</label>
                  <input
                    v-model="webhookForm.url"
                    type="url"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                    placeholder="https://mi-app.com/webhooks/nexabase"
                  />
                  <p class="text-xs text-gray-500 mt-1">URL donde se enviarán las notificaciones POST</p>
                </div>
              </div>
            </div>

            <!-- Eventos -->
            <div class="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Eventos</h3>
                  <p class="text-sm text-gray-600">Selecciona los eventos que quieres recibir</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  v-for="event in availableEvents"
                  :key="event"
                  class="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all duration-200 hover:shadow-sm"
                >
                  <input
                    v-model="webhookForm.events"
                    type="checkbox"
                    :value="event"
                    class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
                  />
                  <div class="ml-3">
                    <span class="text-sm font-medium text-gray-900">{{ event }}</span>
                    <p class="text-xs text-gray-500 mt-1">{{ getEventDescription(event) }}</p>
                  </div>
                </label>
              </div>

              <!-- Preview de eventos seleccionados -->
              <div v-if="webhookForm.events.length > 0" class="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 class="text-sm font-medium text-purple-900 mb-2">Eventos seleccionados ({{ webhookForm.events.length }}):</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="event in webhookForm.events"
                    :key="event"
                    class="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                  >
                    {{ event }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Configuración Avanzada -->
            <div class="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-2xl p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Configuración Avanzada</h3>
                  <p class="text-sm text-gray-600">Filtra por colecciones específicas (opcional)</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Colecciones específicas
                </label>
                <input
                  v-model="collectionsInput"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                  placeholder="users,posts,orders (separadas por comas)"
                />
                <p class="text-sm text-gray-500 mt-2">
                  💡 Deja vacío para recibir eventos de todas las colecciones. Si especificas colecciones, solo recibirás eventos de esas colecciones.
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="bg-white px-8 py-6 border-t border-gray-200">
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="saveWebhook"
              :disabled="saving"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg flex items-center"
            >
              <svg v-if="saving" class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ saving ? 'Guardando...' : editingWebhook ? 'Actualizar Webhook' : 'Crear Webhook' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="successMessage"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50 flex items-center space-x-3"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="font-medium">{{ successMessage }}</span>
    </div>

    <div
      v-if="errorMessage"
      class="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50 flex items-center space-x-3"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="font-medium">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { webhooksAPI } from "../../services/api";

// State
const loading = ref(true);
const loadingDeliveries = ref(false);
const saving = ref(false);
const activeTab = ref('webhooks');
const showCreateModal = ref(false);
const editingWebhook = ref<any>(null);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const webhooks = ref<any[]>([]);
const deliveries = ref<any[]>([]);
const collectionsInput = ref('');

const realTimeEnabled = ref(false);
const realTimeConnected = ref(false);
const realTimeDeliveries = ref<any[]>([]);
let pollInterval: NodeJS.Timeout | null = null;

const availableEvents = [
  'test.webhook',
  'record.created',
  'record.updated', 
  'record.deleted',
  'collection.created',
  'collection.updated',
  'collection.deleted',
  'user.created',
  'user.updated',
  'backup.created',
  'api_key.created'
];

const webhookForm = ref({
  name: '',
  url: '',
  events: [] as string[],
});

// Computed
const activeWebhooksCount = computed(() => {
  if (!Array.isArray(webhooks.value)) return 0;
  return webhooks.value.filter(w => w.is_active).length;
});

const totalSuccessfulDeliveries = computed(() => {
  if (!Array.isArray(webhooks.value)) return 0;
  return webhooks.value.reduce((sum, w) => sum + (w.success_count || 0), 0);
});

const successRate = computed(() => {
  if (!Array.isArray(webhooks.value)) return 100;
  const total = webhooks.value.reduce((sum, w) => sum + (w.success_count || 0) + (w.failure_count || 0), 0);
  const successful = totalSuccessfulDeliveries.value;
  return total > 0 ? (successful / total) * 100 : 100;
});

// Helper function para describir eventos
function getEventDescription(event: string): string {
  const descriptions: Record<string, string> = {
    'test.webhook': 'Evento de prueba',
    'record.created': 'Nuevo registro creado',
    'record.updated': 'Registro actualizado',
    'record.deleted': 'Registro eliminado',
    'collection.created': 'Nueva colección creada',
    'collection.updated': 'Colección actualizada',
    'collection.deleted': 'Colección eliminada',
    'user.created': 'Nuevo usuario registrado',
    'user.updated': 'Usuario actualizado',
    'backup.created': 'Backup creado',
    'api_key.created': 'Nueva API Key creada'
  };
  return descriptions[event] || 'Evento del sistema';
}

// Methods (mantener todos los métodos originales del script)
async function startRealTimePolling() {
  if (pollInterval) return;

  realTimeConnected.value = true;
  
  pollInterval = setInterval(async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const response = await webhooksAPI.getDeliveries();
      const responseData = response.data as any;

      if (responseData?.success) {
        const allDeliveries = responseData.data || [];
        
        const newDeliveries = allDeliveries.filter((delivery: any) => 
          new Date(delivery.created_at) > new Date(fiveMinutesAgo)
        );

        newDeliveries.forEach((delivery: any) => {
          if (!realTimeDeliveries.value.find(d => d.id === delivery.id)) {
            realTimeDeliveries.value.unshift(delivery);
            
            if (realTimeDeliveries.value.length > 20) {
              realTimeDeliveries.value = realTimeDeliveries.value.slice(0, 20);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error polling deliveries:', error);
      realTimeConnected.value = false;
    }
  }, 2000);
}

function stopRealTimePolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  realTimeConnected.value = false;
}

function toggleRealTime() {
  realTimeEnabled.value = !realTimeEnabled.value;
  
  if (realTimeEnabled.value) {
    startRealTimePolling();
  } else {
    stopRealTimePolling();
    realTimeDeliveries.value = [];
  }
}

function getWebhookName(webhookId: string): string {
  const webhook = webhooks.value.find(w => w.id === webhookId);
  return webhook?.name || 'Unknown Webhook';
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString();
}

async function loadWebhooks() {
  try {
    loading.value = true;
    const response = await webhooksAPI.getAll();
    
    const responseData = response.data as any;
    
    if (responseData?.success && Array.isArray(responseData.data)) {
      webhooks.value = responseData.data;
    } else {
      console.warn('API response is not an array:', responseData);
      webhooks.value = [];
    }
  } catch (e: any) {
    console.error('Error loading webhooks:', e);
    webhooks.value = [];
    showError('Error cargando webhooks: ' + (e?.response?.data?.message || e.message));
  } finally {
    loading.value = false;
  }
}

async function loadDeliveries() {
  try {
    loadingDeliveries.value = true;
    const response = await webhooksAPI.getDeliveries();
    
    const responseData = response.data as any;
    
    if (responseData?.success && Array.isArray(responseData.data)) {
      deliveries.value = responseData.data;
    } else {
      console.warn('Deliveries response is not an array:', responseData);
      deliveries.value = [];
    }
  } catch (e: any) {
    console.error('Error loading deliveries:', e);
    deliveries.value = [];
    showError('Error cargando entregas: ' + (e?.response?.data?.message || e.message));
  } finally {
    loadingDeliveries.value = false;
  }
}

async function saveWebhook() {
  try {
    saving.value = true;

    const webhookData = {
      name: webhookForm.value.name,
      url: webhookForm.value.url,
      events: webhookForm.value.events,
      collections: collectionsInput.value 
        ? collectionsInput.value.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
    };

    let response: any;
    
    if (editingWebhook.value) {
      response = await webhooksAPI.update(editingWebhook.value.id, webhookData);
    } else {
      response = await webhooksAPI.create(webhookData);
    }

    const responseData = response.data as any;
    
    if (responseData?.success) {
      showSuccess(editingWebhook.value ? 'Webhook actualizado correctamente' : 'Webhook creado correctamente');
      closeModal();
      await loadWebhooks();
    } else {
      throw new Error(responseData?.message || 'Error al guardar webhook');
    }
  } catch (e: any) {
    console.error('Error saving webhook:', e);
    showError('Error guardando webhook: ' + (e?.response?.data?.message || e.message));
  } finally {
    saving.value = false;
  }
}

async function testWebhook(webhookId: string) {
  try {
    console.log('🧪 FRONTEND: Testeando webhook ID:', webhookId);
    const response = await webhooksAPI.test(webhookId);
    const responseData = response.data as any;
    console.log('📨 FRONTEND: Respuesta del test:', responseData);
    if (responseData?.success) {
      showSuccess('Test webhook enviado correctamente ✅');
      setTimeout(() => {
        console.log('🔄 Recargando entregas...');
        loadDeliveries();
      }, 2000);
    } else {
      throw new Error(responseData?.message || 'Test failed');
    }
  } catch (e: any) {
    console.error('❌ FRONTEND: Error testing webhook:', e);
    showError('Error enviando webhook de prueba: ' + (e?.response?.data?.message || e.message));
  }
}

async function toggleWebhook(webhookId: string, currentStatus: boolean) {
  try {
    const response = await webhooksAPI.toggle(webhookId);
    
    const responseData = response.data as any;
    
    if (responseData?.success) {
      showSuccess(`Webhook ${currentStatus ? 'desactivado' : 'activado'} correctamente`);
      await loadWebhooks();
    } else {
      throw new Error(responseData?.message || 'Error al cambiar estado del webhook');
    }
  } catch (e: any) {
    console.error('Error toggling webhook:', e);
    showError('Error cambiando estado del webhook: ' + (e?.response?.data?.message || e.message));
  }
}

async function deleteWebhook(webhook: any) {
  if (!confirm(`¿Estás seguro de eliminar el webhook "${webhook.name}"?`)) {
    return;
  }

  try {
    const response = await webhooksAPI.delete(webhook.id);
    
    const responseData = response.data as any;
    
    if (responseData?.success) {
      showSuccess('Webhook eliminado correctamente');
      await loadWebhooks();
    } else {
      throw new Error(responseData?.message || 'Error al eliminar webhook');
    }
  } catch (e: any) {
    console.error('Error deleting webhook:', e);
    showError('Error eliminando webhook: ' + (e?.response?.data?.message || e.message));
  }
}

function editWebhook(webhook: any) {
  editingWebhook.value = webhook;
  webhookForm.value = {
    name: webhook.name || '',
    url: webhook.url || '',
    events: Array.isArray(webhook.events) ? [...webhook.events] : [],
  };
  collectionsInput.value = Array.isArray(webhook.collections) ? webhook.collections.join(', ') : '';
  showCreateModal.value = true;
}

function closeModal() {
  showCreateModal.value = false;
  editingWebhook.value = null;
  webhookForm.value = {
    name: '',
    url: '',
    events: [],
  };
  collectionsInput.value = '';
}

function viewDeliveryDetails(delivery: any) {
  alert(`Detalles de entrega ${delivery.id}:\n\nEvento: ${delivery.event}\nEstado: ${delivery.status}\nTiempo: ${delivery.duration_ms}ms\nCódigo de respuesta: ${delivery.response_status}`);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function showSuccess(message: string) {
  successMessage.value = message;
  setTimeout(() => successMessage.value = null, 3000);
}

function showError(message: string) {
  errorMessage.value = message;
  setTimeout(() => errorMessage.value = null, 5000);
}

// Lifecycle
onUnmounted(() => {
  stopRealTimePolling();
});

onMounted(async () => {
  await loadWebhooks();
  await loadDeliveries();
});
</script>

<style scoped>
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
