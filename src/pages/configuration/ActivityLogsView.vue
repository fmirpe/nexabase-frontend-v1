<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Logs de Actividad</h1>
        <p class="text-gray-600 mt-2">
          Timeline completo de todas las acciones administrativas y eventos del
          sistema
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="toggleAdvancedFilters"
          :class="[
            'px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors',
            showAdvancedFilters 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          <span>Filtros Avanzados</span>
        </button>
        <button
          @click="exportLogs"
          :disabled="exporting"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <svg
            v-if="!exporting"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 animate-spin"
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
          <span>{{ exporting ? "Exportando..." : "Exportar" }}</span>
        </button>
        <button
          @click="handleLoadClick"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <svg
            v-if="!loading"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 animate-spin"
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
          <span>{{ loading ? "Cargando..." : "Actualizar" }}</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total de Eventos</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ formatNumber(stats.totalEvents) }}
            </p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Hoy</p>
            <p class="text-3xl font-bold text-green-600 mt-2">
              {{ formatNumber(stats.todayEvents) }}
            </p>
          </div>
          <div class="p-3 bg-green-50 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Errores</p>
            <p class="text-3xl font-bold text-red-600 mt-2">
              {{ formatNumber(stats.errorEvents) }}
            </p>
          </div>
          <div class="p-3 bg-red-50 rounded-lg">
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">
              {{ formatNumber(stats.activeUsers) }}
            </p>
          </div>
          <div class="p-3 bg-purple-50 rounded-lg">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Basic Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Filtros Básicos</h3>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">
            {{ formatNumber(paginationMeta.total) }} eventos encontrados
          </span>
          <button
            @click="clearAllFilters"
            class="text-gray-600 hover:text-gray-800 text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Búsqueda Global
          </label>
          <input
            v-model="searchQuery"
            @input="handleSearchInput"
            type="text"
            placeholder="Buscar en logs..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Evento
          </label>
          <select
            v-model="filters.action"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option v-for="action in uniqueActions" :key="action" :value="action">
              {{ action }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <select
            v-model="filters.user_email"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los usuarios</option>
            <option 
              v-for="(user, index) in uniqueUsers" 
              :key="`user-${index}`" 
              :value="user"
            >
              {{ user }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="success">Éxito</option>
            <option value="failed">Error</option>
            <option value="warning">Advertencia</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600">Auto-refresh:</label>
          <button
            @click="toggleAutoRefresh"
            :class="[
              'px-3 py-1 rounded text-sm font-medium transition-colors',
              autoRefresh
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ autoRefresh ? "ON" : "OFF" }}
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600">Mostrar:</label>
          <select
            v-model="paginationMeta.limit"
            @change="goToPage(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ✅ NUEVO: Advanced Filters Panel -->
    <div 
      v-if="showAdvancedFilters" 
      class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Filtros Avanzados</h3>
        <button 
          @click="clearAdvancedFilters"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          Limpiar filtros avanzados
        </button>
      </div>

      <!-- Active Filters Display -->
      <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2">
        <div
          v-for="(filter, index) in activeFilters"
          :key="index"
          class="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          <span>{{ getFilterDisplayName(filter.field) }}</span>
          <span class="text-blue-600">{{ getOperatorDisplayName(filter.operator) }}</span>
          <span class="font-medium">{{ getFilterValueDisplay(filter) }}</span>
          <button 
            @click="removeFilter(index)"
            class="text-blue-600 hover:text-blue-800"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Filter Builder -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Campo</label>
          <select
            v-model="newFilter.field"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar campo</option>
            <option value="action">Acción</option>
            <option value="status">Estado</option>
            <option value="user_email">Usuario</option>
            <option value="resource_type">Tipo de Recurso</option>
            <option value="ip_address">Dirección IP</option>
            <option value="created_at">Fecha</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Operador</label>
          <select
            v-model="newFilter.operator"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar operador</option>
            <option v-for="op in getAvailableOperators(newFilter.field)" :key="op.value" :value="op.value">
              {{ op.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Valor</label>
          <!-- Text input for most fields -->
          <input
            v-if="!['status'].includes(newFilter.field) && !['between'].includes(newFilter.operator)"
            v-model="newFilter.value"
            :type="['created_at'].includes(newFilter.field) ? 'date' : 'text'"
            placeholder="Ingrese valor..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <!-- Select for status -->
          <select
            v-else-if="newFilter.field === 'status'"
            v-model="newFilter.value"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar estado</option>
            <option value="success">Éxito</option>
            <option value="failed">Error</option>
            <option value="warning">Advertencia</option>
          </select>
          <!-- Date range for between operator -->
          <div v-else-if="newFilter.operator === 'between'" class="flex gap-2">
            <input
              v-model="newFilter.value[0]"
              type="date"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="newFilter.value[1]"
              type="date"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex items-end">
          <button
            @click="addFilter"
            :disabled="!canAddFilter"
            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Agregar Filtro
          </button>
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="flex flex-wrap gap-2">
        <span class="text-sm font-medium text-gray-700">Filtros rápidos:</span>
        <button
          v-for="quickFilter in quickFilters"
          :key="quickFilter.label"
          @click="applyQuickFilter(quickFilter)"
          class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
        >
          {{ quickFilter.label }}
        </button>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Timeline de Actividad</h3>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              Página {{ paginationMeta.page }} de {{ paginationMeta.totalPages }}
            </span>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div v-if="loading" class="space-y-6">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="flex items-start space-x-4">
              <div class="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="allLogs.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay logs</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ hasActiveFilters ? "No hay eventos que coincidan con los filtros." : "No se han registrado eventos aún." }}
          </p>
          <div class="mt-6">
            <button
              v-if="hasActiveFilters"
              @click="clearAllFilters"
              class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <!-- Group by date -->
          <div
            v-for="(dayLogs, date) in groupedLogs"
            :key="date"
            class="space-y-4"
          >
            <div class="flex items-center">
              <div class="flex-1 border-t border-gray-200"></div>
              <div
                class="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600"
              >
                {{ formatDateGroup(date) }}
              </div>
              <div class="flex-1 border-t border-gray-200"></div>
            </div>

            <div class="space-y-4">
              <div
                v-for="log in dayLogs"
                :key="log.id"
                class="flex items-start space-x-4 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <!-- Status indicator -->
                <div class="mt-2">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full border-2 border-white shadow',
                      getStatusColor(log.action, log.status),
                    ]"
                  ></div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-medium text-gray-900">{{
                          log.action
                        }}</span>
                        <span
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-full',
                            getActionBadgeColor(log.action),
                          ]"
                        >
                          {{ log.action.toUpperCase() }}
                        </span>
                        <span
                          v-if="log.status"
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-full',
                            getStatusBadgeColor(log.status),
                          ]"
                        >
                          {{ log.status }}
                        </span>
                      </div>

                      <p class="text-sm text-gray-600 mb-2">
                        {{ formatDescription(log) }}
                      </p>

                      <!-- Details -->
                      <div
                        class="flex items-center space-x-4 text-xs text-gray-500"
                      >
                        <span v-if="log.user_email">
                          👤 {{ log.user_email }}
                        </span>
                        <span v-if="log.resource_type">
                          📄 {{ log.resource_type }}
                        </span>
                        <span v-if="log.resource_id">
                          🔗 {{ log.resource_id.substring(0, 8) }}...
                        </span>
                        <span v-if="log.ip_address">
                          🌐 {{ log.ip_address }}
                        </span>
                        <span>{{ formatRelativeTime(log.created_at) }}</span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="log.metadata"
                        @click="showLogDetails(log)"
                        class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Ver detalles"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>

                      <span class="text-xs text-gray-400">
                        {{ new Date(log.created_at).toLocaleTimeString() }}
                      </span>
                    </div>
                  </div>

                  <!-- Error details -->
                  <div
                    v-if="log.status === 'failed' && log.metadata"
                    class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                  >
                    {{ JSON.stringify(log.metadata, null, 2) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ MEJORADO: Pagination -->
    <div v-if="!loading && paginationMeta.totalPages > 1" class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-sm text-gray-600">
        Mostrando {{ ((paginationMeta.page - 1) * paginationMeta.limit) + 1 }} a {{ Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total) }} de {{ formatNumber(paginationMeta.total) }} resultados
        <span v-if="hasActiveFilters" class="text-blue-600">
          (filtrado)
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(paginationMeta.page - 1)"
          :disabled="paginationMeta.page <= 1"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Anterior
        </button>
        
        <!-- Page numbers -->
        <div class="flex items-center gap-1">
          <button
            v-for="page in getVisiblePages()"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1.5 rounded text-sm transition-colors',
              page === paginationMeta.page 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-50 text-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="goToPage(paginationMeta.page + 1)"
          :disabled="paginationMeta.page >= paginationMeta.totalPages"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      @click="selectedLog = null"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              Detalles del Evento
            </h2>
            <button
              @click="selectedLog = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Acción</label
            >
            <p class="text-sm text-gray-900 mt-1">{{ selectedLog.action }}</p>
          </div>

          <div v-if="selectedLog.user_email">
            <label class="block text-sm font-medium text-gray-700"
              >Usuario</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ selectedLog.user_email }}
            </p>
          </div>

          <div v-if="selectedLog.resource_type">
            <label class="block text-sm font-medium text-gray-700"
              >Tipo de Recurso</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ selectedLog.resource_type }}
            </p>
          </div>

          <div v-if="selectedLog.resource_id">
            <label class="block text-sm font-medium text-gray-700"
              >ID de Recurso</label
            >
            <p class="text-sm text-gray-900 mt-1 font-mono">
              {{ selectedLog.resource_id }}
            </p>
          </div>

          <div v-if="selectedLog.resource_name">
            <label class="block text-sm font-medium text-gray-700"
              >Nombre de Recurso</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ selectedLog.resource_name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Estado</label
            >
            <p class="text-sm text-gray-900 mt-1">{{ selectedLog.status }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Fecha y Hora</label
            >
            <p class="text-sm text-gray-900 mt-1">
              {{ new Date(selectedLog.created_at).toLocaleString() }}
            </p>
          </div>

          <div v-if="selectedLog.ip_address">
            <label class="block text-sm font-medium text-gray-700"
              >Dirección IP</label
            >
            <p class="text-sm text-gray-900 mt-1">{{ selectedLog.ip_address }}</p>
          </div>

          <div v-if="selectedLog.metadata">
            <label class="block text-sm font-medium text-gray-700"
              >Detalles</label
            >
            <pre
              class="text-xs bg-gray-50 p-3 rounded border mt-1 overflow-x-auto"
              >{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div
      v-if="error"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      @click="error = null"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center mb-4">
          <svg
            class="w-6 h-6 text-red-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900">Error</h3>
        </div>
        <p class="text-sm text-gray-600 mb-4">{{ error }}</p>
        <div class="flex justify-end">
          <button
            @click="error = null"
            class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
