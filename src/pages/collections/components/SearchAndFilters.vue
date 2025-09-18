<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">
        {{ currentCollection ? `Registros de ${currentCollection.name}` : 'Búsqueda y Filtros' }}
      </h3>
      <div class="mt-2 sm:mt-0 flex items-center space-x-4">
        <span class="text-sm text-gray-500">
          {{ currentCollection ? formatNumber(filteredRecordsCount) : formatNumber(filteredCollectionsCount) }} 
          {{ currentCollection ? 'registros' : 'collections' }} encontrados
        </span>
        <button
          v-if="selectedRecords.length > 0"
          @click="$emit('open-bulk-delete')"
          class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
        >
          Eliminar Seleccionados ({{ selectedRecords.length }})
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Búsqueda Global
        </label>
        <input
          :value="searchQuery"
          @input="$emit('search-input', $event)"
          type="text"
          :placeholder="currentCollection ? 'Buscar en registros...' : 'Buscar collections...'"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div v-if="!currentCollection">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <select
          :value="collectionFilters.is_active"
          @change="$emit('apply-filters')"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas</option>
          <option value="true">Activas</option>
          <option value="false">Inactivas</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Mostrar
        </label>
        <select
          :value="pagination.limit"
          @change="$emit('go-to-page', 1)"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <div class="flex items-center justify-between mt-4">
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('clear-filters')"
          class="text-gray-600 hover:text-gray-800 text-sm"
        >
          Limpiar filtros
        </button>
        <button
          v-if="currentCollection"
          @click="$emit('export-records')"
          :disabled="exportingRecords"
          class="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
        >
          {{ exportingRecords ? 'Exportando...' : 'Exportar Registros' }}
        </button>
        <button
          v-else
          @click="$emit('export-collections')"
          :disabled="exportingCollections"
          class="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
        >
          {{ exportingCollections ? 'Exportando...' : 'Exportar Collections' }}
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600">Auto-refresh:</label>
        <button
          @click="$emit('toggle-auto-refresh')"
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
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentCollection: any;
  searchQuery: string;
  collectionFilters: any;
  pagination: any;
  filteredCollectionsCount: number;
  filteredRecordsCount: number;
  selectedRecords: string[];
  autoRefresh: boolean;
  exportingRecords: boolean;
  exportingCollections: boolean;
}

defineProps<Props>();

defineEmits<{
  'search-input': [event: Event];
  'apply-filters': [];
  'go-to-page': [page: number];
  'clear-filters': [];
  'export-records': [];
  'export-collections': [];
  'toggle-auto-refresh': [];
  'open-bulk-delete': [];
}>();

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
</script>
