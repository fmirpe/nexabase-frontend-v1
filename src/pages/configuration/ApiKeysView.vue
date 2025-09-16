<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">API Keys</h1>
        <p class="mt-2 text-sm text-gray-600">
          Gestiona las claves de acceso a la API
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <button
          @click="loadStats"
          class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
        >
          Estadísticas
        </button>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nueva API Key
        </button>
        <button
          @click="refreshApiKeys"
          :disabled="loading"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg
            :class="['w-5 h-5 text-gray-600', loading ? 'animate-spin' : '']"
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
      </div>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="stats"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-blue-50 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ stats.total }}
            </h3>
            <p class="text-sm text-gray-500">Total Keys</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-green-50 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ stats.active }}
            </h3>
            <p class="text-sm text-gray-500">Activas</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-orange-50 rounded-lg">
            <svg
              class="w-6 h-6 text-orange-600"
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
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ stats.expired }}
            </h3>
            <p class="text-sm text-gray-500">Expiradas</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-purple-50 rounded-lg">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ formatNumber(stats.total_usage) }}
            </h3>
            <p class="text-sm text-gray-500">Uso Total</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error/Success Messages -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4"
    >
      {{ error }}
    </div>

    <div
      v-if="successMessage"
      class="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4"
    >
      {{ successMessage }}
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="bg-white border border-gray-200 rounded-lg p-8 text-center"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Cargando API keys...</p>
    </div>

    <!-- API Keys List -->
    <div
      v-else-if="apiKeys.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          API Keys ({{ apiKeys.length }})
        </h2>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="apiKey in apiKeys"
          :key="apiKey.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    apiKey.is_active ? 'bg-green-500' : 'bg-gray-400',
                  ]"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ apiKey.name }}
                  </h3>
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      apiKey.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ apiKey.is_active ? "Activa" : "Inactiva" }}
                  </span>
                  <span
                    v-if="isExpired(apiKey)"
                    class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                  >
                    Expirada
                  </span>
                </div>
                <p v-if="apiKey.description" class="text-sm text-gray-600 mt-1">
                  {{ apiKey.description }}
                </p>
                <div
                  class="flex items-center space-x-4 text-sm text-gray-500 mt-2"
                >
                  <span>Creada: {{ formatDate(apiKey.created_at) }}</span>
                  <span v-if="apiKey.last_used_at"
                    >• Último uso:
                    {{ formatRelativeTime(apiKey.last_used_at) }}</span
                  >
                  <span>• Usos: {{ apiKey.usage_count }}</span>
                  <span v-if="apiKey.expires_at"
                    >• Expira: {{ formatDate(apiKey.expires_at) }}</span
                  >
                </div>

                <!-- API Key Display -->
                <div class="mt-3 flex items-center space-x-2">
                  <div
                    class="flex-1 bg-gray-50 px-3 py-2 rounded-lg border font-mono text-sm"
                  >
                    <span v-if="visibleKeys.has(apiKey.id)">{{
                      apiKey.key
                    }}</span>
                    <span v-else
                      >{{ "•".repeat(32) }}{{ apiKey.key.slice(-8) }}</span
                    >
                  </div>
                  <button
                    @click="toggleKeyVisibility(apiKey.id)"
                    class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    {{ visibleKeys.has(apiKey.id) ? "Ocultar" : "Mostrar" }}
                  </button>
                  <button
                    @click="copyToClipboard(apiKey.key)"
                    class="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
                  >
                    Copiar
                  </button>
                </div>

                <!-- Permissions -->
                <div
                  v-if="apiKey.permissions && apiKey.permissions.length > 0"
                  class="mt-3"
                >
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="permission in apiKey.permissions"
                      :key="permission"
                      class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {{ permission }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <button
                @click="openEditModal(apiKey)"
                class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-lg transition-colors"
              >
                Editar
              </button>
              <button
                @click="toggleApiKeyStatus(apiKey)"
                :disabled="actionLoading"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="
                  apiKey.is_active
                    ? 'bg-red-50 hover:bg-red-100 text-red-700'
                    : 'bg-green-50 hover:bg-green-100 text-green-700'
                "
              >
                {{ apiKey.is_active ? "Desactivar" : "Activar" }}
              </button>
              <button
                @click="regenerateApiKey(apiKey)"
                :disabled="actionLoading"
                class="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm rounded-lg transition-colors"
              >
                Regenerar
              </button>
              <button
                @click="confirmDeleteApiKey(apiKey)"
                class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay API Keys</h3>
      <p class="mt-1 text-sm text-gray-500">
        Crea tu primera API Key para comenzar.
      </p>
      <div class="mt-6">
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nueva API Key
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-6 mx-auto p-5 w-full max-w-lg shadow-lg rounded-md bg-white border"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ isEditing ? "Editar API Key" : "Nueva API Key" }}
        </h3>

        <div
          v-if="formError"
          class="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3"
        >
          {{ formError }}
        </div>

        <form @submit.prevent="saveApiKey" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Nombre *</label
            >
            <input
              v-model="apiKeyForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Mi API Key"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Descripción</label
            >
            <textarea
              v-model="apiKeyForm.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción opcional..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Permisos</label
            >
            <div class="space-y-2">
              <label
                v-for="permission in availablePermissions"
                :key="permission"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :value="permission"
                  v-model="apiKeyForm.permissions"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ permission }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Fecha de Expiración</label
            >
            <input
              v-model="apiKeyForm.expires_at"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Límite de Velocidad</label
            >
            <select
              v-model="apiKeyForm.rate_limit"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="unlimited">Sin límite</option>
              <option value="100/hour">100 por hora</option>
              <option value="1000/hour">1000 por hora</option>
              <option value="100/day">100 por día</option>
              <option value="1000/day">1000 por día</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
            >
              {{ saving ? "Guardando..." : isEditing ? "Actualizar" : "Crear" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white border rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h4 class="text-lg font-semibold text-gray-900">Eliminar API Key</h4>
        <p class="text-sm text-gray-600 mt-2">
          ¿Estás seguro de que deseas eliminar la API Key
          <strong>{{ apiKeyToDelete?.name }}</strong
          >? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3 mt-6">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            @click="deleteApiKey"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded"
          >
            {{ deleting ? "Eliminando..." : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "../../services/api";

// State
const loading = ref(true);
const saving = ref(false);
const actionLoading = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Data
const apiKeys = ref<any[]>([]);
const stats = ref<any>(null);
const visibleKeys = ref(new Set<string>());

// Modals
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const apiKeyToDelete = ref<any>(null);

// Form
interface ApiKeyForm {
  name: string;
  description: string;
  permissions: string[];
  expires_at?: string;
  rate_limit: string;
}
const apiKeyForm = ref<ApiKeyForm>({
  name: "",
  description: "",
  permissions: [],
  rate_limit: "unlimited",
});
const editingApiKey = ref<any>(null);

const availablePermissions = [
  "users:read",
  "users:write",
  "collections:read",
  "collections:write",
  "records:read",
  "records:write",
  "admin:read",
  "admin:write",
];

// API Functions
async function loadApiKeys() {
  try {
    loading.value = true;
    error.value = null;

    const response = await apiClient.get("/api/admin/api-keys");
    
    // ✅ Manejar la estructura de respuesta del backend
    const data = response.data as { success?: boolean; data?: any };
    if (data.success && Array.isArray(data.data)) {
      apiKeys.value = data.data;
    } else if (Array.isArray(data)) {
      // Fallback si viene la estructura antigua
      apiKeys.value = data;
    } else {
      apiKeys.value = [];
    }
    
    console.log('API Keys loaded:', apiKeys.value);
  } catch (e: any) {
    console.error("Error loading API keys:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cargando API keys";
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  try {
    const response = await apiClient.get("/api/admin/api-keys/stats");
    // ✅ Manejar la estructura de respuesta del backend
    const data = response.data as { success?: boolean; data?: any };
    if (data.success && data.data) {
      stats.value = data.data;
    } else {
      // Fallback si viene la estructura antigua
      stats.value = data;
    }
    console.log('Stats loaded:', stats.value);
  } catch (e: any) {
    console.error("Error loading stats:", e);
  }
}

async function saveApiKey() {
  try {
    saving.value = true;
    formError.value = null;

    const formData = { ...apiKeyForm.value };
    if (formData.expires_at) {
      formData.expires_at = new Date(formData.expires_at).toISOString();
    } else {
      delete formData.expires_at;
    }

    let responseData;
    if (isEditing.value && editingApiKey.value) {
      const response = await apiClient.patch(
        `/api/admin/api-keys/${editingApiKey.value.id}`,
        formData
      );
      const data = response.data as { success?: boolean; data?: any };
      responseData = data.success ? data.data : data;
      successMessage.value = "API Key actualizada exitosamente";
    } else {
      const response = await apiClient.post("/api/admin/api-keys", formData);
      const data = response.data as { success?: boolean; data?: any };
      responseData = data.success ? data.data : data;
      successMessage.value = `API Key creada: ${responseData.name}`;
      // Mostrar la key recién creada
      visibleKeys.value.add(responseData.id);
    }

    setTimeout(() => (successMessage.value = null), 5000);
    closeModal();
    await loadApiKeys();
  } catch (e: any) {
    console.error("Error saving API key:", e);
    formError.value =
      e?.response?.data?.message || e?.message || "Error guardando API key";
  } finally {
    saving.value = false;
  }
}

async function toggleApiKeyStatus(apiKey: any) {
  try {
    actionLoading.value = true;
    await apiClient.patch(`/api/admin/api-keys/${apiKey.id}/toggle`);

    successMessage.value = `API Key ${
      apiKey.is_active ? "desactivada" : "activada"
    }`;
    setTimeout(() => (successMessage.value = null), 3000);

    await loadApiKeys();
  } catch (e: any) {
    console.error("Error toggling API key status:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error cambiando estado";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    actionLoading.value = false;
  }
}

async function regenerateApiKey(apiKey: any) {
  if (
    !confirm(
      `¿Regenerar la API Key "${apiKey.name}"? La key actual dejará de funcionar.`
    )
  )
    return;

  try {
    actionLoading.value = true;
    const response = await apiClient.patch(
      `/api/admin/api-keys/${apiKey.id}/regenerate`
    );
    
    const data = response.data as { success?: boolean; data?: any };
    const responseData = data.success ? data.data : data;

    successMessage.value = `API Key regenerada para ${apiKey.name}`;
    setTimeout(() => (successMessage.value = null), 5000);

    // Mostrar la nueva key
    visibleKeys.value.add(responseData.id);

    await loadApiKeys();
  } catch (e: any) {
    console.error("Error regenerating API key:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error regenerando API key";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    actionLoading.value = false;
  }
}

function confirmDeleteApiKey(apiKey: any) {
  apiKeyToDelete.value = apiKey;
  showDeleteModal.value = true;
}

async function deleteApiKey() {
  if (!apiKeyToDelete.value) return;

  try {
    deleting.value = true;
    await apiClient.delete(`/api/admin/api-keys/${apiKeyToDelete.value.id}`);

    successMessage.value = `API Key ${apiKeyToDelete.value.name} eliminada`;
    setTimeout(() => (successMessage.value = null), 5000);

    showDeleteModal.value = false;
    apiKeyToDelete.value = null;
    await loadApiKeys();
  } catch (e: any) {
    console.error("Error deleting API key:", e);
    error.value =
      e?.response?.data?.message || e?.message || "Error eliminando API key";
    setTimeout(() => (error.value = null), 5000);
  } finally {
    deleting.value = false;
  }
}

// UI Functions
function openCreateModal() {
  isEditing.value = false;
  editingApiKey.value = null;
  apiKeyForm.value = {
    name: "",
    description: "",
    permissions: [],
    expires_at: "",
    rate_limit: "unlimited",
  };
  showModal.value = true;
}

function openEditModal(apiKey: any) {
  isEditing.value = true;
  editingApiKey.value = apiKey;
  apiKeyForm.value = {
    name: apiKey.name,
    description: apiKey.description || "",
    permissions: apiKey.permissions || [],
    expires_at: apiKey.expires_at
      ? new Date(apiKey.expires_at).toISOString().slice(0, 16)
      : "",
    rate_limit: apiKey.rate_limit || "unlimited",
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  formError.value = null;
}

function refreshApiKeys() {
  loadApiKeys();
  loadStats();
}

function toggleKeyVisibility(keyId: string) {
  if (visibleKeys.value.has(keyId)) {
    visibleKeys.value.delete(keyId);
  } else {
    visibleKeys.value.add(keyId);
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    successMessage.value = "API Key copiada al portapapeles";
    setTimeout(() => (successMessage.value = null), 2000);
  } catch (err) {
    console.error("Error copying to clipboard:", err);
  }
}

// Utility Functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace menos de 1 minuto";
  if (diffInSeconds < 3600)
    return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400)
    return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  return `hace ${Math.floor(diffInSeconds / 86400)} días`;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

function isExpired(apiKey: any): boolean {
  return apiKey.expires_at && new Date(apiKey.expires_at) < new Date();
}

onMounted(() => {
  loadApiKeys();
  loadStats();
});
</script>
