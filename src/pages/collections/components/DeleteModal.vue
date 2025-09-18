<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    @click="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
      @click.stop
    >
      <div class="p-6">
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
          <h3 class="text-lg font-medium text-gray-900">
            {{ collectionToDelete ? 'Eliminar Collection' : 'Eliminar Registro' }}
          </h3>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600">
            <span v-if="collectionToDelete">
              ¿Estás seguro de que quieres eliminar la collection 
              <strong class="text-gray-900">"{{ collectionToDelete.name }}"</strong>?
            </span>
            <span v-else-if="recordToDelete">
              ¿Estás seguro de que quieres eliminar este registro?
            </span>
          </p>
          
          <div v-if="collectionToDelete" class="mt-3 p-3 bg-red-50 border border-red-200 rounded">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="text-sm text-red-700">
                <p class="font-medium">⚠️ Esta acción es irreversible</p>
                <ul class="mt-2 list-disc list-inside space-y-1">
                  <li>Se eliminará la collection y su esquema</li>
                  <li>Se perderán todos los registros ({{ collectionToDelete.record_count || 0 }} registros)</li>
                  <li>Las configuraciones de autorización se borrarán</li>
                </ul>
              </div>
            </div>
          </div>

          <div v-else-if="recordToDelete" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="text-sm text-yellow-700">
                <p class="font-medium">Esta acción eliminará permanentemente:</p>
                <ul class="mt-2 list-disc list-inside space-y-1">
                  <li>El registro con ID: {{ recordToDelete.id }}</li>
                  <li>Todos los datos asociados</li>
                  <li>Los archivos subidos (si los hay)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-4">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="deletingCollection"
            class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center"
          >
            <svg
              v-if="deletingCollection"
              class="w-4 h-4 mr-2 animate-spin"
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
            <svg
              v-else
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {{ deletingCollection ? "Eliminando..." : "Sí, Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  deletingCollection: boolean;
  collectionToDelete: any;
  recordToDelete: any;
}

defineProps<Props>();

defineEmits<{
  'close': [];
  'confirm': [];
}>();
</script>
