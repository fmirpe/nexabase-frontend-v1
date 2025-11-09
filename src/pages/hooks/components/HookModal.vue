<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <CodeBracketIcon class="icon" />
            </div>
            <div>
              <h2>{{ hook ? "Edit Hook" : "Create New Hook" }}</h2>
              <p class="subtitle">
                {{
                  hook
                    ? "Modify hook configuration"
                    : "Configure a new database hook"
                }}
              </p>
            </div>
          </div>
          <button @click="$emit('close')" class="close-btn">
            <XMarkIcon class="icon" />
          </button>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs-nav">
          <button
            @click="activeTab = 'config'"
            class="tab-btn"
            :class="{ active: activeTab === 'config' }"
          >
            <Cog6ToothIcon class="tab-icon" />
            Configuration
          </button>
          <button
            @click="activeTab = 'code'"
            class="tab-btn"
            :class="{ active: activeTab === 'code' }"
          >
            <CodeBracketIcon class="tab-icon" />
            Hook Code
            <span v-if="!formData.code.trim()" class="badge-required"
              >Required</span
            >
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSave">
            <!-- Configuration Tab -->
            <div v-if="activeTab === 'config'" class="tab-panel">
              <!-- Basic Info Section -->
              <div class="form-section">
                <h3 class="section-title">Basic Information</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label> Hook Name <span class="required">*</span> </label>
                    <input
                      v-model="formData.name"
                      type="text"
                      placeholder="e.g., validate-email"
                      required
                      :disabled="isEdit"
                      class="form-input"
                    />
                    <small v-if="isEdit" class="help-text"
                      >Name cannot be changed after creation</small
                    >
                  </div>

                  <div class="form-group">
                    <label> Trigger <span class="required">*</span> </label>
                    <select
                      v-model="formData.trigger"
                      class="form-input"
                      required
                    >
                      <optgroup label="Create Operations">
                        <option value="before:create">Before Create</option>
                        <option value="after:create">After Create</option>
                      </optgroup>
                      <optgroup label="Update Operations">
                        <option value="before:update">Before Update</option>
                        <option value="after:update">After Update</option>
                      </optgroup>
                      <optgroup label="Delete Operations">
                        <option value="before:delete">Before Delete</option>
                        <option value="after:delete">After Delete</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Target Collections</label>
                  <input
                    v-model="collectionsInput"
                    type="text"
                    placeholder="users, posts, comments (leave empty for all collections)"
                    class="form-input"
                  />
                  <small class="help-text">
                    <InformationCircleIcon class="help-icon" />
                    Comma-separated list. Leave empty to apply to all
                    collections
                  </small>
                </div>

                <div class="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    v-model="formData.description"
                    placeholder="Describe what this hook does..."
                    class="form-input"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <!-- Advanced Settings Section -->
              <div class="form-section">
                <h3 class="section-title">Advanced Settings</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label>Priority</label>
                    <input
                      v-model.number="formData.priority"
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      class="form-input"
                    />
                    <small class="help-text"
                      >Higher values execute first (0-100)</small
                    >
                  </div>

                  <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                      <input
                        v-model="formData.async"
                        type="checkbox"
                        class="checkbox-input"
                      />
                      <div class="checkbox-content">
                        <span class="checkbox-title">Run Asynchronously</span>
                        <small
                          >Execute in background without blocking the
                          request</small
                        >
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code Tab -->
            <div v-if="activeTab === 'code'" class="tab-panel">
              <div class="code-section">
                <div class="section-header">
                  <h3 class="section-title">
                    Hook Implementation <span class="required">*</span>
                  </h3>
                  <button
                    type="button"
                    @click="showCodeHelp = !showCodeHelp"
                    class="help-btn"
                  >
                    <QuestionMarkCircleIcon class="icon" />
                    {{ showCodeHelp ? "Hide" : "Show" }} Help
                  </button>
                </div>

                <div v-if="showCodeHelp" class="code-help">
                  <div class="help-columns">
                    <div class="help-column">
                      <h4>📦 Context Object</h4>
                      <ul>
                        <li>
                          <code>context.record</code> - The record being
                          modified
                        </li>
                        <li>
                          <code>context.oldRecord</code> - Previous values
                          (update/delete)
                        </li>
                        <li>
                          <code>context.collection</code> - Collection name
                        </li>
                        <li>
                          <code>context.tenantId</code> - Current tenant ID
                        </li>
                        <li>
                          <code>context.user</code> - User performing action
                        </li>
                        <li><code>context.db</code> - Database helper</li>
                      </ul>
                    </div>

                    <div class="help-column">
                      <h4>🗄️ Database Helper (context.db)</h4>
                      <ul>
                        <li><code>db.findById(table, id)</code></li>
                        <li><code>db.findOne(table, where)</code></li>
                        <li><code>db.find(table, options)</code></li>
                        <li><code>db.create(table, data)</code></li>
                        <li><code>db.update(table, id, data)</code></li>
                        <li><code>db.delete(table, id)</code></li>
                        <li><code>db.count(table, where)</code></li>
                      </ul>
                    </div>
                  </div>

                  <div class="example-tabs">
                    <button
                      v-for="example in codeExamples"
                      :key="example.id"
                      @click="selectedExample = example.id"
                      class="example-tab"
                      :class="{ active: selectedExample === example.id }"
                      type="button"
                    >
                      {{ example.title }}
                    </button>
                  </div>

                  <pre
                    class="code-example"
                  ><code>{{ currentExample.code }}</code></pre>
                </div>

                <div class="editor-wrapper">
                  <MonacoEditor
                    v-model:value="formData.code"
                    language="javascript"
                    theme="vs-dark"
                    :options="editorOptions"
                    height="400px"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button
                type="button"
                @click="$emit('close')"
                class="btn-secondary"
                :disabled="saving"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving || !isFormValid"
                class="btn-primary"
              >
                <template v-if="saving">
                  <svg class="spinner" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </template>
                <template v-else>
                  {{ hook ? "Update Hook" : "Create Hook" }}
                </template>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useHooks } from "@/composables/useHooks";
import type { Hook } from "@/composables/useHooks";
import MonacoEditor from "monaco-editor-vue3";
import {
  XMarkIcon,
  CodeBracketIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps<{
  hook?: Hook | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save"): void;
}>();

const { registerHook, updateHook } = useHooks();
const saving = ref(false);
const collectionsInput = ref("");
const showCodeHelp = ref(false);
const activeTab = ref<"config" | "code">("config");
const selectedExample = ref("validation");

const isEdit = computed(() => !!props.hook);

const codeExamples = [
  {
    id: "validation",
    title: "Validation",
    code: `async function execute(context) {
  const { record } = context;
  
  // Validate email format
  if (record.email && !record.email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  // Validate required fields
  if (!record.name) {
    throw new Error('Name is required');
  }
  
  return context;
}`,
  },
  {
    id: "transform",
    title: "Transform Data",
    code: `async function execute(context) {
  const { record } = context;
  
  // Auto-generate slug from title
  if (record.title && !record.slug) {
    record.slug = record.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Add timestamps
  record.processed_at = new Date().toISOString();
  
  return context;
}`,
  },
  {
    id: "inventory",
    title: "Update Inventory (with DB)",
    code: `async function execute(context) {
  const { db, record } = context;
  
  // Get movement type
  const tipoMovimiento = await db.findById('tipomovimiento', record.tipomovimiento_id);
  const ajuste = record.cantidad * tipoMovimiento.factor;
  
  // Find or create balance
  const saldo = await db.findOne('saldos', {
    producto_id: record.producto_id,
    bodega_id: record.bodega_id
  });
  
  if (saldo) {
    await db.update('saldos', saldo.id, {
      cantidad: saldo.cantidad + ajuste
    });
  } else {
    await db.create('saldos', {
      producto_id: record.producto_id,
      bodega_id: record.bodega_id,
      cantidad: ajuste
    });
  }
  
  console.log(\`✅ Balance updated: \${ajuste}\`);
  return context;
}`,
  },
  {
    id: "notification",
    title: "Send Notification",
    code: `async function execute(context) {
  const { record, collection, user } = context;
  
  // Log the action
  console.log(\`New \${collection} created by \${user?.email}\`);
  
  // Send webhook notification (example)
  // await fetch('https://hooks.slack.com/...', {
  //   method: 'POST',
  //   body: JSON.stringify({ 
  //     text: \`New \${collection} created\` 
  //   })
  // });
  
  return context;
}`,
  },
];

const currentExample = computed(() => {
  return (
    codeExamples.find((ex) => ex.id === selectedExample.value) ||
    codeExamples[0]
  );
});

const formData = reactive({
  name: "",
  trigger: "before:create",
  collections: [] as string[],
  priority: 0,
  async: false,
  description: "",
  code: `async function execute(context) {
  const { db, record, collection, tenantId } = context;
  
  // Your business logic here
  console.log('Hook triggered for:', collection);
  
  // Access database
  // const relatedData = await db.findById('other_table', record.related_id);
  
  // Modify record if needed
  // record.modified_at = new Date().toISOString();
  
  // Throw error to prevent operation
  // if (!record.email) throw new Error('Email is required');
  
  return context;
}`,
});

const isFormValid = computed(() => {
  return formData.name.trim() && formData.trigger && formData.code.trim();
});

const editorOptions = {
  automaticLayout: true,
  fontSize: 14,
  minimap: { enabled: false },
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  tabSize: 2,
  padding: { top: 16, bottom: 16 },
  folding: true,
  renderWhitespace: "selection",
  wordWrap: "on",
};

onMounted(() => {
  if (props.hook) {
    Object.assign(formData, {
      name: props.hook.name,
      trigger: props.hook.trigger,
      collections: props.hook.collections || [],
      priority: props.hook.priority || 0,
      async: props.hook.async || false,
      description: (props.hook as any).description || "",
      code: props.hook.code || formData.code,
    });
    collectionsInput.value = props.hook.collections?.join(", ") || "";
  }
});

async function handleSave() {
  saving.value = true;

  // Parse collections
  if (collectionsInput.value.trim()) {
    formData.collections = collectionsInput.value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  } else {
    formData.collections = [];
  }

  try {
    if (isEdit.value) {
      await updateHook(props.hook!.id, formData);
    } else {
      await registerHook(formData);
    }
    emit("save");
    emit("close");
  } catch (error) {
    console.error("Failed to save hook:", error);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
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
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 950px;
  width: 100%;
  max-height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to bottom, #f9fafb, white);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  color: #6b7280;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-btn .icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Tabs Navigation */
.tabs-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 0 1.5rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  position: relative;
}

.tab-btn:hover {
  color: #374151;
  background: rgba(255, 255, 255, 0.5);
}

.tab-btn.active {
  color: #3b82f6;
  background: white;
  border-bottom-color: #3b82f6;
}

.tab-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.badge-required {
  background: #fef3c7;
  color: #d97706;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.tab-panel {
  animation: fadeIn 0.2s;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.help-btn:hover {
  background: #dbeafe;
}

.help-btn .icon {
  width: 1rem;
  height: 1rem;
}

/* Code Help */
.code-help {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  font-size: 0.813rem;
}

.help-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.help-column h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.help-column ul {
  margin: 0;
  padding-left: 1.25rem;
}

.help-column li {
  margin-bottom: 0.375rem;
  color: #6b7280;
  line-height: 1.5;
}

.help-column code {
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 0.75rem;
  color: #1f2937;
}

.example-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.example-tab {
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.example-tab:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.example-tab.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.code-example {
  background: #1f2937;
  color: #e5e7eb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.6;
}

.code-example code {
  background: none;
  color: inherit;
  padding: 0;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #dc2626;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

textarea.form-input {
  resize: vertical;
  min-height: 70px;
}

.help-text {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.4;
}

.help-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
  width: 100%;
}

.checkbox-label:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.checkbox-input {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox-content {
  flex: 1;
}

.checkbox-title {
  display: block;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.checkbox-content small {
  display: block;
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.125rem;
}

.code-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor-wrapper {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.2s;
}

.editor-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.875rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  min-width: 130px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
