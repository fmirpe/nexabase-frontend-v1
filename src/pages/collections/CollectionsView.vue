<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Colecciones</h1>
        <p class="mt-2 text-sm text-gray-600">
          Administra colecciones dinámicas y esquemas de datos
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <button
          @click="openCreateCollection"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Colección
        </button>
        <button
          @click="toggleAdvancedFilters"
          :class="[
            'px-3 py-2 rounded-lg transition-colors',
            showAdvancedFilters 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
          title="Filtros Avanzados"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
        </button>
        <button
          @click="exportCollections"
          class="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
          title="Exportar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button
          @click="refreshCollections"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Refrescar"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Basic Filters -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar colecciones por nombre..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedStatus"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
          <select
            v-model.number="meta.limit"
            @change="goToPage(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="10">10</option>
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
          Limpiar filtros
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
            <option value="name">Nombre</option>
            <option value="is_active">Estado</option>
            <option value="record_count">Cantidad de registros</option>
            <option value="created_at">Fecha de creación</option>
            <option value="updated_at">Última actualización</option>
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
            v-if="!['is_active'].includes(newFilter.field) && !['between'].includes(newFilter.operator)"
            v-model="newFilter.value"
            :type="['record_count'].includes(newFilter.field) ? 'number' : 'text'"
            placeholder="Ingrese valor..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <!-- Select for status -->
          <select
            v-else-if="newFilter.field === 'is_active'"
            v-model="newFilter.value"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar estado</option>
            <option :value="true">Activa</option>
            <option :value="false">Inactiva</option>
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

      <!-- Date Range Quick Filters -->
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

    <!-- ✅ NUEVO: Stats Cards -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Colecciones</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCollections }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Activas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.activeCollections }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Registros</p>
            <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(stats.totalRecords) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Recientes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.recentlyCreated?.length || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error/Loading -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
      {{ error }}
      <button
        @click="loadCollections"
        class="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>
    <div v-if="loading" class="bg-white border border-gray-200 rounded-lg p-4">
      Cargando colecciones...
    </div>

    <!-- Collections Grid -->
    <div v-if="!loading && collections.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ collection.name }}</h3>
              <p class="text-sm text-gray-500">{{ collection.metadata?.description || 'Sin descripción' }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <button
              @click="openEditCollection(collection)"
              class="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="Editar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="viewCollectionData(collection)"
              class="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
              title="Ver datos"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              @click="confirmDeleteCollection(collection)"
              class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Eliminar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Estado:</span>
            <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                collection.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]">
              {{ collection.is_active ? "Activa" : "Inactiva" }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Registros:</span>
            <span class="text-sm font-medium text-gray-900">{{ formatNumber(collection.record_count) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Campos:</span>
            <span class="text-sm text-gray-900">{{ Object.keys(collection.schema?.fields || {}).length }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Creada:</span>
            <span class="text-sm text-gray-900">{{ formatDate(collection.created_at) }}</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          <button
            @click="toggleCollectionStatus(collection)"
            :class="[
              'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              collection.is_active
                ? 'bg-red-50 hover:bg-red-100 text-red-700'
                : 'bg-green-50 hover:bg-green-100 text-green-700',
            ]"
          >
            {{ collection.is_active ? "Desactivar" : "Activar" }}
          </button>
          <button
            @click="duplicateCollection(collection)"
            class="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors"
          >
            Duplicar
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay colecciones</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ hasActiveFilters ? 'No se encontraron colecciones con los filtros aplicados.' : 'Comienza creando tu primera colección.' }}
      </p>
      <div class="mt-6 flex justify-center gap-3">
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
        >
          Limpiar Filtros
        </button>
        <button
          @click="openCreateCollection"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Colección
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && meta.pages > 1" class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
      <div class="text-sm text-gray-600">
        Página {{ meta.page }} de {{ meta.pages }} • {{ meta.total }} total
        <span v-if="hasActiveFilters" class="text-blue-600">
          (filtrado de {{ stats?.totalCollections || meta.total }})
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(meta.page - 1)"
          :disabled="meta.page <= 1"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          @click="goToPage(meta.page + 1)"
          :disabled="meta.page >= meta.pages"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Create/Edit Collection Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-6 mx-auto p-5 w-full max-w-2xl shadow-lg rounded-md bg-white border"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ isEditing ? "Editar Colección" : "Nueva Colección" }}
        </h3>

        <div
          v-if="formError"
          class="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3"
        >
          {{ formError }}
        </div>

        <form @submit.prevent="saveCollection" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              v-model="collectionForm.name"
              type="text"
              required
              :disabled="isEditing"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="nombre_coleccion"
            />
            <p class="text-xs text-gray-500 mt-1">Solo letras minúsculas, números y guiones bajos</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <input
              v-model="collectionForm.description"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción de la colección"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Schema (JSON)</label>
            <textarea
              v-model="collectionForm.schemaJson"
              rows="10"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder='{"fields": {"name": {"type": "string", "required": true}}}'
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Define los campos y tipos de datos en formato JSON</p>
          </div>

          <div class="flex items-center">
            <input
              v-model="collectionForm.is_active"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-700">Colección activa</label>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
            >
              {{ saving ? "Guardando..." : isEditing ? "Actualizar" : "Crear" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white border rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h4 class="text-lg font-semibold text-gray-900">Eliminar Colección</h4>
        <p class="text-sm text-gray-600 mt-2">
          ¿Estás seguro de que deseas eliminar la colección
          <strong>{{ collectionToDelete?.name }}</strong>? 
          Esta acción eliminará todos los datos y no se puede deshacer.
        </p>
        <div class="flex gap-3 mt-6">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            @click="deleteCollection"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded"
          >
            {{ deleting ? "Eliminando..." : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { adminCollections } from "../../services/api";

// ✅ TIPOS TypeScript
interface Collection {
  id: string;
  name: string;
  is_active: boolean;
  record_count: number;
  schema: any;
  metadata?: { description?: string };
  created_at: string;
  updated_at?: string;
}

interface CollectionForm {
  name: string;
  description: string;
  schemaJson: string;
  is_active: boolean;
}

interface Filter {
  field: string;
  operator: string;
  value: any;
}

interface Stats {
  totalCollections: number;
  activeCollections: number;
  totalRecords: number;
  topCollectionsByRecords: Array<{ name: string; record_count: number }>;
  recentlyCreated: Array<{ name: string; created_at: string }>;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface APIResponse {
  data: Collection[];
  meta: PaginationMeta;
}

const router = useRouter();

// State
const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const deleting = ref<boolean>(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);

// Data
const collections = ref<Collection[]>([]);
const stats = ref<Stats | null>(null);
const meta = ref<PaginationMeta>({
  page: 1,
  limit: 12,
  total: 0,
  pages: 0,
});

// ✅ Advanced Filters
const showAdvancedFilters = ref<boolean>(false);
const activeFilters = ref<Filter[]>([]);
const newFilter = ref<Filter>({
  field: '',
  operator: '',
  value: ''
});

// Basic Filters
const searchQuery = ref<string>("");
const selectedStatus = ref<string>("");

// Modals
const showModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const collectionToDelete = ref<Collection | null>(null);

// Form
const collectionForm = ref<CollectionForm>({
  name: "",
  description: "",
  schemaJson: "",
  is_active: true,
});
const editingCollection = ref<Collection | null>(null);

// Debounce search
let searchTimeout: NodeJS.Timeout;

// ✅ Quick Filters
const quickFilters = [
  {
    label: 'Últimos 7 días',
    filter: { field: 'created_at', operator: 'gte', value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  },
  {
    label: 'Últimos 30 días',
    filter: { field: 'created_at', operator: 'gte', value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  },
  {
    label: 'Solo activas',
    filter: { field: 'is_active', operator: 'eq', value: true }
  },
  {
    label: 'Con más de 100 registros',
    filter: { field: 'record_count', operator: 'gt', value: 100 }
  }
];

// ✅ COMPUTED
const hasActiveFilters = computed(() => {
  return activeFilters.value.length > 0 || searchQuery.value.trim() || selectedStatus.value;
});

const canAddFilter = computed(() => {
  return newFilter.value.field && newFilter.value.operator && 
         (newFilter.value.value !== '' && newFilter.value.value !== null);
});

// ✅ Advanced Filters Functions
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

  const numberOperators = [
    { value: 'eq', label: 'Igual a' },
    { value: 'ne', label: 'Diferente de' },
    { value: 'gt', label: 'Mayor que' },
    { value: 'gte', label: 'Mayor o igual que' },
    { value: 'lt', label: 'Menor que' },
    { value: 'lte', label: 'Menor o igual que' }
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

  if (['created_at', 'updated_at'].includes(field)) {
    return dateOperators;
  }
  if (['record_count'].includes(field)) {
    return numberOperators;
  }
  if (['is_active'].includes(field)) {
    return selectOperators;
  }
  return textOperators;
}

function getFilterDisplayName(field: string): string {
  const names: Record<string, string> = {
    name: 'Nombre',
    is_active: 'Estado',
    record_count: 'Cantidad de registros',
    created_at: 'Fecha de creación',
    updated_at: 'Última actualización'
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
  if (filter.field === 'is_active') {
    return filter.value ? 'Activa' : 'Inactiva';
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

function clearAllFilters(): void {
  activeFilters.value = [];
  searchQuery.value = '';
  selectedStatus.value = '';
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

// ✅ API Functions
async function loadCollections(): Promise<void> {
  try {
    loading.value = true;
    error.value = null;

    const useAdvanced = activeFilters.value.length > 0;
    
    const params: Record<string, any> = {
      page: meta.value.page,
      limit: meta.value.limit,
    };

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    if (useAdvanced) {
      const filters = [...activeFilters.value];
      
      if (selectedStatus.value) {
        filters.push({ field: 'is_active', operator: 'eq', value: selectedStatus.value === 'true' });
      }

      if (filters.length > 0) {
        params.filters = JSON.stringify(filters);
      }

      params.sort = JSON.stringify([{ field: 'created_at', direction: 'DESC' }]);

      const response = await adminCollections.listAdvanced(params);
      // ✅ CORRECCIÓN: Type assertion para response.data
      const data = response.data as APIResponse;

      collections.value = data.data || [];
      meta.value = {
        page: data.meta?.page || 1,
        limit: data.meta?.limit || 12,
        total: data.meta?.total || 0,
        pages: data.meta?.pages || 0,
      };
    } else {
      const legacyParams: any = {
        page: meta.value.page,
        limit: meta.value.limit,
      };

      if (searchQuery.value.trim()) {
        legacyParams.q = searchQuery.value.trim();
      }

      const response = await adminCollections.list(legacyParams);
      // ✅ CORRECCIÓN: Type assertion para response.data
      const data = response.data as APIResponse;

      collections.value = data.data || [];
      meta.value = {
        page: data.meta?.page || 1,
        limit: data.meta?.limit || 12,
        total: data.meta?.total || 0,
        pages: data.meta?.pages || 0,
      };
    }
  } catch (e: any) {
    console.error("Error loading collections:", e);
    error.value = e?.response?.data?.message || e?.message || "Error cargando colecciones";
  } finally {
    loading.value = false;
  }
}

async function loadStats(): Promise<void> {
  try {
    const response = await adminCollections.getStats();
    stats.value = response.data as Stats;
  } catch (e: any) {
    console.error("Error loading stats:", e);
    // No mostrar error para stats, es opcional
  }
}

async function exportCollections(): Promise<void> {
  try {
    const params: any = {
      limit: 1000,
    };

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    if (activeFilters.value.length > 0) {
      const filters = [...activeFilters.value];
      
      if (selectedStatus.value) {
        filters.push({ field: 'is_active', operator: 'eq', value: selectedStatus.value === 'true' });
      }

      params.filters = JSON.stringify(filters);
    }

    const response = await adminCollections.listAdvanced(params);
    // ✅ CORRECCIÓN: Type assertion para response.data
    const responseData = response.data as APIResponse;
    const collections = responseData.data || [];

    const csvContent = [
      ['Nombre', 'Estado', 'Registros', 'Campos', 'Descripción', 'Fecha de Creación'].join(','),
      ...collections.map((collection: any) => [
        collection.name,
        collection.is_active ? 'Activa' : 'Inactiva',
        collection.record_count,
        Object.keys(collection.schema?.fields || {}).length,
        collection.metadata?.description || 'Sin descripción',
        new Date(collection.created_at).toLocaleDateString('es-ES')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `colecciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e: any) {
    console.error("Error exporting collections:", e);
    error.value = "Error exportando colecciones";
  }
}

async function saveCollection(): Promise<void> {
  try {
    saving.value = true;
    formError.value = null;

    let schema;
    try {
      schema = JSON.parse(collectionForm.value.schemaJson);
    } catch (e) {
      throw new Error('Schema JSON inválido');
    }

    const payload = {
      name: collectionForm.value.name,
      schema,
      metadata: {
        description: collectionForm.value.description
      },
      is_active: collectionForm.value.is_active
    };

    if (isEditing.value && editingCollection.value) {
      await adminCollections.update(editingCollection.value.name, payload);
    } else {
      await adminCollections.create(payload);
    }

    closeModal();
    await Promise.all([loadCollections(), loadStats()]);
  } catch (e: any) {
    console.error("Error saving collection:", e);
    formError.value = e?.response?.data?.message || e?.message || "Error guardando colección";
  } finally {
    saving.value = false;
  }
}

async function deleteCollection(): Promise<void> {
  if (!collectionToDelete.value) return;

  try {
    deleting.value = true;
    await adminCollections.delete(collectionToDelete.value.name);
    showDeleteModal.value = false;
    collectionToDelete.value = null;
    await Promise.all([loadCollections(), loadStats()]);
  } catch (e: any) {
    console.error("Error deleting collection:", e);
    error.value = e?.response?.data?.message || e?.message || "Error eliminando colección";
  } finally {
    deleting.value = false;
  }
}

async function toggleCollectionStatus(collection: Collection): Promise<void> {
  try {
    await adminCollections.update(collection.name, { is_active: !collection.is_active });
    await Promise.all([loadCollections(), loadStats()]);
  } catch (e: any) {
    console.error("Error updating collection status:", e);
    error.value = e?.response?.data?.message || e?.message || "Error actualizando estado de la colección";
  }
}

async function duplicateCollection(collection: Collection): Promise<void> {
  try {
    const newName = `${collection.name}_copy_${Date.now()}`;
    const payload = {
      name: newName,
      schema: collection.schema,
      metadata: {
        description: `Copia de ${collection.name}`
      },
      is_active: false
    };

    await adminCollections.create(payload);
    await Promise.all([loadCollections(), loadStats()]);
  } catch (e: any) {
    console.error("Error duplicating collection:", e);
    error.value = e?.response?.data?.message || e?.message || "Error duplicando colección";
  }
}

// UI Functions
function openCreateCollection(): void {
  isEditing.value = false;
  editingCollection.value = null;
  collectionForm.value = {
    name: "",
    description: "",
    schemaJson: '{\n  "fields": {\n    "name": {\n      "type": "string",\n      "required": true\n    }\n  }\n}',
    is_active: true,
  };
  showModal.value = true;
}

function openEditCollection(collection: Collection): void {
  isEditing.value = true;
  editingCollection.value = collection;
  collectionForm.value = {
    name: collection.name,
    description: collection.metadata?.description || "",
    schemaJson: JSON.stringify(collection.schema, null, 2),
    is_active: collection.is_active,
  };
  showModal.value = true;
}

function closeModal(): void {
  showModal.value = false;
  formError.value = null;
}

function confirmDeleteCollection(collection: Collection): void {
  collectionToDelete.value = collection;
  showDeleteModal.value = true;
}

function viewCollectionData(collection: Collection): void {
  router.push(`/admin/collections/${collection.name}/data`);
}

async function refreshCollections(): Promise<void> {
  await Promise.all([loadCollections(), loadStats()]);
}

function goToPage(page: number): void {
  if (page >= 1 && page <= meta.value.pages) {
    meta.value.page = page;
    loadCollections();
  }
}

function handleSearch(): void {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    meta.value.page = 1;
    loadCollections();
  }, 500);
}

function applyFilters(): void {
  meta.value.page = 1;
  loadCollections();
}

// Utilities
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num);
}

// ✅ WATCH: Reset operator and value when field changes
watch(() => newFilter.value.field, () => {
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
  Promise.all([loadCollections(), loadStats()]);
});
</script>
