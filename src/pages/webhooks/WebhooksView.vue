<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Webhooks</h1>
        <p class="text-gray-600 mt-2">
          Configura endpoints para recibir notificaciones automáticas cuando ocurran eventos en tu BaaS
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Nuevo Webhook</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Webhooks</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ webhooks.length }}</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Activos</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ activeWebhooksCount }}</p>
          </div>
          <div class="p-3 bg-green-50 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Entregas Exitosas</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">{{ totalSuccessfulDeliveries }}</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Tasa de Éxito</p>
            <p class="text-3xl font-bold text-purple-600 mt-2">{{ Math.round(successRate) }}%</p>
          </div>
          <div class="p-3 bg-purple-50 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex">
          <button
            @click="activeTab = 'webhooks'"
            :class="[
              'py-4 px-6 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'webhooks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Webhooks
          </button>
          <button
            @click="activeTab = 'deliveries'"
            :class="[
              'py-4 px-6 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'deliveries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Historial de Entregas
          </button>
        </nav>
      </div>

      <!-- Webhooks Tab -->
      <div v-if="activeTab === 'webhooks'" class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Cargando webhooks...</p>
        </div>

        <div v-else-if="webhooks.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay webhooks</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza creando tu primer webhook.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Crear Webhook
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="webhook in webhooks"
            :key="webhook.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div
                  :class="[
                    'w-4 h-4 rounded-full',
                    webhook.is_active ? 'bg-green-500' : 'bg-gray-400'
                  ]"
                ></div>
                <div>
                  <h3 class="font-medium text-gray-900">{{ webhook.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ webhook.url }}</p>
                  <p class="text-sm text-gray-500">{{ webhook.events?.length || 0 }} eventos</p>
                </div>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-xs text-green-600">{{ webhook.success_count || 0 }} exitosas</span>
                  <span class="text-xs text-red-600">{{ webhook.failure_count || 0 }} fallos</span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="testWebhook(webhook.id)"
                  class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  title="Probar webhook"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6.4-6.4a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  @click="editWebhook(webhook)"
                  class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Editar webhook"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="toggleWebhook(webhook.id, webhook.is_active)"
                  class="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                  :title="webhook.is_active ? 'Desactivar' : 'Activar'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </button>
                <button
                  @click="deleteWebhook(webhook)"
                  class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar webhook"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deliveries Tab -->
      <div v-if="activeTab === 'deliveries'" class="p-6">
        <div v-if="loadingDeliveries" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Cargando entregas...</p>
        </div>

        <div v-else-if="deliveries.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay entregas</h3>
          <p class="mt-1 text-sm text-gray-500">Las entregas aparecerán aquí cuando se disparen los webhooks.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="delivery in deliveries"
            :key="delivery.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ delivery.event }}</span>
                  <span
                    v-if="delivery.collection"
                    class="text-sm text-gray-500"
                  >
                    {{ delivery.collection }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      delivery.status === 'success' ? 'bg-green-100 text-green-800' :
                      delivery.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ delivery.status }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ formatDate(delivery.created_at) }} • {{ delivery.duration_ms }}ms
                  <span v-if="delivery.retry_count > 0">• Retry {{ delivery.retry_count }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium">
                  {{ delivery.response_status || 'N/A' }}
                </div>
                <button
                  @click="viewDeliveryDetails(delivery)"
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingWebhook"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ editingWebhook ? 'Editar Webhook' : 'Nuevo Webhook' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveWebhook" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Webhook</label>
            <input
              v-model="webhookForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mi webhook para pedidos"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL del Endpoint</label>
            <input
              v-model="webhookForm.url"
              type="url"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://mi-app.com/webhooks/nexabase"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Eventos</label>
            <div class="grid grid-cols-2 gap-3">
              <label
                v-for="event in availableEvents"
                :key="event"
                class="flex items-center space-x-2 text-sm"
              >
                <input
                  v-model="webhookForm.events"
                  type="checkbox"
                  :value="event"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-gray-700">{{ event }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Colecciones (opcional)
            </label>
            <input
              v-model="collectionsInput"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="users,posts,orders (separadas por comas)"
            />
            <p class="text-sm text-gray-500 mt-1">
              Deja vacío para recibir eventos de todas las colecciones
            </p>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {{ saving ? 'Guardando...' : editingWebhook ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {{ successMessage }}
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { webhooksAPI } from "../../services/api";

// State
const loading = ref(true);
const loadingDeliveries = ref(false);
const saving = ref(false);
const activeTab = ref('webhooks');
const showCreateModal = ref(false);
const editingWebhook = ref<any>(null);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const webhooks = ref<any[]>([]);
const deliveries = ref<any[]>([]);
const collectionsInput = ref('');

const availableEvents = [
  'record.created',
  'record.updated', 
  'record.deleted',
  'collection.created',
  'collection.updated',
  'collection.deleted',
  'user.created',
  'user.updated',
  'backup.created',
  'api_key.created'
];

const webhookForm = ref({
  name: '',
  url: '',
  events: [] as string[],
});

// Computed
const activeWebhooksCount = computed(() => {
  if (!Array.isArray(webhooks.value)) return 0;
  return webhooks.value.filter(w => w.is_active).length;
});

const totalSuccessfulDeliveries = computed(() => {
  if (!Array.isArray(webhooks.value)) return 0;
  return webhooks.value.reduce((sum, w) => sum + (w.success_count || 0), 0);
});

const successRate = computed(() => {
  if (!Array.isArray(webhooks.value)) return 100;
  const total = webhooks.value.reduce((sum, w) => sum + (w.success_count || 0) + (w.failure_count || 0), 0);
  const successful = totalSuccessfulDeliveries.value;
  return total > 0 ? (successful / total) * 100 : 100;
});

// Methods
async function loadWebhooks() {
  try {
    loading.value = true;
    const response = await webhooksAPI.getAll();
    
    // ✅ CAST EXPLÍCITO PARA EVITAR ERRORES DE TYPESCRIPT
    const responseData = response.data as any;
    
    if (responseData?.success && Array.isArray(responseData.data)) {
      webhooks.value = responseData.data;
    } else {
      console.warn('API response is not an array:', responseData);
      webhooks.value = [];
    }
  } catch (e: any) {
    console.error('Error loading webhooks:', e);
    webhooks.value = [];
    showError('Error cargando webhooks: ' + (e?.response?.data?.message || e.message));
  } finally {
    loading.value = false;
  }
}

async function loadDeliveries() {
  try {
    loadingDeliveries.value = true;
    const response = await webhooksAPI.getDeliveries();
    
    // ✅ CAST EXPLÍCITO PARA EVITAR ERRORES DE TYPESCRIPT
    const responseData = response.data as any;
    
    if (responseData?.success && Array.isArray(responseData.data)) {
      deliveries.value = responseData.data;
    } else {
      console.warn('Deliveries response is not an array:', responseData);
      deliveries.value = [];
    }
  } catch (e: any) {
    console.error('Error loading deliveries:', e);
    deliveries.value = [];
    showError('Error cargando entregas: ' + (e?.response?.data?.message || e.message));
  } finally {
    loadingDeliveries.value = false;
  }
}

async function saveWebhook() {
  try {
    saving.value = true;

    const webhookData = {
      name: webhookForm.value.name,
      url: webhookForm.value.url,
      events: webhookForm.value.events,
      collections: collectionsInput.value 
        ? collectionsInput.value.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
    };

    let response: any;
    
    if (editingWebhook.value) {
      response = await webhooksAPI.update(editingWebhook.value.id, webhookData);
    } else {
      response = await webhooksAPI.create(webhookData);
    }

    // ✅ CAST EXPLÍCITO
    const responseData = response.data as any;
    
    if (responseData?.success) {
      showSuccess(editingWebhook.value ? 'Webhook actualizado correctamente' : 'Webhook creado correctamente');
      closeModal();
      await loadWebhooks();
    } else {
      throw new Error(responseData?.message || 'Error al guardar webhook');
    }
  } catch (e: any) {
    console.error('Error saving webhook:', e);
    showError('Error guardando webhook: ' + (e?.response?.data?.message || e.message));
  } finally {
    saving.value = false;
  }
}

async function testWebhook(webhookId: string) {
  try {
    const response = await webhooksAPI.test(webhookId);
    
    // ✅ CAST EXPLÍCITO
    const responseData = response.data as any;
    
    if (responseData?.success) {
      showSuccess('Webhook de prueba enviado correctamente');
      setTimeout(() => loadDeliveries(), 1000);
    } else {
      throw new Error(responseData?.message || 'Error al probar webhook');
    }
  } catch (e: any) {
    console.error('Error testing webhook:', e);
    showError('Error enviando webhook de prueba: ' + (e?.response?.data?.message || e.message));
  }
}

async function toggleWebhook(webhookId: string, currentStatus: boolean) {
  try {
    const response = await webhooksAPI.toggle(webhookId);
    
    // ✅ CAST EXPLÍCITO
    const responseData = response.data as any;
    
    if (responseData?.success) {
      showSuccess(`Webhook ${currentStatus ? 'desactivado' : 'activado'} correctamente`);
      await loadWebhooks();
    } else {
      throw new Error(responseData?.message || 'Error al cambiar estado del webhook');
    }
  } catch (e: any) {
    console.error('Error toggling webhook:', e);
    showError('Error cambiando estado del webhook: ' + (e?.response?.data?.message || e.message));
  }
}

async function deleteWebhook(webhook: any) {
  if (!confirm(`¿Estás seguro de eliminar el webhook "${webhook.name}"?`)) {
    return;
  }

  try {
    const response = await webhooksAPI.delete(webhook.id);
    
    // ✅ CAST EXPLÍCITO
    const responseData = response.data as any;
    
    if (responseData?.success) {
      showSuccess('Webhook eliminado correctamente');
      await loadWebhooks();
    } else {
      throw new Error(responseData?.message || 'Error al eliminar webhook');
    }
  } catch (e: any) {
    console.error('Error deleting webhook:', e);
    showError('Error eliminando webhook: ' + (e?.response?.data?.message || e.message));
  }
}

function editWebhook(webhook: any) {
  editingWebhook.value = webhook;
  webhookForm.value = {
    name: webhook.name || '',
    url: webhook.url || '',
    events: Array.isArray(webhook.events) ? [...webhook.events] : [],
  };
  collectionsInput.value = Array.isArray(webhook.collections) ? webhook.collections.join(', ') : '';
  showCreateModal.value = true;
}

function closeModal() {
  showCreateModal.value = false;
  editingWebhook.value = null;
  webhookForm.value = {
    name: '',
    url: '',
    events: [],
  };
  collectionsInput.value = '';
}

function viewDeliveryDetails(delivery: any) {
  alert(`Detalles de entrega ${delivery.id}:\n\nEvento: ${delivery.event}\nEstado: ${delivery.status}\nTiempo: ${delivery.duration_ms}ms\nCódigo de respuesta: ${delivery.response_status}`);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function showSuccess(message: string) {
  successMessage.value = message;
  setTimeout(() => successMessage.value = null, 3000);
}

function showError(message: string) {
  errorMessage.value = message;
  setTimeout(() => errorMessage.value = null, 5000);
}

// Lifecycle
onMounted(async () => {
  await loadWebhooks();
  await loadDeliveries();
});
</script>
