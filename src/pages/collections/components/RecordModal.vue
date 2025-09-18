<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    @click="emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingRecord ? "Editar Registro" : "Nuevo Registro" }} - {{ collection?.name }}
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <div
          v-for="(fieldDef, fieldName) in collection?.schema?.fields"
          :key="String(fieldName)"
          class="space-y-2"
        >
          <label class="block text-sm font-medium text-gray-700">
            {{ fieldName }}
            <span v-if="fieldDef.required" class="text-red-500">*</span>
            <span class="text-gray-400 text-xs ml-2">({{ fieldDef.type }})</span>
            <span v-if="isRelationField(String(fieldName))" class="text-blue-500 text-xs ml-1">
              - Relación con {{ getRelationConfig(String(fieldName))?.references }}
            </span>
          </label>

          <!-- Relation Select (belongs_to) -->
          <select
            v-if="isRelationField(String(fieldName))"
            v-model="recordForm[String(fieldName)]"
            :required="fieldDef.required"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Seleccionar {{ getRelationConfig(String(fieldName))?.references }} --</option>
            <option 
              v-for="option in getRelationOptions(String(fieldName))" 
              :key="option.id" 
              :value="option.id"
            >
              {{ option.display }}
            </option>
          </select>

          <!-- String/Email/URL Input -->
          <input
            v-else-if="['string', 'email', 'url'].includes(fieldDef.type)"
            v-model="recordForm[String(fieldName)]"
            :type="fieldDef.type === 'email' ? 'email' : fieldDef.type === 'url' ? 'url' : 'text'"
            :required="fieldDef.required"
            :maxlength="fieldDef.maxLength"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="`Ingrese ${String(fieldName)}`"
          />

          <!-- Number Input -->
          <input
            v-else-if="fieldDef.type === 'number'"
            v-model.number="recordForm[String(fieldName)]"
            type="number"
            :required="fieldDef.required"
            :min="fieldDef.min"
            :max="fieldDef.max"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="`Ingrese ${String(fieldName)}`"
          />

          <!-- Boolean Select -->
          <select
            v-else-if="fieldDef.type === 'boolean'"
            v-model="recordForm[String(fieldName)]"
            :required="fieldDef.required"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione</option>
            <option :value="true">Verdadero</option>
            <option :value="false">Falso</option>
          </select>

          <!-- Date Input -->
          <input
            v-else-if="fieldDef.type === 'date'"
            v-model="recordForm[String(fieldName)]"
            type="datetime-local"
            :required="fieldDef.required"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <!-- Text Area -->
          <textarea
            v-else-if="fieldDef.type === 'text'"
            v-model="recordForm[String(fieldName)]"
            :required="fieldDef.required"
            :maxlength="fieldDef.maxLength"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="`Ingrese ${String(fieldName)}`"
          ></textarea>

          <!-- JSON Input -->
          <div v-else-if="fieldDef.type === 'json'" class="space-y-2">
            <textarea
              v-model="recordForm[String(fieldName) + '_json_string']"
              :required="fieldDef.required"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder='{"key": "value", "number": 123}'
              @input="emit('validate-json', String(fieldName))"
            ></textarea>
            <p v-if="jsonErrors[String(fieldName)]" class="text-red-500 text-sm">
              {{ jsonErrors[String(fieldName)] }}
            </p>
          </div>

          <!-- File Upload -->
          <div v-else-if="fieldDef.type === 'file'" class="space-y-3">
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">Haz clic para subir</span> o arrastra y suelta
                  </p>
                  <p class="text-xs text-gray-500">PNG, JPG, PDF MAX. 50MB</p>
                </div>
                <input type="file" @change="handleFileUpload($event, String(fieldName), false)" class="hidden" />
              </label>
            </div>

            <!-- Progress bar -->
            <div v-if="uploadProgress[String(fieldName)]" class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress[String(fieldName)] + '%' }"
              ></div>
            </div>

            <!-- Uploaded file -->
            <div v-if="recordForm[String(fieldName)]" class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-green-900">Archivo subido</p>
                  <p class="text-xs text-green-700">{{ getFileName(recordForm[String(fieldName)]) }}</p>
                </div>
              </div>
              <button @click="removeFile(String(fieldName))" class="text-red-600 hover:text-red-800 p-1" title="Quitar archivo">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Image Upload -->
          <div v-else-if="fieldDef.type === 'image'" class="space-y-3">
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">Haz clic para subir imagen</span>
                  </p>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF MAX. 50MB</p>
                </div>
                <input type="file" accept="image/*" @change="handleFileUpload($event, String(fieldName), false)" class="hidden" />
              </label>
            </div>

            <!-- Progress bar -->
            <div v-if="uploadProgress[String(fieldName)]" class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress[String(fieldName)] + '%' }"
              ></div>
            </div>

            <!-- Uploaded image -->
            <div v-if="recordForm[String(fieldName)]" class="relative">
              <img
                :src="getFileUrl(recordForm[String(fieldName)])"
                :alt="String(fieldName)"
                class="w-full h-48 object-cover rounded-lg border border-gray-200"
                @error="handleImageError"
              />
              <button
                @click="removeFile(String(fieldName))"
                class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
                title="Quitar imagen"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Multiple Files Upload -->
          <div v-else-if="fieldDef.type === 'files'" class="space-y-3">
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">Subir múltiples archivos</span>
                  </p>
                  <p class="text-xs text-gray-500">Selecciona varios archivos MAX. 50MB c/u</p>
                </div>
                <input type="file" multiple @change="handleFileUpload($event, String(fieldName), true)" class="hidden" />
              </label>
            </div>

            <!-- Progress bar -->
            <div v-if="uploadProgress[String(fieldName)]" class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress[String(fieldName)] + '%' }"
              ></div>
            </div>

            <!-- Uploaded files -->
            <div v-if="recordForm[String(fieldName)] && recordForm[String(fieldName)].length > 0" class="space-y-2">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Archivos subidos ({{ recordForm[String(fieldName)].length }})
              </div>
              <div class="space-y-1 max-h-40 overflow-y-auto">
                <div
                  v-for="(fileId, index) in recordForm[String(fieldName)]"
                  :key="fileId"
                  class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4zM2 8.5V17a2 2 0 002 2h12a2 2 0 002-2V8.5H2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-blue-900">{{ getFileName(fileId) }}</p>
                      <p class="text-xs text-blue-700">Archivo {{ index + 1 }}</p>
                    </div>
                  </div>
                  <button
                    @click="removeFileFromArray(String(fieldName), index)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Quitar archivo"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Multiple Images Upload -->
          <div v-else-if="fieldDef.type === 'images'" class="space-y-3">
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">Subir múltiples imágenes</span>
                  </p>
                  <p class="text-xs text-gray-500">Selecciona varias imágenes MAX. 50MB c/u</p>
                </div>
                <input type="file" accept="image/*" multiple @change="handleFileUpload($event, String(fieldName), true)" class="hidden" />
              </label>
            </div>

            <!-- Progress bar -->
            <div v-if="uploadProgress[String(fieldName)]" class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: uploadProgress[String(fieldName)] + '%' }"
              ></div>
            </div>

            <!-- Uploaded images -->
            <div v-if="recordForm[String(fieldName)] && recordForm[String(fieldName)].length > 0">
              <div class="text-sm font-medium text-gray-700 mb-3">
                Imágenes subidas ({{ recordForm[String(fieldName)].length }})
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="(fileId, index) in recordForm[String(fieldName)]"
                  :key="fileId"
                  class="relative group"
                >
                  <img
                    :src="getFileUrl(fileId)"
                    :alt="`${String(fieldName)} ${index + 1}`"
                    class="w-full h-24 object-cover rounded-lg border border-gray-200"
                    @error="handleImageError"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                    <button
                      @click="removeFileFromArray(String(fieldName), index)"
                      class="opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-all"
                      title="Quitar imagen"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                  <div class="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {{ index + 1 }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Default fallback -->
          <input
            v-else
            v-model="recordForm[String(fieldName)]"
            type="text"
            :required="fieldDef.required"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="`Ingrese ${String(fieldName)} (${fieldDef.type})`"
          />

          <!-- Field Help Text -->
          <div v-if="getFieldHelpText(fieldDef)" class="text-xs text-gray-500">
            {{ getFieldHelpText(fieldDef) }}
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div class="flex items-center justify-end space-x-4">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            @click="emit('save')"
            :disabled="savingRecord || hasValidationErrors || loadingRelations"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50"
          >
            {{ savingRecord ? "Guardando..." : editingRecord ? "Actualizar Registro" : "Crear Registro" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { storageAPI, recordsAPI } from "../../../services/api";

interface Props {
  collection: any;
  editingRecord: any;
  recordForm: any;
  jsonErrors: any;
  uploadProgress: any;
  savingRecord: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'close': [];
  'save': [];
  'validate-json': [fieldName: string];
}>();

// Estado para relaciones
const relationOptions = ref<Record<string, any[]>>({});
const loadingRelations = ref(false);

const hasValidationErrors = computed(() => {
  return Object.keys(props.jsonErrors).length > 0;
});

// Funciones para relaciones
function isRelationField(fieldName: string): boolean {
  const relations = props.collection?.schema?.relations;
  if (!relations || !relations[fieldName]) return false;
  
  // Solo mostrar select para belongs_to
  return relations[fieldName].type === 'belongs_to';
}

function getRelationConfig(fieldName: string): any {
  return props.collection?.schema?.relations?.[fieldName];
}

function getRelationOptions(fieldName: string): any[] {
  return relationOptions.value[fieldName] || [];
}

async function loadRelationOptions(schemaRelations: any) {
  if (!schemaRelations) return;
  
  try {
    loadingRelations.value = true;
    
    for (const [fieldName, relationConfig] of Object.entries(schemaRelations)) {
      const config = relationConfig as any;
      
      // Solo cargar opciones para belongs_to
      if (config.type === 'belongs_to') {
        const referencedCollection = config.references;
        try {
          const response = await recordsAPI.getAll(referencedCollection, { 
            page: 1, 
            limit: 200 
          });
          
          const responseData = response.data as any;
          const records = responseData?.data || responseData || [];
          
          relationOptions.value[fieldName] = records.map((record: any) => {
            const displayField = config.display_field || 'name';
            const display = record[displayField] || 
                           record.name || 
                           record.title || 
                           record.email || 
                           record.id || 
                           'Sin nombre';
                           
            return {
              id: record.id,
              display: display
            };
          });
        } catch (error) {
          console.error(`Error loading options for ${referencedCollection}:`, error);
          relationOptions.value[fieldName] = [];
        }
      }
    }
  } catch (error) {
    console.error('Error loading relation options:', error);
  } finally {
    loadingRelations.value = false;
  }
}

// Watch para cargar relaciones cuando cambia la collection
watch(() => props.collection, async (newCollection) => {
  if (newCollection?.schema?.relations) {
    await loadRelationOptions(newCollection.schema.relations);
  }
}, { immediate: true });

// Funciones de upload (sin cambios)
async function handleFileUpload(event: Event, fieldName: string, isMultiple: boolean) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;

  try {
    props.uploadProgress[fieldName] = 0;
    
    if (isMultiple) {
      const currentFiles = props.recordForm[fieldName] || [];
      const newFileIds: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = await uploadSingleFile(file);
        if (fileId) newFileIds.push(fileId);
        
        props.uploadProgress[fieldName] = Math.round(((i + 1) / files.length) * 100);
      }
      
      props.recordForm[fieldName] = [...currentFiles, ...newFileIds];
    } else {
      const fileId = await uploadSingleFile(files[0]);
      if (fileId) {
        props.recordForm[fieldName] = fileId;
        props.uploadProgress[fieldName] = 100;
      }
    }
    
    setTimeout(() => {
      delete props.uploadProgress[fieldName];
    }, 1000);
    
    target.value = '';
  } catch (error) {
    console.error('Error uploading file:', error);
    delete props.uploadProgress[fieldName];
  }
}

async function uploadSingleFile(file: File): Promise<string | null> {
  try {
    const response = await storageAPI.upload(file, {
      folder: props.collection.name,
      collection: props.collection.name
    });
    
    const responseData = response.data as any;
    const fileId = responseData?.data?.id || responseData?.id;
    return fileId || null;
  } catch (error) {
    console.error('Error uploading single file:', error);
    throw error;
  }
}

function getFileUrl(fileId: string): string {
  if (!fileId) return '';
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}/api/storage/${fileId}/download`;
}

function getFileName(fileId: string): string {
  if (!fileId) return 'archivo';
  return `archivo_${fileId.slice(0, 8)}`;
}

function removeFile(fieldName: string) {
  props.recordForm[fieldName] = null;
}

function removeFileFromArray(fieldName: string, index: number) {
  const currentFiles = props.recordForm[fieldName] || [];
  currentFiles.splice(index, 1);
  props.recordForm[fieldName] = [...currentFiles];
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwYXRoIGQ9Im0yMSAxNS0zLjA4Ni0zLjA4NmE0Ljg4OCA0Ljg4OCAwIDAwLTYuODI4IDBMMTAgMTMiLz48L3N2Zz4=';
}

function getFieldHelpText(fieldDef: any): string {
  const hints = [];
  
  if (fieldDef.required) hints.push('Obligatorio');
  if (fieldDef.unique) hints.push('Debe ser único');
  if (fieldDef.maxLength) hints.push(`Máximo ${fieldDef.maxLength} caracteres`);
  if (fieldDef.min !== undefined || fieldDef.max !== undefined) {
    if (fieldDef.min !== undefined && fieldDef.max !== undefined) {
      hints.push(`Entre ${fieldDef.min} y ${fieldDef.max}`);
    } else if (fieldDef.min !== undefined) {
      hints.push(`Mínimo ${fieldDef.min}`);
    } else if (fieldDef.max !== undefined) {
      hints.push(`Máximo ${fieldDef.max}`);
    }
  }
  if (fieldDef.default !== undefined) hints.push(`Por defecto: ${fieldDef.default}`);
  
  return hints.join(' • ');
}
</script>
