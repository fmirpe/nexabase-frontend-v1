<!-- src/pages/organization/OrganizationSettingsView.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p class="mt-2 text-sm text-gray-600">
          Manage your organization information and members
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="pt-6">
        <!-- Tab: General Settings -->
        <div v-show="activeTab === 'general'" class="space-y-6">
          <div class="max-w-2xl">
            <h3 class="text-lg font-medium text-gray-900">General Information</h3>
            <p class="mt-1 text-sm text-gray-500">
              Update your organization's basic information.
            </p>

            <form @submit.prevent="updateOrganization" class="mt-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  v-model="organizationForm.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  v-model="organizationForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization description (optional)"
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="updatingOrg"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                >
                  {{ updatingOrg ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tab: Members -->
        <div v-show="activeTab === 'members'" class="space-y-6">
          <!-- Add Member -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900">Invite New Member</h3>
            <p class="mt-1 text-sm text-gray-500">
              Add existing users to your organization.
            </p>

            <form @submit.prevent="inviteUser" class="mt-4 flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input
                  v-model="inviteForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter user email"
                />
              </div>
              <div>
                <select
                  v-model="inviteForm.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  :disabled="inviting"
                  class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                >
                  {{ inviting ? 'Inviting...' : 'Invite' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Members List -->
          <div class="bg-white border border-gray-200 rounded-xl">
            <div class="p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 class="text-lg font-medium text-gray-900">
                  Members ({{ membersData.total || 0 }})
                </h3>
                
                <!-- Search -->
                <div class="w-full sm:w-64">
                  <div class="relative">
                    <svg
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      v-model="searchQuery"
                      @input="debouncedSearch"
                      type="text"
                      placeholder="Search members..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="loadingMembers" class="text-center py-8">
                <div class="text-gray-500">Loading members...</div>
              </div>

              <!-- Members Grid (Similar to Users) -->
              <div v-else-if="membersData.members?.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="member in membersData.members"
                  :key="member.id"
                  class="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span class="text-white font-semibold text-sm">
                          {{ getInitials(member.firstName, member.lastName) }}
                        </span>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 text-sm">
                          {{ member.firstName }} {{ member.lastName }}
                        </h4>
                        <p class="text-xs text-gray-500">{{ member.email }}</p>
                      </div>
                    </div>
                    <button
                      v-if="member.id !== authStore.user?.id"
                      @click="confirmRemoveMember(member)"
                      class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-600">Role:</span>
                      <span
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          member.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800',
                        ]"
                      >
                        {{ member.role.toUpperCase() }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-600">Joined:</span>
                      <span class="text-xs text-gray-900">{{ formatDate(member.joinedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Members -->
              <div v-else class="text-center py-8">
                <div class="text-gray-500">No members found</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Member Modal - Igual que antes -->
    <div v-if="memberToRemove" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900">Remove Member</h3>
        <p class="mt-2 text-sm text-gray-500">
          Are you sure you want to remove <strong>{{ memberToRemove.firstName }} {{ memberToRemove.lastName }}</strong> from the organization?
        </p>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="memberToRemove = null"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="removeMember"
            :disabled="removingMember"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {{ removingMember ? 'Removing...' : 'Remove' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { tenantsAPI } from '../../services/api';

// ✅ INTERFACES PARA RESPUESTAS API
interface OrganizationTenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  settings?: any;
  is_active: boolean;
  metadata?: {
    description?: string;
  };
}

interface GetCurrentOrganizationResponse {
  tenant: OrganizationTenant;
}

interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member';
  status: string;
  joinedAt: string;
  lastActiveAt: string | null;
  avatarUrl: string | null;
}

interface MembersResponse {
  members: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UpdateOrganizationResponse {
  success: boolean;
  message: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    description: string;
    settings: any;
  };
}

interface InviteUserResponse {
  success: boolean;
  message: string;
  membership: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}

interface Tab {
  id: string;
  name: string;
}

// ✅ CREAR COMPOSABLE DE NOTIFICACIONES SIMPLE
const useNotifications = () => {
  const showSuccess = (title: string, message: string) => {
    console.log(`✅ ${title}: ${message}`);
    // Aquí puedes integrar una librería de notificaciones real
  };

  const showError = (title: string, message: string) => {
    console.error(`❌ ${title}: ${message}`);
    // Aquí puedes integrar una librería de notificaciones real
  };

  return { showSuccess, showError };
};

const { showSuccess, showError } = useNotifications();
const authStore = useAuthStore();

const activeTab = ref<string>('general');
const tabs: Tab[] = [
  { id: 'general', name: 'General' },
  { id: 'members', name: 'Members' },
];

// Organization form
const organizationForm = ref({
  name: '',
  description: '',
});
const updatingOrg = ref(false);

// Invite form
const inviteForm = ref({
  email: '',
  role: 'member' as 'admin' | 'member',
});
const inviting = ref(false);

// Members
const membersData = ref<MembersResponse>({ members: [], total: 0, page: 1, limit: 50, totalPages: 0 });
const loadingMembers = ref(false);
const searchQuery = ref('');
const memberToRemove = ref<Member | null>(null);
const removingMember = ref(false);

// Methods
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const loadCurrentOrganization = async (): Promise<void> => {
  try {
    // ✅ USAR getUserOrganizations COMO FALLBACK SI getCurrentOrganization NO EXISTE
    const response = await tenantsAPI.getUserOrganizations();
    const data = response.data as { organizations: any[]; currentTenantId: string | null };
    
    if (data.organizations && data.organizations.length > 0) {
      const currentOrg = data.organizations.find(org => org.isActive);
      if (currentOrg) {
        organizationForm.value.name = currentOrg.name;
        organizationForm.value.description = currentOrg.description || '';
      }
    }
  } catch (error) {
    console.error('Failed to load organization:', error);
    showError('Organization', 'Failed to load organization data');
  }
};

const updateOrganization = async (): Promise<void> => {
  updatingOrg.value = true;
  try {
    const response = await tenantsAPI.updateOrganization({
      name: organizationForm.value.name,
      description: organizationForm.value.description,
    });
    
    const data = response.data as UpdateOrganizationResponse;
    if (data.success) {
      showSuccess('Organization', 'Organization updated successfully');
    }
  } catch (error: any) {
    console.error('Failed to update organization:', error);
    const message = error.response?.data?.message || 'Failed to update organization';
    showError('Organization', message);
  } finally {
    updatingOrg.value = false;
  }
};

const loadMembers = async (): Promise<void> => {
  loadingMembers.value = true;
  try {
    const params = {
      page: 1,
      limit: 50,
      search: searchQuery.value,
    };
    const response = await tenantsAPI.getMembers(params);
    const data = response.data as MembersResponse;
    membersData.value = data;
  } catch (error: any) {
    console.error('Failed to load members:', error);
    const message = error.response?.data?.message || 'Failed to load members';
    showError('Members', message);
    membersData.value = { members: [], total: 0, page: 1, limit: 50, totalPages: 0 };
  } finally {
    loadingMembers.value = false;
  }
};

const inviteUser = async (): Promise<void> => {
  if (!inviteForm.value.email) return;
  
  inviting.value = true;
  try {
    const response = await tenantsAPI.inviteUser({
      email: inviteForm.value.email,
      role: inviteForm.value.role,
    });
    
    const data = response.data as InviteUserResponse;
    if (data.success) {
      inviteForm.value.email = '';
      inviteForm.value.role = 'member';
      showSuccess('User', 'User invited successfully');
      await loadMembers();
    }
  } catch (error: any) {
    console.error('Failed to invite user:', error);
    const message = error.response?.data?.message || 'Failed to invite user';
    showError('User', message);
  } finally {
    inviting.value = false;
  }
};

const confirmRemoveMember = (member: Member): void => {
  memberToRemove.value = member;
};

const removeMember = async (): Promise<void> => {
  if (!memberToRemove.value) return;
  
  removingMember.value = true;
  try {
    const response = await tenantsAPI.removeMember(memberToRemove.value.id);
    const data = response.data as { success: boolean; message: string };
    
    if (data.success) {
      showSuccess('Member', 'Member removed successfully');
      memberToRemove.value = null;
      await loadMembers();
    }
  } catch (error: any) {
    console.error('Failed to remove member:', error);
    const message = error.response?.data?.message || 'Failed to remove member';
    showError('Member', message);
  } finally {
    removingMember.value = false;
  }
};

// Debounced search
let searchTimeout: NodeJS.Timeout | undefined;
const debouncedSearch = (): void => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadMembers, 300);
};

onMounted((): void => {
  loadCurrentOrganization();
  loadMembers();
});
</script>

