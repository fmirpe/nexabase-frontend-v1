<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div>
            <h2>Test Function</h2>
            <p class="function-name">{{ func.name }}</p>
          </div>
          <button @click="$emit('close')" class="close-btn">
            <XMarkIcon class="icon" />
          </button>
        </div>

        <div class="modal-body">
          <div class="two-columns">
            <!-- Input Section -->
            <div class="column">
              <h3>Input</h3>

              <div class="tabs">
                <button
                  v-for="tab in inputTabs"
                  :key="tab"
                  @click="activeInputTab = tab"
                  :class="['tab', { active: activeInputTab === tab }]"
                >
                  {{ tab }}
                </button>
              </div>

              <!-- Body JSON -->
              <div v-show="activeInputTab === 'Body'" class="input-section">
                <label>Request Body (JSON)</label>
                <textarea
                  v-model="payload.body"
                  rows="10"
                  placeholder='{ "name": "John", "email": "john@example.com" }'
                  class="json-input"
                  @input="validateJSON('body')"
                />
                <span v-if="jsonErrors.body" class="error-text">{{
                  jsonErrors.body
                }}</span>
              </div>

              <!-- Query Params -->
              <div v-show="activeInputTab === 'Query'" class="input-section">
                <label>Query Parameters</label>
                <div
                  v-for="(value, key, index) in parsedPayload.query"
                  :key="index"
                  class="param-row"
                >
                  <input
                    v-model="queryKeys[index]"
                    type="text"
                    placeholder="key"
                    class="param-input"
                  />
                  <input
                    v-model="parsedPayload.query[key]"
                    type="text"
                    placeholder="value"
                    class="param-input"
                  />
                  <button
                    @click="removeParam('query', key)"
                    class="btn-icon-sm"
                  >
                    <TrashIcon class="icon-xs" />
                  </button>
                </div>
                <button @click="addParam('query')" class="btn-secondary-sm">
                  + Add Parameter
                </button>
              </div>

              <!-- Headers -->
              <div v-show="activeInputTab === 'Headers'" class="input-section">
                <label>HTTP Headers</label>
                <div
                  v-for="(value, key, index) in parsedPayload.headers"
                  :key="index"
                  class="param-row"
                >
                  <input
                    v-model="headerKeys[index]"
                    type="text"
                    placeholder="Header-Name"
                    class="param-input"
                  />
                  <input
                    v-model="parsedPayload.headers[key]"
                    type="text"
                    placeholder="value"
                    class="param-input"
                  />
                  <button
                    @click="removeParam('headers', key)"
                    class="btn-icon-sm"
                  >
                    <TrashIcon class="icon-xs" />
                  </button>
                </div>
                <button @click="addParam('headers')" class="btn-secondary-sm">
                  + Add Header
                </button>
              </div>

              <button
                @click="invokeFunction"
                :disabled="executing"
                class="btn-primary-full"
              >
                <PlayIcon class="icon" />
                {{ executing ? "Executing..." : "Run Function" }}
              </button>
            </div>

            <!-- Output Section -->
            <div class="column">
              <h3>Output</h3>

              <div v-if="!result && !error" class="empty-output">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <p>Run the function to see the output</p>
              </div>

              <!-- Success Result -->
              <div v-if="result" class="result-section">
                <div class="result-header">
                  <span class="badge badge-success">Success</span>
                  <span class="execution-time"
                    >{{ result.executionTime }}ms</span
                  >
                </div>

                <div class="tabs">
                  <button
                    v-for="tab in outputTabs"
                    :key="tab"
                    @click="activeOutputTab = tab"
                    :class="['tab', { active: activeOutputTab === tab }]"
                  >
                    {{ tab }}
                  </button>
                </div>

                <div
                  v-show="activeOutputTab === 'Response'"
                  class="output-content"
                >
                  <pre><code>{{ formatJSON(result.output) }}</code></pre>
                </div>

                <div v-show="activeOutputTab === 'Logs'" class="output-content">
                  <div
                    v-if="result.logs && result.logs.length > 0"
                    class="logs"
                  >
                    <div
                      v-for="(log, index) in result.logs"
                      :key="index"
                      class="log-line"
                    >
                      {{ log }}
                    </div>
                  </div>
                  <div v-else class="no-logs">No console output</div>
                </div>
              </div>

              <!-- Error Result -->
              <div v-if="error" class="error-section">
                <div class="result-header">
                  <span class="badge badge-error">Error</span>
                </div>
                <pre class="error-message"><code>{{ error }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { functionsAPI } from "@/services/api";
import type { EdgeFunction } from "@/types/functions";
import { XMarkIcon, TrashIcon, PlayIcon } from "@heroicons/vue/24/outline";
import { useNotifications } from "@/composables/useNotifications";

const props = defineProps<{
  func: EdgeFunction;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { showError } = useNotifications();

const activeInputTab = ref("Body");
const activeOutputTab = ref("Response");
const executing = ref(false);
const result = ref<any>(null);
const error = ref<string | null>(null);

const inputTabs = ["Body", "Query", "Headers"];
const outputTabs = ["Response", "Logs"];

const payload = reactive({
  body: '{\n  "name": "John",\n  "email": "john@example.com"\n}',
});

const parsedPayload = reactive({
  query: {} as Record<string, string>,
  headers: {} as Record<string, string>,
});

const queryKeys = ref<string[]>([]);
const headerKeys = ref<string[]>([]);

const jsonErrors = reactive({
  body: "",
});

function validateJSON(field: "body") {
  try {
    if (payload[field].trim()) {
      JSON.parse(payload[field]);
    }
    jsonErrors[field] = "";
    return true;
  } catch (err) {
    jsonErrors[field] = "Invalid JSON";
    return false;
  }
}

function addParam(type: "query" | "headers") {
  const key = `param_${Object.keys(parsedPayload[type]).length + 1}`;
  parsedPayload[type][key] = "";
  if (type === "query") {
    queryKeys.value.push(key);
  } else {
    headerKeys.value.push(key);
  }
}

function removeParam(type: "query" | "headers", key: string) {
  delete parsedPayload[type][key];
  if (type === "query") {
    queryKeys.value = queryKeys.value.filter((k) => k !== key);
  } else {
    headerKeys.value = headerKeys.value.filter((k) => k !== key);
  }
}

async function invokeFunction() {
  if (!validateJSON("body")) {
    showError("Please fix JSON errors before executing", "JSON Error");
    return;
  }

  executing.value = true;
  result.value = null;
  error.value = null;

  try {
    const invokePayload: any = {
      query: parsedPayload.query,
      headers: parsedPayload.headers,
    };

    // Parse body if provided
    if (payload.body.trim()) {
      try {
        invokePayload.body = JSON.parse(payload.body);
      } catch (err) {
        throw new Error("Invalid JSON in request body");
      }
    }

    const response = await functionsAPI.invoke(props.func.id, invokePayload);

    // ✅ Extraer los datos correctamente de la respuesta
    result.value = {
      output: (response as any).output || (response as any).data?.output,
      executionTime:
        (response as any).executionTime ||
        (response as any).data?.executionTime,
      logs: (response as any).logs || (response as any).data?.logs || [],
    };
  } catch (err: any) {
    error.value =
      err.response?.data?.error || err.message || "Function execution failed";
  } finally {
    executing.value = false;
  }
}

function formatJSON(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
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
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 1400px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.function-name {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
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

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-xs {
  width: 1rem;
  height: 1rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.column h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.tab:hover {
  color: #374151;
}

.tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.input-section {
  margin-bottom: 1rem;
}

.input-section label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
}

.json-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: "Monaco", "Menlo", "Courier New", monospace;
  font-size: 0.875rem;
  resize: vertical;
}

.json-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.error-text {
  display: block;
  margin-top: 0.25rem;
  color: #ef4444;
  font-size: 0.75rem;
}

.param-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.param-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.param-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.btn-icon-sm {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #ef4444;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.btn-icon-sm:hover {
  background: #fef2f2;
}

.btn-secondary-sm {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-secondary-sm:hover {
  background: #f9fafb;
}

.btn-primary-full {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
}

.btn-primary-full:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary-full:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-output {
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
}

.result-section,
.error-section {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-error {
  background: #fee2e2;
  color: #991b1b;
}

.execution-time {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.output-content {
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.output-content pre {
  margin: 0;
  font-family: "Monaco", "Menlo", "Courier New", monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
}

.logs {
  font-family: "Monaco", "Menlo", "Courier New", monospace;
  font-size: 0.875rem;
}

.log-line {
  padding: 0.25rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}

.no-logs {
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
}

.error-message {
  padding: 1rem;
  margin: 0;
  color: #dc2626;
  background: #fef2f2;
  font-family: "Monaco", "Menlo", "Courier New", monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
}

@media (max-width: 1024px) {
  .two-columns {
    grid-template-columns: 1fr;
  }
}
</style>
