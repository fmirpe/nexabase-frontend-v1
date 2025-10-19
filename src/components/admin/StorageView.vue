<template>
  <div class="space-y-8 min-h-screen bg-gray-50 p-6">
    <!-- Header Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Archivos</h1>
            <p class="text-lg text-gray-600 mt-1">Administra todos los archivos subidos al sistema</p>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Almacenamiento seguro
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Vista previa de imágenes
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 lg:mt-0 flex items-center space-x-3">
          <button
            @click="refreshFiles"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
            title="Refrescar archivos"
          >
            <svg :class="['w-5 h-5', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="ml-2 hidden sm:inline">Actualizar</span>
          </button>

          <button
            @click="openUploadModal"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Subir Archivos
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards Premium -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Archivos</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalFiles }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                {{ filteredFiles.length }} visibles
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Espacio Usado</p>
            <p class="text-3xl font-bold text-green-700 mt-2">{{ formatSize(stats.totalSize) }}</p>
            <div class="flex items-center mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min((stats.totalSize / (100 * 1024 * 1024)) * 100, 100)}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 ml-2">
                {{ Math.round(Math.min((stats.totalSize / (100 * 1024 * 1024)) * 100, 100)) }}%
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Imágenes</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ stats.imageCount }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {{ Math.round(stats.totalFiles > 0 ? (stats.imageCount / stats.totalFiles) * 100 : 0) }}% del total
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Carpetas</p>
            <p class="text-3xl font-bold text-orange-600 mt-2">{{ stats.folderCount }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                Organizadas
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar archivos por nombre, tipo..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <select
              v-model="selectedFolder"
              class="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white min-w-[150px]"
            >
              <option value="">📁 Todas las carpetas</option>
              <option v-for="folder in folders" :key="folder" :value="folder">
                📂 {{ folder }}
              </option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div class="relative">
            <select
              v-model="selectedType"
              class="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white min-w-[150px]"
            >
              <option value="">🗂️ Todos los tipos</option>
              <option value="image">🖼️ Imágenes</option>
              <option value="document">📄 Documentos</option>
              <option value="other">📎 Otros</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800 font-medium">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Cargando Archivos</h3>
        <p class="text-gray-600">Obteniendo la información más reciente...</p>
      </div>
    </div>

    <!-- Files Grid Premium -->
    <div v-else-if="filteredFiles.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">
            Archivos ({{ filteredFiles.length }})
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>Total: {{ formatSize(filteredFiles.reduce((sum, f) => sum + f.size, 0)) }}</span>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Archivo
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Carpeta
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tamaño
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subido
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="file in filteredFiles" :key="file.id" class="hover:bg-gray-50 transition-colors duration-150 group">
              <td class="px-6 py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0 w-16 h-16">
                    <div v-if="isImage(file.mime_type)" class="w-16 h-16 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <img 
                        :src="getSecureImageUrl(file.id)"
                        :alt="file.original_name"
                        :data-file-id="file.id"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                        loading="lazy"
                      />
                    </div>
                    <div v-else :class="[
                      'w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105',
                      getFileTypeColor(file.mime_type)
                    ]">
                      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="file.mime_type.includes('pdf')" d="M4 18h12V6l-4-4H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        <path v-else-if="file.mime_type.includes('document')" d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z"/>
                        <path v-else d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                      {{ file.original_name }}
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                      <span class="text-sm text-gray-500">{{ file.mime_type }}</span>
                      <span v-if="isImage(file.mime_type)" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Imagen
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  {{ file.folder || 'general' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-gray-900">{{ formatSize(file.size) }}</div>
                <div class="text-xs text-gray-500">{{ getSizeCategory(file.size) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ formatDate(file.created_at) }}</div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    @click="downloadFile(file.id, file.original_name)"
                    class="inline-flex items-center px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                    title="Descargar archivo"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar
                  </button>
                  <button
                    @click="confirmDeleteFile(file)"
                    class="inline-flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                    title="Eliminar archivo"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State Premium -->
    <div v-else class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay archivos</h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Sube tu primer archivo para comenzar a gestionar el almacenamiento de tu aplicación.
      </p>
      <button
        @click="openUploadModal"
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Subir Primer Archivo
      </button>
    </div>

    <!-- Upload Modal Premium -->
    <div v-if="uploadModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" @click.stop>
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white">Subir Archivos</h3>
              <p class="text-emerald-100 mt-1">Agrega nuevos archivos al sistema</p>
            </div>
            <button @click="closeUploadModal" class="text-white hover:text-emerald-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-8 space-y-6">
          <!-- Upload Area -->
          <div class="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <label class="flex flex-col items-center justify-center cursor-pointer p-8">
              <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Selecciona archivos</h4>
              <p class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Haz clic para seleccionar</span> o arrastra archivos aquí
              </p>
              <p class="text-xs text-gray-500">PNG, JPG, PDF, DOC, etc. (Máximo 50MB por archivo)</p>
              <input
                type="file"
                multiple
                @change="handleMultipleFileUpload"
                class="hidden"
                accept="*/*"
              />
            </label>
          </div>

          <!-- Folder Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Carpeta de destino</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <input
                v-model="uploadFolder"
                type="text"
                placeholder="general"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">Si no especificas una carpeta, se usará "general"</p>
          </div>

          <!-- Selected Files -->
          <div v-if="uploadingFiles.length > 0" class="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <h4 class="text-sm font-semibold text-emerald-900 mb-3 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Archivos seleccionados ({{ uploadingFiles.length }})
            </h4>
            <div class="max-h-32 overflow-y-auto space-y-2">
              <div v-for="(file, index) in uploadingFiles" :key="index" class="flex items-center justify-between text-sm bg-white rounded-lg p-3">
                <div class="flex items-center space-x-3 min-w-0 flex-1">
                  <div :class="[
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    getFileTypeColor(file.type)
                  ]">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z" />
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900 truncate">{{ file.name }}</span>
                </div>
                <span class="text-emerald-600 font-medium bg-emerald-100 px-2 py-1 rounded-full text-xs">
                  {{ formatSize(file.size) }}
                </span>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between text-xs text-emerald-700">
              <span>Total: {{ formatSize(uploadingFiles.reduce((sum, f) => sum + f.size, 0)) }}</span>
              <span>{{ uploadingFiles.length }} archivo{{ uploadingFiles.length !== 1 ? 's' : '' }}</span>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div class="flex gap-4">
            <button
              @click="closeUploadModal"
              class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="submitUpload"
              :disabled="uploadingFiles.length === 0 || uploading"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <svg v-if="uploading" class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {{ uploading ? 'Subiendo archivos...' : `Subir ${uploadingFiles.length} archivo${uploadingFiles.length !== 1 ? 's' : ''}` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal Premium -->
    <div v-if="deleteConfirmOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4" @click.stop>
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">Eliminar Archivo</h4>
          <p class="text-gray-600 mb-2">¿Estás seguro de que deseas eliminar</p>
          <p class="font-semibold text-gray-900 mb-6 break-all">
            "{{ fileToDelete?.original_name }}"?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p class="text-red-800 text-sm">
              ⚠️ Esta acción no se puede deshacer. El archivo se eliminará permanentemente del sistema.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="deleteConfirmOpen = false"
              class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="submitDeleteFile"
              :disabled="deleting"
              class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {{ deleting ? "Eliminando..." : "Eliminar Archivo" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storageAPI } from '../../services/api';
import { useAuthStore } from '../../stores/auth';

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

interface StorageResponse {
  data: StorageFile[];
  tenantInfo?: {
    id: string;
    isFiltered: boolean;
    contextInfo?: any;
  };
}

// State (mantener todos los states originales)
const files = ref<StorageFile[]>([]);
const tenantInfo = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedFolder = ref('');
const selectedType = ref('');

// Image cache
const imageUrlCache = ref<Map<string, string>>(new Map());

// Upload modal
const uploadModalOpen = ref(false);
const uploadFolder = ref('');
const uploadingFiles = ref<File[]>([]);
const uploading = ref(false);

// Delete modal
const deleteConfirmOpen = ref(false);
const fileToDelete = ref<StorageFile | null>(null);
const deleting = ref(false);

// Auth store
const authStore = useAuthStore();

// Computed (mantener todos los computed originales)
const stats = computed(() => {
  const filesArray = files.value || [];
  const totalFiles = filesArray.length;
  const totalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
  const imageCount = filesArray.filter(f => f.mime_type.startsWith('image/')).length;
  const folders = new Set(filesArray.map(f => f.folder || 'general'));
  
  return {
    totalFiles,
    totalSize,
    imageCount,
    folderCount: folders.size
  };
});

const folders = computed(() => {
  const filesArray = files.value || [];
  const folderSet = new Set(filesArray.map(f => f.folder || 'general'));
  return Array.from(folderSet).sort();
});

const filteredFiles = computed(() => {
  const filesArray = files.value || [];
  let result = filesArray;
  
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

// Helper function para categorías de tamaño
function getSizeCategory(bytes: number): string {
  if (bytes < 1024) return 'Muy pequeño';
  if (bytes < 1024 * 1024) return 'Pequeño';
  if (bytes < 10 * 1024 * 1024) return 'Mediano';
  if (bytes < 50 * 1024 * 1024) return 'Grande';
  return 'Muy grande';
}

// Helper function para colores de tipo de archivo
function getFileTypeColor(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'bg-gradient-to-br from-purple-500 to-purple-600';
  if (mimeType.includes('pdf')) return 'bg-gradient-to-br from-red-500 to-red-600';
  if (mimeType.includes('document')) return 'bg-gradient-to-br from-blue-500 to-blue-600';
  if (mimeType.includes('text/')) return 'bg-gradient-to-br from-green-500 to-green-600';
  if (mimeType.includes('video/')) return 'bg-gradient-to-br from-pink-500 to-pink-600';
  if (mimeType.includes('audio/')) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
  return 'bg-gradient-to-br from-gray-500 to-gray-600';
}

// Mantener todas las funciones originales
async function loadFiles() {
  loading.value = true;
  error.value = null;
  try {
    const response = await storageAPI.list();
    console.log('🔍 Storage API response:', response.data);
    
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const storageResponse = response.data as StorageResponse;
      files.value = storageResponse.data || [];
      tenantInfo.value = storageResponse.tenantInfo || null;
      console.log('✅ Using new structure - Files:', files.value.length, 'TenantInfo:', tenantInfo.value);
    } else if (Array.isArray(response.data)) {
      files.value = response.data as StorageFile[];
      tenantInfo.value = null;
      console.log('✅ Using legacy structure - Files:', files.value.length);
    } else {
      files.value = [];
      console.warn('⚠️ Unexpected response structure:', response.data);
    }
  } catch (e: any) {
    console.error('❌ Error loading files:', e);
    error.value = e?.response?.data?.message || e?.message || 'Error cargando archivos';
    files.value = [];
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

function getSecureImageUrl(fileId: string): string {
  if (!fileId) return getFallbackImageUrl();
  
  if (imageUrlCache.value.has(fileId)) {
    return imageUrlCache.value.get(fileId)!;
  }
  
  const fallbackUrl = getFallbackImageUrl();
  loadSecureImage(fileId);
  return fallbackUrl;
}

async function loadSecureImage(fileId: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/storage/${fileId}/download`, {
      headers: {
        'Authorization': `Bearer ${authStore.tokens?.access_token}`,
        'X-Tenant-ID': authStore.currentTenantId || ''
      }
    });

    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    imageUrlCache.value.set(fileId, imageUrl);
    
    const images = document.querySelectorAll(`img[data-file-id="${fileId}"]`);
    images.forEach((img: any) => {
      img.src = imageUrl;
    });
    
  } catch (error) {
    console.warn('Error loading secure image:', error);
  }
}

async function downloadFile(fileId: string, filename: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/storage/${fileId}/download`, {
      headers: {
        'Authorization': `Bearer ${authStore.tokens?.access_token}`,
        'X-Tenant-ID': authStore.currentTenantId || ''
      }
    });

    if (!response.ok) throw new Error('Error downloading file');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e: any) {
    error.value = e?.message || 'Error descargando archivo';
  }
}

// Utilities (mantener todas las utilities originales)
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

function getFallbackImageUrl(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwYXRoIGQ9Im0yMSAxNS0zLjA4Ni0zLjA4NmE0Ljg4OCA0Ljg4OCAwIDAwLTYuODI4IDBsMTAgMTMiLz48L3N2Zz4=';
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = getFallbackImageUrl();
}

// Lifecycle
onMounted(loadFiles);
</script>
