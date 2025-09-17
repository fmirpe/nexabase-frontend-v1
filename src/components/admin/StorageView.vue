<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Archivos</h1>
        <p class="mt-2 text-sm text-gray-600">
          Administra todos los archivos subidos al sistema
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <button
          @click="refreshFiles"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Refrescar"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
        <button
          @click="openUploadModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          Subir Archivos
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Archivos</dt>
              <dd class="text-lg font-medium text-gray-900">{{ stats.totalFiles }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Espacio Usado</dt>
              <dd class="text-lg font-medium text-gray-900">{{ formatSize(stats.totalSize) }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Imágenes</dt>
              <dd class="text-lg font-medium text-gray-900">{{ stats.imageCount }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Carpetas</dt>
              <dd class="text-lg font-medium text-gray-900">{{ stats.folderCount }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar archivos..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedFolder"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las carpetas</option>
            <option v-for="folder in folders" :key="folder" :value="folder">
              {{ folder }}
            </option>
          </select>
          <select
            v-model="selectedType"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="image">Imágenes</option>
            <option value="document">Documentos</option>
            <option value="other">Otros</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error/Loading -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
      {{ error }}
    </div>
    <div v-if="loading" class="bg-white border border-gray-200 rounded-lg p-4">
      Cargando archivos...
    </div>

    <!-- Files Grid -->
    <div v-if="!loading && filteredFiles.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Archivos ({{ filteredFiles.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archivo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carpeta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamaño
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subido
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="file in filteredFiles" :key="file.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-12 h-12">
                    <div v-if="isImage(file.mime_type)" class="w-12 h-12 rounded-lg overflow-hidden">
                      <img 
                        :src="getFileUrl(file.id)" 
                        :alt="file.original_name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                    <div v-else class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ file.original_name }}</div>
                    <div class="text-sm text-gray-500">{{ file.mime_type }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ file.folder || 'general' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatSize(file.size) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(file.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <a
                  :href="getDownloadUrl(file.id)"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Descargar
                </a>
                <button
                  @click="confirmDeleteFile(file)"
                  class="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay archivos</h3>
      <p class="mt-1 text-sm text-gray-500">Sube tu primer archivo para comenzar.</p>
      <div class="mt-6">
        <button
          @click="openUploadModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Subir Archivo
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="uploadModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Subir Archivos</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="mb-2 text-sm text-gray-500">
                  <span class="font-semibold">Haz clic para subir</span> o arrastra archivos
                </p>
                <p class="text-xs text-gray-500">PNG, JPG, PDF, etc. (MAX. 50MB)</p>
              </div>
              <input
                type="file"
                multiple
                @change="handleMultipleFileUpload"
                class="hidden"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Carpeta</label>
            <input
              v-model="uploadFolder"
              type="text"
              placeholder="general"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div v-if="uploadingFiles.length > 0" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-900">Archivos seleccionados:</h4>
            <div class="max-h-32 overflow-y-auto space-y-1">
              <div v-for="(file, index) in uploadingFiles" :key="index" class="flex items-center justify-between text-sm">
                <span class="truncate">{{ file.name }}</span>
                <span class="text-gray-500">{{ formatSize(file.size) }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="closeUploadModal"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="submitUpload"
              :disabled="uploadingFiles.length === 0 || uploading"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
            >
              {{ uploading ? 'Subiendo...' : 'Subir' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteConfirmOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar Archivo</h3>
        <p class="text-sm text-gray-600 mb-6">
          ¿Seguro que deseas eliminar "{{ fileToDelete?.original_name }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteConfirmOpen = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="submitDeleteFile"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg transition-colors"
          >
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storageAPI } from '../../services/api';

interface StorageFile {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  folder: string;
  collection?: string;
  created_at: string;
}

// State
const files = ref<StorageFile[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedFolder = ref('');
const selectedType = ref('');

// Upload modal
const uploadModalOpen = ref(false);
const uploadFolder = ref('');
const uploadingFiles = ref<File[]>([]);
const uploading = ref(false);

// Delete modal
const deleteConfirmOpen = ref(false);
const fileToDelete = ref<StorageFile | null>(null);
const deleting = ref(false);

// Stats
const stats = computed(() => {
  const totalFiles = files.value.length;
  const totalSize = files.value.reduce((sum, file) => sum + file.size, 0);
  const imageCount = files.value.filter(f => f.mime_type.startsWith('image/')).length;
  const folders = new Set(files.value.map(f => f.folder || 'general'));
  
  return {
    totalFiles,
    totalSize,
    imageCount,
    folderCount: folders.size
  };
});

const folders = computed(() => {
  const folderSet = new Set(files.value.map(f => f.folder || 'general'));
  return Array.from(folderSet).sort();
});

const filteredFiles = computed(() => {
  let result = files.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(f => 
      f.original_name.toLowerCase().includes(query) ||
      f.mime_type.toLowerCase().includes(query)
    );
  }
  
  if (selectedFolder.value) {
    result = result.filter(f => f.folder === selectedFolder.value);
  }
  
  if (selectedType.value) {
    switch (selectedType.value) {
      case 'image':
        result = result.filter(f => f.mime_type.startsWith('image/'));
        break;
      case 'document':
        result = result.filter(f => 
          f.mime_type.includes('pdf') || 
          f.mime_type.includes('document') ||
          f.mime_type.includes('text/')
        );
        break;
      case 'other':
        result = result.filter(f => 
          !f.mime_type.startsWith('image/') &&
          !f.mime_type.includes('pdf') && 
          !f.mime_type.includes('document') &&
          !f.mime_type.includes('text/')
        );
        break;
    }
  }
  
  return result;
});

// Functions
async function loadFiles() {
  loading.value = true;
  error.value = null;
  try {
    const response = await storageAPI.list();
    files.value = response.data as StorageFile[];
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Error cargando archivos';
  } finally {
    loading.value = false;
  }
}

function refreshFiles() {
  loadFiles();
}

function openUploadModal() {
  uploadModalOpen.value = true;
  uploadFolder.value = '';
  uploadingFiles.value = [];
}

function closeUploadModal() {
  uploadModalOpen.value = false;
  uploadingFiles.value = [];
}

function handleMultipleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (selectedFiles) {
    uploadingFiles.value = Array.from(selectedFiles);
  }
}

async function submitUpload() {
  if (uploadingFiles.value.length === 0) return;
  
  uploading.value = true;
  try {
    for (const file of uploadingFiles.value) {
      await storageAPI.upload(file, {
        folder: uploadFolder.value || 'general'
      });
    }
    closeUploadModal();
    await loadFiles();
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Error subiendo archivos';
  } finally {
    uploading.value = false;
  }
}

function confirmDeleteFile(file: StorageFile) {
  fileToDelete.value = file;
  deleteConfirmOpen.value = true;
}

async function submitDeleteFile() {
  if (!fileToDelete.value) return;
  
  deleting.value = true;
  try {
    await storageAPI.delete(fileToDelete.value.id);
    deleteConfirmOpen.value = false;
    fileToDelete.value = null;
    await loadFiles();
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Error eliminando archivo';
  } finally {
    deleting.value = false;
  }
}

// Utilities
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

function getFileUrl(fileId: string): string {
  if (!fileId) return '';
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}/api/storage/${fileId}/download`; // ✅ CORRECTO
}

function getDownloadUrl(fileId: string): string {
  return getFileUrl(fileId);
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwYXRoIGQ9Im0yMSAxNS0zLjA4Ni0zLjA4NmE0Ljg4OCA0Ljg4OCAwIDAwLTYuODI4IDBMMTAgMTMiLz48L3N2Zz4=';
}

// Lifecycle
onMounted(loadFiles);
</script>
