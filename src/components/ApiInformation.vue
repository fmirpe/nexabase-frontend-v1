<!-- components/ApiInformation.vue -->
<template>
  <div class="api-information-card">
    <!-- Header del Card -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
        >
          <svg
            class="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">API Endpoint</h3>
          <p class="text-blue-100">Tu URL personalizada de NexaBase</p>
        </div>
      </div>
    </div>

    <!-- Contenido del Card -->
    <div
      class="bg-white rounded-b-xl p-6 border-l border-r border-b border-gray-200"
    >
      <!-- URL Principal -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🌐 URL de tu API
          </label>
          <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
            <code class="flex-1 text-blue-600 font-mono text-lg">
              {{ apiUrl }}
            </code>
            <button
              @click="copyToClipboard(apiUrl)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                copied.apiUrl
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white',
              ]"
            >
              <span v-if="copied.apiUrl">✓ Copiado</span>
              <span v-else>📋 Copiar</span>
            </button>
          </div>
        </div>

        <!-- Subdomain Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              🏷️ Subdominio
            </label>
            <div class="p-3 bg-gray-50 rounded-lg border">
              <code class="text-gray-800 font-mono">{{
                organization?.subdomain
              }}</code>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📚 Documentación
            </label>
            <a
              :href="`${apiUrl}/docs`"
              target="_blank"
              class="inline-flex items-center px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200"
            >
              Ver Docs
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 9l6-6m0 0l-6 0m6 0v6"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Ejemplos de uso -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ⚡ Ejemplos de uso
          </label>

          <!-- Tabs -->
          <div class="border-b border-gray-200 mb-4">
            <nav class="flex space-x-8">
              <button
                v-for="tab in examples"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="space-y-4">
            <div
              v-for="example in examples"
              :key="example.id"
              v-show="activeTab === example.id"
            >
              <div class="bg-gray-900 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-400 text-sm">{{
                    example.description
                  }}</span>
                  <button
                    @click="copyToClipboard(example.code)"
                    :class="[
                      'px-3 py-1 rounded text-xs font-medium transition-all duration-200',
                      copied[example.id]
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
                    ]"
                  >
                    <span v-if="copied[example.id]">✓</span>
                    <span v-else>📋</span>
                  </button>
                </div>
                <pre
                  class="text-green-400 text-sm overflow-x-auto"
                ><code>{{ example.code }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const organization = computed(() => authStore.user?.organization);
const apiUrl = computed(() =>
  organization.value?.subdomain
    ? `https://${organization.value.subdomain}.api.nexabase.online`
    : "https://api.nexabase.online"
);

const activeTab = ref("curl");
const copied = ref<Record<string, boolean>>({});

const examples = computed(() => [
  {
    id: "curl",
    label: "cURL",
    description: "Listar colecciones",
    code: `curl -X GET "${apiUrl.value}/api/v1/collections" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    description: "Cliente JavaScript/Node.js",
    code: `const response = await fetch('${apiUrl.value}/api/v1/collections', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const collections = await response.json();`,
  },
  {
    id: "python",
    label: "Python",
    description: "Cliente Python",
    code: `import requests

response = requests.get(
  '${apiUrl.value}/api/v1/collections',
  headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
collections = response.json()`,
  },
]);

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    const key = text === apiUrl.value ? "apiUrl" : activeTab.value;
    copied.value[key] = true;
    setTimeout(() => {
      copied.value[key] = false;
    }, 2000);
  } catch (err) {
    console.error("Error copying to clipboard:", err);
  }
}
</script>
