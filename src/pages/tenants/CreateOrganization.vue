<!-- src/pages/CreateOrganization.vue - ARCHIVO NUEVO -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="text-center">
        <img class="mx-auto h-15 w-60" :src="logoUrl" alt="NexaBase" />
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Create Your Organization
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Set up your workspace and choose your plan
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
        <!-- Step Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-center">
            <div class="flex items-center">
              <div :class="['flex items-center justify-center w-8 h-8 rounded-full border-2', 
                currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500']">
                <span class="text-sm font-medium">1</span>
              </div>
              <div :class="['w-16 h-0.5', currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300']"></div>
              <div :class="['flex items-center justify-center w-8 h-8 rounded-full border-2', 
                currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500']">
                <span class="text-sm font-medium">2</span>
              </div>
              <div :class="['w-16 h-0.5', currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300']"></div>
              <div :class="['flex items-center justify-center w-8 h-8 rounded-full border-2', 
                currentStep >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500']">
                <span class="text-sm font-medium">3</span>
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-gray-500">
            <span>Organization</span>
            <span>Plan</span>
            <span>Payment</span>
          </div>
        </div>

        <!-- Step 1: Organization Details -->
        <div v-if="currentStep === 1">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Organization Details</h3>
          <form @submit.prevent="nextStep" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Organization Name *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="My Company"
              />
            </div>

            <div>
              <label for="slug" class="block text-sm font-medium text-gray-700">
                URL Slug (optional)
              </label>
              <input
                id="slug"
                v-model="form.slug"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="my-company"
              />
              <p class="mt-2 text-xs text-gray-500">
                Leave empty to auto-generate from name
              </p>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description..."
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="!form.name.trim()"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Choose Plan
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Plan Selection -->
        <div v-if="currentStep === 2">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Choose Your Plan</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div
              v-for="plan in plans"
              :key="plan.id"
              @click="selectedPlan = plan"
              :class="[
                'border-2 rounded-lg p-6 cursor-pointer transition-all',
                selectedPlan?.id === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="text-center">
                <h4 class="text-lg font-semibold text-gray-900">{{ plan.name }}</h4>
                <div class="mt-4">
                  <span class="text-3xl font-bold text-gray-900">
                    ${{ plan.price }}
                  </span>
                  <span class="text-gray-500">{{ plan.interval }}</span>
                </div>
                <ul class="mt-6 space-y-2 text-sm text-gray-600">
                  <li v-for="feature in plan.features" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
                <div v-if="plan.id === 'free'" class="mt-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Popular
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between">
            <button
              @click="currentStep = 1"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              @click="nextStep"
              :disabled="!selectedPlan"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ selectedPlan?.price === 0 ? 'Create Organization' : 'Next: Payment' }}
            </button>
          </div>
        </div>

        <!-- Step 3: Payment (only for paid plans) -->
        <div v-if="currentStep === 3 && selectedPlan!.price > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-6">Payment Information</h3>
          <!-- Stripe Payment Form Placeholder -->
          <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Stripe Payment Integration</h3>
            <p class="mt-1 text-sm text-gray-500">
              Payment form will be integrated here
            </p>
            <div class="mt-6">
              <button
                @click="simulatePayment"
                :disabled="authStore.loading"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {{ authStore.loading ? 'Processing...' : `Pay $${selectedPlan!.price}/${selectedPlan!.interval} (Simulate)` }}
              </button>
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <button
              @click="currentStep = 2"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="authStore.error"
          class="mt-6 bg-red-50 border border-red-200 rounded-md p-4"
        >
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <p class="mt-2 text-sm text-red-700">{{ authStore.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { plansAPI, tenantsAPI } from '../../services/api';

// ✅ INTERFACES DE TIPOS
interface PlanFeatures {
  storage_gb: number;
  bandwidth_gb: number;
  database_rows: number;
  collections_count: number;
  realtime_connections: number;
  realtime_messages_per_month: number;
  api_requests_per_month: number;
  functions_invocations: number;
  monthly_active_users: number;
  multi_tenant: boolean;
  custom_domains: boolean;
  advanced_analytics: boolean;
  priority_support: boolean;
  sla_guarantee: string | null;
  team_members: number;
  environments: number;
  backups_retention_days: number;
  white_label: boolean;
  custom_integrations: boolean;
  dedicated_instance: boolean;
  compliance_certifications: string[];
}

interface BackendPlan {
  id: string;
  name: string;
  type: string;
  price: string;
  billing_interval: string;
  description?: string;
  features: PlanFeatures;
  highlight_features?: string[];
}

interface FormattedPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  interval: string;
  description?: string;
  features: string[];
  highlight_features: string[];
}

// ✅ INTERFACES PARA RESPUESTAS API
interface PlansAPIResponse {
  success: boolean;
  data: BackendPlan[];
  timestamp: string;
}

interface CreateOrganizationResult {
  success: boolean;
  organization?: any;
  user?: any;
}

const router = useRouter();
const authStore = useAuthStore();
const logoUrl = '/logo_peq.png';

const currentStep = ref(1);
const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
  slug: '',
  description: '',
});

const plans = ref<FormattedPlan[]>([]);
const selectedPlan = ref<FormattedPlan | null>(null);

onMounted(async (): Promise<void> => {
  try {
    loading.value = true;
    const response = await plansAPI.getAll();
    
    // ✅ TYPE ASSERTION CON VALIDACIÓN
    const apiData = response.data as PlansAPIResponse;
    
    if (apiData && apiData.data && Array.isArray(apiData.data)) {
      plans.value = apiData.data.map((plan: BackendPlan): FormattedPlan => ({
        id: plan.id,
        name: plan.name,
        type: plan.type,
        price: parseFloat(plan.price),
        interval: plan.billing_interval === 'monthly' ? '/month' : '/year',
        description: plan.description,
        features: formatFeatures(plan.features),
        highlight_features: plan.highlight_features || []
      }));
      
      // Seleccionar plan FREE por defecto
      const freePlan = plans.value.find((p: FormattedPlan) => p.type === 'free');
      if (freePlan) {
        selectedPlan.value = freePlan;
      }
    } else {
      // Fallback con planes predeterminados
      plans.value = getDefaultPlans();
      selectedPlan.value = plans.value[0];
    }
  } catch (err) {
    console.error('Error loading plans:', err);
    error.value = 'Error loading plans, using defaults';
    
    // ✅ PLANES POR DEFECTO EN CASO DE ERROR
    plans.value = getDefaultPlans();
    selectedPlan.value = plans.value[0];
  } finally {
    loading.value = false;
  }
});

// ✅ FUNCIÓN PARA PLANES POR DEFECTO
function getDefaultPlans(): FormattedPlan[] {
  return [
    {
      id: 'free',
      name: 'Free',
      type: 'free',
      price: 0,
      interval: '/month',
      features: ['10 Collections', '1,000 Records', '1GB Storage', 'Basic Support'],
      highlight_features: ['Popular']
    },
    {
      id: 'pro',
      name: 'Professional',
      type: 'paid',
      price: 29,
      interval: '/month',
      features: ['Unlimited Collections', '100K Records', '10GB Storage', 'Priority Support'],
      highlight_features: ['Most Popular']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      type: 'paid',
      price: 99,
      interval: '/month',
      features: ['Unlimited Everything', 'Custom Domains', 'Advanced Analytics', '24/7 Support'],
      highlight_features: ['Advanced']
    }
  ];
}

function formatFeatures(features: PlanFeatures): string[] {
  const formatted: string[] = [];
  
  if (features.collections_count) {
    formatted.push(`${features.collections_count === -1 ? 'Unlimited' : features.collections_count} Collections`);
  }
  
  if (features.database_rows) {
    formatted.push(`${features.database_rows === -1 ? 'Unlimited' : formatNumber(features.database_rows)} Records`);
  }
  
  if (features.storage_gb) {
    formatted.push(`${features.storage_gb} GB Storage`);
  }
  
  if (features.api_requests_per_month) {
    formatted.push(`${formatNumber(features.api_requests_per_month)} API Requests/month`);
  }
  
  if (features.priority_support) {
    formatted.push('Priority Support');
  }
  
  if (features.advanced_analytics) {
    formatted.push('Advanced Analytics');
  }
  
  if (features.custom_domains) {
    formatted.push('Custom Domains');
  }
  
  return formatted;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000) + 'M';
  if (num >= 1000) return (num / 1000) + 'K';
  return num.toString();
}

function nextStep(): void {
  if (currentStep.value === 1) {
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    if (selectedPlan.value?.price === 0) {
      handleCreateOrganization();
    } else {
      currentStep.value = 3;
    }
  }
}

async function simulatePayment(): Promise<void> {
  await handleCreateOrganization();
}

async function handleCreateOrganization(): Promise<void> {
  if (typeof authStore.clearError === 'function') {
    authStore.clearError();
  }

  try {
    // ✅ DETECTAR SI ES PRIMERA ORGANIZACIÓN O ADICIONAL
    const isFirstOrg = !authStore.user?.tenantId;
    
    let result;
    if (isFirstOrg) {
      // Primera organización - usar authStore
      result = await authStore.createFirstOrganization({
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim() || undefined,
        planId: selectedPlan.value?.id,
        paymentMethod: selectedPlan.value?.price && selectedPlan.value.price > 0 ? 'stripe_simulated' : undefined,
      }) as CreateOrganizationResult;
    } else {
      // Organización adicional - usar API directa
      const response = await tenantsAPI.createAdditional({
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim() || undefined,
        planId: selectedPlan.value?.id,
        paymentMethod: selectedPlan.value?.price && selectedPlan.value.price > 0 ? 'stripe_simulated' : undefined,
      });
      result = { success: true };
      // ✅ ACTUALIZAR USUARIO EN authStore CON LA NUEVA ORGANIZACIÓN
      if (authStore.user) {
        const responseData = response.data as any;
        authStore.user.tenantId = responseData.user.tenantId;
        localStorage.setItem('nexa_user', JSON.stringify(authStore.user));
      }
    }

    if (result.success) {
      await router.push('/');
    }
  } catch (err) {
    console.error('Create organization error:', err);
    error.value = 'Failed to create organization';
  }
}
</script>
