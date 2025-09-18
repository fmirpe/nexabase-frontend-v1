<template>
  <div class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
    <div class="text-sm text-gray-600">
      Mostrando {{ ((pagination.page - 1) * pagination.limit) + 1 }} a {{ Math.min(pagination.page * pagination.limit, totalItems) }} de {{ formatNumber(totalItems) }} resultados
      <span v-if="hasActiveFilters" class="text-blue-600">
        (filtrado)
      </span>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="$emit('go-to-page', pagination.page - 1)"
        :disabled="pagination.page <= 1"
        class="px-3 py-1.5 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Anterior
      </button>
      
      <!-- Page numbers -->
      <div class="flex items-center gap-1">
        <button
          v-for="page in getVisiblePages()"
          :key="page"
          @click="$emit('go-to-page', page)"
          :class="[
            'px-3 py-1.5 rounded text-sm transition-colors',
            page === pagination.page 
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-50 text-gray-700'
          ]"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        @click="$emit('go-to-page', pagination.page + 1)"
        :disabled="pagination.page >= totalPages"
        class="px-3 py-1.5 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pagination: {
    page: number;
    limit: number;
  };
  totalItems: number;
  totalPages: number;
  hasActiveFilters: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  'go-to-page': [page: number];
}>();

function getVisiblePages(): number[] {
  const current = props.pagination.page;
  const total = props.totalPages;
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

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
</script>
