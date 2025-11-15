<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">
          Registros de {{ collection.name }}
        </h3>
        <div v-if="selectedRecords.length > 0" class="flex items-center gap-2">
          <span class="text-sm text-gray-500">
            {{ selectedRecords.length }} seleccionados
          </span>
          <button
            @click="$emit('open-bulk-delete')"
            class="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
          >
            Eliminar seleccionados
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left">
              <input
                type="checkbox"
                :checked="areAllVisibleSelected"
                @change="$emit('toggle-select-all-visible')"
                class="rounded border-gray-300"
              />
            </th>

            <th
              v-for="(fieldDef, fieldName) in collection.schema?.fields"
              :key="String(fieldName)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              @click="$emit('sort-by', String(fieldName))"
            >
              <div class="flex items-center gap-2">
                {{ fieldName }}
                <svg
                  v-if="sortField === String(fieldName)"
                  class="w-4 h-4"
                  :class="sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span class="text-xs text-gray-400">({{ fieldDef.type }})</span>
                <span
                  v-if="isRelationField(String(fieldName))"
                  class="text-xs text-purple-500"
                >
                  →
                  {{
                    collection.schema.relations[String(fieldName)].references
                  }}
                </span>
              </div>
            </th>

            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Creado
            </th>

            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="records.length === 0">
            <td
              :colspan="Object.keys(collection.schema?.fields || {}).length + 3"
              class="px-6 py-8 text-center text-gray-500"
            >
              {{
                hasActiveFilters
                  ? "No se encontraron registros que coincidan con los filtros."
                  : "No hay registros aún."
              }}
            </td>
          </tr>

          <tr
            v-for="record in records"
            :key="record.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                :checked="selectedRecords.includes(record.id)"
                @change="$emit('toggle-select-record', record.id)"
                class="rounded border-gray-300"
              />
            </td>

            <td
              v-for="(fieldDef, fieldName) in collection.schema?.fields"
              :key="String(fieldName)"
              class="px-6 py-4 whitespace-nowrap"
            >
              <!-- Campo Imagen -->
              <div v-if="fieldDef.type === 'image'" class="flex items-center">
                <img
                  v-if="record[String(fieldName)]?.id"
                  :src="getSignedImageUrl(record[String(fieldName)])"
                  :alt="String(fieldName)"
                  class="w-12 h-12 object-cover rounded-lg border border-gray-200"
                  @error="handleImageError"
                />
                <span v-else class="text-gray-400 text-sm">Sin imagen</span>
              </div>

              <!-- Campo File -->
              <div
                v-else-if="fieldDef.type === 'file'"
                class="flex items-center"
              >
                <div
                  v-if="record[String(fieldName)]?.id"
                  class="flex items-center gap-2"
                >
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <a
                      :href="getSignedImageUrl(record[String(fieldName)])"
                      target="_blank"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver archivo
                    </a>
                    <p class="text-xs text-gray-500">
                      {{ record[String(fieldName)]?.filename || "archivo" }}
                    </p>
                  </div>
                </div>
                <span v-else class="text-gray-400 text-sm">Sin archivo</span>
              </div>

              <!-- Campo JSON -->
              <div v-else-if="fieldDef.type === 'json'" class="max-w-xs">
                <div
                  v-if="record[String(fieldName)]"
                  class="bg-gray-50 rounded px-2 py-1 text-xs font-mono text-gray-600 truncate"
                >
                  {{ JSON.stringify(record[String(fieldName)]) }}
                </div>
                <span v-else class="text-gray-400 text-sm">null</span>
              </div>

              <!-- Campo Boolean -->
              <span
                v-else-if="fieldDef.type === 'boolean'"
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  record[String(fieldName)]
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ record[String(fieldName)] ? "Sí" : "No" }}
              </span>

              <!-- Campo Date -->
              <span
                v-else-if="fieldDef.type === 'date'"
                class="text-sm text-gray-900"
              >
                {{ formatDate(record[String(fieldName)]) }}
              </span>

              <!-- Campo Text largo -->
              <div v-else-if="fieldDef.type === 'text'" class="max-w-xs">
                <p
                  class="text-sm text-gray-900 truncate"
                  :title="record[String(fieldName)]"
                >
                  {{ record[String(fieldName)] || "—" }}
                </p>
              </div>

              <!-- Campo Email -->
              <a
                v-else-if="
                  fieldDef.type === 'email' && record[String(fieldName)]
                "
                :href="`mailto:${record[String(fieldName)]}`"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ record[String(fieldName)] }}
              </a>

              <!-- Campo URL -->
              <a
                v-else-if="fieldDef.type === 'url' && record[String(fieldName)]"
                :href="record[String(fieldName)]"
                target="_blank"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ truncateUrl(record[String(fieldName)]) }}
              </a>

              <!-- Campo Relation -->
              <div v-else-if="isRelationField(String(fieldName))">
                <span
                  v-if="record[String(fieldName)]"
                  class="text-sm text-gray-900"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center"
                    >
                      <svg
                        class="w-3 h-3 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{
                          getRelationDisplayValue(
                            record[String(fieldName)],
                            String(fieldName)
                          )
                        }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{
                          collection.schema.relations[String(fieldName)]
                            .references
                        }}
                      </p>
                    </div>
                  </div>
                </span>
                <span v-else class="text-gray-400 text-sm">Sin asignar</span>
              </div>

              <!-- Otros campos -->
              <span v-else class="text-sm text-gray-900">
                {{ formatValue(record[String(fieldName)]) }}
              </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(record.created_at) }}
            </td>

            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <div class="flex items-center justify-end space-x-2">
                <button
                  v-if="canUpdateRecords"
                  @click="$emit('open-edit-record', record)"
                  class="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                  title="Editar registro"
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
                  v-if="canDeleteRecords"
                  @click="$emit('open-delete-record', record)"
                  class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                  title="Eliminar registro"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "../../../stores/auth";

interface Props {
  collection: any;
  records: any[];
  selectedRecords: string[];
  hasActiveFilters: boolean;
  canUpdateRecords: boolean;
  canDeleteRecords: boolean;
  sortField: string;
  sortDirection: "asc" | "desc";
}

const props = defineProps<Props>();

defineEmits<{
  "toggle-select-record": [recordId: string];
  "toggle-select-all-visible": [];
  "sort-by": [field: string];
  "open-edit-record": [record: any];
  "open-delete-record": [record: any];
  "open-bulk-delete": [];
}>();

const authStore = useAuthStore();
const signedUrlsCache = ref<Map<string, { url: string; expires: number }>>(
  new Map()
);

const areAllVisibleSelected = computed(() => {
  return (
    props.records.length > 0 &&
    props.records.every((record) => props.selectedRecords.includes(record.id))
  );
});

function isRelationField(fieldName: string): boolean {
  const relations = props.collection?.schema?.relations;
  return !!(
    relations &&
    relations[fieldName] &&
    relations[fieldName].type === "belongs_to"
  );
}

function getRelationDisplayValue(
  relationValue: any,
  fieldName: string
): string {
  if (!relationValue) return "—";

  const relationConfig = props.collection?.schema?.relations?.[fieldName];
  if (!relationConfig) return String(relationValue);

  if (typeof relationValue === "object" && relationValue !== null) {
    const displayField = relationConfig.display_field || "name";
    return (
      relationValue[displayField] ||
      relationValue.name ||
      relationValue.title ||
      relationValue.email ||
      relationValue.id ||
      "Sin nombre"
    );
  }

  return `ID: ${relationValue}`;
}

function getSignedImageUrl(imageData: any): string {
  if (!imageData?.id) return getFallbackImageUrl();

  const cached = signedUrlsCache.value.get(imageData.id);
  if (cached && cached.expires > Date.now()) {
    return cached.url;
  }

  loadSignedUrl(imageData.id);
  return getFallbackImageUrl();
}

async function loadSignedUrl(fileId: string) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(
      `${apiUrl}/api/storage/${fileId}/url?expires=3600`,
      {
        headers: {
          Authorization: `Bearer ${authStore.tokens?.access_token}`,
          "X-Tenant-ID": authStore.currentTenantId || "",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch signed URL");

    const data = await response.json();

    signedUrlsCache.value.set(fileId, {
      url: data.url,
      expires: Date.now() + 3600 * 1000,
    });

    const images = document.querySelectorAll(`img[data-file-id="${fileId}"]`);
    images.forEach((img: any) => {
      img.src = data.url;
    });
  } catch (error) {
    console.error("Error loading signed URL:", error);
  }
}

function getFallbackImageUrl(): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwYXRoIGQ9Im0yMSAxNS0zLjA4Ni0zLjA4NmE0Ljg4OCA0Ljg4OCAwIDAwLTYuODI4IDBsMTAgMTMiLz48L3N2Zz4=";
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = getFallbackImageUrl();
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && value.length > 50) {
    return value.substring(0, 47) + "...";
  }
  return String(value);
}

function truncateUrl(url: string): string {
  if (!url) return "—";
  if (url.length > 30) {
    return url.substring(0, 27) + "...";
  }
  return url;
}
</script>
