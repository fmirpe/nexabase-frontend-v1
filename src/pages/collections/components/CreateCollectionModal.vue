<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    @click="emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto"
      @click.stop
    >
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingCollection ? "Editar Collection" : "Nueva Collection" }}
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
        <!-- Basic Collection Info -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">
            Información Básica
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Collection *
              </label>
              <input
                :value="form.name"
                @input="updateForm('name', ($event.target as HTMLInputElement).value)"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ej: users, products, orders"
                :disabled="editingCollection"
              />
              <p class="text-xs text-gray-500 mt-1">
                Debe iniciar con letra y usar solo letras, números y guion bajo.
              </p>
            </div>

            <div class="flex items-end">
              <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  :checked="form.is_active"
                  @change="updateForm('is_active', ($event.target as HTMLInputElement).checked)"
                  class="rounded border-gray-300"
                />
                Activa
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción (metadata)
            </label>
            <textarea
              :value="form.metadata.description"
              @input="updateFormMetadata('description', ($event.target as HTMLTextAreaElement).value)"
              rows="2"
              placeholder="Describe el propósito..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                :checked="form.schema.timestamps"
                @change="updateFormSchema('timestamps', ($event.target as HTMLInputElement).checked)"
                class="rounded border-gray-300"
              />
              timestamps
            </label>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Índices (opcional)
              </label>
              <input
                :value="indexesInput"
                @input="emit('update:indexesInput', ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="ej: idx_name, idx_price"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                Separados por coma. Se enviarán como array.
              </p>
            </div>
          </div>
        </div>

        <!-- Auth Rules -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">
            Reglas de Autorización
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reglas CREATE
              </label>
              <input
                :value="authCreateInput"
                @input="emit('update:authCreateInput', ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="authenticated, admin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reglas READ
              </label>
              <input
                :value="authReadInput"
                @input="emit('update:authReadInput', ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="public"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reglas UPDATE
              </label>
              <input
                :value="authUpdateInput"
                @input="emit('update:authUpdateInput', ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="owner, admin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reglas DELETE
              </label>
              <input
                :value="authDeleteInput"
                @input="emit('update:authDeleteInput', ($event.target as HTMLInputElement).value)"
                type="text"
                placeholder="admin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Schema Fields -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Campos del Schema</h3>
            <button
              @click="emit('add-field')"
              type="button"
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Agregar campo
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(f, idx) in schemaFields"
              :key="f.id"
              class="border rounded-lg p-3"
            >
              <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    :value="f.name"
                    @input="updateSchemaField(idx, 'name', ($event.target as HTMLInputElement).value.trim())"
                    type="text"
                    placeholder="name"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    :value="f.type"
                    @change="updateSchemaField(idx, 'type', ($event.target as HTMLSelectElement).value)"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="string">string</option>
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="date">date</option>
                    <option value="json">json</option>
                    <option value="email">email</option>
                    <option value="url">url</option>
                    <option value="file">file</option>
                    <option value="image">image</option>
                    <option value="files">files (múltiples)</option>
                    <option value="images">images (múltiples)</option>
                  </select>
                </div>

                <div class="flex items-center gap-2">
                  <label class="inline-flex items-center gap-1 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      :checked="f.required"
                      @change="updateSchemaField(idx, 'required', ($event.target as HTMLInputElement).checked)"
                      class="rounded border-gray-300"
                    />
                    required
                  </label>
                  <label class="inline-flex items-center gap-1 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      :checked="f.unique"
                      @change="updateSchemaField(idx, 'unique', ($event.target as HTMLInputElement).checked)"
                      class="rounded border-gray-300"
                    />
                    unique
                  </label>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    default
                  </label>
                  <input
                    :value="f.default"
                    @input="updateSchemaField(idx, 'default', ($event.target as HTMLInputElement).value)"
                    type="text"
                    placeholder="opcional"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex items-center justify-end">
                  <button
                    @click="emit('remove-field', idx)"
                    class="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                    type="button"
                  >
                    Quitar
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    maxLength
                  </label>
                  <input
                    :value="f.maxLength || ''"
                    @input="updateSchemaField(idx, 'maxLength', Number(($event.target as HTMLInputElement).value) || undefined)"
                    type="number"
                    min="1"
                    placeholder="p/ string"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    min
                  </label>
                  <input
                    :value="f.min !== undefined ? f.min : ''"
                    @input="updateSchemaField(idx, 'min', ($event.target as HTMLInputElement).value === '' ? undefined : Number(($event.target as HTMLInputElement).value))"
                    type="number"
                    placeholder="p/ number"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    max
                  </label>
                  <input
                    :value="f.max !== undefined ? f.max : ''"
                    @input="updateSchemaField(idx, 'max', ($event.target as HTMLInputElement).value === '' ? undefined : Number(($event.target as HTMLInputElement).value))"
                    type="number"
                    placeholder="p/ number"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <p v-if="schemaFields.length === 0" class="text-xs text-gray-500">
              Agrega al menos un campo.
            </p>
          </div>
        </div>

        <!-- Relaciones -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Relaciones</h3>
            <button
              @click="emit('add-relation')"
              type="button"
              class="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-sm"
            >
              Agregar relación
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(r, idx) in relationList"
              :key="r._id"
              class="border rounded-lg p-3 bg-purple-50"
            >
              <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Campo
                  </label>
                  <input
                    :value="r.field"
                    @input="updateRelation(idx, 'field', ($event.target as HTMLInputElement).value.trim())"
                    type="text"
                    placeholder="categoria_id"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    :value="r.type"
                    @change="updateRelation(idx, 'type', ($event.target as HTMLSelectElement).value)"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="belongs_to">belongs_to</option>
                    <option value="has_many">has_many</option>
                    <option value="many_to_many">many_to_many</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    Referencia
                  </label>
                  <input
                    :value="r.references"
                    @input="updateRelation(idx, 'references', ($event.target as HTMLInputElement).value.trim())"
                    type="text"
                    placeholder="categories"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">
                    {{ r.type === 'many_to_many' ? 'Tabla intermedia' : 'Campo mostrar' }}
                  </label>
                  <input
                    :value="r.extra"
                    @input="updateRelation(idx, 'extra', ($event.target as HTMLInputElement).value.trim())"
                    type="text"
                    :placeholder="r.type === 'many_to_many' ? 'product_tags' : 'name'"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex items-center justify-end">
                  <button
                    @click="emit('remove-relation', idx)"
                    class="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                    type="button"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>

            <p v-if="relationList.length === 0" class="text-xs text-gray-500">
              Las relaciones son opcionales.
            </p>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div class="flex gap-3">
          <button
            @click="emit('close')"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            v-if="!editingCollection"
            @click="emit('save')"
            :disabled="saving"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
          >
            {{ saving ? "Creando..." : "Crear" }}
          </button>
          <button
            v-else
            @click="emit('save')"
            :disabled="saving"
            class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-medium rounded-lg transition-colors"
          >
            {{ saving ? "Actualizando..." : "Actualizar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  editingCollection: any;
  form: any;
  schemaFields: any[];
  relationList: any[];
  indexesInput: string;
  authCreateInput: string;
  authReadInput: string;
  authUpdateInput: string;
  authDeleteInput: string;
  saving: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'close': [];
  'save': [];
  'add-field': [];
  'remove-field': [index: number];
  'add-relation': [];
  'remove-relation': [index: number];
  'update:indexesInput': [value: string];
  'update:authCreateInput': [value: string];
  'update:authReadInput': [value: string];
  'update:authUpdateInput': [value: string];
  'update:authDeleteInput': [value: string];
  'update-form': [key: string, value: any];
  'update-form-metadata': [key: string, value: any];  
  'update-form-schema': [key: string, value: any];
  'update-schema-field': [index: number, key: string, value: any];
  'update-relation': [index: number, key: string, value: any];
}>();

function updateForm(key: string, value: any) {
  emit('update-form', key, value);
}

function updateFormMetadata(key: string, value: any) {
  emit('update-form-metadata', key, value);
}

function updateFormSchema(key: string, value: any) {
  emit('update-form-schema', key, value);
}

function updateSchemaField(index: number, key: string, value: any) {
  emit('update-schema-field', index, key, value);
}

function updateRelation(index: number, key: string, value: any) {
  emit('update-relation', index, key, value);
}
</script>
