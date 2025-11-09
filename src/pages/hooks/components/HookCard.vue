<template>
  <div class="hook-card">
    <div class="card-header">
      <div class="header-left">
        <component :is="getTriggerIcon(hook.trigger)" class="trigger-icon" />
        <div>
          <h3 class="hook-name">{{ hook.name }}</h3>
          <p class="trigger-type">{{ formatTrigger(hook.trigger) }}</p>
        </div>
      </div>
      <span
        :class="['status-badge', hook.active !== false ? 'active' : 'inactive']"
      >
        {{ hook.active !== false ? "Active" : "Inactive" }}
      </span>
    </div>

    <div class="hook-details">
      <div class="detail-row">
        <span class="detail-label">Priority:</span>
        <span class="detail-value">{{ hook.priority || 0 }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Mode:</span>
        <span class="detail-value">{{ hook.async ? "Async" : "Sync" }}</span>
      </div>
      <div v-if="hook.collections" class="detail-row">
        <span class="detail-label">Collections:</span>
        <span class="detail-value">{{
          hook.collections.join(", ") || "All"
        }}</span>
      </div>
      <div v-if="hook.executions !== undefined" class="detail-row">
        <span class="detail-label">Executions:</span>
        <span class="detail-value">{{ hook.executions.toLocaleString() }}</span>
      </div>
    </div>

    <div class="actions">
      <button
        @click="$emit('toggle', hook)"
        :class="['btn-toggle', hook.active !== false ? 'active' : 'inactive']"
      >
        <component
          :is="hook.active !== false ? PauseIcon : PlayIcon"
          class="icon"
        />
        {{ hook.active !== false ? "Pause" : "Activate" }}
      </button>
      <button @click="$emit('edit', hook)" class="btn-icon">
        <PencilIcon class="icon" />
      </button>
      <button @click="$emit('delete', hook)" class="btn-icon btn-danger">
        <TrashIcon class="icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlayIcon,
  PauseIcon,
  PencilIcon,
  TrashIcon,
  CircleStackIcon, // DatabaseIcon
  ClockIcon,
  CodeBracketIcon, // CodeIcon
} from "@heroicons/vue/24/outline";

interface Hook {
  name: string;
  trigger: string;
  collections?: string[];
  priority?: number;
  async?: boolean;
  active?: boolean;
  executions?: number;
}

defineProps<{
  hook: Hook;
}>();

defineEmits<{
  (e: "edit", hook: Hook): void;
  (e: "delete", hook: Hook): void;
  (e: "toggle", hook: Hook): void;
}>();

function getTriggerIcon(trigger: string) {
  if (
    trigger.includes("create") ||
    trigger.includes("update") ||
    trigger.includes("delete")
  ) {
    return CircleStackIcon; // Cambio: DatabaseIcon
  }
  if (trigger.includes("schedule")) {
    return ClockIcon;
  }
  return CodeBracketIcon; // Cambio: CodeIcon
}

function formatTrigger(trigger: string): string {
  return trigger
    .replace(/:/g, " ")
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
</script>

<style scoped>
.hook-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.hook-card:hover {
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

.hook-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.trigger-type {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.hook-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.detail-label {
  color: #6b7280;
}

.detail-value {
  font-weight: 500;
  color: #111827;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-toggle {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-toggle.active {
  background: #fef3c7;
  color: #92400e;
}

.btn-toggle.active:hover {
  background: #fde68a;
}

.btn-toggle.inactive {
  background: #d1fae5;
  color: #065f46;
}

.btn-toggle.inactive:hover {
  background: #a7f3d0;
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
}

.btn-icon:hover {
  background: #f9fafb;
}

.btn-danger {
  border-color: #fecaca;
  color: #dc2626;
}

.btn-danger:hover {
  background: #fef2f2;
}

.icon {
  width: 1rem;
  height: 1rem;
}
</style>
