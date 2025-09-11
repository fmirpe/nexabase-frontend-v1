<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Collections</h1>
        <p class="mt-2 text-sm text-gray-600">
          Gestiona tus collections de datos y esquemas
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <button
          @click="openCreate"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nueva Collection
        </button>
        <button
          @click="refreshCollections"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Refrescar"
        >
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar collections..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
          <select
            v-model.number="meta.limit"
            @change="goToPage(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Límite por página"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error/Loading -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4"
    >
      {{ error }}
    </div>
    <div v-if="loading" class="bg-white border border-gray-200 rounded-lg p-4">
      Cargando collections...
    </div>

    <!-- Grid -->
    <div
      v-if="!loading && filteredCollections.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="collection in filteredCollections"
        :key="collection.id"
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center mr-3',
                collection.is_active
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ collection.name }}</h3>
              <p class="text-sm text-gray-500">
                {{ collection.record_count }} registros
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <button
              @click="openEditCollection(collection.name)"
              class="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="Editar"
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
              @click="confirmDeleteCollection(collection.name)"
              class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Eliminar"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-600 mb-2">
          {{
            collection.metadata && (collection.metadata as any).description
              ? (collection.metadata as any).description
              : "Sin descripción"
          }}
        </p>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <span class="text-gray-500"
              >Creado: {{ formatDate(collection.created_at) }}</span
            >
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              collection.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800',
            ]"
            >{{ collection.is_active ? "Activa" : "Inactiva" }}</span
          >
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
          <button
            @click="viewCollection(collection)"
            class="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors col-span-2"
          >
            Ver Datos
          </button>
          <button
            @click="openInsertRecord(collection)"
            class="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-lg transition-colors"
          >
            Nuevo
          </button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!loading" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay collections</h3>
      <p class="mt-1 text-sm text-gray-500">
        Comienza creando tu primera collection de datos.
      </p>
      <div class="mt-6">
        <button
          @click="openCreate"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nueva Collection
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && meta.pages > 1"
      class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
    >
      <div class="text-sm text-gray-600">
        Página {{ meta.page }} de {{ meta.pages }} • {{ meta.total }} total
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(meta.page - 1)"
          :disabled="meta.page <= 1"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          @click="goToPage(meta.page + 1)"
          :disabled="meta.page >= meta.pages"
          class="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Create/Edit Collection Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-6 mx-auto p-5 w-full max-w-2xl shadow-lg rounded-md bg-white border"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ isEditing ? "Editar Collection" : "Nueva Collection" }}
        </h3>

        <div
          v-if="formError"
          class="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3"
        >
          <span v-if="Array.isArray(formError)">{{
            formError.join(" | ")
          }}</span>
          <span v-else>{{ formError }}</span>
        </div>

        <div class="grid grid-cols-1 gap-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Nombre</label
              >
              <input
                v-model.trim="form.name"
                :disabled="isEditing"
                type="text"
                placeholder="ej: products"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">
                Debe iniciar con letra y usar solo letras, números y guion bajo.
              </p>
            </div>
            <div class="flex items-end">
              <label
                class="inline-flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  v-model="form.is_active"
                  class="rounded border-gray-300"
                  disabled
                />
                Activa (solo lectura)
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Descripción (metadata)</label
            >
            <textarea
              v-model="form.metadata.description"
              rows="2"
              placeholder="Describe el propósito..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                v-model="form.schema.timestamps"
                class="rounded border-gray-300"
              />
              timestamps
            </label>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Índices (opcional)</label
              >
              <input
                v-model="indexesInput"
                type="text"
                placeholder="ej: idx_name, idx_price"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">
                Separados por coma. Se enviarán como array.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Reglas CREATE</label
              >
              <input
                v-model="authCreateInput"
                type="text"
                placeholder="authenticated, admin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Reglas READ</label
              >
              <input
                v-model="authReadInput"
                type="text"
                placeholder="public"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Reglas UPDATE</label
              >
              <input
                v-model="authUpdateInput"
                type="text"
                placeholder="owner, admin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Reglas DELETE</label
              >
              <input
                v-model="authDeleteInput"
                type="text"
                placeholder="admin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-semibold text-gray-800">Campos</h4>
              <button
                @click="addField"
                type="button"
                class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Agregar campo
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="(f, idx) in fieldList"
                :key="f._id"
                class="border rounded-lg p-3"
              >
                <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >Nombre</label
                    >
                    <input
                      v-model.trim="f.name"
                      type="text"
                      placeholder="name"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >Tipo</label
                    >
                    <select
                      v-model="f.type"
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
                    </select>
                  </div>
                  <div class="flex items-center gap-2">
                    <label
                      class="inline-flex items-center gap-1 text-xs text-gray-700"
                      ><input
                        type="checkbox"
                        v-model="f.required"
                        class="rounded border-gray-300"
                      />
                      required</label
                    >
                    <label
                      class="inline-flex items-center gap-1 text-xs text-gray-700"
                      ><input
                        type="checkbox"
                        v-model="f.unique"
                        class="rounded border-gray-300"
                      />
                      unique</label
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >default</label
                    >
                    <input
                      v-model="f.default"
                      type="text"
                      placeholder="opcional"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div class="flex items-center justify-end">
                    <button
                      @click="removeField(idx)"
                      class="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >maxLength</label
                    >
                    <input
                      v-model.number="f.maxLength"
                      type="number"
                      min="1"
                      placeholder="p/ string"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >min</label
                    >
                    <input
                      v-model.number="f.min"
                      type="number"
                      placeholder="p/ number"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1"
                      >max</label
                    >
                    <input
                      v-model.number="f.max"
                      type="number"
                      placeholder="p/ number"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <p v-if="fieldList.length === 0" class="text-xs text-gray-500">
                Agrega al menos un campo.
              </p>
            </div>
          </div>

          <div class="flex gap-3 mt-2">
            <button
              @click="closeModal"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              v-if="!isEditing"
              @click="submitCreateCollection"
              :disabled="creating"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
            >
              {{ creating ? "Creando..." : "Crear" }}
            </button>
            <button
              v-else
              @click="submitUpdateCollection"
              :disabled="creating"
              class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-medium rounded-lg transition-colors"
            >
              {{ creating ? "Actualizando..." : "Actualizar" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete collection confirm -->
    <div
      v-if="showDeleteCollection"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center"
      @click="showDeleteCollection = false"
    >
      <div class="bg-white border rounded-lg p-6 w-full max-w-md" @click.stop>
        <h4 class="text-lg font-semibold text-gray-900">Eliminar Collection</h4>
        <p class="text-sm text-gray-600 mt-2">
          ¿Seguro que deseas eliminar "{{ pendingDeleteCollection }}"? Esta
          acción no se puede deshacer.
        </p>
        <div class="flex gap-3 mt-6">
          <button
            @click="showDeleteCollection = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            @click="submitDeleteCollection"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded"
          >
            {{ deleting ? "Eliminando..." : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Insert Record Modal -->
    <div
      v-if="insertOpen"
      class="fixed inset-0 bg-gray-800/40 z-50"
      @click="closeInsert"
    >
      <div
        class="bg-white border rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-12 p-5"
        @click.stop
      >
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-semibold text-gray-900">
            Nuevo registro: {{ insertTitle }}
          </h4>
          <button
            @click="closeInsert"
            class="px-2 py-1 rounded hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>

        <div
          v-if="insertError"
          class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-3"
        >
          <span v-if="Array.isArray(insertError)">{{
            insertError.join(" | ")
          }}</span>
          <span v-else>{{ insertError }}</span>
        </div>

        <div class="space-y-4">
          <div
            v-for="def in insertFields"
            :key="def.name"
            class="grid grid-cols-1 gap-1"
          >
            <label class="text-sm font-medium text-gray-700">
              {{ def.name }}
              <span v-if="def.required" class="text-red-500">*</span>
            </label>

            <template v-if="def.type === 'text'">
              <textarea
                v-model="insertModel[def.name]"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </template>
            <template v-else-if="def.type === 'boolean'">
              <label
                class="inline-flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  v-model="insertModel[def.name]"
                  class="rounded border-gray-300"
                />
                {{ insertModel[def.name] ? "true" : "false" }}
              </label>
            </template>
            <template v-else-if="def.type === 'number'">
              <input
                type="number"
                v-model.number="insertModel[def.name]"
                :min="def.min ?? undefined"
                :max="def.max ?? undefined"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </template>
            <template v-else-if="def.type === 'date'">
              <input
                type="datetime-local"
                v-model="insertModel[def.name]"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </template>
            <template v-else-if="def.type === 'json'">
              <textarea
                v-model="insertJsonBuffers[def.name]"
                rows="4"
                class="w-full px-3 py-2 font-mono text-xs border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder='{"key":"value"}'
              ></textarea>
            </template>
            <template v-else>
              <input
                type="text"
                v-model="insertModel[def.name]"
                :maxlength="def.maxLength ?? undefined"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </template>

            <p
              v-if="def.maxLength && def.type === 'string'"
              class="text-xs text-gray-500"
            >
              Max {{ def.maxLength }} chars
            </p>
            <p
              v-if="typeof def.min === 'number' && def.type === 'number'"
              class="text-xs text-gray-500"
            >
              Min {{ def.min }}
            </p>
            <p
              v-if="typeof def.max === 'number' && def.type === 'number'"
              class="text-xs text-gray-500"
            >
              Max {{ def.max }}
            </p>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="closeInsert"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancelar
            </button>
            <button
              @click="submitInsert"
              :disabled="inserting"
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded"
            >
              {{ inserting ? "Guardando..." : "Guardar" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Browser Modal -->
    <div
      v-if="browseOpen"
      class="fixed inset-0 bg-gray-800/40 z-50"
      @click="browseOpen = false"
    >
      <div
        class="bg-white border rounded-lg shadow-lg w-full max-w-5xl mx-auto mt-16 p-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-semibold text-gray-900">{{ browseTitle }}</h4>
          <button
            @click="browseOpen = false"
            class="px-2 py-1 rounded hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>

        <div
          v-if="browseError"
          class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-3"
        >
          {{ browseError }}
        </div>

        <div v-else>
          <div v-if="browseRows.length === 0" class="text-sm text-gray-600">
            Sin registros
          </div>

          <div v-else class="overflow-auto max-h-[60vh] border rounded">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-3 py-2 text-left text-gray-600">ID</th>
                  <th
                    v-for="col in visibleColumns"
                    :key="col"
                    class="px-3 py-2 text-left text-gray-600"
                  >
                    {{ col }}
                  </th>
                  <th class="px-3 py-2 text-right text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in browseRows" :key="row.id" class="border-t">
                  <td class="px-3 py-2 font-mono text-xs">{{ row.id }}</td>
                  <td
                    v-for="col in visibleColumns"
                    :key="col"
                    class="px-3 py-2"
                  >
                    <span v-if="isPrimitive(row[col])">{{
                      renderCell(row[col])
                    }}</span>
                    <pre v-else class="text-xs bg-gray-50 border rounded p-2">{{
                      JSON.stringify(row[col], null, 2)
                    }}</pre>
                  </td>
                  <td class="px-3 py-2 text-right space-x-2">
                    <button
                      @click="openViewRecord(currentCollectionName, row.id)"
                      class="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                    >
                      Ver
                    </button>
                    <button
                      @click="openEditRecord(currentCollectionName, row.id)"
                      class="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200"
                    >
                      Editar
                    </button>
                    <button
                      @click="
                        confirmDeleteRecord(currentCollectionName, row.id)
                      "
                      class="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="browseMeta" class="text-xs text-gray-600 mt-2">
            Total: {{ browseMeta.total ?? browseRows.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- View/Edit Record Modal -->
    <div
      v-if="recordOpen"
      class="fixed inset-0 bg-gray-800/40 z-50"
      @click="closeRecord"
    >
      <div
        class="bg-white border rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-12 p-5"
        @click.stop
      >
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-semibold text-gray-900">
            {{ recordMode === "view" ? "Ver" : "Editar" }} registro:
            {{ recordTitle }}
          </h4>
          <button
            @click="closeRecord"
            class="px-2 py-1 rounded hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>

        <div
          v-if="recordError"
          class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-3"
        >
          <span v-if="Array.isArray(recordError)">{{
            recordError.join(" | ")
          }}</span>
          <span v-else>{{ recordError }}</span>
        </div>

        <div v-if="recordMode === 'view'">
          <pre
            class="text-xs bg-gray-50 border rounded p-3 overflow-auto max-h-[60vh]"
            >{{ JSON.stringify(recordData, null, 2) }}</pre
          >
        </div>

        <div v-else>
          <div class="space-y-4">
            <div
              v-for="def in recordFields"
              :key="def.name"
              class="grid grid-cols-1 gap-1"
            >
              <label class="text-sm font-medium text-gray-700">
                {{ def.name }}
                <span v-if="def.required" class="text-red-500">*</span>
              </label>

              <template v-if="def.type === 'text'">
                <textarea
                  v-model="recordModel[def.name]"
                  rows="3"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </template>
              <template v-else-if="def.type === 'boolean'">
                <label
                  class="inline-flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    v-model="recordModel[def.name]"
                    class="rounded border-gray-300"
                  />
                  {{ recordModel[def.name] ? "true" : "false" }}
                </label>
              </template>
              <template v-else-if="def.type === 'number'">
                <input
                  type="number"
                  v-model.number="recordModel[def.name]"
                  :min="def.min ?? undefined"
                  :max="def.max ?? undefined"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </template>
              <template v-else-if="def.type === 'date'">
                <input
                  type="datetime-local"
                  v-model="recordModel[def.name]"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </template>
              <template v-else-if="def.type === 'json'">
                <textarea
                  v-model="recordJsonBuffers[def.name]"
                  rows="4"
                  class="w-full px-3 py-2 font-mono text-xs border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder='{"key":"value"}'
                ></textarea>
              </template>
              <template v-else>
                <input
                  type="text"
                  v-model="recordModel[def.name]"
                  :maxlength="def.maxLength ?? undefined"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </template>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="closeRecord"
                class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                @click="submitUpdateRecord"
                :disabled="recordSaving"
                class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white rounded"
              >
                {{ recordSaving ? "Guardando..." : "Guardar cambios" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete record confirm -->
    <div
      v-if="deleteRecordOpen"
      class="fixed inset-0 bg-gray-800/40 z-50 flex items-center justify-center"
      @click="deleteRecordOpen = false"
    >
      <div class="bg-white border rounded-lg p-6 w-full max-w-md" @click.stop>
        <h4 class="text-lg font-semibold text-gray-900">Eliminar registro</h4>
        <p class="text-sm text-gray-600 mt-2">
          ¿Seguro que deseas eliminar este registro? Esta acción no se puede
          deshacer.
        </p>
        <div class="flex gap-3 mt-6">
          <button
            @click="deleteRecordOpen = false"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            @click="submitDeleteRecord"
            :disabled="recordDeleting"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded"
          >
            {{ recordDeleting ? "Eliminando..." : "Eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { adminCollections, dynamicCollections } from "../../services/api";

// Tipos base
type JsonMap = Record<string, unknown>;
interface CollectionDto {
  id: string;
  name: string;
  schema: JsonMap;
  auth_rules: JsonMap | null;
  is_active: boolean;
  record_count: number;
  created_at: string;
  updated_at: string;
  metadata: JsonMap | null;
}
interface PageMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
interface PagedResponse<T> {
  data: T[];
  meta: PageMeta;
}

// Listado y filtros
const collections = ref<CollectionDto[]>([]);
const meta = ref<PageMeta>({ page: 1, limit: 10, total: 0, pages: 0 });
const loading = ref(false);
const creating = ref(false);
const deleting = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref("");
const selectedFilter = ref<"all" | "active" | "inactive">("all");

const filteredCollections = computed(() => {
  let rows = collections.value.slice();
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    rows = rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        ((c.metadata as any)?.description || "").toLowerCase().includes(q)
    );
  }
  if (selectedFilter.value !== "all") {
    rows = rows.filter(
      (c) => c.is_active === (selectedFilter.value === "active")
    );
  }
  return rows;
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const schemaFieldCount = (schema: JsonMap) => {
  const s = schema as any;
  if (s?.fields && typeof s.fields === "object")
    return Object.keys(s.fields).length;
  return Object.keys(schema || {}).length;
};
const firstSchemaFields = (schema: JsonMap, take: number) => {
  const s = schema as any;
  const keys =
    s?.fields && typeof s.fields === "object"
      ? Object.keys(s.fields)
      : Object.keys(schema || {});
  return keys.slice(0, take);
};

async function loadCollections() {
  loading.value = true;
  error.value = null;
  try {
    const params: any = { page: meta.value.page, limit: meta.value.limit };
    if (searchQuery.value) params.q = searchQuery.value;
    const { data } = await adminCollections.list(params);
    const res = data as PagedResponse<CollectionDto>;
    collections.value = res.data;
    meta.value = res.meta;
  } catch (e: any) {
    error.value =
      e?.response?.data?.message || e?.message || "Error cargando collections";
  } finally {
    loading.value = false;
  }
}

async function refreshCollections() {
  await loadCollections();
}

function goToPage(page: number) {
  if (page >= 1 && page <= meta.value.pages) {
    meta.value.page = page;
    loadCollections();
  }
}

// ===================== Create/Edit Collection =====================
type FieldRow = {
  _id: string;
  name: string;
  type:
    | "string"
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "json"
    | "email"
    | "url";
  required?: boolean;
  unique?: boolean;
  default?: any;
  maxLength?: number;
  min?: number;
  max?: number;
};

const showModal = ref(false);
const isEditing = ref(false);
const formError = ref<any>(null);

const form = ref<{
  name: string;
  is_active: boolean;
  schema: {
    fields: Record<string, any>;
    timestamps?: boolean;
    indexes?: string[];
  };
  auth_rules: {
    create: string[];
    read: string[];
    update: string[];
    delete: string[];
  };
  metadata: { description?: string; [k: string]: any };
}>({
  name: "",
  is_active: true,
  schema: { fields: {}, timestamps: true, indexes: [] },
  auth_rules: {
    create: ["authenticated"],
    read: ["public"],
    update: ["owner", "admin"],
    delete: ["admin"],
  },
  metadata: { description: "" },
});
const fieldList = ref<FieldRow[]>([
  {
    _id: cryptoRandomId(),
    name: "name",
    type: "string",
    required: true,
    maxLength: 100,
  },
]);
const indexesInput = ref("");
const authCreateInput = ref("authenticated");
const authReadInput = ref("public");
const authUpdateInput = ref("owner, admin");
const authDeleteInput = ref("admin");

function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function addField() {
  fieldList.value.push({ _id: cryptoRandomId(), name: "", type: "string" });
}
function removeField(i: number) {
  fieldList.value.splice(i, 1);
}

function openCreate() {
  resetCollectionForm();
  isEditing.value = false;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
  formError.value = null;
}
function resetCollectionForm() {
  formError.value = null;
  form.value = {
    name: "",
    is_active: true,
    schema: { fields: {}, timestamps: true, indexes: [] },
    auth_rules: {
      create: ["authenticated"],
      read: ["public"],
      update: ["owner", "admin"],
      delete: ["admin"],
    },
    metadata: { description: "" },
  };
  fieldList.value = [
    {
      _id: cryptoRandomId(),
      name: "name",
      type: "string",
      required: true,
      maxLength: 100,
    },
  ];
  indexesInput.value = "";
  authCreateInput.value = "authenticated";
  authReadInput.value = "public";
  authUpdateInput.value = "owner, admin";
  authDeleteInput.value = "admin";
}

function toArrayFromCsv(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}
function guessDefaultValueField(f: FieldRow) {
  if (f.default === "" || f.default === undefined) return undefined;
  switch (f.type) {
    case "number":
      return Number(f.default);
    case "boolean":
      if (typeof f.default === "boolean") return f.default;
      if (typeof f.default === "string")
        return ["true", "1", "yes", "on"].includes(f.default.toLowerCase());
      return !!f.default;
    case "json":
      try {
        return JSON.parse(String(f.default));
      } catch {
        return f.default;
      }
    case "date":
      return String(f.default);
    default:
      return String(f.default);
  }
}
function buildSchemaFieldsFromUI() {
  const fields: Record<string, any> = {};
  for (const f of fieldList.value) {
    const fname = f.name.trim();
    if (!fname) continue;
    const entry: any = { type: f.type };
    if (f.required) entry.required = true;
    if (f.unique) entry.unique = true;
    if (f.default !== undefined && f.default !== "")
      entry.default = guessDefaultValueField(f);
    if (typeof f.maxLength === "number") entry.maxLength = f.maxLength;
    if (typeof f.min === "number") entry.min = f.min;
    if (typeof f.max === "number") entry.max = f.max;
    fields[fname] = entry;
  }
  return fields;
}
function buildAuthRulesFromUI() {
  return {
    create: toArrayFromCsv(authCreateInput.value),
    read: toArrayFromCsv(authReadInput.value),
    update: toArrayFromCsv(authUpdateInput.value),
    delete: toArrayFromCsv(authDeleteInput.value),
  };
}

function buildCreateCollectionPayload() {
  const name = form.value.name.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    formError.value =
      "El nombre debe iniciar con letra y solo contener letras, números y guion bajo";
    return null;
  }
  const fields = buildSchemaFieldsFromUI();
  if (Object.keys(fields).length === 0) {
    formError.value = "Agrega al menos un campo al schema";
    return null;
  }
  const idx = toArrayFromCsv(indexesInput.value);
  return {
    name,
    schema: {
      fields,
      timestamps: !!form.value.schema.timestamps,
      indexes: idx.length ? idx : undefined,
    },
    auth_rules: buildAuthRulesFromUI(),
    metadata: form.value.metadata?.description
      ? { description: form.value.metadata.description }
      : undefined,
  };
}
function buildUpdateCollectionPayload() {
  const fields = buildSchemaFieldsFromUI();
  const idx = toArrayFromCsv(indexesInput.value);
  const body: any = {};
  body.schema = {
    fields,
    timestamps: !!form.value.schema.timestamps,
    ...(idx.length ? { indexes: idx } : {}),
  };
  body.auth_rules = buildAuthRulesFromUI();
  if (
    form.value.metadata?.description &&
    form.value.metadata.description.trim().length > 0
  ) {
    body.metadata = { description: form.value.metadata.description.trim() };
  }
  return body;
}

async function submitCreateCollection() {
  creating.value = true;
  error.value = null;
  try {
    const payload = buildCreateCollectionPayload();
    if (!payload) return;
    await adminCollections.create(payload as any);
    closeModal();
    await loadCollections();
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Create collection error:", server || e);
    formError.value =
      server?.message || e?.message || "Error creando collection";
  } finally {
    creating.value = false;
  }
}

async function openEditCollection(name: string) {
  try {
    const { data } = await adminCollections.getByName(name);
    const dto = data as CollectionDto;
    form.value.name = dto.name;
    form.value.is_active = dto.is_active;
    const s = dto.schema as any;
    form.value.schema.timestamps = !!s?.timestamps;
    form.value.schema.indexes = Array.isArray(s?.indexes) ? s.indexes : [];
    indexesInput.value = (form.value.schema.indexes || []).join(", ");
    fieldList.value = [];
    const fobj = s?.fields || {};
    for (const key of Object.keys(fobj)) {
      const def = fobj[key];
      fieldList.value.push({
        _id: cryptoRandomId(),
        name: key,
        type: def.type,
        required: !!def.required,
        unique: !!def.unique,
        default: def.default,
        maxLength:
          typeof def.maxLength === "number" ? def.maxLength : undefined,
        min: typeof def.min === "number" ? def.min : undefined,
        max: typeof def.max === "number" ? def.max : undefined,
      });
    }
    if (fieldList.value.length === 0)
      fieldList.value.push({
        _id: cryptoRandomId(),
        name: "name",
        type: "string",
        required: true,
        maxLength: 100,
      });
    const ar = dto.auth_rules as any;
    authCreateInput.value = Array.isArray(ar?.create)
      ? ar.create.join(", ")
      : "authenticated";
    authReadInput.value = Array.isArray(ar?.read)
      ? ar.read.join(", ")
      : "public";
    authUpdateInput.value = Array.isArray(ar?.update)
      ? ar.update.join(", ")
      : "owner, admin";
    authDeleteInput.value = Array.isArray(ar?.delete)
      ? ar.delete.join(", ")
      : "admin";
    form.value.metadata.description = (dto.metadata as any)?.description || "";
    isEditing.value = true;
    showModal.value = true;
    formError.value = null;
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "No se pudo cargar la collection";
  }
}

async function submitUpdateCollection() {
  creating.value = true;
  formError.value = null;
  try {
    const name = form.value.name.trim();
    const payload = buildUpdateCollectionPayload();
    const cleaned: any = {};
    if (
      payload.schema &&
      (Object.keys(payload.schema.fields || {}).length > 0 ||
        payload.schema.timestamps !== undefined ||
        payload.schema.indexes)
    )
      cleaned.schema = payload.schema;
    if (payload.auth_rules) cleaned.auth_rules = payload.auth_rules;
    if (payload.metadata) cleaned.metadata = payload.metadata;
    if (Object.keys(cleaned).length === 0) {
      closeModal();
      return;
    }
    const { default: apiClient } = await import("../../services/api");
    await apiClient.put(
      `/api/admin/collections/${encodeURIComponent(name)}`,
      cleaned
    );
    closeModal();
    await loadCollections();
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Update collection error:", server || e);
    formError.value =
      server?.message || e?.message || "Error actualizando collection";
  } finally {
    creating.value = false;
  }
}

// Delete Collection
const showDeleteCollection = ref(false);
const pendingDeleteCollection = ref<string | null>(null);
function confirmDeleteCollection(name: string) {
  pendingDeleteCollection.value = name;
  showDeleteCollection.value = true;
}
async function submitDeleteCollection() {
  if (!pendingDeleteCollection.value) return;
  deleting.value = true;
  try {
    const { default: apiClient } = await import("../../services/api");
    await apiClient.delete(
      `/api/admin/collections/${encodeURIComponent(
        pendingDeleteCollection.value
      )}`
    );
    showDeleteCollection.value = false;
    pendingDeleteCollection.value = null;
    await loadCollections();
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Delete collection error:", server || e);
    error.value =
      server?.message || e?.message || "Error eliminando collection";
  } finally {
    deleting.value = false;
  }
}

// ===================== Data Browser =====================
const browseError = ref<string | null>(null);
const browseOpen = ref(false);
const browseTitle = ref("");
const browseRows = ref<any[]>([]);
const browseMeta = ref<{ total?: number } | null>(null);
const currentCollectionName = ref<string>("");
const visibleColumns = ref<string[]>([]);

function isPrimitive(v: any) {
  return ["string", "number", "boolean"].includes(typeof v) || v === null;
}
function renderCell(v: any) {
  return typeof v === "boolean" ? (v ? "true" : "false") : v;
}

async function viewCollection(c: CollectionDto) {
  browseError.value = null;
  browseRows.value = [];
  browseMeta.value = null;
  browseTitle.value = `Datos: ${c.name}`;
  currentCollectionName.value = c.name;
  try {
    let resp;
    try {
      resp = await dynamicCollections.list(c.name);
    } catch {
      try {
        resp = await dynamicCollections.list(c.name, { page: 1, take: 10 });
      } catch {
        resp = await dynamicCollections.list(c.name, { limit: 10, offset: 0 });
      }
    }
    const payload = resp.data;
    let rows: any[] = [];
    let meta: any = null;
    if (Array.isArray(payload)) rows = payload;
    else if (payload?.data && Array.isArray(payload.data)) {
      rows = payload.data;
      meta = payload.meta ?? null;
    } else rows = [payload];
    browseRows.value = rows;
    browseMeta.value = meta;
    const cols = new Set<string>();
    for (const r of rows)
      Object.keys(r || {}).forEach((k) => {
        if (k !== "id") cols.add(k);
      });
    visibleColumns.value = Array.from(cols).slice(0, 8);
    browseOpen.value = true;
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("List data error:", server || e);
    browseError.value =
      server?.message || e?.message || "Error cargando datos de la collection";
    browseOpen.value = true;
  }
}

// ===================== Insert Record =====================
type FieldDef = {
  name: string;
  type:
    | "string"
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "json"
    | "email"
    | "url";
  required?: boolean;
  unique?: boolean;
  default?: any;
  maxLength?: number;
  min?: number;
  max?: number;
};
const insertOpen = ref(false);
const insertTitle = ref("");
const insertName = ref("");
const insertFields = ref<FieldDef[]>([]);
const insertModel = ref<Record<string, any>>({});
const insertJsonBuffers = ref<Record<string, string>>({});
const insertError = ref<any>(null);
const inserting = ref(false);

function openInsertRecord(c: CollectionDto) {
  insertError.value = null;
  insertTitle.value = c.name;
  insertName.value = c.name;
  insertFields.value = [];
  insertModel.value = {};
  insertJsonBuffers.value = {};

  const s = c.schema as any;
  const fobj = s?.fields || {};
  for (const key of Object.keys(fobj)) {
    const def = fobj[key];
    const entry: FieldDef = {
      name: key,
      type: def.type,
      required: !!def.required,
      unique: !!def.unique,
      default: def.default,
      maxLength: typeof def.maxLength === "number" ? def.maxLength : undefined,
      min: typeof def.min === "number" ? def.min : undefined,
      max: typeof def.max === "number" ? def.max : undefined,
    };
    insertFields.value.push(entry);
    if (def.type === "boolean")
      insertModel.value[key] =
        typeof def.default === "boolean" ? def.default : false;
    else if (def.type === "number")
      insertModel.value[key] =
        typeof def.default === "number" ? def.default : undefined;
    else if (def.type === "json") {
      insertJsonBuffers.value[key] =
        def.default !== undefined ? JSON.stringify(def.default, null, 2) : "";
      insertModel.value[key] =
        def.default !== undefined ? def.default : undefined;
    } else if (def.type === "date")
      insertModel.value[key] =
        def.default !== undefined ? String(def.default) : "";
    else
      insertModel.value[key] =
        def.default !== undefined ? String(def.default) : "";
  }
  insertOpen.value = true;
}
function closeInsert() {
  insertOpen.value = false;
  insertError.value = null;
}

function normalizeInsertPayload() {
  const payload: any = {};
  for (const def of insertFields.value) {
    const val = insertModel.value[def.name];
    if (def.required && (val === undefined || val === null || val === "")) {
      insertError.value = `El campo '${def.name}' es requerido`;
      return null;
    }
    if (val === undefined || val === "") continue;
    switch (def.type) {
      case "number":
        if (typeof val !== "number" || isNaN(val)) {
          insertError.value = `El campo '${def.name}' debe ser numérico`;
          return null;
        }
        if (typeof def.min === "number" && val < def.min) {
          insertError.value = `El campo '${def.name}' debe ser >= ${def.min}`;
          return null;
        }
        if (typeof def.max === "number" && val > def.max) {
          insertError.value = `El campo '${def.name}' debe ser <= ${def.max}`;
          return null;
        }
        payload[def.name] = val;
        break;
      case "boolean":
        payload[def.name] = !!val;
        break;
      case "json":
        try {
          const text = insertJsonBuffers.value[def.name] ?? "";
          if (text.trim().length === 0) continue;
          payload[def.name] = JSON.parse(text);
        } catch {
          insertError.value = `El JSON de '${def.name}' no es válido`;
          return null;
        }
        break;
      case "date":
        payload[def.name] = new Date(val).toISOString();
        break;
      default:
        if (def.maxLength && String(val).length > def.maxLength) {
          insertError.value = `El campo '${def.name}' supera maxLength ${def.maxLength}`;
          return null;
        }
        payload[def.name] = String(val);
        break;
    }
  }
  return payload;
}

async function submitInsert() {
  inserting.value = true;
  insertError.value = null;
  try {
    const payload = normalizeInsertPayload();
    if (!payload) return;
    await dynamicCollections.create(insertName.value, payload);
    if (browseOpen.value && insertTitle.value === currentCollectionName.value) {
      await viewCollection({ name: insertName.value } as any);
    }
    closeInsert();
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Insert record error:", server || e);
    insertError.value =
      server?.message || e?.message || "Error creando registro";
  } finally {
    inserting.value = false;
  }
}

// ===================== View/Edit/Delete Record =====================
const recordOpen = ref(false);
const recordMode = ref<"view" | "edit">("view");
const recordTitle = ref("");
const recordId = ref<string>("");
const recordCollection = ref<string>("");
const recordData = ref<any>(null);
const recordFields = ref<FieldDef[]>([]);
const recordModel = ref<Record<string, any>>({});
const recordJsonBuffers = ref<Record<string, string>>({});
const recordError = ref<any>(null);
const recordSaving = ref(false);
const deleteRecordOpen = ref(false);
const recordDeleting = ref(false);

function mapSchemaToFields(schema: any): FieldDef[] {
  const out: FieldDef[] = [];
  const fobj = schema?.fields || {};
  for (const key of Object.keys(fobj)) {
    const def = fobj[key];
    out.push({
      name: key,
      type: def.type,
      required: !!def.required,
      unique: !!def.unique,
      default: def.default,
      maxLength: typeof def.maxLength === "number" ? def.maxLength : undefined,
      min: typeof def.min === "number" ? def.min : undefined,
      max: typeof def.max === "number" ? def.max : undefined,
    });
  }
  return out;
}

async function openViewRecord(colName: string, id: string) {
  recordError.value = null;
  recordMode.value = "view";
  recordCollection.value = colName;
  recordId.value = id;
  recordTitle.value = `${colName} · ${id.slice(0, 8)}`;
  try {
    const { data } = await dynamicCollections.getById(colName, id);
    recordData.value = data;
    recordOpen.value = true;
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Fetch record error:", server || e);
    recordError.value =
      server?.message || e?.message || "Error cargando registro";
    recordOpen.value = true;
  }
}

async function openEditRecord(colName: string, id: string) {
  recordError.value = null;
  recordMode.value = "edit";
  recordCollection.value = colName;
  recordId.value = id;
  recordTitle.value = `${colName} · ${id.slice(0, 8)}`;
  try {
    const c = collections.value.find((x) => x.name === colName);
    const schema = (c?.schema as any) || {};
    recordFields.value = mapSchemaToFields(schema);

    const { data } = await dynamicCollections.getById(colName, id);
    recordData.value = data;
    recordModel.value = {};
    recordJsonBuffers.value = {};
    for (const f of recordFields.value) {
      const v = data[f.name];
      if (f.type === "json")
        recordJsonBuffers.value[f.name] =
          v !== undefined ? JSON.stringify(v, null, 2) : "";
      else if (f.type === "date")
        recordModel.value[f.name] = v
          ? new Date(v).toISOString().slice(0, 16)
          : "";
      else recordModel.value[f.name] = v;
    }
    recordOpen.value = true;
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Fetch record error:", server || e);
    recordError.value =
      server?.message || e?.message || "Error cargando registro";
    recordOpen.value = true;
  }
}

function normalizeUpdateRecordPayload() {
  const payload: any = {};
  for (const def of recordFields.value) {
    const val = recordModel.value[def.name];
    if (val === undefined || val === "") continue;
    switch (def.type) {
      case "number":
        if (typeof val !== "number" || isNaN(val)) {
          recordError.value = `El campo '${def.name}' debe ser numérico`;
          return null;
        }
        if (typeof def.min === "number" && val < def.min) {
          recordError.value = `El campo '${def.name}' debe ser >= ${def.min}`;
          return null;
        }
        if (typeof def.max === "number" && val > def.max) {
          recordError.value = `El campo '${def.name}' debe ser <= ${def.max}`;
          return null;
        }
        payload[def.name] = val;
        break;
      case "boolean":
        payload[def.name] = !!val;
        break;
      case "json":
        try {
          const text = recordJsonBuffers.value[def.name] ?? "";
          if (text.trim().length === 0) continue;
          payload[def.name] = JSON.parse(text);
        } catch {
          recordError.value = `El JSON de '${def.name}' no es válido`;
          return null;
        }
        break;
      case "date":
        payload[def.name] = new Date(val).toISOString();
        break;
      default:
        if (def.maxLength && String(val).length > def.maxLength) {
          recordError.value = `El campo '${def.name}' supera maxLength ${def.maxLength}`;
          return null;
        }
        payload[def.name] = String(val);
        break;
    }
  }
  return payload;
}

async function submitUpdateRecord() {
  recordSaving.value = true;
  recordError.value = null;
  try {
    const payload = normalizeUpdateRecordPayload();
    if (!payload) return;
    await dynamicCollections.update(
      recordCollection.value,
      recordId.value,
      payload
    );
    if (
      browseOpen.value &&
      recordCollection.value === currentCollectionName.value
    ) {
      await viewCollection({ name: recordCollection.value } as any);
    }
    closeRecord();
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Update record error:", server || e);
    recordError.value =
      server?.message || e?.message || "Error actualizando registro";
  } finally {
    recordSaving.value = false;
  }
}

function confirmDeleteRecord(colName: string, id: string) {
  recordCollection.value = colName;
  recordId.value = id;
  deleteRecordOpen.value = true;
}
async function submitDeleteRecord() {
  recordDeleting.value = true;
  try {
    await dynamicCollections.remove(recordCollection.value, recordId.value);
    deleteRecordOpen.value = false;
    if (
      browseOpen.value &&
      recordCollection.value === currentCollectionName.value
    ) {
      await viewCollection({ name: recordCollection.value } as any);
    }
  } catch (e: any) {
    const server = e?.response?.data;
    console.error("Delete record error:", server || e);
    error.value = server?.message || e?.message || "Error eliminando registro";
  } finally {
    recordDeleting.value = false;
  }
}

function closeRecord() {
  recordOpen.value = false;
  recordError.value = null;
}

// lifecycle
onMounted(loadCollections);
watch([searchQuery, selectedFilter], () => {
  meta.value.page = 1;
  loadCollections();
});
</script>
