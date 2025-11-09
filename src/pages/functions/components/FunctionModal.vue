<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <CommandLineIcon class="icon" />
            </div>
            <div>
              <h2>{{ isEdit ? "Edit Function" : "Create New Function" }}</h2>
              <p class="subtitle">
                {{
                  isEdit
                    ? "Modify function configuration"
                    : "Configure a new serverless function"
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
            Function Code
            <span v-if="!formData.code.trim()" class="badge-required"
              >Required</span
            >
          </button>
          <button
            @click="activeTab = 'advanced'"
            class="tab-btn"
            :class="{ active: activeTab === 'advanced' }"
          >
            <AdjustmentsHorizontalIcon class="tab-icon" />
            Advanced
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSave">
            <!-- Configuration Tab -->
            <div v-if="activeTab === 'config'" class="tab-panel">
              <!-- Basic Info Section -->
              <div class="form-section">
                <h3 class="section-title">Basic Information</h3>

                <div class="form-group">
                  <label> Function Name <span class="required">*</span> </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="my-function"
                    pattern="[a-z0-9-]+"
                    required
                    :disabled="isEdit"
                    class="form-input"
                  />
                  <small class="help-text">
                    <InformationCircleIcon class="help-icon" />
                    {{
                      isEdit
                        ? "Name cannot be changed after creation"
                        : "Only lowercase letters, numbers, and hyphens"
                    }}
                  </small>
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <textarea
                    v-model="formData.description"
                    placeholder="What does this function do?"
                    rows="3"
                    class="form-input"
                  />
                </div>
              </div>

              <!-- Trigger Configuration Section -->
              <div class="form-section">
                <h3 class="section-title">Trigger Configuration</h3>

                <div class="form-group">
                  <label> Trigger Type <span class="required">*</span> </label>
                  <select v-model="formData.trigger" class="form-input">
                    <option value="http">🌐 HTTP Request</option>
                    <option value="schedule">⏰ Scheduled (Cron)</option>
                    <option value="database">💾 Database Event</option>
                    <option value="webhook">🔗 Webhook</option>
                    <option value="manual">🖱️ Manual Execution</option>
                  </select>
                </div>

                <!-- HTTP Configuration -->
                <div v-if="formData.trigger === 'http'" class="trigger-config">
                  <div class="form-group">
                    <label>HTTP Path</label>
                    <div class="input-group">
                      <span class="input-prefix">/api/functions/</span>
                      <input
                        v-model="formData.config!.path"
                        type="text"
                        placeholder="my-endpoint"
                        class="form-input with-prefix"
                      />
                    </div>
                    <small class="help-text">
                      Full URL:
                      <code
                        >{{ baseUrl }}/api/functions/{{
                          formData.config!.path || "my-endpoint"
                        }}</code
                      >
                    </small>
                  </div>
                </div>

                <!-- Schedule Configuration -->
                <div
                  v-if="formData.trigger === 'schedule'"
                  class="trigger-config"
                >
                  <div class="form-group">
                    <label>
                      Cron Schedule <span class="required">*</span>
                    </label>
                    <input
                      v-model="formData.config!.schedule"
                      type="text"
                      placeholder="0 * * * *"
                      class="form-input"
                    />
                    <small class="help-text">
                      Examples: <code>0 * * * *</code> (hourly),
                      <code>0 0 * * *</code> (daily),
                      <code>*/5 * * * *</code> (every 5 min)
                    </small>
                  </div>
                  <div class="cron-helper">
                    <h4>Quick Patterns</h4>
                    <div class="quick-patterns">
                      <button
                        type="button"
                        @click="formData.config!.schedule = '*/5 * * * *'"
                        class="pattern-btn"
                      >
                        Every 5 min
                      </button>
                      <button
                        type="button"
                        @click="formData.config!.schedule = '0 * * * *'"
                        class="pattern-btn"
                      >
                        Every hour
                      </button>
                      <button
                        type="button"
                        @click="formData.config!.schedule = '0 0 * * *'"
                        class="pattern-btn"
                      >
                        Daily at midnight
                      </button>
                      <button
                        type="button"
                        @click="formData.config!.schedule = '0 9 * * 1'"
                        class="pattern-btn"
                      >
                        Monday at 9 AM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code Tab -->
            <div v-if="activeTab === 'code'" class="tab-panel">
              <div class="code-section">
                <div class="section-header">
                  <h3 class="section-title">
                    Function Implementation <span class="required">*</span>
                  </h3>
                  <div class="header-actions">
                    <button
                      type="button"
                      @click="showCodeHelp = !showCodeHelp"
                      class="help-btn"
                    >
                      <QuestionMarkCircleIcon class="icon" />
                      {{ showCodeHelp ? "Hide" : "Show" }} Help
                    </button>
                  </div>
                </div>

                <div v-if="showCodeHelp" class="code-help">
                  <div class="help-columns">
                    <div class="help-column">
                      <h4>📦 Context Object</h4>
                      <ul>
                        <li><code>context.body</code> - Request body (HTTP)</li>
                        <li><code>context.query</code> - Query parameters</li>
                        <li><code>context.headers</code> - Request headers</li>
                        <li><code>context.user</code> - Authenticated user</li>
                        <li><code>context.tenantId</code> - Current tenant</li>
                        <li><code>context.db</code> - Database helper</li>
                        <li>
                          <code>context.env</code> - Environment variables
                        </li>
                      </ul>
                    </div>

                    <div class="help-column">
                      <h4>🗄️ Database Helper (context.db)</h4>
                      <ul>
                        <li>
                          <code>db.findById(table, id)</code> - Get record by ID
                        </li>
                        <li>
                          <code>db.findOne(table, where)</code> - Find single
                          record
                        </li>
                        <li>
                          <code>db.find(table, options)</code> - Find multiple
                          records
                        </li>
                        <li>
                          <code>db.create(table, data)</code> - Insert new
                          record
                        </li>
                        <li>
                          <code>db.update(table, id, data)</code> - Update
                          record
                        </li>
                        <li>
                          <code>db.delete(table, id)</code> - Delete record
                        </li>
                        <li>
                          <code>db.count(table, where)</code> - Count records
                        </li>
                        <li>
                          <code>db.query(sql, params)</code> - Raw SQL query
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Expandable Examples Section -->
                  <div class="examples-section" style="margin-top: 1.5rem">
                    <details>
                      <summary
                        style="
                          cursor: pointer;
                          font-weight: 600;
                          color: #374151;
                          margin-bottom: 0.5rem;
                        "
                      >
                        💡 Database Helper Examples
                      </summary>
                      <div
                        style="
                          background: white;
                          padding: 1rem;
                          border-radius: 0.5rem;
                          margin-top: 0.5rem;
                        "
                      >
                        <pre
                          style="
                            margin: 0;
                            font-size: 0.75rem;
                            line-height: 1.6;
                            color: #1f2937;
                          "
                        ><code>// Find by ID
const product = await context.db.findById('products', productId);

// Find with filters
const activeUsers = await context.db.find('users', {
  where: { status: 'active' },
  limit: 10,
  order: { created_at: 'DESC' }
});

// Create record
const newOrder = await context.db.create('orders', {
  user_id: context.user.id,
  total: 99.99,
  status: 'pending'
});

// Update record
await context.db.update('products', productId, {
  stock: product.stock - quantity
});

// Count records
const totalActive = await context.db.count('users', { status: 'active' });</code></pre>
                      </div>
                    </details>
                  </div>
                </div>

                <!-- Code Templates -->
                <div class="template-selector">
                  <span class="template-label">Quick Start Templates:</span>
                  <div class="template-buttons">
                    <button
                      type="button"
                      @click="loadTemplate('http')"
                      class="template-btn"
                      :class="{ active: currentTemplate === 'http' }"
                    >
                      <GlobeAltIcon class="icon-sm" />
                      HTTP Function
                    </button>
                    <button
                      type="button"
                      @click="loadTemplate('schedule')"
                      class="template-btn"
                      :class="{ active: currentTemplate === 'schedule' }"
                    >
                      <ClockIcon class="icon-sm" />
                      Scheduled Task
                    </button>
                    <button
                      type="button"
                      @click="loadTemplate('database')"
                      class="template-btn"
                      :class="{ active: currentTemplate === 'database' }"
                    >
                      <CircleStackIcon class="icon-sm" />
                      Database Hook
                    </button>
                  </div>
                </div>

                <div class="editor-wrapper">
                  <MonacoEditor
                    v-model:value="formData.code"
                    language="javascript"
                    theme="vs-dark"
                    :options="editorOptions"
                    height="420px"
                  />
                </div>
              </div>
            </div>

            <!-- Advanced Tab -->
            <div v-if="activeTab === 'advanced'" class="tab-panel">
              <!-- Runtime Settings -->
              <div class="form-section">
                <h3 class="section-title">Runtime Settings</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label>Memory Limit (MB)</label>
                    <input
                      v-model.number="formData.config!.memoryLimit"
                      type="number"
                      min="8"
                      max="512"
                      placeholder="128"
                      class="form-input"
                    />
                    <small class="help-text"
                      >Recommended: 128-256 MB for most functions</small
                    >
                  </div>
                  <div class="form-group">
                    <label>Timeout (seconds)</label>
                    <input
                      v-model.number="formData.config!.timeout"
                      type="number"
                      min="1"
                      max="300"
                      placeholder="30"
                      class="form-input"
                    />
                    <small class="help-text">Maximum execution time</small>
                  </div>
                </div>
              </div>

              <!-- Environment Variables -->
              <div class="form-section">
                <h3 class="section-title">Environment Variables</h3>

                <div class="env-list">
                  <div
                    v-for="(value, key, index) in formData.environment"
                    :key="index"
                    class="env-row"
                  >
                    <input
                      v-model="envKeys[index]"
                      type="text"
                      placeholder="VARIABLE_NAME"
                      class="form-input"
                    />
                    <input
                      v-model="formData.environment![key]"
                      type="text"
                      placeholder="value"
                      class="form-input"
                    />
                    <button
                      type="button"
                      @click="removeEnvVar(key)"
                      class="btn-icon-danger"
                      title="Remove variable"
                    >
                      <TrashIcon class="icon-sm" />
                    </button>
                  </div>

                  <button type="button" @click="addEnvVar" class="btn-add">
                    <PlusIcon class="icon-sm" />
                    Add Environment Variable
                  </button>
                </div>

                <div class="info-box">
                  <InformationCircleIcon class="info-icon" />
                  <div>
                    <p>
                      <strong>Security Note:</strong> Environment variables are
                      encrypted at rest and only accessible within your
                      function.
                    </p>
                  </div>
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
                  {{ isEdit ? "Update Function" : "Create Function" }}
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
import { useFunctions } from "@/composables/useFunctions";
import {
  type EdgeFunction,
  type CreateFunctionDto,
  FunctionTrigger,
} from "@/types/functions";
import MonacoEditor from "monaco-editor-vue3";
import {
  XMarkIcon,
  TrashIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  CommandLineIcon,
  PlusIcon,
  GlobeAltIcon,
  ClockIcon,
  CircleStackIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps<{
  func?: EdgeFunction | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save"): void;
}>();

const { createFunction, updateFunction } = useFunctions();
const saving = ref(false);
const envKeys = ref<string[]>([]);
const activeTab = ref<"config" | "code" | "advanced">("config");
const showCodeHelp = ref(false);
const currentTemplate = ref("");
const baseUrl = ref(window.location.origin);

const isEdit = computed(() => !!props.func);

const formData = reactive<CreateFunctionDto>({
  name: "",
  description: "",
  code: "",
  trigger: FunctionTrigger.HTTP,
  config: {
    memoryLimit: 128,
    timeout: 30,
    schedule: "",
    path: "",
  },
  environment: {},
});

const isFormValid = computed(() => {
  return formData.name.trim() && formData.code.trim();
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

const codeTemplates: Record<string, string> = {
  http: `export default async function handler(context) {
  const { body, query, headers, user, tenantId, db } = context;
  
  // Access request data
  console.log('HTTP function invoked by:', user?.email);
  
  // Example: Query database
  const users = await db.find('users', { 
    where: { active: true }, 
    limit: 10 
  });
  
  return {
    success: true,
    data: users,
    timestamp: new Date().toISOString()
  };
}`,

  schedule: `export default async function handler(context) {
  const { tenantId, env, db } = context;
  
  console.log('⏰ Scheduled task running');
  
  try {
    // Example: Clean up old records
    const oldRecords = await db.find('logs', {
      where: { created_at: '< 30 days ago' }
    });
    
    for (const record of oldRecords) {
      await db.delete('logs', record.id);
    }
    
    return {
      success: true,
      executedAt: new Date().toISOString(),
      itemsDeleted: oldRecords.length
    };
  } catch (error) {
    console.error('Scheduled task failed:', error);
    throw error;
  }
}`,

  database: `export default async function handler(context) {
  const { db, record, oldRecord, collection } = context;
  
  console.log(\`Hook triggered on: \${collection}\`);
  
  // Example: Automatic inventory update
  if (collection === 'movimientoinventario') {
    const tipoMovimiento = await db.findById('tipomovimiento', record.tipomovimiento_id);
    const ajuste = record.cantidad * tipoMovimiento.factor;
    
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
    
    console.log(\`✅ Saldo actualizado: ajuste = \${ajuste}\`);
  }
  
  return { success: true };
}`,
};

onMounted(() => {
  if (props.func) {
    formData.name = props.func.name;
    formData.description = props.func.description || "";
    formData.code = props.func.code;
    formData.trigger = props.func.trigger;

    formData.config = {
      memoryLimit: props.func.config?.memoryLimit || 128,
      timeout: props.func.config?.timeout || 30,
      schedule: props.func.config?.schedule || "",
      path: props.func.config?.path || "",
    };

    formData.environment = props.func.environment
      ? { ...props.func.environment }
      : {};
    envKeys.value = Object.keys(formData.environment);
  } else {
    loadTemplate("http");
  }
});

function loadTemplate(type: string) {
  formData.code = codeTemplates[type] || codeTemplates.http;
  currentTemplate.value = type;
}

function addEnvVar() {
  const key = `NEW_VAR_${Object.keys(formData.environment || {}).length + 1}`;
  if (!formData.environment) formData.environment = {};
  formData.environment[key] = "";
  envKeys.value.push(key);
}

function removeEnvVar(key: string) {
  if (formData.environment) {
    delete formData.environment[key];
  }
  envKeys.value = envKeys.value.filter((k) => k !== key);
}

async function handleSave() {
  saving.value = true;
  try {
    if (isEdit.value && props.func) {
      await updateFunction(props.func.id, formData);
    } else {
      await createFunction(formData);
    }
    emit("save");
    emit("close");
  } catch (error) {
    console.error("Failed to save function:", error);
  } finally {
    saving.value = false;
  }
}

function handleOverlayClick() {
  if (
    confirm("Are you sure you want to close? Unsaved changes will be lost.")
  ) {
    emit("close");
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
  background: linear-gradient(135deg, #10b981, #059669);
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
}

.tab-btn:hover {
  color: #374151;
  background: rgba(255, 255, 255, 0.5);
}

.tab-btn.active {
  color: #10b981;
  background: white;
  border-bottom-color: #10b981;
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.help-btn:hover {
  background: #a7f3d0;
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

/* Templates */
.template-selector {
  margin-bottom: 1rem;
}

.template-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.template-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.template-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.813rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn:hover {
  border-color: #10b981;
  color: #10b981;
  background: #d1fae5;
}

.template-btn.active {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

/* Trigger Config */
.trigger-config {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
}

.input-group {
  display: flex;
}

.input-prefix {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-right: none;
  border-radius: 0.5rem 0 0 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.form-input.with-prefix {
  border-radius: 0 0.5rem 0.5rem 0;
}

.cron-helper {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
}

.cron-helper h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.quick-patterns {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pattern-btn {
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pattern-btn:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Environment Variables */
.env-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.env-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
}

.btn-icon-danger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #ef4444;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-icon-danger:hover {
  background: #fef2f2;
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  color: #10b981;
  border: 1px dashed #10b981;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #d1fae5;
  border-style: solid;
}

.info-box {
  display: flex;
  gap: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #16a34a;
  flex-shrink: 0;
}

.info-box p {
  font-size: 0.813rem;
  color: #166534;
  margin: 0;
  line-height: 1.5;
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
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  min-width: 130px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
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
