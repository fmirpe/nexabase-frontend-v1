<template>
  <div class="execution-history">
    <div class="header">
      <h3>Execution History</h3>
      <button @click="loadExecutions" class="btn-refresh">
        <RefreshIcon class="icon" />
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div v-else-if="executions.length === 0" class="empty">
      <p>No executions yet</p>
    </div>

    <div v-else class="executions-list">
      <div
        v-for="execution in executions"
        :key="execution.id"
        class="execution-item"
        @click="selectedExecution = execution"
      >
        <div class="execution-status">
          <span :class="['status-dot', `status-${execution.status}`]"></span>
          <span class="status-text">{{ execution.status }}</span>
        </div>
        <div class="execution-time">
          {{ execution.executionTime.toFixed(0) }}ms
        </div>
        <div class="execution-date">
          {{ formatDate(execution.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Execution Detail Modal -->
    <Teleport to="body" v-if="selectedExecution">
      <div class="modal-overlay" @click="selectedExecution = null">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Execution Details</h3>
            <button @click="selectedExecution = null" class="close-btn">
              <XIcon class="icon" />
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-section">
              <label>Status</label>
              <span :class="['badge', `badge-${selectedExecution.status}`]">
                {{ selectedExecution.status }}
              </span>
            </div>

            <div class="detail-section">
              <label>Execution Time</label>
              <span>{{ selectedExecution.executionTime.toFixed(2) }}ms</span>
            </div>

            <div v-if="selectedExecution.memoryUsed" class="detail-section">
              <label>Memory Used</label>
              <span
                >{{
                  (selectedExecution.memoryUsed / 1024 / 1024).toFixed(2)
                }}MB</span
              >
            </div>

            <div class="detail-section">
              <label>Input</label>
              <pre><code>{{ formatJSON(selectedExecution.input) }}</code></pre>
            </div>

            <div v-if="selectedExecution.output" class="detail-section">
              <label>Output</label>
              <pre><code>{{ formatJSON(selectedExecution.output) }}</code></pre>
            </div>

            <div v-if="selectedExecution.error" class="detail-section">
              <label>Error</label>
              <pre
                class="error-pre"
              ><code>{{ selectedExecution.error }}</code></pre>
            </div>

            <div v-if="selectedExecution.logs" class="detail-section">
              <label>Logs</label>
              <pre
                class="logs-pre"
              ><code>{{ selectedExecution.logs }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { functionsAPI } from "@/services/api";
import type { FunctionExecution } from "@/types/functions";
// @ts-ignore
import { RefreshIcon, XIcon } from "@heroicons/vue/outline";

const props = defineProps<{
  functionId: string;
}>();

const executions = ref<FunctionExecution[]>([]);
const loading = ref(false);
const selectedExecution = ref<FunctionExecution | null>(null);

async function loadExecutions() {
  loading.value = true;
  try {
    executions.value = await functionsAPI.getExecutions(props.functionId);
  } catch (error) {
    console.error("Failed to load executions:", error);
  } finally {
    loading.value = false;
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

function formatJSON(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

onMounted(() => {
  loadExecutions();
});
</script>

<style scoped>
.execution-history {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.btn-refresh {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-refresh:hover {
  background: #f9fafb;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.executions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.execution-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.execution-item:hover {
  background: #f9fafb;
  border-color: #3b82f6;
}

.execution-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.status-success {
  background: #10b981;
}

.status-error {
  background: #ef4444;
}

.status-timeout {
  background: #f59e0b;
}

.status-text {
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.execution-time {
  font-size: 0.875rem;
  color: #6b7280;
  font-family: monospace;
}

.execution-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.detail-section pre {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  margin: 0;
}

.error-pre {
  background: #fef2f2;
  color: #dc2626;
}

.logs-pre {
  background: #111827;
  color: #f9fafb;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-error {
  background: #fee2e2;
  color: #991b1b;
}

.badge-timeout {
  background: #fef3c7;
  color: #92400e;
}
</style>
