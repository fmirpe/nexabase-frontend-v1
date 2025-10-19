<template>
  <div class="space-y-4">
    <!-- Drop Zone -->
    <div
      :class="[
        'relative border-2 border-dashed rounded-xl p-6 transition-colors duration-200',
        isDragging 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-300 hover:border-gray-400',
        uploadProgress !== undefined ? 'opacity-50 pointer-events-none' : ''
      ]"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
    >
      <!-- Upload Progress Overlay -->
      <div v-if="uploadProgress !== undefined" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 relative">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke-width="4"
                stroke="#e5e7eb"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke-width="4"
                stroke="#10b981"
                fill="transparent"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference - (uploadProgress / 100) * circumference"
                class="transition-all duration-300"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-sm font-semibold text-green-600">{{ uploadProgress }}%</span>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-700">Subiendo archivo{{ isMultiple ? 's' : '' }}...</p>
        </div>
      </div>

      <!-- Drop Zone Content -->
      <div v-if="!currentFiles.length" class="text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ isMultiple ? 'Subir archivos' : 'Subir archivo' }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Arrastra y suelta {{ isMultiple ? 'archivos aquí' : 'un archivo aquí' }} o haz clic para seleccionar
        </p>
        <button
          type="button"
          @click="triggerFileInput"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Seleccionar {{ isMultiple ? 'archivos' : 'archivo' }}
        </button>
        <p class="text-xs text-gray-500 mt-2">
          {{ acceptTypes === '*/*' ? 'Todos los tipos de archivo' : `Tipos permitidos: ${acceptTypes}` }}
        </p>
      </div>

      <!-- File List -->
      <div v-else class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-gray-900">
            {{ isMultiple ? `${currentFiles.length} archivo${currentFiles.length !== 1 ? 's' : ''}` : 'Archivo' }}
          </h4>
          <button
            type="button"
            @click="triggerFileInput"
            class="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {{ isMultiple ? 'Agregar más' : 'Cambiar archivo' }}
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(file, index) in currentFiles"
            :key="index"
            class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ getFileName(file) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ getFileSize(file) }} • {{ getFileType(file) }}
              </p>
            </div>
            <button
              type="button"
              @click="removeFile(index)"
              class="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        :multiple="isMultiple"
        :accept="acceptTypes"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- File Info -->
    <div v-if="currentFiles.length > 0" class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <div class="flex items-center space-x-4">
        <span>{{ currentFiles.length }} archivo{{ currentFiles.length !== 1 ? 's' : '' }}</span>
        <span>{{ getTotalSize() }}</span>
        <span v-if="isMultiple">Máximo 10 archivos</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  fieldName: string;
  currentValue: any;
  uploadProgress?: number;
  isMultiple: boolean;
  acceptTypes: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'file-upload': [event: Event];
  'file-remove': [index: number];
}>();

const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const circumference = 2 * Math.PI * 28; // Para el círculo de progreso

const currentFiles = computed(() => {
  if (!props.currentValue) return [];
  
  if (props.isMultiple) {
    return Array.isArray(props.currentValue) ? props.currentValue : [];
  } else {
    return props.currentValue ? [props.currentValue] : [];
  }
});

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    // Validar límite de archivos para múltiples
    if (props.isMultiple && currentFiles.value.length + target.files.length > 10) {
      alert('Máximo 10 archivos permitidos');
      return;
    }
    
    // Validar tamaño de archivo (máximo 10MB por archivo)
    for (let i = 0; i < target.files.length; i++) {
      if (target.files[i].size > 10 * 1024 * 1024) {
        alert(`El archivo "${target.files[i].name}" es muy grande. Máximo 10MB por archivo.`);
        return;
      }
    }
    
    emit('file-upload', event);
  }
}

// Drag and Drop handlers
function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragEnter(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault();
  // Solo cambiar estado si realmente salimos del drop zone
  if (!event.currentTarget?.contains(event.relatedTarget as Node)) {
    isDragging.value = false;
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    // Validar límite
    if (props.isMultiple && currentFiles.value.length + files.length > 10) {
      alert('Máximo 10 archivos permitidos');
      return;
    }
    
    // Validar tamaño
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 10 * 1024 * 1024) {
        alert(`El archivo "${files[i].name}" es muy grande. Máximo 10MB por archivo.`);
        return;
      }
    }
    
    // Simular evento de input para mantener consistencia
    const mockEvent = {
      target: { files }
    } as any;
    
    emit('file-upload', mockEvent);
  }
}

function removeFile(index: number) {
  emit('file-remove', index);
}

// Utility functions
function getFileName(file: any): string {
  if (typeof file === 'string') return `archivo_${file.substring(0, 8)}...`;
  return file?.name || file?.filename || 'Archivo sin nombre';
}

function getFileSize(file: any): string {
  if (typeof file === 'string') return 'Tamaño desconocido';
  
  const size = file?.size;
  if (!size) return 'Tamaño desconocido';
  
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(file: any): string {
  if (typeof file === 'string') return 'Archivo';
  return file?.type || file?.mimetype || 'Tipo desconocido';
}

function getTotalSize(): string {
  let totalSize = 0;
  currentFiles.value.forEach(file => {
    if (typeof file !== 'string' && file?.size) {
      totalSize += file.size;
    }
  });
  
  if (totalSize === 0) return 'Tamaño total desconocido';
  if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB total`;
  return `${(totalSize / (1024 * 1024)).toFixed(1)} MB total`;
}
</script>
