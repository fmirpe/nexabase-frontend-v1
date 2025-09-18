<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p class="mt-2 text-sm text-gray-600">
          Administra usuarios, roles y permisos del sistema
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <button
          @click="openCreateUser"
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
          Nuevo Usuario
        </button>
        <button
          @click="refreshUsers"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Refrescar"
        >
          <svg
            class="w-5 h-5 text-gray-600"
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

    <!-- Filters -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
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
              @input="handleSearch"
              type="text"
              placeholder="Buscar usuarios..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedRole"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="user">Usuario</option>
            <option value="developer">Desarrollador</option>
          </select>
          <select
            v-model.number="meta.limit"
            @change="goToPage(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error/Loading -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4"
    >
      {{ error }}
      <button
        @click="loadUsers"
        class="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>
    <div v-if="loading" class="bg-white border border-gray-200 rounded-lg p-4">
      Cargando usuarios...
    </div>

    <!-- Users Grid -->
    <div
      v-if="!loading && users.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4"
            >
              <span class="text-white font-semibold text-lg">
                {{ getUserInitials(user) }}
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">
                {{ user.first_name }} {{ user.last_name }}
              </h3>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <button
              @click="openEditUser(user)"
              class="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="Editar"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="confirmDeleteUser(user)"
              class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Eliminar"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Rol:</span>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : user.role === 'developer'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800',
              ]"
            >
              {{ user.role.toUpperCase() }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Estado:</span>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                user.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ user.is_active ? "Activo" : "Inactivo" }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Registro:</span>
            <span class="text-sm text-gray-900">{{
              formatDate(user.created_at)
            }}</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          <button
            @click="toggleUserStatus(user)"
            :class="[
              'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              user.is_active
                ? 'bg-red-50 hover:bg-red-100 text-red-700'
                : 'bg-green-50 hover:bg-green-100 text-green-700',
            ]"
          >
            {{ user.is_active ? "Desactivar" : "Activar" }}
          </button>
          <button
            @click="resetUserPassword(user)"
            class="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="text-center py-12">
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
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
      <p class="mt-1 text-sm text-gray-500">
        Comienza creando tu primer usuario.
      </p>
      <div class="mt-6">
        <button
          @click="openCreateUser"
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
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && meta.pages > 1"
      class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
    >
      <div class="text-sm text-gray-600">
        Página {{ meta.page }} de {{ meta.pages }} • {{ meta.total }} total
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(meta.page - 1)"
          :disabled="meta.page <= 1"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          @click="goToPage(meta.page + 1)"
          :disabled="meta.page >= meta.pages"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-6 mx-auto p-5 w-full max-w-md shadow-lg rounded-md bg-white border"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ isEditing ? "Editar Usuario" : "Nuevo Usuario" }}
        </h3>

        <div
          v-if="formError"
          class="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3"
        >
          {{ formError }}
        </div>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Nombre</label
              >
              <input
                v-model="userForm.first_name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Apellido</label
              >
              <input
                v-model="userForm.last_name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apellido"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Email</label
            >
            <input
              v-model="userForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Contraseña</label
            >
            <input
              v-model="userForm.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Rol</label
            >
            <select
              v-model="userForm.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">Usuario</option>
              <option value="developer">Desarrollador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              v-model="userForm.is_active"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-700">Usuario activo</label>
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
        <h4 class="text-lg font-semibold text-gray-900">Eliminar Usuario</h4>
        <p class="text-sm text-gray-600 mt-2">
          ¿Estás seguro de que deseas eliminar a
          <strong
            >{{ userToDelete?.first_name }}
            {{ userToDelete?.last_name }}</strong
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
            @click="deleteUser"
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
import { usersAPI } from "../../services/api";

// ✅ TIPOS TypeScript
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

// State
const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const deleting = ref<boolean>(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);

// Data
const users = ref<User[]>([]);
const meta = ref<PaginationMeta>({
  page: 1,
  limit: 12,
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

// ✅ CORREGIDO: API Functions con tipos TypeScript
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
    // ✅ CORREGIDO: Tipo assertion para response.data
    const data = response.data as APIResponse;

    users.value = data.data || [];
    meta.value = {
      page: data.meta?.page || 1,
      limit: data.meta?.limit || 12,
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
      // Update user - excluir password del update
      const { password, ...updateData } = userForm.value;
      await usersAPI.update(editingUser.value.id, updateData);
    } else {
      // Create user
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
    // Simular reset de password - implementar endpoint real
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Contraseña restablecida para ${user.first_name} ${user.last_name}`);
  } catch (e: any) {
    console.error("Error resetting password:", e);
    error.value = "Error restableciendo contraseña";
  }
}

// UI Functions
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

// Utilities
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
