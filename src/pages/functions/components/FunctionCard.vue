<template>
  <div class="function-card">
    <div class="card-header">
      <div class="header-left">
        <component :is="getTriggerIcon(func.trigger)" class="trigger-icon" />
        <div>
          <h3 class="function-name">{{ func.name }}</h3>
          <p class="trigger-type">{{ func.trigger }} trigger</p>
        </div>
      </div>
      <span :class="['status-badge', `status-${func.status}`]">
        {{ func.status }}
      </span>
    </div>

    <p v-if="func.description" class="description">{{ func.description }}</p>

    <div class="stats">
      <div class="stat">
        <span class="stat-label">Invocations</span>
        <span class="stat-value">{{ func.invocations.toLocaleString() }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Errors</span>
        <span :class="['stat-value', { 'text-red': func.errors > 0 }]">
          {{ func.errors }}
        </span>
      </div>
      <div class="stat">
        <span class="stat-label">Avg Time</span>
        <span class="stat-value">{{
          formatExecutionTime(func.avgExecutionTime)
        }}</span>
      </div>
    </div>

    <div class="actions">
      <button @click="$emit('invoke', func)" class="btn-test">
        <PlayIcon class="icon" />
        Test
      </button>

      <!-- ✅ BOTÓN DEL RELOJ AQUÍ -->
      <button
        @click="$emit('view-executions', func)"
        class="btn-icon"
        title="View execution history"
      >
        <ClockIcon class="icon" />
      </button>

      <button
        @click="$emit('edit', func)"
        class="btn-icon"
        title="Edit function"
      >
        <PencilIcon class="icon" />
      </button>

      <button
        @click="$emit('toggle-status', func)"
        class="btn-icon"
        :title="func.status === 'active' ? 'Pause' : 'Activate'"
      >
        <component
          :is="func.status === 'active' ? PauseIcon : PlayIcon"
          class="icon"
        />
      </button>

      <button
        @click="$emit('delete', func)"
        class="btn-icon btn-danger"
        title="Delete function"
      >
        <TrashIcon class="icon" />
      </button>
    </div>

    <div v-if="func.lastExecutedAt" class="last-execution">
      Last executed: {{ formatDate(func.lastExecutedAt) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { EdgeFunction } from "@/types/functions";
import {
  PlayIcon,
  PencilIcon,
  TrashIcon,
  PauseIcon,
  BoltIcon,
  ClockIcon, // ✅ IMPORTADO
  CalendarIcon,
  CircleStackIcon,
} from "@heroicons/vue/24/outline";

defineProps<{
  func: EdgeFunction;
}>();

defineEmits<{
  (e: "edit", func: EdgeFunction): void;
  (e: "delete", func: EdgeFunction): void;
  (e: "invoke", func: EdgeFunction): void;
  (e: "toggle-status", func: EdgeFunction): void;
  (e: "view-executions", func: EdgeFunction): void; // ✅ EVENTO AGREGADO
}>();

function getTriggerIcon(trigger: string) {
  const icons: Record<string, any> = {
    http: BoltIcon,
    schedule: CalendarIcon,
    database: CircleStackIcon,
    webhook: ClockIcon,
    manual: ClockIcon,
  };
  return icons[trigger] || ClockIcon;
}

function formatExecutionTime(ms?: number): string {
  if (!ms) return "N/A";
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString();
}
</script>

<style scoped>
.function-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.function-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.header-left {
  display: flex;
  gap: 0.75rem;
}

.trigger-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
  flex-shrink: 0;
}

.function-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.trigger-type {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  text-transform: capitalize;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-deploying {
  background: #dbeafe;
  color: #1e40af;
}

.status-error {
  background: #fef3c7;
  color: #92400e;
}

.description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.text-red {
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-test {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-test:hover {
  background: #2563eb;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
}

.btn-icon:hover {
  background: #f9fafb;
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-danger {
  border-color: #fecaca;
  color: #dc2626;
}

.btn-danger:hover {
  background: #fef2f2;
  border-color: #ef4444;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.last-execution {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
}
</style>
