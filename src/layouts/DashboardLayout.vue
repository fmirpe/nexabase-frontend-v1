<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Sidebar (mantener igual) -->
    <div
      :class="[
        'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-500 flex flex-col shadow-2xl border-r border-slate-700/50 backdrop-blur-xl',
        sidebarOpen ? 'w-72' : 'w-20',
      ]"
    >
      <!-- Todo el contenido del sidebar mantenerlo igual -->
      <!-- Logo/Header -->
      <div
        class="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-transparent"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 backdrop-blur-sm border border-white/10 group-hover:scale-105 transition-transform duration-200"
          >
            <img
              v-if="logoUrl"
              class="w-8 h-8 rounded-xl"
              :src="logoUrl"
              alt="NexaBase"
              @error="logoError = true"
            />
            <svg
              v-else
              class="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
          </div>
          <div v-show="sidebarOpen" class="transition-all duration-500">
            <h1
              class="font-bold text-2xl bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent"
            >
              NexaBase
            </h1>
            <div class="text-sm text-slate-400 flex items-center mt-1">
              <div
                class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"
              ></div>
              Dashboard v2.1.0
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation (mantener igual) -->
      <nav class="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <!-- Main Navigation -->
        <div class="space-y-2">
          <div
            class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider"
            v-show="sidebarOpen"
          >
            Navegación Principal
          </div>
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            :class="[
              'group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden',
              $route.path === item.path
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105 border border-indigo-400/30'
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-102 hover:shadow-lg hover:shadow-slate-900/20',
            ]"
          >
            <div
              v-if="$route.path === item.path"
              class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 animate-pulse"
            ></div>

            <div class="relative z-10 flex items-center gap-4 w-full">
              <div
                :class="[
                  'p-2 rounded-xl flex items-center justify-center transition-all duration-300',
                  $route.path === item.path
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                    : 'bg-slate-700/50 group-hover:bg-slate-600/50',
                ]"
              >
                <svg
                  class="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="item.iconPath"
                  />
                </svg>
              </div>

              <div
                v-show="sidebarOpen"
                class="flex-1 flex items-center justify-between transition-all duration-500"
              >
                <span class="font-medium">{{ item.label }}</span>
                <div v-if="item.badge" class="flex items-center space-x-2">
                  <div v-if="item.badgeLoading" class="w-4 h-4">
                    <svg
                      class="w-4 h-4 animate-spin text-indigo-400"
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
                  </div>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/20"
                  >
                    {{ item.badge }}
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Admin Section (mantener igual) -->
        <div v-if="authStore.isAdmin" class="mt-8">
          <div
            v-show="sidebarOpen"
            class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Administración
          </div>
          <div class="space-y-2 mt-3">
            <router-link
              v-for="adminItem in adminNavigationItems"
              :key="adminItem.name"
              :to="adminItem.path"
              :class="[
                'group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden',
                $route.path === adminItem.path
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105 border border-purple-400/30'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-102 hover:shadow-lg hover:shadow-slate-900/20',
              ]"
            >
              <div
                v-if="$route.path === adminItem.path"
                class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"
              ></div>

              <div class="relative z-10 flex items-center gap-4 w-full">
                <div
                  :class="[
                    'p-2 rounded-xl flex items-center justify-center transition-all duration-300',
                    $route.path === adminItem.path
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                      : 'bg-slate-700/50 group-hover:bg-slate-600/50',
                  ]"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="adminItem.iconPath"
                    />
                  </svg>
                </div>
                <span
                  v-show="sidebarOpen"
                  class="font-medium transition-all duration-500"
                >
                  {{ adminItem.label }}
                </span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- System Status (mantener igual) -->
        <div v-show="sidebarOpen" class="mt-8 px-4">
          <div
            class="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Sistema</span
              >
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  systemStats?.apiHealth === 'online'
                    ? 'bg-green-400 animate-pulse'
                    : 'bg-red-400',
                ]"
              ></div>
            </div>
            <div v-if="systemStats" class="space-y-2 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Collections:</span>
                <span class="font-semibold">{{
                  systemStats.totalCollections
                }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Registros:</span>
                <span class="font-semibold">{{
                  formatNumber(systemStats.totalRecords)
                }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Usuarios:</span>
                <span class="font-semibold">{{ systemStats.totalUsers }}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- User Section (mantener igual) -->
      <div
        class="p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-transparent"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 backdrop-blur-sm border border-white/10 group-hover:scale-105 transition-transform duration-200"
          >
            <span class="text-sm font-bold text-white">
              {{
                getUserInitials(
                  authStore.user?.first_name,
                  authStore.user?.last_name,
                  authStore.user?.email
                )
              }}
            </span>
          </div>
          <div v-show="sidebarOpen" class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate">
              {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
            </p>
            <p class="text-xs text-slate-400 truncate flex items-center mt-1">
              <svg
                class="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              {{ authStore.user?.email }}
            </p>
          </div>
          <div v-show="sidebarOpen" class="flex items-center gap-2">
            <button
              @click="loadSystemStats"
              :disabled="statsLoading"
              class="p-2.5 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-105 border border-slate-600/50 hover:border-slate-500/50"
              title="Actualizar estadísticas"
            >
              <svg
                :class="[
                  'w-4 h-4 text-slate-300',
                  statsLoading ? 'animate-spin' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <button
              @click="logout"
              class="p-2.5 hover:bg-red-500/20 rounded-xl transition-all duration-200 hover:scale-105 border border-slate-600/50 hover:border-red-400/50 group"
              title="Cerrar sesión"
            >
              <svg
                class="w-4 h-4 text-slate-300 group-hover:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Enhanced Header -->
      <header
        class="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 px-8 py-6 relative z-20"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border border-gray-200/50"
            >
              <svg
                class="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Enhanced Breadcrumb -->
            <div
              class="flex items-center space-x-3 text-sm bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200/50"
            >
              <div class="flex items-center text-indigo-600 font-bold">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                </svg>
                NexaBase
              </div>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-gray-900 font-bold text-lg">
                {{ currentPageTitle }}
              </span>
            </div>
          </div>

          <!-- Enhanced Header Actions -->
          <div class="flex items-center gap-4">
            <!-- Last Updated Indicator -->
            <div
              v-if="lastUpdated"
              class="hidden md:flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200/50"
            >
              <svg
                class="w-4 h-4 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Actualizado: {{ formatRelativeTime(lastUpdated) }}
            </div>

            <!-- 🔧 FIXED: Enhanced Notifications con z-index correcto -->
            <div class="relative z-[70]">
              <button
                class="p-3 hover:bg-gray-100 rounded-2xl relative transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md border border-gray-200/50"
                @click="showNotifications = !showNotifications"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <div
                  v-if="notifications.length > 0"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse"
                >
                  {{ notifications.length > 9 ? "9+" : notifications.length }}
                </div>
              </button>

              <!-- 🔧 FIXED: Dropdown con teleport para evitar conflictos de z-index -->
              <Teleport to="body">
                <div
                  v-if="showNotifications"
                  class="fixed inset-0 z-[100]"
                  @click="showNotifications = false"
                >
                  <!-- Backdrop específico para notificaciones -->
                  <div
                    class="absolute inset-0 bg-black/5 backdrop-blur-sm"
                  ></div>

                  <!-- Dropdown posicionado dinámicamente -->
                  <div
                    :style="notificationDropdownStyle"
                    class="absolute w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                    @click.stop
                  >
                    <div
                      class="p-6 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50 to-purple-50"
                    >
                      <div class="flex items-center justify-between">
                        <h3 class="font-bold text-lg text-gray-900">
                          Notificaciones
                        </h3>
                        <div
                          class="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border"
                        >
                          {{ notifications.length }} nuevas
                        </div>
                      </div>
                    </div>
                    <div class="max-h-80 overflow-y-auto custom-scrollbar">
                      <div
                        v-if="notifications.length === 0"
                        class="p-8 text-center text-gray-500"
                      >
                        <svg
                          class="w-12 h-12 mx-auto mb-4 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                          />
                        </svg>
                        <p class="font-medium">No hay notificaciones</p>
                        <p class="text-sm mt-1">
                          Te notificaremos cuando haya actualizaciones
                        </p>
                      </div>
                      <div v-else>
                        <div
                          v-for="notification in notifications"
                          :key="notification.id"
                          class="p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <div class="flex items-start gap-4">
                            <div
                              :class="[
                                'w-3 h-3 rounded-full mt-2 flex-shrink-0',
                                notification.type === 'success'
                                  ? 'bg-green-500'
                                  : notification.type === 'warning'
                                  ? 'bg-yellow-500'
                                  : 'bg-blue-500',
                              ]"
                            ></div>
                            <div class="flex-1 min-w-0">
                              <p
                                class="text-sm font-semibold text-gray-900 mb-1"
                              >
                                {{ notification.title }}
                              </p>
                              <p class="text-sm text-gray-600 leading-relaxed">
                                {{ notification.message }}
                              </p>
                              <p
                                class="text-xs text-gray-400 mt-2 flex items-center"
                              >
                                <svg
                                  class="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {{
                                  formatRelativeTime(notification.created_at)
                                }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Teleport>
            </div>

            <!-- Enhanced Role Badge -->
            <div
              :class="[
                'px-4 py-2 rounded-2xl text-xs font-bold border shadow-sm',
                authStore.isAdmin
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200'
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
              ]"
            >
              <div class="flex items-center space-x-2">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="authStore.isAdmin"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{{ authStore.user?.role?.toUpperCase() || "USER" }}</span>
              </div>
            </div>

            <!-- 🔧 FIXED: Organization Switcher con z-index alto -->
            <div class="relative z-[60]">
              <OrganizationSwitcher v-if="authStore.user?.tenantId" />
            </div>
          </div>
        </div>
      </header>

      <!-- Enhanced Page Content -->
      <main
        class="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 relative"
      >
        <div class="max-w-full mx-auto h-full">
          <!-- Enhanced Loading Indicator -->
          <div
            v-if="statsLoading"
            class="m-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 rounded-2xl p-4 shadow-sm"
          >
            <div class="flex items-center">
              <svg
                class="w-6 h-6 mr-3 animate-spin text-blue-600"
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
              <div>
                <p class="font-semibold">
                  Actualizando estadísticas del sistema...
                </p>
                <p class="text-sm text-blue-600 mt-1">
                  Obteniendo datos en tiempo real
                </p>
              </div>
            </div>
          </div>

          <!-- Router Content -->
          <div class="h-full">
            <router-view />
          </div>
        </div>
      </main>
    </div>

    <!-- 🔧 FIXED: Backdrop con z-index más bajo -->
    <div
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-[50] bg-black/5 backdrop-blur-sm"
    ></div>
  </div>
</template>

<script setup lang="ts">
// Todo el script mantenerlo exactamente igual
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { adminCollections, usersAPI } from "../services/api";
import OrganizationSwitcher from "../components/OrganizationSwitcher.vue";

// Todo tu código existente mantenerlo igual...
const logoUrl = "/icono.png";
const logoError = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(true);
const statsLoading = ref(false);
const showNotifications = ref(false);
const lastUpdated = ref<string | null>(null);

const systemStats = ref<{
  totalCollections: number;
  totalRecords: number;
  totalUsers: number;
  apiHealth: "online" | "offline";
} | null>(null);

const notificationButtonRef = ref<HTMLElement | null>(null);

// Computed para posicionar el dropdown dinámicamente
const notificationDropdownStyle = computed(() => {
  if (typeof window === "undefined") return {};

  // Posición fija desde la derecha y desde arriba
  return {
    top: "80px",
    right: "32px",
  };
});
const notifications = ref([
  {
    id: 1,
    type: "success",
    title: "Sistema iniciado",
    message:
      "NexaBase está funcionando correctamente y todos los servicios están operativos",
    created_at: new Date().toISOString(),
  },
]);

const currentPageTitle = computed(() => {
  return (route.meta?.title as string) || "Dashboard";
});

const navigationItems = computed(() => [
  {
    name: "dashboard",
    path: "/",
    label: "Dashboard",
    iconPath:
      "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z",
    badge: null,
    badgeLoading: false,
  },
  {
    name: "collections",
    path: "/collections",
    label: "Collections",
    iconPath:
      "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    badge: systemStats.value?.totalCollections?.toString() || "0",
    badgeLoading: statsLoading.value,
  },
]);

const adminNavigationItems = computed(() => [
  {
    name: "users",
    path: "/users",
    label: "Usuarios",
    iconPath:
      "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  },
  {
    name: "storage",
    path: "/storage",
    label: "Archivos",
    iconPath:
      "M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z",
  },
  {
    name: "webhooks",
    path: "/webhooks",
    label: "Webhooks",
    iconPath:
      "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  },
  {
    name: "api-keys",
    path: "/api-keys",
    label: "API Keys",
    iconPath:
      "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  },
  {
    name: "activity-logs",
    path: "/activity-logs",
    label: "Logs de Actividad",
    iconPath:
      "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    name: "backup",
    path: "/backup",
    label: "Backup & Restore",
    iconPath:
      "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    name: "configuration",
    path: "/configuration",
    label: "Configuración",
    iconPath:
      "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
]);

// Todas las funciones mantenerlas iguales
function getUserInitials(
  firstName?: string,
  lastName?: string,
  email?: string
): string {
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (email) {
    const parts = email.split("@")[0].split(".");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : email.slice(0, 2).toUpperCase();
  }
  return "?";
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace un momento";
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
  return `hace ${Math.floor(diffInSeconds / 86400)}d`;
}

async function loadSystemStats() {
  try {
    statsLoading.value = true;

    const [collectionsRes, usersRes] = await Promise.all([
      adminCollections
        .list({ page: 1, limit: 1 })
        .catch(() => ({ data: { meta: { total: 0 } } })),
      authStore.isAdmin
        ? usersAPI
            .getAll({ page: 1, limit: 1 })
            .catch(() => ({ data: { meta: { total: 0 } } }))
        : Promise.resolve({ data: { meta: { total: 0 } } }),
    ]);

    const collectionsCount = collectionsRes.data?.meta?.total || 0;
    const usersCount = usersRes.data?.meta?.total || 0;

    let totalRecords = 0;
    if (collectionsCount > 0) {
      try {
        const allCollectionsRes = await adminCollections
          .list({
            page: 1,
            limit: 100,
          })
          .catch(() => ({ data: { data: [] } }));
        const collections = allCollectionsRes.data?.data || [];
        totalRecords = collections.reduce((sum: number, collection: any) => {
          return sum + (collection.record_count || 0);
        }, 0);
      } catch (e) {
        console.warn("Error calculating total records:", e);
      }
    }

    systemStats.value = {
      totalCollections: collectionsCount,
      totalRecords,
      totalUsers: usersCount,
      apiHealth: "online",
    };

    lastUpdated.value = new Date().toISOString();
  } catch (error: any) {
    console.error("Error loading system stats:", error);

    if (systemStats.value) {
      systemStats.value.apiHealth = "offline";
    }
  } finally {
    statsLoading.value = false;
  }
}

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};

let refreshInterval: NodeJS.Timeout;
onMounted(async () => {
  loadSystemStats();
  refreshInterval = setInterval(loadSystemStats, 5 * 60 * 1000);

  await nextTick();
  if (authStore.user?.tenantId) {
    const orgSwitcher = document.querySelector("[data-org-switcher]");
    if (orgSwitcher) {
      orgSwitcher.dispatchEvent(new CustomEvent("load-organizations"));
    }
  }
});

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (refreshInterval) clearInterval(refreshInterval);
  });
}

watch(
  () => route.path,
  () => {
    showNotifications.value = false;
  }
);
</script>

<style scoped>
/* Mantener todos los estilos iguales */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-xl {
    backdrop-filter: blur(16px);
  }
}

.bg-clip-text {
  background-clip: text;
  -webkit-background-clip: text;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>
