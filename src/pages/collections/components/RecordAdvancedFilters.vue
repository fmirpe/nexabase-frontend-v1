<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Filtros Avanzados para Registros</h3>
      <button @click="$emit('clear-filters')" class="text-sm text-gray-500 hover:text-gray-700">
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
        <span>{{ filter.field }}</span>
        <span class="text-blue-600">{{ getOperatorDisplayName(filter.operator) }}</span>
        <span class="font-medium">{{ filter.value }}</span>
        <button @click="$emit('remove-filter', index)" class="text-blue-600 hover:text-blue-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filter Builder for Records -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Campo</label>
        <select v-model="newFilter.field" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Seleccionar campo</option>
          <option v-for="(fieldDef, fieldName) in collection?.schema?.fields" :key="fieldName" :value="fieldName">
            {{ fieldName }} ({{ fieldDef.type }})
          </option>
          <option value="created_at">created_at</option>
          <option value="updated_at">updated_at</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Operador</label>
        <select v-model="newFilter.operator" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Seleccionar operador</option>
          <option v-for="op in getAvailableOperatorsForField(newFilter.field)" :key="op.value" :value="op.value">
            {{ op.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Valor</label>
        <input
          v-if="!['boolean'].includes(getFieldType(newFilter.field))"
          v-model="newFilter.value"
          :type="getInputType(newFilter.field)"
          placeholder="Ingrese valor..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <select
          v-else
          v-model="newFilter.value"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Seleccionar valor</option>
          <option value="true">Verdadero</option>
          <option value="false">Falso</option>
        </select>
      </div>

      <div class="flex items-end">
        <button
          @click="$emit('add-filter')"
          :disabled="!canAddFilter"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg"
        >
          Agregar Filtro
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Filter {
  field: string;
  operator: string;
  value: any;
}

interface Props {
  activeFilters: Filter[];
  newFilter: Filter;
  collection: any;
}

const props = defineProps<Props>();

defineEmits<{
  'add-filter': [];
  'remove-filter': [index: number];
  'clear-filters': [];
  'update:activeFilters': [filters: Filter[]];
  'update:newFilter': [filter: Filter];
}>();

const canAddFilter = computed(() => {
  return props.newFilter.field && props.newFilter.operator && 
         (props.newFilter.value !== '' && props.newFilter.value !== null);
});

function getAvailableOperatorsForField(field: string) {
  const fieldType = getFieldType(field);
  
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
    { value: 'gte', label: 'Mayor o igual' },
    { value: 'lt', label: 'Menor que' },
    { value: 'lte', label: 'Menor o igual' }
  ];

  const dateOperators = [
    { value: 'eq', label: 'Igual a' },
    { value: 'ne', label: 'Diferente de' },
    { value: 'gt', label: 'Después de' },
    { value: 'gte', label: 'Desde' },
    { value: 'lt', label: 'Antes de' },
    { value: 'lte', label: 'Hasta' }
  ];

  const booleanOperators = [
    { value: 'eq', label: 'Igual a' },
    { value: 'ne', label: 'Diferente de' }
  ];

  if (['number'].includes(fieldType)) return numberOperators;
  if (['date', 'created_at', 'updated_at'].includes(fieldType) || ['created_at', 'updated_at'].includes(field)) return dateOperators;
  if (['boolean'].includes(fieldType)) return booleanOperators;
  return textOperators;
}

function getFieldType(field: string): string {
  if (['created_at', 'updated_at'].includes(field)) return 'date';
  return props.collection?.schema?.fields?.[field]?.type || 'string';
}

function getInputType(field: string): string {
  const fieldType = getFieldType(field);
  
  if (['number'].includes(fieldType)) return 'number';
  if (['date', 'created_at', 'updated_at'].includes(fieldType) || ['created_at', 'updated_at'].includes(field)) return 'date';
  if (['email'].includes(fieldType)) return 'email';
  if (['url'].includes(fieldType)) return 'url';
  return 'text';
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
    ends_with: 'termina con'
  };
  return operators[operator] || operator;
}
</script>
