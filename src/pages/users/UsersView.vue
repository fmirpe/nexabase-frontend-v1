<template>
  <div class="space-y-8 min-h-screen bg-gray-50 p-6">
    <!-- Header Premium -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p class="text-lg text-gray-600 mt-1">Administra usuarios, roles y permisos del sistema</p>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Control de acceso
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.99-2A9 9 0 1121 12a9 9 0 01-.01 0z" />
                </svg>
                Gestión de roles
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 lg:mt-0 flex items-center space-x-3">
          <button
            @click="refreshUsers"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
            title="Refrescar"
          >
            <svg :class="['w-5 h-5', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="ml-2 hidden sm:inline">Actualizar</span>
          </button>

          <button
            @click="openCreateUser"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ meta.total }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                {{ users.filter(u => u.is_active).length }} activos
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Administradores</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ users.filter(u => u.role === 'admin').length }}</p>
            <div class="flex items-center mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${users.length > 0 ? (users.filter(u => u.role === 'admin').length / users.length) * 100 : 0}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 ml-2">{{ Math.round(users.length > 0 ? (users.filter(u => u.role === 'admin').length / users.length) * 100 : 0) }}%</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Desarrolladores</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">{{ users.filter(u => u.role === 'developer').length }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                Acceso API
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Usuarios Regulares</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ users.filter(u => u.role === 'user').length }}</p>
            <div class="flex items-center mt-2">
              <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Acceso básico
              </span>
            </div>
          </div>
          <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
              @input="handleSearch"
              type="text"
              placeholder="Buscar usuarios por nombre, email..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
            />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <select
              v-model="selectedRole"
              @change="applyFilters"
              class="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white min-w-[150px]"
            >
              <option value="">Todos los roles</option>
              <option value="admin">👑 Admin</option>
              <option value="developer">⚡ Desarrollador</option>
              <option value="user">👤 Usuario</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div class="relative">
            <select
              v-model.number="meta.limit"
              @change="goToPage(1)"
              class="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
            >
              <option :value="9">9 por página</option>
              <option :value="18">18 por página</option>
              <option :value="36">36 por página</option>
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
        <div class="flex-1">
          <p class="text-red-800 font-medium">{{ error }}</p>
        </div>
        <button
          @click="loadUsers"
          class="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Cargando Usuarios</h3>
        <p class="text-gray-600">Obteniendo la información más reciente...</p>
      </div>
    </div>

    <!-- Users Grid Premium -->
    <div v-else-if="users.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group"
      >
        <!-- User Header -->
        <div class="p-6 pb-4">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl transition-all duration-200 group-hover:scale-105',
                user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30' :
                user.role === 'developer' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/30' :
                'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30'
              ]">
                {{ getUserInitials(user) }}
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                  {{ user.first_name }} {{ user.last_name }}
                </h3>
                <p class="text-gray-600 text-sm truncate">{{ user.email }}</p>
                <div class="flex items-center space-x-2 mt-2">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'developer' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  ]">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="user.role === 'admin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      <path v-else-if="user.role === 'developer'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ user.role.toUpperCase() }}
                  </span>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    <div :class="['w-2 h-2 rounded-full mr-1.5', user.is_active ? 'bg-green-500' : 'bg-red-500']"></div>
                    {{ user.is_active ? "Activo" : "Inactivo" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click="openEditUser(user)"
                class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                title="Editar usuario"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDeleteUser(user)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Eliminar usuario"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- User Stats -->
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <div class="text-sm font-semibold text-gray-900">{{ formatDate(user.created_at) }}</div>
                <div class="text-xs text-gray-500">Registro</div>
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ user.updated_at ? formatDate(user.updated_at) : 'Nunca' }}  
                </div>
                <div class="text-xs text-gray-500">Última actualización</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="px-6 pb-6">
          <div class="flex gap-2">
            <button
              @click="toggleUserStatus(user)"
              :class="[
                'flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md',
                user.is_active
                  ? 'bg-red-50 hover:bg-red-100 text-red-700'
                  : 'bg-green-50 hover:bg-green-100 text-green-700'
              ]"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg v-if="user.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ user.is_active ? "Desactivar" : "Activar" }}</span>
              </div>
            </button>
            <button
              @click="resetUserPassword(user)"
              class="flex-1 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Reset Pass</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State Premium -->
    <div v-else class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay usuarios</h3>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Comienza creando tu primer usuario para gestionar el acceso al sistema.
      </p>
      <button
        @click="openCreateUser"
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Crear Primer Usuario
      </button>
    </div>

    <!-- Pagination Premium -->
    <div v-if="!loading && meta.pages > 1" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Mostrando <span class="font-semibold">{{ ((meta.page - 1) * meta.limit) + 1 }}</span> a 
          <span class="font-semibold">{{ Math.min(meta.page * meta.limit, meta.total) }}</span> de 
          <span class="font-semibold">{{ meta.total }}</span> usuarios
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="goToPage(meta.page - 1)"
            :disabled="meta.page <= 1"
            class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </div>
          </button>
          
          <div class="flex items-center space-x-1">
            <span class="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg">
              {{ meta.page }}
            </span>
            <span class="text-gray-500">de {{ meta.pages }}</span>
          </div>
          
          <button
            @click="goToPage(meta.page + 1)"
            :disabled="meta.page >= meta.pages"
            class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div class="flex items-center space-x-1">
              <span>Siguiente</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal Premium -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-8 pb-8"
      @click="closeModal"
    >
      <div
        class="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white">
                {{ isEditing ? "Editar Usuario" : "Nuevo Usuario" }}
              </h3>
              <p class="text-indigo-100 mt-1">
                {{ isEditing ? "Modifica la información del usuario" : "Agrega un nuevo usuario al sistema" }}
              </p>
            </div>
            <button @click="closeModal" class="text-white hover:text-indigo-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-8">
          <div v-if="formError" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-red-800 font-medium">{{ formError }}</p>
            </div>
          </div>

          <form @submit.prevent="saveUser" class="space-y-6">
            <!-- Información Personal -->
            <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900">Información Personal</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <input
                    v-model="userForm.first_name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                  <input
                    v-model="userForm.last_name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div v-if="!isEditing" class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                <input
                  v-model="userForm.password"
                  type="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  placeholder="Mínimo 8 caracteres"
                />
                <p class="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 8 caracteres</p>
              </div>
            </div>

            <!-- Permisos y Configuración -->
            <div class="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Permisos y Configuración</h4>
                  <p class="text-sm text-gray-600">Define el rol y estado del usuario</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rol del Usuario</label>
                  <select
                    v-model="userForm.role"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                  >
                    <option value="user">👤 Usuario - Acceso básico</option>
                    <option value="developer">⚡ Desarrollador - Acceso API</option>
                    <option value="admin">👑 Administrador - Acceso completo</option>
                  </select>
                </div>

                <div class="flex items-center justify-center">
                  <div class="bg-white rounded-xl p-4 border border-gray-200 text-center">
                    <label class="flex items-center justify-center cursor-pointer">
                      <input
                        v-model="userForm.is_active"
                        type="checkbox"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5 mr-3"
                      />
                      <div>
                        <div class="text-sm font-medium text-gray-900">Usuario Activo</div>
                        <div class="text-xs text-gray-500">Puede acceder al sistema</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="bg-white px-8 py-6 border-t border-gray-200">
          <div class="flex gap-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="saveUser"
              :disabled="saving"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <svg v-if="saving" class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ saving ? "Guardando..." : isEditing ? "Actualizar Usuario" : "Crear Usuario" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal Premium -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-200"
        @click.stop
      >
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">Eliminar Usuario</h4>
          <p class="text-gray-600 mb-2">¿Estás seguro de que deseas eliminar a</p>
          <p class="font-semibold text-gray-900 mb-6">
            {{ userToDelete?.first_name }} {{ userToDelete?.last_name }}?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p class="text-red-800 text-sm">
              ⚠️ Esta acción no se puede deshacer. El usuario perderá acceso al sistema inmediatamente.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="deleteUser"
              :disabled="deleting"
              class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {{ deleting ? "Eliminando..." : "Eliminar Usuario" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usersAPI } from "../../services/api";

// ✅ TIPOS TypeScript (mantener todos los tipos originales)
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'user' | 'developer';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'developer';
  is_active: boolean;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface APIResponse {
  data: User[];
  meta: PaginationMeta;
}

// State (mantener todos los states originales)
const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const deleting = ref<boolean>(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);

// Data
const users = ref<User[]>([]);
const meta = ref<PaginationMeta>({
  page: 1,
  limit: 9, // Cambiar a 9 para grid de 3x3
  total: 0,
  pages: 0,
});

// Filters
const searchQuery = ref<string>("");
const selectedRole = ref<string>("");

// Modals
const showModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const userToDelete = ref<User | null>(null);

// Form
const userForm = ref<UserForm>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "user",
  is_active: true,
});
const editingUser = ref<User | null>(null);

// Debounce search
let searchTimeout: NodeJS.Timeout;

// ✅ MANTENER TODAS LAS FUNCIONES ORIGINALES DEL SCRIPT
async function loadUsers(): Promise<void> {
  try {
    loading.value = true;
    error.value = null;

    const params: Record<string, any> = {
      page: meta.value.page,
      limit: meta.value.limit,
    };

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    if (selectedRole.value) {
      params.role = selectedRole.value;
    }

    const response = await usersAPI.getAll(params);
    const data = response.data as APIResponse;

    users.value = data.data || [];
    meta.value = {
      page: data.meta?.page || 1,
      limit: data.meta?.limit || 9,
      total: data.meta?.total || 0,
      pages: data.meta?.pages || 0,
    };
  } catch (e: any) {
    console.error("Error loading users:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cargando usuarios";
  } finally {
    loading.value = false;
  }
}

async function saveUser(): Promise<void> {
  try {
    saving.value = true;
    formError.value = null;

    if (isEditing.value && editingUser.value) {
      const { password, ...updateData } = userForm.value;
      await usersAPI.update(editingUser.value.id, updateData);
    } else {
      await usersAPI.create(userForm.value);
    }

    closeModal();
    await loadUsers();
  } catch (e: any) {
    console.error("Error saving user:", e);
    formError.value =
      e?.response?.data?.message || e?.message || "Error guardando usuario";
  } finally {
    saving.value = false;
  }
}

async function deleteUser(): Promise<void> {
  if (!userToDelete.value) return;

  try {
    deleting.value = true;
    await usersAPI.delete(userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
    await loadUsers();
  } catch (e: any) {
    console.error("Error deleting user:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error eliminando usuario";
  } finally {
    deleting.value = false;
  }
}

async function toggleUserStatus(user: User): Promise<void> {
  try {
    await usersAPI.update(user.id, { is_active: !user.is_active });
    await loadUsers();
  } catch (e: any) {
    console.error("Error updating user status:", e);
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Error actualizando estado del usuario";
  }
}

async function resetUserPassword(user: User): Promise<void> {
  if (
    !confirm(
      `¿Restablecer la contraseña de ${user.first_name} ${user.last_name}?`
    )
  )
    return;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Contraseña restablecida para ${user.first_name} ${user.last_name}`);
  } catch (e: any) {
    console.error("Error resetting password:", e);
    error.value = "Error restableciendo contraseña";
  }
}

// UI Functions (mantener todas)
function openCreateUser(): void {
  isEditing.value = false;
  editingUser.value = null;
  userForm.value = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "user",
    is_active: true,
  };
  showModal.value = true;
}

function openEditUser(user: User): void {
  isEditing.value = true;
  editingUser.value = user;
  userForm.value = {
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    password: "",
    role: user.role || "user",
    is_active: user.is_active !== false,
  };
  showModal.value = true;
}

function closeModal(): void {
  showModal.value = false;
  formError.value = null;
}

function confirmDeleteUser(user: User): void {
  userToDelete.value = user;
  showDeleteModal.value = true;
}

async function refreshUsers(): Promise<void> {
  await loadUsers();
}

function goToPage(page: number): void {
  if (page >= 1 && page <= meta.value.pages) {
    meta.value.page = page;
    loadUsers();
  }
}

function handleSearch(): void {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    meta.value.page = 1;
    loadUsers();
  }, 500);
}

function applyFilters(): void {
  meta.value.page = 1;
  loadUsers();
}

// Utilities (mantener todas)
function getUserInitials(user: User): string {
  const first = user.first_name?.[0] || "";
  const last = user.last_name?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Lifecycle
onMounted(() => {
  loadUsers();
});
</script>
