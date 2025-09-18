<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="p-6">
      <div class="animate-pulse space-y-6">
        <div v-for="n in 5" :key="n" class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-gray-200 rounded"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for loading state
</script>
