<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
    @click="emit('close')"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 sticky top-0 z-40">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">
                {{ editingCollection ? "Editar Collection" : "Nueva Collection" }}
              </h2>
              <p class="text-blue-100 text-sm">
                {{ editingCollection ? "Modifica tu collection existente" : "Define el esquema de tu nueva collection" }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- Quick Save Button en Header -->
            <button
              v-if="canSave"
              @click="emit('save')"
              :disabled="saving"
              class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 rounded-lg transition-all duration-200 flex items-center text-sm font-medium"
            >
              <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
            
            <button
              @click="emit('close')"
              class="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex h-[calc(95vh-100px)]">
        <!-- Sidebar Navigation -->
        <div class="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <nav class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 mr-3" />
              {{ tab.name }}
              <span v-if="tab.badge" :class="tab.badgeClass" class="ml-auto px-2 py-1 text-xs rounded-full">
                {{ tab.badge }}
              </span>
            </button>
          </nav>

          <!-- Progress Indicator -->
          <div class="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <div class="text-sm font-medium text-gray-700 mb-2">Progreso</div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ completionPercentage }}% completado</div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <!-- Basic Info Tab -->
            <div v-if="activeTab === 'basic'" class="space-y-6">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información Básica
                </h3>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Collection *
                      </label>
                      <input
                        :value="form.name"
                        @input="updateForm('name', ($event.target as HTMLInputElement).value)"
                        type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="ej: users, products, orders"
                        :disabled="editingCollection"
                      />
                      <p class="text-xs text-gray-500 mt-2 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Debe iniciar con letra, solo letras, números y guion bajo
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        :value="form.metadata.description"
                        @input="updateFormMetadata('description', ($event.target as HTMLTextAreaElement).value)"
                        rows="3"
                        placeholder="Describe el propósito de esta collection..."
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-900 mb-3">Configuración</h4>
                      <div class="space-y-3">
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            :checked="form.is_active"
                            @change="updateForm('is_active', ($event.target as HTMLInputElement).checked)"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span class="ml-3 text-sm font-medium text-gray-700">Collection activa</span>
                        </label>
                        
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            :checked="form.schema.timestamps"
                            @change="updateFormSchema('timestamps', ($event.target as HTMLInputElement).checked)"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span class="ml-3 text-sm font-medium text-gray-700">Incluir timestamps (created_at, updated_at)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Índices (opcional)
                      </label>
                      <input
                        :value="indexesInput"
                        @input="emit('update:indexesInput', ($event.target as HTMLInputElement).value)"
                        type="text"
                        placeholder="ej: idx_name, idx_email, idx_status"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p class="text-xs text-gray-500 mt-2">
                        Separados por coma para mejorar el rendimiento de consultas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Schema Fields Tab -->
            <div v-if="activeTab === 'fields'" class="space-y-6">
              <div class="bg-white rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Campos del Schema
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">Define los campos que tendrán los registros de esta collection</p>
                  </div>
                  <button
                    @click="emit('add-field')"
                    class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Campo
                  </button>
                </div>

                <div class="p-6">
                  <div v-if="schemaFields.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Sin campos definidos</h3>
                    <p class="text-gray-500 mb-4">Agrega al menos un campo para definir la estructura de tu collection</p>
                    <button
                      @click="emit('add-field')"
                      class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Crear Primer Campo
                    </button>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                      v-for="(field, idx) in schemaFields"
                      :key="field.id"
                      class="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getFieldTypeColor(field.type)">
                            <component :is="getFieldTypeIcon(field.type)" class="w-5 h-5" />
                          </div>
                          <div>
                            <input
                              :value="field.name"
                              @input="updateSchemaField(idx, 'name', ($event.target as HTMLInputElement).value.trim())"
                              type="text"
                              placeholder="nombre_del_campo"
                              class="text-lg font-medium bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                            />
                            <div class="flex items-center space-x-4 mt-1">
                              <span :class="getFieldTypeBadgeColor(field.type)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                                {{ field.type }}
                              </span>
                              <span v-if="field.required" class="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                obligatorio
                              </span>
                              <span v-if="field.unique" class="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                único
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          @click="emit('remove-field', idx)"
                          class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Campo</label>
                          <select
                            :value="field.type"
                            @change="updateSchemaField(idx, 'type', ($event.target as HTMLSelectElement).value)"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <optgroup label="Texto">
                              <option value="string">String - Texto corto</option>
                              <option value="text">Text - Texto largo</option>
                              <option value="email">Email - Dirección de correo</option>
                              <option value="url">URL - Enlace web</option>
                            </optgroup>
                            <optgroup label="Números">
                              <option value="number">Number - Número</option>
                              <option value="boolean">Boolean - Verdadero/Falso</option>
                            </optgroup>
                            <optgroup label="Fechas">
                              <option value="date">Date - Fecha</option>
                            </optgroup>
                            <optgroup label="Archivos">
                              <option value="file">File - Archivo único</option>
                              <option value="image">Image - Imagen única</option>
                              <option value="files">Files - Múltiples archivos</option>
                              <option value="images">Images - Múltiples imágenes</option>
                            </optgroup>
                            <optgroup label="Avanzados">
                              <option value="json">JSON - Datos estructurados</option>
                            </optgroup>
                          </select>
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                          <div class="space-y-2">
                            <label class="flex items-center">
                              <input
                                type="checkbox"
                                :checked="field.required"
                                @change="updateSchemaField(idx, 'required', ($event.target as HTMLInputElement).checked)"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span class="ml-2 text-sm text-gray-700">Campo obligatorio</span>
                            </label>
                            <label class="flex items-center">
                              <input
                                type="checkbox"
                                :checked="field.unique"
                                @change="updateSchemaField(idx, 'unique', ($event.target as HTMLInputElement).checked)"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span class="ml-2 text-sm text-gray-700">Valor único</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Valor por Defecto</label>
                          <input
                            :value="field.default"
                            @input="updateSchemaField(idx, 'default', ($event.target as HTMLInputElement).value)"
                            type="text"
                            placeholder="Opcional..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <!-- Field-specific options -->
                      <div v-if="field.type === 'string'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Longitud Máxima</label>
                          <input
                            :value="field.maxLength || ''"
                            @input="updateSchemaField(idx, 'maxLength', Number(($event.target as HTMLInputElement).value) || undefined)"
                            type="number"
                            min="1"
                            placeholder="255"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div v-if="field.type === 'number'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Valor Mínimo</label>
                          <input
                            :value="field.min !== undefined ? field.min : ''"
                            @input="updateSchemaField(idx, 'min', ($event.target as HTMLInputElement).value === '' ? undefined : Number(($event.target as HTMLInputElement).value))"
                            type="number"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Valor Máximo</label>
                          <input
                            :value="field.max !== undefined ? field.max : ''"
                            @input="updateSchemaField(idx, 'max', ($event.target as HTMLInputElement).value === '' ? undefined : Number(($event.target as HTMLInputElement).value))"
                            type="number"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Relations Tab -->
            <div v-if="activeTab === 'relations'" class="space-y-6">
              <div class="bg-white rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Relaciones
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">Conecta esta collection con otras collections</p>
                  </div>
                  <button
                    @click="emit('add-relation')"
                    class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Relación
                  </button>
                </div>

                <div class="p-6">
                  <div v-if="relationList.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Sin relaciones definidas</h3>
                    <p class="text-gray-500 mb-4">Las relaciones permiten conectar registros entre diferentes collections</p>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                      v-for="(relation, idx) in relationList"
                      :key="relation._id"
                      class="bg-gray-50 rounded-lg border border-gray-200 p-4"
                    >
                      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Campo</label>
                          <input
                            :value="relation.field"
                            @input="updateRelation(idx, 'field', ($event.target as HTMLInputElement).value)"
                            type="text"
                            placeholder="usuario_id"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                          <select
                            :value="relation.type"
                            @change="updateRelation(idx, 'type', ($event.target as HTMLSelectElement).value)"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="belongs_to">Belongs To (N:1)</option>
                            <option value="has_many">Has Many (1:N)</option>
                            <option value="many_to_many">Many to Many (M:N)</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">Referencia</label>
                          <input
                            :value="relation.references"
                            @input="updateRelation(idx, 'references', ($event.target as HTMLInputElement).value)"
                            type="text"
                            placeholder="users"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div class="flex items-end">
                          <button
                            @click="emit('remove-relation', idx)"
                            class="w-full px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Auth Rules Tab -->
            <div v-if="activeTab === 'auth'" class="space-y-6">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Reglas de Autorización
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        <span class="flex items-center">
                          <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Crear Registros
                        </span>
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
                        <span class="flex items-center">
                          <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Leer Registros
                        </span>
                      </label>
                      <input
                        :value="authReadInput"
                        @input="emit('update:authReadInput', ($event.target as HTMLInputElement).value)"
                        type="text"
                        placeholder="public"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        <span class="flex items-center">
                          <svg class="w-4 h-4 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Actualizar Registros
                        </span>
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
                        <span class="flex items-center">
                          <svg class="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar Registros
                        </span>
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

                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 class="text-sm font-medium text-blue-900 mb-2">Opciones de autorización:</h4>
                  <ul class="text-sm text-blue-800 space-y-1">
                    <li><code class="bg-blue-100 px-1 rounded">public</code> - Acceso público sin autenticación</li>
                    <li><code class="bg-blue-100 px-1 rounded">authenticated</code> - Solo usuarios autenticados</li>
                    <li><code class="bg-blue-100 px-1 rounded">owner</code> - Solo el propietario del registro</li>
                    <li><code class="bg-blue-100 px-1 rounded">admin</code> - Solo administradores</li>
                    <li><code class="bg-blue-100 px-1 rounded">none</code> - Acceso denegado</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Preview Tab -->
            <div v-if="activeTab === 'preview'" class="space-y-6">
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Vista Previa del Schema
                </h3>

                <div class="space-y-6">
                  <!-- Collection Info Preview -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-2">Información de la Collection</h4>
                    <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Nombre</dt>
                        <dd class="text-sm text-gray-900">{{ form.name || 'Sin nombre' }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Estado</dt>
                        <dd class="text-sm">
                          <span :class="form.is_active ? 'text-green-600' : 'text-red-600'">
                            {{ form.is_active ? 'Activa' : 'Inactiva' }}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Descripción</dt>
                        <dd class="text-sm text-gray-900">{{ form.metadata?.description || 'Sin descripción' }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Timestamps</dt>
                        <dd class="text-sm text-gray-900">{{ form.schema.timestamps ? 'Habilitados' : 'Deshabilitados' }}</dd>
                      </div>
                    </dl>
                  </div>

                  <!-- Fields Preview -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-4">Campos ({{ schemaFields.length }})</h4>
                    <div v-if="schemaFields.length === 0" class="text-center py-4 text-gray-500">
                      No hay campos definidos
                    </div>
                    <div v-else class="space-y-2">
                      <div
                        v-for="field in schemaFields"
                        :key="field.id"
                        class="flex items-center justify-between bg-white rounded p-3"
                      >
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getFieldTypeColor(field.type)">
                            <component :is="getFieldTypeIcon(field.type)" class="w-4 h-4" />
                          </div>
                          <div>
                            <div class="font-medium text-gray-900">{{ field.name || 'Sin nombre' }}</div>
                            <div class="text-xs text-gray-500">{{ field.type }}</div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span v-if="field.required" class="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            obligatorio
                          </span>
                          <span v-if="field.unique" class="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            único
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Relations Preview -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-4">Relaciones ({{ relationList.length }})</h4>
                    <div v-if="relationList.length === 0" class="text-center py-4 text-gray-500">
                      No hay relaciones definidas
                    </div>
                    <div v-else class="space-y-2">
                      <div
                        v-for="relation in relationList"
                        :key="relation._id"
                        class="flex items-center justify-between bg-white rounded p-3"
                      >
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div>
                            <div class="font-medium text-gray-900">{{ relation.field || 'Sin nombre' }}</div>
                            <div class="text-xs text-gray-500">{{ relation.type }} → {{ relation.references }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- JSON Preview -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-4">Schema JSON</h4>
                    <pre class="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">{{ JSON.stringify(generatePreviewJSON(), null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between sticky bottom-0 shadow-lg">
        <div class="flex items-center space-x-4">
          <button
            @click="emit('close')"
            class="px-6 py-2 text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ schemaFields.length }} campo{{ schemaFields.length !== 1 ? 's' : '' }}</span>
            <span class="text-gray-300">•</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>{{ relationList.length }} relación{{ relationList.length !== 1 ? 'es' : '' }}</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Progress indicator mobile -->
          <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
            <div class="w-16 bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
            <span class="text-xs">{{ completionPercentage }}%</span>
          </div>
          
          <!-- Save Button - MÁS PROMINENTE -->
          <button
            @click="emit('save')"
            :disabled="saving || !canSave"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg v-if="saving" class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ saving ? 'Guardando...' : (editingCollection ? 'Actualizar Collection' : 'Crear Collection') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';

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

const props = defineProps<Props>();

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

const activeTab = ref('basic');

// ✅ ICONOS REALES COMO COMPONENTES FUNCIONALES
const InfoIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}));

const DocumentIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
}));

const LinkIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
}));

const ShieldIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
}));

const EyeIcon = () => h('svg', {
  class: 'w-5 h-5',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
}), h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
}));

const tabs = computed(() => [
  {
    id: 'basic',
    name: 'Información',
    icon: InfoIcon,
    badge: props.form.name ? '✓' : '',
    badgeClass: props.form.name ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  },
  {
    id: 'fields',
    name: 'Campos',
    icon: DocumentIcon,
    badge: props.schemaFields.length.toString(),
    badgeClass: props.schemaFields.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
  },
  {
    id: 'relations',
    name: 'Relaciones',
    icon: LinkIcon,
    badge: props.relationList.length.toString(),
    badgeClass: props.relationList.length > 0 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
  },
  {
    id: 'auth',
    name: 'Autorización',
    icon: ShieldIcon,
    badge: '',
    badgeClass: 'bg-gray-100 text-gray-800'
  },
  {
    id: 'preview',
    name: 'Vista Previa',
    icon: EyeIcon,
    badge: '',
    badgeClass: 'bg-gray-100 text-gray-800'
  }
]);

const completionPercentage = computed(() => {
  let completed = 0;
  let total = 4;

  if (props.form.name) completed++;
  if (props.schemaFields.length > 0) completed++;
  if (props.form.metadata?.description) completed++;
  if (props.authCreateInput || props.authReadInput) completed++;

  return Math.round((completed / total) * 100);
});

const canSave = computed(() => {
  return props.form.name && props.schemaFields.length > 0;
});

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

// ✅ ICONOS PARA TIPOS DE CAMPO
function getFieldTypeIcon(type: string) {
  const icons: Record<string, () => any> = {
    string: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
    })),
    
    text: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    })),
    
    number: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
    })),
    
    boolean: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    })),
    
    date: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    })),
    
    email: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    })),
    
    url: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    })),
    
    file: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    })),
    
    image: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    })),
    
    files: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
    })),
    
    images: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    })),
    
    json: () => h('svg', {
      class: 'w-5 h-5',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    }))
  };
  
  return icons[type] || icons.string;
}

function getFieldTypeColor(type: string) {
  const colors: Record<string, string> = {
    string: 'bg-blue-100 text-blue-600',
    text: 'bg-blue-100 text-blue-600',
    number: 'bg-green-100 text-green-600',
    boolean: 'bg-purple-100 text-purple-600',
    date: 'bg-yellow-100 text-yellow-600',
    email: 'bg-red-100 text-red-600',
    url: 'bg-indigo-100 text-indigo-600',
    file: 'bg-gray-100 text-gray-600',
    image: 'bg-pink-100 text-pink-600',
    files: 'bg-gray-100 text-gray-600',
    images: 'bg-pink-100 text-pink-600',
    json: 'bg-orange-100 text-orange-600'
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
}

function getFieldTypeBadgeColor(type: string) {
  const colors: Record<string, string> = {
    string: 'bg-blue-100 text-blue-800',
    text: 'bg-blue-100 text-blue-800',
    number: 'bg-green-100 text-green-800',
    boolean: 'bg-purple-100 text-purple-800',
    date: 'bg-yellow-100 text-yellow-800',
    email: 'bg-red-100 text-red-800',
    url: 'bg-indigo-100 text-indigo-800',
    file: 'bg-gray-100 text-gray-800',
    image: 'bg-pink-100 text-pink-800',
    files: 'bg-gray-100 text-gray-800',
    images: 'bg-pink-100 text-pink-800',
    json: 'bg-orange-100 text-orange-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

function generatePreviewJSON() {
  const fields: any = {};
  props.schemaFields.forEach(field => {
    if (field.name) {
      const fieldConfig: any = { type: field.type };
      if (field.required) fieldConfig.required = field.required;
      if (field.unique) fieldConfig.unique = field.unique;
      if (field.default) fieldConfig.default = field.default;
      if (field.maxLength) fieldConfig.maxLength = field.maxLength;
      if (field.min !== undefined) fieldConfig.min = field.min;
      if (field.max !== undefined) fieldConfig.max = field.max;
      fields[field.name] = fieldConfig;
    }
  });

  const relations: any = {};
  props.relationList.forEach(rel => {
    if (rel.field && rel.references) {
      relations[rel.field] = {
        type: rel.type,
        references: rel.references
      };
    }
  });

  return {
    name: props.form.name,
    schema: {
      fields,
      relations: Object.keys(relations).length > 0 ? relations : undefined,
      timestamps: props.form.schema.timestamps
    },
    auth_rules: {
      create: props.authCreateInput ? props.authCreateInput.split(',').map((s: string) => s.trim()) : [],
      read: props.authReadInput ? props.authReadInput.split(',').map((s: string) => s.trim()) : [],
      update: props.authUpdateInput ? props.authUpdateInput.split(',').map((s: string) => s.trim()) : [],
      delete: props.authDeleteInput ? props.authDeleteInput.split(',').map((s: string) => s.trim()) : []
    },
    metadata: {
      description: props.form.metadata?.description || ''
    },
    is_active: props.form.is_active
  };
}
</script>
