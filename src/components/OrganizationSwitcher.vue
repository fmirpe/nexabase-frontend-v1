<!-- src/components/OrganizationSwitcher.vue - VERSIÓN COMPLETA CORREGIDA -->
<template>
  <div class="relative" data-org-switcher>
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200"
      :disabled="loading"
    >
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {{ currentOrgInitials }}
        </div>
        <span class="hidden sm:block">{{ currentOrgName }}</span>
      </div>
      <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-show="isOpen"
      class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      @click.stop
    >
      <div class="p-2">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          My Organizations
        </div>
        
        <div v-if="loading" class="px-3 py-2 text-sm text-gray-500">
          Loading...
        </div>

        <div v-else-if="organizations.length === 0" class="px-3 py-2 text-sm text-gray-500">
          No organizations found
        </div>

        <div v-else>
          <button
            v-for="org in organizations"
            :key="org.id"
            @click="switchToOrganization(org.id)"
            class="w-full flex items-center space-x-3 px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-lg transition-colors"
            :class="{ 'bg-blue-50 text-blue-700': org.isActive }"
            :disabled="switching"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {{ getOrgInitials(org.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ org.name }}</div>
              <div class="text-xs text-gray-500 capitalize">{{ org.role }}</div>
            </div>
            <svg v-if="org.isActive" class="w-4 h-4 text-blue-600 flex-shrink-0">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12 5 5L20 7"/>
            </svg>
          </button>
        </div>

        <hr class="my-2" />
        
        <button
          @click="createNewOrganization"
          class="w-full flex items-center space-x-3 px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
        >
          <svg class="w-5 h-5 flex-shrink-0">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          <span>Create Organization</span>
        </button>

        <button
          @click="goToSettings"
          class="w-full flex items-center space-x-3 px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
        >
          <svg class="w-5 h-5 flex-shrink-0">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Organization Settings</span>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Overlay para cerrar dropdown -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-40" 
    @click="closeDropdown"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { tenantsAPI } from '../services/api';

// ✅ INTERFACES PARA LAS RESPUESTAS API
interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  role: string;
  status: string;
  joinedAt: string;
  isActive: boolean;
}

interface GetUserOrganizationsResponse {
  organizations: Organization[];
  currentTenantId: string | null;
  total: number;
}

interface SwitchOrganizationResponse {
  success: boolean;
  newTenantId: string;
  organizationName: string;
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId: string;
  };
}

const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);
const organizations = ref<Organization[]>([]);
const loading = ref(false);
const switching = ref(false);

const currentOrgName = computed(() => {
  const current = organizations.value.find(org => org.isActive);
  return current?.name || 'No Organization';
});

const currentOrgInitials = computed(() => {
  const current = organizations.value.find(org => org.isActive);
  return current ? getOrgInitials(current.name) : '?';
});

const getOrgInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const toggleDropdown = (): void => {
  if (!isOpen.value) {
    loadOrganizations();
  }
  isOpen.value = !isOpen.value;
};

const closeDropdown = (): void => {
  isOpen.value = false;
};

const loadOrganizations = async (): Promise<void> => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    const response = await tenantsAPI.getUserOrganizations();
    const data = response.data as GetUserOrganizationsResponse;
    organizations.value = data.organizations || [];
    
    // ✅ MARCAR LA ORGANIZACIÓN ACTIVA BASADA EN EL TENANTID DEL USUARIO
    if (authStore.user?.tenantId) {
      organizations.value.forEach(org => {
        org.isActive = org.id === authStore.user?.tenantId;
      });
    }
    
    console.log('🔍 Organizations loaded with active status:', organizations.value);
  } catch (error) {
    console.error('Failed to load organizations:', error);
    organizations.value = [];
  } finally {
    loading.value = false;
  }
};

const switchToOrganization = async (tenantId: string): Promise<void> => {
  if (switching.value) return;
  
  const currentOrg = organizations.value.find(org => org.isActive);
  if (currentOrg && currentOrg.id === tenantId) {
    closeDropdown();
    return;
  }
  
  switching.value = true;
  try {
    const response = await tenantsAPI.switchOrganization(tenantId);
    const data = response.data as SwitchOrganizationResponse;
    
    if (data.success) {
      if (authStore.user) {
        authStore.user.tenantId = data.newTenantId;
        localStorage.setItem('nexa_user', JSON.stringify(authStore.user));
      }
      
      console.log('✅', data.message);
      window.location.reload();
    }
  } catch (error) {
    console.error('Failed to switch organization:', error);
  } finally {
    switching.value = false;
    closeDropdown();
  }
};

const createNewOrganization = async (): Promise<void> => {
  console.log('🔍 Create new organization clicked');
  console.log('🔍 Current user tenantId:', authStore.user?.tenantId);
  
  try {
    await router.push('/create-organization');
    console.log('✅ Navigation to create-organization successful');
  } catch (error) {
    console.error('❌ Navigation failed:', error);
  }
  
  closeDropdown();
};

const goToSettings = async (): Promise<void> => {
  console.log('🔍 Navigating to organization-settings');
  
  try {
    await router.push('/organization-settings');
    console.log('✅ Settings navigation successful');
  } catch (error) {
    console.error('❌ Settings navigation failed:', error);
  }
  
  closeDropdown();
};

// ✅ WATCH PARA CAMBIOS EN TENANTID
watch(
  () => authStore.user?.tenantId,
  (newTenantId) => {
    if (newTenantId && organizations.value.length > 0) {
      // Actualizar el estado activo cuando cambie el tenantId
      organizations.value.forEach(org => {
        org.isActive = org.id === newTenantId;
      });
      console.log('🔄 Updated active organization:', newTenantId);
    }
  },
  { immediate: true }
);

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') {
    closeDropdown();
  }
};

const handleLoadOrganizations = async (): Promise<void> => {
  await loadOrganizations();
};

// ✅ CARGAR ORGANIZACIONES AL MONTAR SI HAY USUARIO CON TENANT
onMounted(async () => {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('load-organizations', handleLoadOrganizations);
  
  // Cargar organizaciones automáticamente si hay usuario con tenant
  if (authStore.user?.tenantId) {
    console.log('🔍 Auto-loading organizations on mount...');
    await loadOrganizations();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('load-organizations', handleLoadOrganizations);
});
</script>
