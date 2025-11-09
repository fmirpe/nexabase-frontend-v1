<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useHooks } from "@/composables/useHooks";
import type { Hook } from "@/composables/useHooks";
import HookCard from "./components/HookCard.vue";
import HookModal from "./components/HookModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { PlusIcon, ArrowPathIcon } from "@heroicons/vue/24/outline";

const { hooks, loading, stats, loadHooks, deleteHook, toggleStatus } =
  useHooks();

const showCreateModal = ref(false);
const editingHook = ref<Hook | null>(null);

const showConfirmModal = ref(false);
const confirmAction = ref<(() => Promise<void>) | null>(null);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirming = ref(false);

function handleEdit(hook: Hook) {
  editingHook.value = hook;
}

async function handleDelete(hook: Hook) {
  confirmTitle.value = "Delete Hook";
  confirmMessage.value = `Are you sure you want to delete "${hook.name}"? This action cannot be undone.`;
  confirmAction.value = async () => {
    await deleteHook(hook.id);
  };
  showConfirmModal.value = true;
}

async function handleToggle(hook: Hook) {
  const newStatus = !hook.active;
  confirmTitle.value = newStatus ? "Activate Hook" : "Deactivate Hook";
  confirmMessage.value = `Are you sure you want to ${
    newStatus ? "activate" : "deactivate"
  } "${hook.name}"?`;
  confirmAction.value = async () => {
    await toggleStatus(hook.id, hook.active !== false);
  };
  showConfirmModal.value = true;
}

async function handleConfirm() {
  if (!confirmAction.value) return;

  confirming.value = true;
  try {
    await confirmAction.value();
    showConfirmModal.value = false;
  } catch (error) {
    console.error("Action failed:", error);
  } finally {
    confirming.value = false;
    confirmAction.value = null;
  }
}

function handleCancelConfirm() {
  showConfirmModal.value = false;
  confirmAction.value = null;
  confirming.value = false;
}

function closeModal() {
  showCreateModal.value = false;
  editingHook.value = null;
}

async function handleSave() {
  closeModal();
  await loadHooks();
}

onMounted(() => {
  loadHooks();
});
</script>

<template>
  <div class="hooks-view">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div>
          <h1 class="title">Database Hooks</h1>
          <p class="subtitle">Automate actions when data changes</p>
        </div>
        <div class="header-actions">
          <button @click="loadHooks" class="btn-secondary">
            <ArrowPathIcon class="icon" />
            Refresh
          </button>
          <button @click="showCreateModal = true" class="btn-primary">
            <PlusIcon class="icon" />
            New Hook
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <p class="stat-label">Total Hooks</p>
        <p class="stat-value">{{ stats.total }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Active</p>
        <p class="stat-value text-green">{{ stats.active }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">By Trigger</p>
        <div class="trigger-breakdown">
          <span
            v-for="(count, trigger) in stats.byTrigger"
            :key="trigger"
            class="trigger-item"
          >
            {{ trigger }}: {{ count }}
          </span>
        </div>
      </div>
      <div class="stat-card">
        <p class="stat-label">Total Executions</p>
        <p class="stat-value text-blue">
          {{ stats.totalExecutions.toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Info Card -->
    <div class="info-card">
      <div class="info-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="info-content">
        <h3>What are Database Hooks?</h3>
        <p>
          Hooks automatically execute code when database events occur (create,
          update, delete). Use them for validations, transformations, sending
          notifications, and more.
        </p>
      </div>
    </div>

    <!-- Hooks List -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading hooks...</p>
    </div>

    <div v-else-if="hooks.length > 0" class="hooks-grid">
      <HookCard
        v-for="hook in hooks"
        :key="hook.name"
        :hook="hook"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle="handleToggle"
      />
    </div>

    <div v-else class="empty-state">
      <svg
        class="empty-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
      <h3>No hooks configured</h3>
      <p>Create your first hook to automate database actions.</p>
      <button @click="showCreateModal = true" class="btn-primary mt-4">
        Create Hook
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <HookModal
      v-if="showCreateModal || editingHook"
      :hook="editingHook"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Confirm Modal -->
    <ConfirmModal
      v-if="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirming="confirming"
      @close="handleCancelConfirm"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.hooks-view {
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.text-green {
  color: #10b981;
}

.text-blue {
  color: #3b82f6;
}

.trigger-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.trigger-item {
  font-size: 0.875rem;
  color: #374151;
  text-transform: capitalize;
}

.info-card {
  display: flex;
  gap: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-icon {
  flex-shrink: 0;
}

.info-icon svg {
  width: 2rem;
  height: 2rem;
  color: #3b82f6;
}

.info-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1e40af;
}

.info-content p {
  font-size: 0.875rem;
  color: #1e40af;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hooks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin: 0 auto 1rem;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
