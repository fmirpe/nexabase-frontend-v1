<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Users</h1>
        <p class="text-gray-600 mt-1">Manage user accounts</p>
      </div>
      <button
        @click="showInviteModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Invite User
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <!-- User Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    class="h-10 w-10 rounded-full bg-gray-300"
                    :src="getUserAvatar(user)"
                    :alt="getUserName(user)"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getUserName(user) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getRoleColor(user.role)
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(user.status)
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>

              <!-- Created -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-500">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <svg class="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a6 6 0 0112 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-500 mb-6">Get started by inviting your first user</p>
        <button
          @click="showInviteModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Invite User
        </button>
      </div>
    </div>

    <!-- Invite User Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showInviteModal = false"></div>
        
        <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-gray-900">Invite User</h3>
            <p class="text-sm text-gray-500 mt-1">Send an invitation to join your team</p>
          </div>
          
          <form @submit.prevent="handleInviteUser">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  v-model="inviteForm.email"
                  type="email"
                  required
                  placeholder="user@example.com"
                  class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    v-model="inviteForm.first_name"
                    type="text"
                    placeholder="John"
                    class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    v-model="inviteForm.last_name"
                    type="text"
                    placeholder="Doe"
                    class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  v-model="inviteForm.role"
                  class="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showInviteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {{ loading ? 'Sending...' : 'Send Invitation' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// Interfaces
interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: 'admin' | 'user' | 'developer'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

// State
const loading = ref(false)
const searchQuery = ref('')
const showInviteModal = ref(false)

const inviteForm = reactive({
  email: '',
  first_name: '',
  last_name: '',
  role: 'user' as 'admin' | 'user' | 'developer'
})

// Mock users data
const users = ref<User[]>([
  {
    id: '1',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'admin',
    status: 'active',
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'developer',
    status: 'active',
    created_at: '2025-01-16T14:20:00Z'
  },
  {
    id: '3',
    email: 'bob@example.com',
    first_name: 'Bob',
    last_name: 'Johnson',
    role: 'user',
    status: 'suspended',
    created_at: '2025-01-18T11:15:00Z'
  }
])

// Computed
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.email.toLowerCase().includes(query) ||
    getUserName(user).toLowerCase().includes(query)
  )
})

// Methods
function getUserName(user: User): string {
  return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User'
}

function getUserAvatar(user: User): string {
  const initials = getUserName(user)
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
  return `https://ui-avatars.com/api/?name=${initials}&background=3b82f6&color=fff&size=40`
}

function getRoleColor(role: string): string {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    developer: 'bg-purple-100 text-purple-800',
    user: 'bg-gray-100 text-gray-800',
  }
  return colors[role as keyof typeof colors] || colors.user
}

function getStatusColor(status: string): string {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
  }
  return colors[status as keyof typeof colors] || colors.inactive
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

async function handleInviteUser() {
  loading.value = true
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add new user to list (in real app, this would come from API response)
    const newUser: User = {
      id: Date.now().toString(),
      email: inviteForm.email,
      first_name: inviteForm.first_name,
      last_name: inviteForm.last_name,
      role: inviteForm.role,
      status: 'active',
      created_at: new Date().toISOString()
    }
    
    users.value.push(newUser)
    
    // Reset form
    showInviteModal.value = false
    inviteForm.email = ''
    inviteForm.first_name = ''
    inviteForm.last_name = ''
    inviteForm.role = 'user'
  } finally {
    loading.value = false
  }
}
</script>