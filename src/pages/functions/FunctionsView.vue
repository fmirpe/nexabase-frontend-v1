<template>
  <div class="functions-view">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div>
          <h1 class="title">Edge Functions</h1>
          <p class="subtitle">Serverless functions that run on demand</p>
        </div>
        <div class="header-actions">
          <button @click="loadFunctions" class="btn-secondary">
            <svg
              class="icon"
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
            Refresh
          </button>
          <button @click="showCreateModal = true" class="btn-primary">
            <svg
              class="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Function
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <p class="stat-label">Total Functions</p>
        <p class="stat-value">{{ stats.total }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Active</p>
        <p class="stat-value text-green">{{ stats.active }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">With Errors</p>
        <p class="stat-value text-red">{{ stats.errors }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Total Invocations</p>
        <p class="stat-value text-blue">
          {{ stats.totalInvocations.toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter"
        @click="currentFilter = filter"
        :class="['filter-btn', { active: currentFilter === filter }]"
      >
        {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading functions...</p>
    </div>

    <!-- Functions List -->
    <div v-else-if="filteredFunctions.length > 0" class="functions-grid">
      <FunctionCard
        v-for="func in filteredFunctions"
        :key="func.id"
        :func="func"
        @edit="handleEdit"
        @delete="handleDelete"
        @invoke="handleInvoke"
        @toggle-status="handleToggleStatus"
        @view-executions="handleViewExecutions"
      />
    </div>

    <!-- Empty State -->
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
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3>No functions</h3>
      <p>Get started by creating a new function.</p>
      <button @click="showCreateModal = true" class="btn-primary mt-4">
        Create Function
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <FunctionModal
      v-if="showCreateModal || editingFunction"
      :func="editingFunction"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Invoke Modal -->
    <InvokeFunctionModal
      v-if="invokingFunction"
      :func="invokingFunction"
      @close="invokingFunction = null"
    />

    <!-- ✅ Execution History Modal -->
    <ExecutionHistory
      v-if="viewingExecutions"
      :function-id="viewingExecutions.id"
      @close="viewingExecutions = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFunctions } from "@/composables/useFunctions";
import type { EdgeFunction } from "@/types/functions";
import FunctionCard from "./components/FunctionCard.vue";
import FunctionModal from "./components/FunctionModal.vue";
import InvokeFunctionModal from "./components/InvokeFunctionModal.vue";
import ExecutionHistory from "./components/ExecutionHistory.vue"; // ✅ AGREGAR
import { PlusIcon } from "@heroicons/vue/24/outline";

const {
  functions,
  loading,
  stats,
  loadFunctions,
  deleteFunction,
  toggleStatus,
} = useFunctions();

const currentFilter = ref("all");
const showCreateModal = ref(false);
const editingFunction = ref<EdgeFunction | null>(null);
const invokingFunction = ref<EdgeFunction | null>(null);
const viewingExecutions = ref<EdgeFunction | null>(null); // ✅ AGREGAR

const filters = ["all", "active", "http", "schedule", "database", "error"];

const filteredFunctions = computed(() => {
  return functions.value.filter((f) => {
    if (currentFilter.value === "all") return true;
    if (currentFilter.value === "active") return f.status === "active";
    if (currentFilter.value === "error") return f.errors > 0;
    return f.trigger === currentFilter.value;
  });
});

function handleEdit(func: EdgeFunction) {
  editingFunction.value = func;
}

async function handleDelete(func: EdgeFunction) {
  if (confirm(`Are you sure you want to delete "${func.name}"?`)) {
    await deleteFunction(func.id);
  }
}

function handleInvoke(func: EdgeFunction) {
  invokingFunction.value = func;
}

// ✅ AGREGAR: Handler para ver executions
function handleViewExecutions(func: EdgeFunction) {
  viewingExecutions.value = func;
}

async function handleToggleStatus(func: EdgeFunction) {
  await toggleStatus(func.id, func.status);
}

function closeModal() {
  showCreateModal.value = false;
  editingFunction.value = null;
}

async function handleSave() {
  closeModal();
  await loadFunctions();
}

onMounted(() => {
  loadFunctions();
});
</script>

<style scoped>
.functions-view {
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

.text-red {
  color: #ef4444;
}

.text-blue {
  color: #3b82f6;
}

.filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f9fafb;
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.functions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
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
