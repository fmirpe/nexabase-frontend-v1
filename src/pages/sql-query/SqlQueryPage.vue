<template>
  <div class="flex min-h-screen bg-gray-50 p-6 gap-6">
    <!-- Sidebar a la izquierda -->
    <aside class="w-72 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto flex-shrink-0">
      <h3 class="font-bold text-lg text-indigo-700 mb-4">Tablas Disponibles</h3>
      <ul>
        <li v-for="table in tables" :key="table.name" class="mb-4">
          <div class="font-bold text-indigo-700 flex items-center mb-2">
            {{ table.name }}
            <button @click.stop="insertTextAtCursor(table.name)" class="ml-2 bg-indigo-500 text-white text-xs px-2 rounded hover:bg-indigo-700" title="Insertar tabla">+</button>
          </div>
          <ul class="pl-4">
            <li v-for="col in table.columns" :key="col"
                @click="insertTextAtCursor(col)"
                class="py-1 px-2 rounded hover:bg-indigo-100 text-gray-800 cursor-pointer mb-1 transition"
                title="Haz clic para insertar columna">
              {{ col }}
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- Panel principal -->
    <main class="flex-1 flex flex-col gap-8">
      <!-- Toast de error -->
      <transition name="fade">
        <div v-if="showToast" class="fixed top-6 right-6 z-50 bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4">
          <span class="font-semibold">{{ toastMessage }}</span>
          <button @click="showToast = false" class="ml-4 text-lg font-bold hover:text-yellow-300">×</button>
        </div>
      </transition>

      <!-- Header, editor y acciones -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-bold text-gray-900">Ejecutor de Consulta SQL</h3>
          </div>
          <button class="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:opacity-80 transition"
                  @click="exportRowsToCSV(results, columns, 'resultados.csv')">
            Exportar CSV
          </button>
        </div>
        <MonacoEditor
          v-model:value="sql"
          language="sql"
          :options="editorOptions"
          height="180"
          @editorDidMount="onEditorMount"
          theme="vs-dark"
        />
        <button class="mt-5 bg-indigo-600 text-white px-5 py-2 font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition"
                @click="executeQuery" :disabled="isLoading">
          {{ isLoading ? "Ejecutando..." : "Ejecutar Consulta" }}
        </button>
      </section>

      <!-- Resultados -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-auto">
        <div class="flex flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
          <span class="text-lg font-semibold text-gray-700">Resultados ({{ totalRows }} filas)</span>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col"
                  class="font-semibold text-gray-700 bg-gray-50 px-4 py-2">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in results" :key="idx" class="hover:bg-indigo-50 transition">
              <td v-for="col in columns" :key="col" class="text-gray-900 px-4 py-2">
                {{ formatCell(row[col]) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="results.length === 0" class="text-gray-500 p-6 text-center">
          No hay resultados para mostrar.
        </div>
        <div class="py-6 flex items-center justify-center gap-6">
          <button class="px-4 py-2 rounded-xl border bg-white text-indigo-700 font-semibold shadow-sm transition hover:bg-indigo-100"
                  @click="changePage(page - 1)" :disabled="page <= 1">Anterior</button>
          <span>Página {{ page }} / {{ totalPages }}</span>
          <button class="px-4 py-2 rounded-xl border bg-white text-indigo-700 font-semibold shadow-sm transition hover:bg-indigo-100"
                  @click="changePage(page + 1)" :disabled="page >= totalPages">Siguiente</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "monaco-editor-vue3";
import { adminCollections, sqlQueriesAPI } from "@/services/api";

const sql = ref("");
const tables = ref<Array<{ name: string; columns: string[] }>>([]);
const results = ref<Array<Record<string, any>>>([]);
const columns = ref<string[]>([]);
const isLoading = ref(false);
const page = ref(1);
const limit = ref(20);
const totalRows = ref(0);
const totalPages = ref(1);

// TOAST
const showToast = ref(false);
const toastMessage = ref("");

const editorOptions = {
  wordWrap: "on",
  minimap: { enabled: false },
  fontSize: 15,
  automaticLayout: true,
};

let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
let providerHandle: monaco.IDisposable | null = null;

function insertTextAtCursor(text: string): void {
  if (!editorInstance) return;
  const position = editorInstance.getPosition();
  if (!position) return;
  editorInstance.executeEdits("", [
    {
      range: new monaco.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column
      ),
      text,
      forceMoveMarkers: true,
    },
  ]);
  editorInstance.focus();
}

function registerCustomCompletionProvider() {
  if (providerHandle) {
    providerHandle.dispose();
  }
  if (!editorInstance) return;
  const model = editorInstance.getModel();
  const position = editorInstance.getPosition();
  if (!model || !position) return;
  const wordUntil = model.getWordUntilPosition(position);
  const range = new monaco.Range(
    position.lineNumber,
    wordUntil.startColumn,
    position.lineNumber,
    wordUntil.endColumn
  );
  providerHandle = monaco.languages.registerCompletionItemProvider("sql", {
    triggerCharacters: [" ", ".", ","],
    provideCompletionItems: function(model, position) {
      const tableSuggestions: monaco.languages.CompletionItem[] = tables.value.map(
        table => ({
          label: table.name,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: table.name,
          detail: "Tabla",
          range,
        })
      );
      const columnSuggestions: monaco.languages.CompletionItem[] = tables.value.flatMap(
        table =>
          table.columns.map(col => ({
            label: col,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: col,
            detail: `Columna de ${table.name}`,
            range,
          }))
      );
      return {
        suggestions: [...tableSuggestions, ...columnSuggestions],
      };
    }
  });
}

function onEditorMount(editor: monaco.editor.IStandaloneCodeEditor) {
  editorInstance = editor;
  registerCustomCompletionProvider();
}

async function loadTables(): Promise<void> {
  try {
    const response = await adminCollections.list();
    const collections = (response as any)?.data?.data;
    if (!collections || !Array.isArray(collections)) {
      tables.value = [];
      return;
    }
    const tableData: Array<{ name: string; columns: string[] }> = [];
    for (const col of collections) {
      if (!col || !col.name) continue;
      const fieldsObj = col.schema?.fields || {};
      tableData.push({ name: col.name, columns: Object.keys(fieldsObj) });
    }
    tables.value = tableData;
    registerCustomCompletionProvider();
  } catch {
    tables.value = [];
  }
}

async function executeQuery(): Promise<void> {
  if (!sql.value.trim()) return;
  isLoading.value = true;
  try {
    const response = await sqlQueriesAPI.execute(
      sql.value,
      [],
      page.value,
      limit.value
    );
    if (response?.data && (response.data as any).success) {
      results.value = (response.data as any).results || [];
      columns.value = results.value.length
        ? Object.keys(results.value[0])
        : [];
      totalRows.value = (response.data as any).totalRows || 0;
      totalPages.value = Math.ceil(totalRows.value / limit.value) || 1;
    } else {
      showToastMessage((response?.data as any)?.error || "Error desconocido");
      results.value = [];
      columns.value = [];
      totalRows.value = 0;
      totalPages.value = 1;
    }
  } catch (error: any) {
    showToastMessage(error?.message || "Error ejecutando consulta SQL.");
    results.value = [];
    columns.value = [];
    totalRows.value = 0;
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

// Mostrar toast por 5 segundos
function showToastMessage(message: string) {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
}

function changePage(newPage: number): void {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
  executeQuery();
}

function formatCell(value: any): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "object") return JSON.stringify(value);
  return value.toString();
}

function exportRowsToCSV(rows: any[], columns: string[], filename: string) {
  const csvContent = [
    columns.join(","),
    ...rows.map(row => columns.map(col => `"${row[col] ?? ''}"`).join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(loadTables);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter, .fade-leave-to { opacity: 0; }
.bg-indigo-700 { background-color: #4338ca; }
.bg-indigo-600 { background-color: #6366f1; }
.bg-indigo-500 { background-color: #6366f1; }
.text-indigo-700 { color: #4338ca; }
.hover\:bg-indigo-700:hover { background-color: #4338ca; }
.hover\:bg-indigo-100:hover { background-color: #eef2ff; }
.hover\:bg-indigo-50:hover { background-color: #f5f6ff; }
.premium-table th, .premium-table td { padding: 0.85rem; font-size: 0.98rem; border: 1px solid #e5e7eb; background: #fafbfc; }
.premium-table tr:hover td { background: #f3f4f6; }
.premium-pagination button { background: white; color: #4338ca; border: 1px solid #e5e7eb; font-weight: 600; }
.premium-pagination button:disabled { background: #f3f4f6; color: #a5b4fc; cursor: not-allowed; }
.export-btn { background: linear-gradient(90deg,#6366f1 0%,#4338ca 100%); color:white; padding:0.5rem 1.2rem; border-radius:0.9rem; font-weight:600; cursor:pointer; border:none; box-shadow:0 2px 8px rgba(99,102,241,.09); }
.export-btn:hover { background: linear-gradient(90deg,#4338ca 0%,#6366f1 100%); }
.execute-btn { background:#6366f1; color:white; padding:0.6rem 1.25rem; border-radius:0.73rem; font-weight:600; font-size:1rem; cursor:pointer; border:none; transition:background-color 0.2s; }
.execute-btn:disabled { background:#a5b4fc; cursor:not-allowed; }
.execute-btn:hover:not(:disabled) { background:#4338ca; }
</style>
