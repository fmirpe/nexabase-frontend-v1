<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Collections</h1>
      <p class="mt-2 text-sm text-gray-600">
        Gestiona tus collections de datos y esquemas
      </p>
    </div>
    <div class="mt-4 sm:mt-0 flex items-center gap-2">
      <button
        v-if="!currentCollection"
        @click="$emit('toggle-advanced-filters')"
        :class="[
          'inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors',
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
        v-if="currentCollection"
        @click="$emit('go-back')"
        class="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Collections
      </button>
      
      <button
        v-if="currentCollection && canInsertRecords"
        @click="$emit('open-insert-modal')"
        class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nuevo Registro
      </button>
      
      <button
        v-if="!currentCollection"
        @click="$emit('open-create')"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nueva Collection
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentCollection: any;
  showAdvancedFilters: boolean;
  canInsertRecords: boolean;
}

defineProps<Props>();

defineEmits<{
  'toggle-advanced-filters': [];
  'go-back': [];
  'open-insert-modal': [];
  'open-create': [];
}>();
</script>
