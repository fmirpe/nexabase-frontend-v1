<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden"
      @click.stop
    >
      <!-- Header Mejorado -->
      <div class="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 sticky top-0 z-40">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">
                {{ editingRecord ? "Editar Registro" : "Nuevo Registro" }}
              </h2>
              <p class="text-green-100 text-sm">
                Collection: <span class="font-medium">{{ collection?.name }}</span>
                {{ editingRecord ? `• ID: ${editingRecord.id}` : "" }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Progress Indicator -->
            <div class="hidden sm:flex items-center space-x-2 text-white text-sm">
              <div class="w-16 bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  class="bg-white h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${completionPercentage}%` }"
                ></div>
              </div>
              <span class="text-xs opacity-90">{{ completionPercentage }}%</span>
            </div>

            <!-- Quick Save -->
            <button
              v-if="canSave && !savingRecord"
              @click="emit('save')"
              class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 rounded-lg transition-all duration-200 flex items-center text-sm font-medium"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Guardar
            </button>

            <button
              @click="emit('close')"
              class="text-white hover:text-green-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex h-[calc(95vh-100px)]">
        <!-- Sidebar con Navegación de Campos - MEJORADO -->
        <div class="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div class="p-4 border-b border-gray-200 flex-shrink-0">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Campos del Formulario</h3>
            
            <!-- Resumen compacto -->
            <div class="grid grid-cols-3 gap-2 text-xs text-center mb-4">
              <div class="bg-white rounded-lg p-2 border">
                <div class="font-semibold text-gray-900">{{ totalFields }}</div>
                <div class="text-gray-500">Total</div>
              </div>
              <div class="bg-green-50 rounded-lg p-2 border border-green-200">
                <div class="font-semibold text-green-700">{{ completedFields }}</div>
                <div class="text-green-600">Completos</div>
              </div>
              <div class="bg-red-50 rounded-lg p-2 border border-red-200" v-if="fieldsWithErrors > 0">
                <div class="font-semibold text-red-700">{{ fieldsWithErrors }}</div>
                <div class="text-red-600">Errores</div>
              </div>
              <div class="bg-blue-50 rounded-lg p-2 border border-blue-200" v-else>
                <div class="font-semibold text-blue-700">{{ completedRequiredFields }}</div>
                <div class="text-blue-600">Requeridos</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                class="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
            <div class="text-xs text-gray-500 text-center">{{ completionPercentage }}% completado</div>
          </div>

          <!-- Lista de campos con scroll mejorado -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-2">
              <button
                v-for="(fieldDef, fieldName) in collection?.schema?.fields"
                :key="fieldName"
                @click="scrollToField(fieldName)"
                :class="[
                  'w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 text-left group hover:shadow-md',
                  getFieldValidationStatus(fieldName) === 'valid' 
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    : getFieldValidationStatus(fieldName) === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : recordForm[fieldName] && recordForm[fieldName] !== ''
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                ]"
              >
                <!-- Icon section mejorado -->
                <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0" :class="getFieldTypeColor(fieldDef.type)">
                  <component :is="getFieldTypeIcon(fieldDef.type)" class="w-5 h-5" />
                </div>
                
                <!-- Field info section -->
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate text-sm">{{ fieldName }}</div>
                  <div class="text-xs opacity-75 mt-0.5">{{ fieldDef.type }}</div>
                  
                  <!-- Tags mejorados -->
                  <div class="flex items-center space-x-1 mt-1">
                    <span v-if="fieldDef.required" class="inline-flex px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded">
                      req
                    </span>
                    <span v-if="fieldDef.unique" class="inline-flex px-1.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-600 rounded">
                      único
                    </span>
                    <span v-if="isRelationField(fieldName)" class="inline-flex px-1.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-600 rounded">
                      rel
                    </span>
                  </div>
                </div>

                <!-- Status indicator mejorado -->
                <div class="flex-shrink-0 ml-2">
                  <div class="w-4 h-4 rounded-full flex items-center justify-center" :class="getFieldStatusIndicator(fieldName)">
                    <!-- Check icon para campos válidos -->
                    <svg v-if="getFieldValidationStatus(fieldName) === 'valid'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <!-- X icon para campos con error -->
                    <svg v-else-if="getFieldValidationStatus(fieldName) === 'error'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <!-- Dot para otros estados -->
                    <div v-else class="w-2 h-2 rounded-full bg-current opacity-60"></div>
                  </div>
                </div>
              </button>
            </div>

            <!-- Estado vacío si no hay campos -->
            <div v-if="!collection?.schema?.fields || Object.keys(collection.schema.fields).length === 0" class="text-center py-8">
              <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-sm text-gray-500">No hay campos definidos</p>
            </div>
          </div>

          <!-- Footer del sidebar con acciones rápidas -->
          <div class="border-t border-gray-200 p-4 bg-white flex-shrink-0">
            <div class="text-xs text-gray-500 text-center mb-2">
              Navegación rápida
            </div>
            <div class="flex space-x-2">
              <button
                @click="scrollToTop"
                class="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded transition-colors"
              >
                ↑ Inicio
              </button>
              <button
                @click="scrollToBottom"
                class="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded transition-colors"
              >
                ↓ Final
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto bg-gray-50">
          <div class="p-6 pb-32">
            <div class="max-w-3xl mx-auto space-y-6">
              <!-- Dynamic Form Fields -->
              <div
                v-for="(fieldDef, fieldName) in collection?.schema?.fields"
                :key="fieldName"
                :id="`field-${fieldName}`"
                class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <!-- Field Header -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="getFieldTypeColor(fieldDef.type)">
                      <component :is="getFieldTypeIcon(fieldDef.type)" class="w-5 h-5" />
                    </div>
                    <div>
                      <label class="text-lg font-semibold text-gray-900">
                        {{ fieldName }}
                        <span v-if="fieldDef.required" class="text-red-500 ml-1">*</span>
                      </label>
                      <div class="flex items-center space-x-2 mt-1">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full" :class="getFieldTypeBadgeColor(fieldDef.type)">
                          {{ fieldDef.type }}
                        </span>
                        <span v-if="isRelationField(fieldName)" class="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          → {{ getRelationConfig(fieldName)?.references }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getFieldStatusIndicatorLarge(fieldName)">
                    <svg v-if="getFieldValidationStatus(fieldName) === 'valid'" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="getFieldValidationStatus(fieldName) === 'error'" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>

                <!-- Field Input Component -->
                <div class="space-y-4">
                  <!-- Relation Select (belongsTo) -->
                  <template v-if="isRelationField(fieldName)">
                    <div class="relative">
                      <select
                        :value="recordForm[fieldName]"
                        @change="updateField(fieldName, ($event.target as HTMLSelectElement).value)"
                        :required="fieldDef.required"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                      >
                        <option value="">-- Seleccionar {{ getRelationConfig(fieldName)?.references }} --</option>
                        <option 
                          v-for="option in getRelationOptions(fieldName)" 
                          :key="option.id" 
                          :value="option.id"
                        >
                          {{ option.display }}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </template>

                  <!-- String/Email/URL Input -->
                  <template v-else-if="['string', 'email', 'url'].includes(fieldDef.type)">
                    <div class="relative">
                      <input
                        :value="recordForm[fieldName]"
                        @input="updateField(fieldName, ($event.target as HTMLInputElement).value)"
                        :type="fieldDef.type === 'email' ? 'email' : fieldDef.type === 'url' ? 'url' : 'text'"
                        :required="fieldDef.required"
                        :maxlength="fieldDef.maxLength"
                        :placeholder="`Ingrese ${fieldName}...`"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                      <div v-if="fieldDef.maxLength" class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-xs text-gray-400">
                          {{ (recordForm[fieldName] || '').length }}/{{ fieldDef.maxLength }}
                        </span>
                      </div>
                    </div>
                  </template>

                  <!-- Number Input -->
                  <template v-else-if="fieldDef.type === 'number'">
                    <div class="relative">
                      <input
                        :value="recordForm[fieldName]"
                        @input="updateField(fieldName, Number(($event.target as HTMLInputElement).value))"
                        type="number"
                        :required="fieldDef.required"
                        :min="fieldDef.min"
                        :max="fieldDef.max"
                        :placeholder="`Ingrese ${fieldName}...`"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                      <div v-if="fieldDef.min !== undefined || fieldDef.max !== undefined" class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-xs text-gray-400">
                          {{ fieldDef.min !== undefined && fieldDef.max !== undefined 
                            ? `${fieldDef.min}-${fieldDef.max}` 
                            : fieldDef.min !== undefined 
                            ? `≥${fieldDef.min}` 
                            : `≤${fieldDef.max}` }}
                        </span>
                      </div>
                    </div>
                  </template>

                  <!-- Boolean Select -->
                  <template v-else-if="fieldDef.type === 'boolean'">
                    <div class="flex items-center space-x-4">
                      <label class="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          :name="`${fieldName}_boolean`"
                          :checked="recordForm[fieldName] === true"
                          @change="updateField(fieldName, true)"
                          class="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span class="ml-2 text-sm font-medium text-gray-700">Verdadero</span>
                      </label>
                      <label class="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          :name="`${fieldName}_boolean`"
                          :checked="recordForm[fieldName] === false"
                          @change="updateField(fieldName, false)"
                          class="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <span class="ml-2 text-sm font-medium text-gray-700">Falso</span>
                      </label>
                    </div>
                  </template>

                  <!-- Date Input -->
                  <template v-else-if="fieldDef.type === 'date'">
                    <input
                      :value="recordForm[fieldName]"
                      @input="updateField(fieldName, ($event.target as HTMLInputElement).value)"
                      type="datetime-local"
                      :required="fieldDef.required"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </template>

                  <!-- Text Area -->
                  <template v-else-if="fieldDef.type === 'text'">
                    <div class="relative">
                      <textarea
                        :value="recordForm[fieldName]"
                        @input="updateField(fieldName, ($event.target as HTMLTextAreaElement).value)"
                        :required="fieldDef.required"
                        :maxlength="fieldDef.maxLength"
                        rows="4"
                        :placeholder="`Ingrese ${fieldName}...`"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                      ></textarea>
                      <div v-if="fieldDef.maxLength" class="absolute bottom-3 right-3">
                        <span class="text-xs text-gray-400">
                          {{ (recordForm[fieldName] || '').length }}/{{ fieldDef.maxLength }}
                        </span>
                      </div>
                    </div>
                  </template>

                  <!-- JSON Input -->
                  <template v-else-if="fieldDef.type === 'json'">
                    <div class="space-y-3">
                      <div class="relative">
                        <textarea
                          :value="recordForm[`${fieldName}_jsonstring`]"
                          @input="updateJsonField(fieldName, ($event.target as HTMLTextAreaElement).value)"
                          :required="fieldDef.required"
                          rows="6"
                          placeholder='{"key": "value", "number": 123}'
                          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm transition-colors"
                        ></textarea>
                        <div class="absolute top-3 right-3">
                          <span v-if="!jsonErrors[fieldName]" class="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                            Válido
                          </span>
                          <span v-else class="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            Error
                          </span>
                        </div>
                      </div>
                      <p v-if="jsonErrors[fieldName]" class="text-red-600 text-sm">
                        {{ jsonErrors[fieldName] }}
                      </p>
                    </div>
                  </template>

                  <!-- File Upload -->
                  <template v-else-if="fieldDef.type === 'file'">
                    <FileUploadField
                      :field-name="fieldName"
                      :current-value="recordForm[fieldName]"
                      :upload-progress="uploadProgress[fieldName]"
                      :is-multiple="false"
                      :accept-types="'*/*'"
                      @file-upload="handleFileUpload($event, fieldName, false)"
                      @file-remove="removeFile(fieldName)"
                    />
                  </template>

                  <!-- Image Upload -->
                  <template v-else-if="fieldDef.type === 'image'">
                    <ImageUploadField
                      :field-name="fieldName"
                      :current-value="recordForm[fieldName]"
                      :upload-progress="uploadProgress[fieldName]"
                      :is-multiple="false"
                      @file-upload="handleFileUpload($event, fieldName, false)"
                      @file-remove="removeFile(fieldName)"
                    />
                  </template>

                  <!-- Multiple Files Upload -->
                  <template v-else-if="fieldDef.type === 'files'">
                    <FileUploadField
                      :field-name="fieldName"
                      :current-value="recordForm[fieldName]"
                      :upload-progress="uploadProgress[fieldName]"
                      :is-multiple="true"
                      :accept-types="'*/*'"
                      @file-upload="handleFileUpload($event, fieldName, true)"
                      @file-remove="removeFileFromArray(fieldName, $event)"
                    />
                  </template>

                  <!-- Multiple Images Upload -->
                  <template v-else-if="fieldDef.type === 'images'">
                    <ImageUploadField
                      :field-name="fieldName"
                      :current-value="recordForm[fieldName]"
                      :upload-progress="uploadProgress[fieldName]"
                      :is-multiple="true"
                      @file-upload="handleFileUpload($event, fieldName, true)"
                      @file-remove="removeFileFromArray(fieldName, $event)"
                    />
                  </template>

                  <!-- Default fallback -->
                  <template v-else>
                    <input
                      :value="recordForm[fieldName]"
                      @input="updateField(fieldName, ($event.target as HTMLInputElement).value)"
                      type="text"
                      :required="fieldDef.required"
                      :placeholder="`Ingrese ${fieldName}... (${fieldDef.type})`"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </template>

                  <!-- Field Help Text -->
                  <div v-if="getFieldHelpText(fieldDef)" class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {{ getFieldHelpText(fieldDef) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con Acciones -->
      <div class="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between sticky bottom-0 shadow-lg">
        <div class="flex items-center space-x-4">
          <button
            @click="emit('close')"
            class="px-6 py-2 text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          
          <div class="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{{ completedFields }} completados</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>{{ fieldsWithErrors }} con errores</span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Validation Summary -->
          <div v-if="!canSave" class="hidden sm:flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>Completa los campos requeridos</span>
          </div>

          <!-- Save Button -->
          <button
            @click="emit('save')"
            :disabled="savingRecord || !canSave"
            class="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg v-if="savingRecord" class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ savingRecord ? 'Guardando...' : (editingRecord ? 'Actualizar Registro' : 'Crear Registro') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch, onMounted, nextTick } from 'vue';
import { recordsAPI, storageAPI } from '../../../services/api';
import FileUploadField from './FileUploadField.vue';
import ImageUploadField from './ImageUploadField.vue';

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

// Computed properties para el progreso
const totalFields = computed(() => 
  Object.keys(props.collection?.schema?.fields || {}).length
);

const completedFields = computed(() => 
  Object.keys(props.collection?.schema?.fields || {}).filter(fieldName => {
    const value = props.recordForm[fieldName];
    return value !== null && value !== undefined && value !== '';
  }).length
);

const totalRequiredFields = computed(() => 
  Object.entries(props.collection?.schema?.fields || {}).filter(([_, fieldDef]: [string, any]) => 
    fieldDef.required
  ).length
);

const completedRequiredFields = computed(() => 
  Object.entries(props.collection?.schema?.fields || {}).filter(([fieldName, fieldDef]: [string, any]) => {
    if (!fieldDef.required) return false;
    const value = props.recordForm[fieldName];
    return value !== null && value !== undefined && value !== '';
  }).length
);

const fieldsWithErrors = computed(() => 
  Object.keys(props.jsonErrors || {}).length
);

const completionPercentage = computed(() => {
  if (totalFields.value === 0) return 100;
  return Math.round((completedFields.value / totalFields.value) * 100);
});

const canSave = computed(() => {
  // Todos los campos requeridos deben estar completados
  const requiredFieldsComplete = Object.entries(props.collection?.schema?.fields || {}).every(([fieldName, fieldDef]: [string, any]) => {
    if (!fieldDef.required) return true;
    const value = props.recordForm[fieldName];
    return value !== null && value !== undefined && value !== '';
  });

  // No debe haber errores de JSON
  const noJsonErrors = Object.keys(props.jsonErrors || {}).length === 0;

  return requiredFieldsComplete && noJsonErrors;
});

// Funciones de utilidad
function updateField(fieldName: string, value: any) {
  props.recordForm[fieldName] = value;
}

function updateJsonField(fieldName: string, jsonString: string) {
  props.recordForm[`${fieldName}_jsonstring`] = jsonString;
  emit('validate-json', fieldName);
}

function scrollToField(fieldName: string) {
  nextTick(() => {
    const element = document.getElementById(`field-${fieldName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function scrollToTop() {
  const mainContent = document.querySelector('.flex-1.overflow-y-auto');
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function scrollToBottom() {
  const mainContent = document.querySelector('.flex-1.overflow-y-auto');
  if (mainContent) {
    mainContent.scrollTo({ top: mainContent.scrollHeight, behavior: 'smooth' });
  }
}

function getFieldValidationStatus(fieldName: string): 'valid' | 'error' | 'incomplete' | 'empty' {
  const fieldDef = props.collection?.schema?.fields?.[fieldName];
  const value = props.recordForm[fieldName];
  
  // Si hay error de JSON
  if (props.jsonErrors?.[fieldName]) return 'error';
  
  // Si es requerido y está vacío
  if (fieldDef?.required && (value === null || value === undefined || value === '')) {
    return 'error';
  }
  
  // Si tiene valor
  if (value !== null && value !== undefined && value !== '') {
    return 'valid';
  }
  
  return 'empty';
}

function getFieldStatusIndicator(fieldName: string): string {
  const status = getFieldValidationStatus(fieldName);
  switch (status) {
    case 'valid': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    case 'incomplete': return 'bg-yellow-500';
    default: return 'bg-gray-300';
  }
}

function getFieldStatusIndicatorLarge(fieldName: string): string {
  const status = getFieldValidationStatus(fieldName);
  switch (status) {
    case 'valid': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    case 'incomplete': return 'bg-yellow-500';
    default: return 'bg-gray-200';
  }
}

// Funciones de iconos y colores (iguales al CreateCollectionModal)
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

// Funciones para relaciones
function isRelationField(fieldName: string): boolean {
  const relations = props.collection?.schema?.relations;
  if (!relations || !relations[fieldName]) return false;
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
      
      if (config.type === 'belongs_to') {
        const referencedCollection = config.references;
        
        try {
          const response = await recordsAPI.getAll(referencedCollection, { page: 1, limit: 200 });
          const responseData = response.data as any;
          const records = responseData?.data || responseData;
          
          relationOptions.value[fieldName] = records.map((record: any) => {
            const displayField = config.displayfield || 'name';
            const display = record[displayField] || record.name || record.title || record.email || record.id || 'Sin nombre';
            
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

// Funciones para archivos
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
      if (fileId) props.recordForm[fieldName] = fileId;
      props.uploadProgress[fieldName] = 100;
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
    const response = await storageAPI.upload(
      file,
      `folder/${props.collection.name}`,
      { collection: props.collection.name }
    );
    const responseData = response.data as any;
    const fileId = responseData?.data?.id || responseData?.id;
    return fileId || null;
  } catch (error) {
    console.error('Error uploading single file:', error);
    throw error;
  }
}

function removeFile(fieldName: string) {
  props.recordForm[fieldName] = null;
}

function removeFileFromArray(fieldName: string, index: number) {
  const currentFiles = props.recordForm[fieldName] || [];
  currentFiles.splice(index, 1);
  props.recordForm[fieldName] = [...currentFiles];
}

function getFieldHelpText(fieldDef: any): string {
  const hints: string[] = [];
  
  if (fieldDef.required) hints.push('Obligatorio');
  if (fieldDef.unique) hints.push('Debe ser único');
  if (fieldDef.maxLength) hints.push(`Máximo ${fieldDef.maxLength} caracteres`);
  if (fieldDef.min !== undefined && fieldDef.max !== undefined) {
    hints.push(`Entre ${fieldDef.min} y ${fieldDef.max}`);
  } else if (fieldDef.min !== undefined) {
    hints.push(`Mínimo ${fieldDef.min}`);
  } else if (fieldDef.max !== undefined) {
    hints.push(`Máximo ${fieldDef.max}`);
  }
  if (fieldDef.default !== undefined) hints.push(`Por defecto: ${fieldDef.default}`);
  
  return hints.join(' • ');
}

// Watch para cargar relaciones cuando cambia la collection
watch(() => props.collection, async (newCollection) => {
  if (newCollection?.schema?.relations) {
    await loadRelationOptions(newCollection.schema.relations);
  }
}, { immediate: true });
</script>
