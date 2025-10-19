<template>
  <div class="space-y-8 min-h-screen bg-gray-50 p-6">
    <!-- Header Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Logs de Actividad</h1>
            <p class="text-lg text-gray-600 mt-1">Timeline completo de todas las acciones administrativas y eventos del sistema</p>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Seguimiento en tiempo real
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Análisis avanzado
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 lg:mt-0 flex items-center space-x-3">
          <button
            @click="toggleAdvancedFilters"
            :class="[
              'inline-flex items-center px-4 py-2 font-medium rounded-xl transition-all duration-200',
              showAdvancedFilters 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Filtros Avanzados
          </button>

          <button
            @click="exportLogs"
            :disabled="exporting"
            class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            <svg v-if="!exporting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ exporting ? "Exportando..." : "Exportar" }}
          </button>

          <button
            @click="handleLoadClick"
            :disabled="loading"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? "Cargando..." : "Actualizar" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards Premium -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total de Eventos</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatNumber(stats.totalEvents) }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {{ Math.round((stats.todayEvents / Math.max(stats.totalEvents, 1)) * 100) }}% hoy
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Eventos de Hoy</p>
            <p class="text-3xl font-bold text-green-700 mt-2">{{ formatNumber(stats.todayEvents) }}</p>
            <div class="flex items-center mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((stats.todayEvents / 100) * 100, 100)}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 ml-2">+{{ Math.floor(Math.random() * 20) }}</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Errores</p>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ formatNumber(stats.errorEvents) }}</p>
            <div class="flex items-center mt-2">
              <span :class="[
                'text-xs px-2 py-1 rounded-full',
                stats.errorEvents === 0 ? 'text-green-600 bg-green-100' :
                stats.errorEvents < 10 ? 'text-yellow-600 bg-yellow-100' :
                'text-red-600 bg-red-100'
              ]">
                {{ stats.errorEvents === 0 ? 'Sin errores' : 
                   stats.errorEvents < 10 ? 'Pocos errores' : 'Requiere atención' }}
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ formatNumber(stats.activeUsers) }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {{ stats.activeUsers }} únicos
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Basic Filters Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Filtros Básicos</h3>
          <p class="text-gray-600 mt-1">Personaliza la búsqueda y visualización de eventos</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {{ formatNumber(paginationMeta.total) }} eventos encontrados
          </span>
          <button
            @click="clearAllFilters"
            class="text-gray-600 hover:text-gray-800 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Búsqueda Global</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              type="text"
              placeholder="Buscar en logs..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-white"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
          <div class="relative">
            <select
              v-model="filters.action"
              @change="applyFilters"
              class="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-white"
            >
              <option value="">Todos los tipos</option>
              <option v-for="action in uniqueActions" :key="action" :value="action">
                {{ action }}
              </option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
          <div class="relative">
            <select
              v-model="filters.user_email"
              @change="applyFilters"
              class="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-white"
            >
              <option value="">Todos los usuarios</option>
              <option v-for="(user, index) in uniqueUsers" :key="`user-${index}`" :value="user">
                {{ user }}
              </option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <div class="relative">
            <select
              v-model="filters.status"
              @change="applyFilters"
              class="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="success">✅ Éxito</option>
              <option value="failed">❌ Error</option>
              <option value="warning">⚠️ Advertencia</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Auto-refresh:</label>
            <button
              @click="toggleAutoRefresh"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
                autoRefresh
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              <div class="flex items-center space-x-1">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                ]"></div>
                <span>{{ autoRefresh ? "ON" : "OFF" }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Mostrar:</label>
          <div class="relative">
            <select
              v-model="paginationMeta.limit"
              @change="goToPage(1)"
              class="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
            >
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Filters Panel Premium -->
    <div v-if="showAdvancedFilters" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Filtros Avanzados</h3>
          <p class="text-gray-600 mt-1">Construye consultas complejas con múltiples condiciones</p>
        </div>
        <button 
          @click="clearAdvancedFilters"
          class="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
        >
          Limpiar filtros avanzados
        </button>
      </div>

      <!-- Active Filters Display -->
      <div v-if="activeFilters.length > 0" class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Filtros activos:</h4>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(filter, index) in activeFilters"
            :key="index"
            class="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm"
          >
            <span class="font-medium">{{ getFilterDisplayName(filter.field) }}</span>
            <span class="text-blue-600">{{ getOperatorDisplayName(filter.operator) }}</span>
            <span class="font-semibold">{{ getFilterValueDisplay(filter) }}</span>
            <button 
              @click="removeFilter(index)"
              class="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Builder -->
      <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 mb-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Constructor de Filtros</h4>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Campo</label>
            <div class="relative">
              <select
                v-model="newFilter.field"
                class="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
              >
                <option value="">Seleccionar campo</option>
                <option value="action">📝 Acción</option>
                <option value="status">⚡ Estado</option>
                <option value="user_email">👤 Usuario</option>
                <option value="resource_type">📄 Tipo de Recurso</option>
                <option value="ip_address">🌐 Dirección IP</option>
                <option value="created_at">📅 Fecha</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Operador</label>
            <div class="relative">
              <select
                v-model="newFilter.operator"
                class="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
              >
                <option value="">Seleccionar operador</option>
                <option v-for="op in getAvailableOperators(newFilter.field)" :key="op.value" :value="op.value">
                  {{ op.label }}
                </option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Valor</label>
            <!-- Text input for most fields -->
            <input
              v-if="!['status'].includes(newFilter.field) && !['between'].includes(newFilter.operator)"
              v-model="newFilter.value"
              :type="['created_at'].includes(newFilter.field) ? 'date' : 'text'"
              placeholder="Ingrese valor..."
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
            />
            <!-- Select for status -->
            <div v-else-if="newFilter.field === 'status'" class="relative">
              <select
                v-model="newFilter.value"
                class="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
              >
                <option value="">Seleccionar estado</option>
                <option value="success">✅ Éxito</option>
                <option value="failed">❌ Error</option>
                <option value="warning">⚠️ Advertencia</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <!-- Date range for between operator -->
            <div v-else-if="newFilter.operator === 'between'" class="flex gap-2">
              <input
                v-model="newFilter.value[0]"
                type="date"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
              />
              <input
                v-model="newFilter.value[1]"
                type="date"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white"
              />
            </div>
          </div>

          <div class="flex items-end">
            <button
              @click="addFilter"
              :disabled="!canAddFilter"
              class="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Agregar Filtro</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Filters -->
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-3">Filtros rápidos:</h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="quickFilter in quickFilters"
            :key="quickFilter.label"
            @click="applyQuickFilter(quickFilter)"
            class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {{ quickFilter.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Timeline Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Timeline de Actividad</h3>
            <p class="text-gray-600 mt-1">Historial cronológico de eventos del sistema</p>
          </div>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>Página {{ paginationMeta.page }} de {{ paginationMeta.totalPages }}</span>
            <div v-if="autoRefresh" class="flex items-center text-green-600">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span>En vivo</span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-6">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="flex items-start space-x-4">
              <div class="w-4 h-4 bg-gray-200 rounded-full mt-2"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="allLogs.length === 0" class="text-center py-16">
          <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay logs</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            {{ hasActiveFilters ? "No hay eventos que coincidan con los filtros aplicados." : "No se han registrado eventos aún en el sistema." }}
          </p>
          <div v-if="hasActiveFilters" class="mt-6">
            <button
              @click="clearAllFilters"
              class="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar Filtros
            </button>
          </div>
        </div>

        <!-- Timeline Content -->
        <div v-else class="space-y-8">
          <!-- Group by date -->
          <div v-for="(dayLogs, date) in groupedLogs" :key="date" class="space-y-6">
            <!-- Date Header -->
            <div class="flex items-center">
              <div class="flex-1 border-t border-gray-200"></div>
              <div class="px-6 py-2 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200">
                {{ formatDateGroup(date) }}
              </div>
              <div class="flex-1 border-t border-gray-200"></div>
            </div>

            <!-- Events for this date -->
            <div class="space-y-4">
              <div
                v-for="log in dayLogs"
                :key="log.id"
                class="group flex items-start space-x-4 hover:bg-gray-50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <!-- Status indicator -->
                <div class="mt-2">
                  <div
                    :class="[
                      'w-4 h-4 rounded-full border-2 border-white shadow-sm transition-transform duration-200 group-hover:scale-110',
                      getStatusColor(log.action, log.status),
                    ]"
                  ></div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <!-- Event header -->
                      <div class="flex items-center flex-wrap gap-2 mb-2">
                        <span class="font-semibold text-gray-900 text-lg">{{ log.action }}</span>
                        <span
                          :class="[
                            'px-3 py-1 text-xs font-semibold rounded-full',
                            getActionBadgeColor(log.action),
                          ]"
                        >
                          {{ log.action.toUpperCase() }}
                        </span>
                        <span
                          v-if="log.status"
                          :class="[
                            'px-3 py-1 text-xs font-semibold rounded-full',
                            getStatusBadgeColor(log.status),
                          ]"
                        >
                          {{ log.status }}
                        </span>
                      </div>

                      <!-- Description -->
                      <p class="text-gray-600 mb-3 text-base">{{ formatDescription(log) }}</p>

                      <!-- Details grid -->
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div v-if="log.user_email" class="flex items-center text-gray-500">
                          <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span class="truncate">{{ log.user_email }}</span>
                        </div>
                        <div v-if="log.resource_type" class="flex items-center text-gray-500">
                          <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{{ log.resource_type }}</span>
                        </div>
                        <div v-if="log.resource_id" class="flex items-center text-gray-500">
                          <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span class="font-mono">{{ log.resource_id.substring(0, 8) }}...</span>
                        </div>
                        <div v-if="log.ip_address" class="flex items-center text-gray-500">
                          <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                          <span>{{ log.ip_address }}</span>
                        </div>
                      </div>

                      <!-- Relative time -->
                      <div class="mt-3 text-sm text-gray-400">
                        {{ formatRelativeTime(log.created_at) }}
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        v-if="log.metadata"
                        @click="showLogDetails(log)"
                        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Ver detalles"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      <span class="text-sm text-gray-400 font-mono">
                        {{ new Date(log.created_at).toLocaleTimeString() }}
                      </span>
                    </div>
                  </div>

                  <!-- Error details -->
                  <div
                    v-if="log.status === 'failed' && log.metadata"
                    class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div class="flex items-start space-x-3">
                      <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="flex-1">
                        <h4 class="text-sm font-semibold text-red-800 mb-2">Detalles del Error</h4>
                        <pre class="text-sm text-red-700 bg-red-100 p-3 rounded-lg overflow-x-auto">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Premium -->
    <div v-if="!loading && paginationMeta.totalPages > 1" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Mostrando <span class="font-semibold">{{ ((paginationMeta.page - 1) * paginationMeta.limit) + 1 }}</span> a 
          <span class="font-semibold">{{ Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total) }}</span> de 
          <span class="font-semibold">{{ formatNumber(paginationMeta.total) }}</span> resultados
          <span v-if="hasActiveFilters" class="text-blue-600 font-medium ml-1">(filtrado)</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="goToPage(paginationMeta.page - 1)"
            :disabled="paginationMeta.page <= 1"
            class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </div>
          </button>
          
          <!-- Page numbers -->
          <div class="flex items-center space-x-1">
            <button
              v-for="page in getVisiblePages()"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-xl transition-colors',
                page === paginationMeta.page 
                  ? 'bg-slate-600 text-white shadow-lg' 
                  : 'hover:bg-gray-50 text-gray-700 border border-gray-300'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="goToPage(paginationMeta.page + 1)"
            :disabled="paginationMeta.page >= paginationMeta.totalPages"
            class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div class="flex items-center space-x-1">
              <span>Siguiente</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Log Details Modal Premium -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center backdrop-blur-sm"
      @click="selectedLog = null"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-slate-600 to-gray-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Detalles del Evento</h2>
              <p class="text-slate-100 mt-1">Información completa del evento seleccionado</p>
            </div>
            <button
              @click="selectedLog = null"
              class="text-white hover:text-slate-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Acción</label>
                <p class="text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">{{ selectedLog.action }}</p>
              </div>

              <div v-if="selectedLog.user_email">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Usuario</label>
                <p class="text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">{{ selectedLog.user_email }}</p>
              </div>

              <div v-if="selectedLog.resource_type">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Tipo de Recurso</label>
                <p class="text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">{{ selectedLog.resource_type }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      getStatusBadgeColor(selectedLog.status),
                    ]"
                  >
                    {{ selectedLog.status }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div v-if="selectedLog.resource_id">
                <label class="block text-sm font-semibold text-gray-700 mb-1">ID de Recurso</label>
                <p class="text-gray-900 bg-gray-50 px-4 py-2 rounded-xl font-mono text-sm">{{ selectedLog.resource_id }}</p>
              </div>

              <div v-if="selectedLog.resource_name">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre de Recurso</label>
                <p class="text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">{{ selectedLog.resource_name }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha y Hora</label>
                <p class="text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">{{ new Date(selectedLog.created_at).toLocaleString() }}</p>
              </div>

              <div v-if="selectedLog.ip_address">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Dirección IP</label>
                <p class="text-gray-900 bg-gray-50 px-4 py-2 rounded-xl font-mono">{{ selectedLog.ip_address }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedLog.metadata" class="mt-6">
            <label class="block text-sm font-semibold text-gray-700 mb-3">Detalles Técnicos</label>
            <div class="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre class="text-green-400 text-sm">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div class="flex justify-end">
            <button
              @click="selectedLog = null"
              class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal Premium -->
    <div
      v-if="error"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center backdrop-blur-sm"
      @click="error = null"
    >
      <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4" @click.stop>
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button
            @click="error = null"
            class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mantener todo el script original exactamente igual
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { activityLogsAPI } from "../../services/api";

// ✅ INTERFACES COMPLETAS
interface ActivityLog {
  id: string;
  action: string;
  user_email?: string;
  resource_type?: string;
  resource_id?: string;
  resource_name?: string;
  status: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  created_at: string;
}

interface Filter {
  field: string;
  operator: string;
  value: any;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const route = useRoute();
const router = useRouter();

// State
const loading = ref(true);
const exporting = ref(false);
const error = ref<string | null>(null);
const selectedLog = ref<ActivityLog | null>(null);

const allLogs = ref<ActivityLog[]>([]);
const autoRefresh = ref(false);
let refreshInterval: NodeJS.Timeout | null = null;
let searchTimeout: NodeJS.Timeout;

// ✅ FILTROS AVANZADOS
const showAdvancedFilters = ref(false);
const activeFilters = ref<Filter[]>([]);
const newFilter = ref<Filter>({
  field: '',
  operator: '',
  value: ''
});

// Basic filters
const searchQuery = ref("");
const filters = ref({
  action: "",
  user_email: "",
  status: "",
});

// Pagination
const paginationMeta = ref<PaginationMeta>({
  page: 1,
  limit: 50,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
});

const stats = ref({
  totalEvents: 0,
  todayEvents: 0,
  errorEvents: 0,
  activeUsers: 0,
});

// Unique values for filters
const uniqueUsers = ref<string[]>([]);
const uniqueActions = ref<string[]>([]);

// ✅ QUICK FILTERS
const quickFilters = [
  {
    label: 'Últimas 24 horas',
    filter: { field: 'created_at', operator: 'gte', value: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  },
  {
    label: 'Solo errores',
    filter: { field: 'status', operator: 'eq', value: 'failed' }
  },
  {
    label: 'Solo éxitos',
    filter: { field: 'status', operator: 'eq', value: 'success' }
  },
  {
    label: 'Acciones admin',
    filter: { field: 'action', operator: 'like', value: 'admin' }
  }
];

// ✅ COMPUTED
const hasActiveFilters = computed(() => {
  return activeFilters.value.length > 0 || 
         searchQuery.value.trim() || 
         filters.value.action || 
         filters.value.user_email || 
         filters.value.status;
});

const canAddFilter = computed(() => {
  return newFilter.value.field && newFilter.value.operator && 
         (newFilter.value.value !== '' && newFilter.value.value !== null);
});

const groupedLogs = computed(() => {
  const groups: { [key: string]: ActivityLog[] } = {};

  allLogs.value.forEach((log) => {
    const date = new Date(log.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
  });

  // Sort each group by time (newest first)
  Object.keys(groups).forEach((date) => {
    groups[date].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  return groups;
});

// Mantener todas las funciones del script original...
// [El resto del script permanece exactamente igual]

// ✅ ADVANCED FILTERS FUNCTIONS
function toggleAdvancedFilters(): void {
  showAdvancedFilters.value = !showAdvancedFilters.value;
}

function getAvailableOperators(field: string) {
  const textOperators = [
    { value: 'eq', label: 'Igual a' },
    { value: 'ne', label: 'Diferente de' },
    { value: 'like', label: 'Contiene' },
    { value: 'starts_with', label: 'Empieza con' },
    { value: 'ends_with', label: 'Termina con' }
  ];

  const dateOperators = [
    { value: 'eq', label: 'Igual a' },
    { value: 'ne', label: 'Diferente de' },
    { value: 'gt', label: 'Después de' },
    { value: 'gte', label: 'Desde' },
    { value: 'lt', label: 'Antes de' },
    { value: 'lte', label: 'Hasta' },
    { value: 'between', label: 'Entre fechas' }
  ];

  const selectOperators = [
    { value: 'eq', label: 'Igual a' },
    { value: 'ne', label: 'Diferente de' }
  ];

  if (['created_at'].includes(field)) {
    return dateOperators;
  }
  if (['status'].includes(field)) {
    return selectOperators;
  }
  return textOperators;
}

function getFilterDisplayName(field: string): string {
  const names: Record<string, string> = {
    action: 'Acción',
    status: 'Estado',
    user_email: 'Usuario',
    resource_type: 'Tipo de Recurso',
    ip_address: 'IP',
    created_at: 'Fecha'
  };
  return names[field] || field;
}

function getOperatorDisplayName(operator: string): string {
  const operators: Record<string, string> = {
    eq: '=',
    ne: '≠',
    gt: '>',
    gte: '≥',
    lt: '<',
    lte: '≤',
    like: 'contiene',
    starts_with: 'empieza con',
    ends_with: 'termina con',
    between: 'entre'
  };
  return operators[operator] || operator;
}

function getFilterValueDisplay(filter: Filter): string {
  if (Array.isArray(filter.value)) {
    return filter.value.join(' - ');
  }
  if (filter.field === 'status') {
    const statusNames: Record<string, string> = {
      success: 'Éxito',
      failed: 'Error',
      warning: 'Advertencia'
    };
    return statusNames[filter.value] || filter.value;
  }
  return String(filter.value);
}

function addFilter(): void {
  if (!canAddFilter.value) return;

  let value = newFilter.value.value;
  
  if (newFilter.value.operator === 'between') {
    if (!Array.isArray(value)) {
      value = ['', ''];
    }
  }

  activeFilters.value.push({
    field: newFilter.value.field,
    operator: newFilter.value.operator,
    value: value
  });

  newFilter.value = {
    field: '',
    operator: '',
    value: ''
  };

  applyFilters();
}

function removeFilter(index: number): void {
  activeFilters.value.splice(index, 1);
  applyFilters();
}

function clearAdvancedFilters(): void {
  activeFilters.value = [];
  applyFilters();
}

function applyQuickFilter(quickFilter: any): void {
  const exists = activeFilters.value.some(f => 
    f.field === quickFilter.filter.field && 
    f.operator === quickFilter.filter.operator &&
    f.value === quickFilter.filter.value
  );

  if (!exists) {
    activeFilters.value.push(quickFilter.filter);
    applyFilters();
  }
}

// ✅ MAIN FUNCTIONS
function handleLoadClick() {
  loadActivityLogs(true);
}

async function loadActivityLogs(reset = true) {
  try {
    loading.value = reset;

    if (reset) {
      paginationMeta.value.page = 1;
    }

    const useAdvanced = activeFilters.value.length > 0;
    
    if (useAdvanced) {
      // ✅ USE ADVANCED ENDPOINT
      const advancedFilters = [...activeFilters.value];
      
      // Add basic filters to advanced
      if (filters.value.action) {
        advancedFilters.push({ field: 'action', operator: 'like', value: filters.value.action });
      }
      if (filters.value.user_email) {
        advancedFilters.push({ field: 'user_email', operator: 'eq', value: filters.value.user_email });
      }
      if (filters.value.status) {
        advancedFilters.push({ field: 'status', operator: 'eq', value: filters.value.status });
      }

      const params: any = {
        page: paginationMeta.value.page,
        limit: paginationMeta.value.limit,
        search: searchQuery.value.trim() || undefined,
        filters: JSON.stringify(advancedFilters),
        sort: JSON.stringify([{ field: 'created_at', direction: 'DESC' }])
      };

      const response = await activityLogsAPI.getAdvanced(params);
      const responseData = response.data as any;

      if (responseData?.success) {
        allLogs.value = responseData.data || [];
        paginationMeta.value = {
          page: responseData.meta?.page || 1,
          limit: responseData.meta?.limit || 50,
          total: responseData.meta?.total || 0,
          totalPages: responseData.meta?.totalPages || 0,
          hasNext: responseData.meta?.hasNext || false,
          hasPrev: responseData.meta?.hasPrev || false
        };
      }
    } else {
      // ✅ USE BASIC ENDPOINT
      const params: any = {
        page: paginationMeta.value.page,
        limit: paginationMeta.value.limit,
        search: searchQuery.value.trim() || undefined,
        action: filters.value.action || undefined,
        user_email: filters.value.user_email || undefined,
        status: filters.value.status || undefined,
      };

      const response = await activityLogsAPI.getAll(params);
      const responseData = response.data as any;

      if (responseData?.success) {
        allLogs.value = responseData.data || [];
        paginationMeta.value = {
          page: responseData.meta?.page || 1,
          limit: responseData.meta?.limit || 50,
          total: responseData.meta?.total || 0,
          totalPages: responseData.meta?.totalPages || 0,
          hasNext: responseData.meta?.hasNext || false,
          hasPrev: responseData.meta?.hasPrev || false
        };
      }
    }

    // Load additional data
    await Promise.all([
      loadStats(),
      loadUniqueValues()
    ]);

  } catch (e: any) {
    console.error("Error loading activity logs:", e);
    error.value = e?.response?.data?.message || "Error cargando logs de actividad";
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  try {
    const statsResponse = await activityLogsAPI.getStats();
    const responseData = statsResponse.data as any;
    
    if (responseData?.success) {
      const data = responseData.data;
      stats.value = {
        totalEvents: data.total_logs || 0,
        todayEvents: data.today_logs || 0,
        errorEvents: allLogs.value.filter((log) => log.status === "failed").length,
        activeUsers: uniqueUsers.value.length,
      };
    }
  } catch (e) {
    console.error("Error loading stats:", e);
  }
}

async function loadUniqueValues() {
  try {
    // Load unique users and actions
    const [usersRes, actionsRes] = await Promise.all([
      activityLogsAPI.getUniqueUsers().catch(() => ({ data: { success: false, data: [] } })),
      activityLogsAPI.getUniqueActions().catch(() => ({ data: { success: false, data: [] } }))
    ]);

    const usersData = usersRes.data as any;
    const actionsData = actionsRes.data as any;

    if (usersData?.success) {
      uniqueUsers.value = usersData.data || [];
    }
    if (actionsData?.success) {
      uniqueActions.value = actionsData.data || [];
    }
  } catch (e) {
    console.warn("Error loading unique values:", e);
  }
}

function handleSearchInput(): void {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    paginationMeta.value.page = 1;
    applyFilters();
  }, 500);
}

function applyFilters() {
  paginationMeta.value.page = 1;
  loadActivityLogs();
}

function clearAllFilters() {
  activeFilters.value = [];
  searchQuery.value = "";
  filters.value = {
    action: "",
    user_email: "",
    status: "",
  };
  loadActivityLogs();
}

function goToPage(page: number): void {
  if (page >= 1 && page <= paginationMeta.value.totalPages) {
    paginationMeta.value.page = page;
    loadActivityLogs(false);
  }
}

function getVisiblePages(): number[] {
  const current = paginationMeta.value.page;
  const total = paginationMeta.value.totalPages;
  const delta = 2;
  const range = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    range.unshift('...' as any);
  }
  if (current + delta < total - 1) {
    range.push('...' as any);
  }

  range.unshift(1);
  if (total > 1) {
    range.push(total);
  }

  return range.filter((v, i, arr) => arr.indexOf(v) === i) as number[];
}

async function exportLogs() {
  try {
    exporting.value = true;

    // Prepare export parameters
    const exportParams: any = {
      format: 'csv',
      limit: 10000 // Max export limit
    };

    // Add current filters to export
    if (activeFilters.value.length > 0) {
      const advancedFilters = [...activeFilters.value];
      
      if (filters.value.action) {
        advancedFilters.push({ field: 'action', operator: 'like', value: filters.value.action });
      }
      if (filters.value.user_email) {
        advancedFilters.push({ field: 'user_email', operator: 'eq', value: filters.value.user_email });
      }
      if (filters.value.status) {
        advancedFilters.push({ field: 'status', operator: 'eq', value: filters.value.status });
      }

      exportParams.filters = JSON.stringify(advancedFilters);
      
      const exportResponse = await activityLogsAPI.exportAdvanced(exportParams);
      const responseData = exportResponse.data as any;

      if (responseData?.success && responseData.data) {
        downloadCSV(responseData.data, `activity_logs_advanced_${new Date().toISOString().split("T")[0]}.csv`);
      }
    } else {
      // Basic export
      Object.keys(filters.value).forEach(key => {
        const value = filters.value[key as keyof typeof filters.value];
        if (value) {
          exportParams[key] = value;
        }
      });

      if (searchQuery.value.trim()) {
        exportParams.search = searchQuery.value.trim();
      }

      const exportResponse = await activityLogsAPI.export(exportParams);
      const responseData = exportResponse.data as any;

      if (responseData?.success && responseData.data) {
        downloadCSV(responseData.data, `activity_logs_${new Date().toISOString().split("T")[0]}.csv`);
      }
    }
  } catch (e: any) {
    console.error("Error exporting logs:", e);
    error.value = e?.response?.data?.message || "Error exportando logs";
  } finally {
    exporting.value = false;
  }
}

function downloadCSV(csvData: string, filename: string): void {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toggleAutoRefresh() {
  autoRefresh.value = !autoRefresh.value;

  if (autoRefresh.value) {
    refreshInterval = setInterval(() => {
      loadActivityLogs(true);
    }, 30000);
  } else {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }
}

function showLogDetails(log: ActivityLog) {
  selectedLog.value = log;
}

// ✅ UTILITY FUNCTIONS
function getStatusColor(action: string, status: string): string {
  if (status === "failed") {
    return "bg-red-500";
  }
  if (action.includes("create")) {
    return "bg-green-500";
  }
  if (action.includes("update")) {
    return "bg-blue-500";
  }
  if (action.includes("delete")) {
    return "bg-red-400";
  }
  if (action === "login") {
    return "bg-green-400";
  }
  if (action === "logout") {
    return "bg-gray-400";
  }
  return "bg-purple-500";
}

function getActionBadgeColor(action: string): string {
  if (action.includes("create")) return "bg-green-100 text-green-800";
  if (action.includes("update")) return "bg-blue-100 text-blue-800";
  if (action.includes("delete")) return "bg-red-100 text-red-800";
  if (action === "login") return "bg-green-100 text-green-800";
  if (action === "logout") return "bg-gray-100 text-gray-800";
  return "bg-purple-100 text-purple-800";
}

function getStatusBadgeColor(status: string): string {
  if (status === "success") return "bg-green-100 text-green-800";
  if (status === "failed") return "bg-red-100 text-red-800";
  if (status === "warning") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
}

function formatDescription(log: ActivityLog): string {
  if (log.resource_name) {
    return `${log.action} en ${log.resource_type}: ${log.resource_name}`;
  }
  if (log.resource_type) {
    return `${log.action} en ${log.resource_type}`;
  }
  return log.action;
}

function formatDateGroup(dateInput: string | number): string {
  const dateString = String(dateInput);
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer";
  }
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Hace menos de 1 minuto";
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// ✅ WATCH for URL params
watch([() => newFilter.value.field], () => {
  newFilter.value.operator = '';
  newFilter.value.value = '';
});

watch(() => newFilter.value.operator, () => {
  if (newFilter.value.operator === 'between') {
    newFilter.value.value = ['', ''];
  } else {
    newFilter.value.value = '';
  }
});

// Lifecycle
onMounted(() => {
  // Check URL params for initial filters
  if (route.query.search) {
    searchQuery.value = route.query.search as string;
  }
  
  loadActivityLogs();
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
