<template>
  <div class="space-y-6">
    <!-- Header -->
    <CollectionHeader
      :current-collection="currentCollection"
      :show-advanced-filters="showAdvancedFilters"
      :can-insert-records="canInsertRecords"
      @toggle-advanced-filters="toggleAdvancedFilters"
      @go-back="goBack"
      @open-insert-modal="openInsertModal"
      @open-create="openCreate"
    />

    <!-- Stats Cards -->
    <CollectionStats
      v-if="!currentCollection && collectionsStats"
      :stats="collectionsStats"
    />
    <RecordStats
      v-else-if="currentCollection && recordsStats"
      :stats="recordsStats"
      :filtered-count="filteredRecordsCount"
      :selected-count="selectedRecords.length"
      :fields-count="Object.keys(currentCollection?.schema?.fields || {}).length"
    />

    <!-- Advanced Filters -->
    <CollectionAdvancedFilters
      v-if="!currentCollection && showAdvancedFilters"
      v-model:active-filters="activeCollectionFilters"
      v-model:new-filter="newCollectionFilter"
      @add-filter="addCollectionFilter"
      @remove-filter="removeCollectionFilter"
      @clear-filters="clearAdvancedFilters"
    />
    <RecordAdvancedFilters
      v-else-if="currentCollection && showAdvancedFilters"
      v-model:active-filters="activeRecordFilters"
      v-model:new-filter="newRecordFilter"
      :collection="currentCollection"
      @add-filter="addRecordFilter"
      @remove-filter="removeRecordFilter"
      @clear-filters="clearAdvancedFilters"
    />

    <!-- Search and Basic Filters -->
    <SearchAndFilters
      :current-collection="currentCollection"
      :search-query="searchQuery"
      :collection-filters="collectionFilters"
      :pagination="pagination"
      :filtered-collections-count="filteredCollectionsCount"
      :filtered-records-count="filteredRecordsCount"
      :selected-records="selectedRecords"
      :auto-refresh="autoRefresh"
      :exporting-records="exportingRecords"
      :exporting-collections="exportingCollections"
      @search-input="handleSearchInput"
      @apply-filters="applyFilters"
      @go-to-page="goToPage"
      @clear-filters="clearAllFilters"
      @export-records="exportRecords"
      @export-collections="exportCollections"
      @toggle-auto-refresh="toggleAutoRefresh"
      @open-bulk-delete="openBulkDeleteModal"
    />

    <!-- Loading State -->
    <LoadingState v-if="loading" />

    <!-- Collections Table -->
    <CollectionsTable
      v-else-if="!currentCollection"
      :collections="paginatedCollections"
      :filtered-collections="filteredCollections"
      :has-active-filters="hasActiveCollectionFilters"
      @view-data="viewData"
      @view-collection="viewCollection"
      @open-edit="openEdit"
      @open-delete="openDelete"
    />

    <!-- Records Table -->
    <RecordsTable
      v-else
      :collection="currentCollection"
      :records="paginatedRecords"
      :selected-records="selectedRecords"
      :has-active-filters="hasActiveRecordFilters"
      :can-update-records="canUpdateRecords"
      :can-delete-records="canDeleteRecords"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      @toggle-select-record="toggleSelectRecord"
      @toggle-select-all-visible="toggleSelectAllVisibleRecords"
      @sort-by="sortBy"
      @open-edit-record="openEditRecord"
      @open-delete-record="openDeleteRecord"
    />

    <!-- Pagination -->
    <PaginationControls
      v-if="!loading && totalPages > 1"
      :pagination="pagination"
      :total-items="totalItems"
      :total-pages="totalPages"
      :has-active-filters="hasActiveFilters"
      @go-to-page="goToPage"
    />

    <!-- Modals -->
    <CreateCollectionModal
      v-if="showCreateModal"
      :editing-collection="editingCollection"
      :form="form"
      :schema-fields="schemaFields"
      :relation-list="relationList"
      :indexes-input="indexesInput"
      :auth-create-input="authCreateInput"
      :auth-read-input="authReadInput"
      :auth-update-input="authUpdateInput"
      :auth-delete-input="authDeleteInput"
      :saving="saving"
      @close="closeCreateModal"
      @save="saveCollection"
      @add-field="addSchemaField"
      @remove-field="removeSchemaField"
      @add-relation="addRelation"
      @remove-relation="removeRelation"
      @update:indexes-input="(val) => indexesInput = val"
      @update:auth-create-input="(val) => authCreateInput = val"
      @update:auth-read-input="(val) => authReadInput = val"
      @update:auth-update-input="(val) => authUpdateInput = val"
      @update:auth-delete-input="(val) => authDeleteInput = val"
      @update-form="updateForm"
      @update-form-metadata="updateFormMetadata"
      @update-form-schema="updateFormSchema"
      @update-schema-field="updateSchemaField"
      @update-relation="updateRelation"
    />

    <RecordModal
      v-if="showInsertModal"
      :collection="currentCollection"
      :editing-record="editingRecord"
      :record-form="recordForm"
      :json-errors="jsonErrors"
      :upload-progress="uploadProgress"
      :saving-record="savingRecord"
      @close="closeInsertModal"
      @save="saveRecord"
      @validate-json="validateJSON"
    />

    <DeleteModal
      v-if="showDeleteModal"
      :deleting-collection="deletingCollection"
      :collection-to-delete="collectionToDelete"
      :record-to-delete="recordToDelete"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />

    <BulkDeleteModal
      v-if="showBulkDeleteModal"
      :selected-count="selectedRecords.length"
      :bulk-deleting="bulkDeleting"
      @close="closeBulkDeleteModal"
      @confirm="confirmBulkDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { adminCollections, recordsAPI } from "../../services/api";
import { useNotifications } from '../../composables/useNotifications';

// Components
import CollectionHeader from "./components/CollectionHeader.vue";
import CollectionStats from "./components/CollectionStats.vue";
import RecordStats from "./components/RecordStats.vue";
import CollectionAdvancedFilters from "./components/CollectionAdvancedFilters.vue";
import RecordAdvancedFilters from "./components/RecordAdvancedFilters.vue";
import SearchAndFilters from "./components/SearchAndFilters.vue";
import LoadingState from "./components/LoadingState.vue";
import CollectionsTable from "./components/CollectionsTable.vue";
import RecordsTable from "./components/RecordsTable.vue";
import PaginationControls from "./components/PaginationControls.vue";
import CreateCollectionModal from "./components/CreateCollectionModal.vue";
import RecordModal from "./components/RecordModal.vue";
import DeleteModal from "./components/DeleteModal.vue";
import BulkDeleteModal from "./components/BulkDeleteModal.vue";

const { showSuccess, showError } = useNotifications();

// Interfaces
interface Collection {
  id: string;
  name: string;
  is_active: boolean;
  record_count: number;
  schema: any;
  metadata: any;
  auth_rules: any;
  created_at: string;
  updated_at: string;
}

interface Filter {
  field: string;
  operator: string;
  value: any;
}

interface Pagination {
  page: number;
  limit: number;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(true);
const saving = ref(false);
const savingRecord = ref(false);
const deletingCollection = ref(false);
const bulkDeleting = ref(false);
const exportingCollections = ref(false);
const exportingRecords = ref(false);

// Collections
const collections = ref<Collection[]>([]);
const currentCollection = ref<Collection | null>(null);
const collectionsStats = ref<any>(null);

// Records
const records = ref<any[]>([]);
const recordsStats = ref<any>(null);
const selectedRecords = ref<string[]>([]);

// Filters
const showAdvancedFilters = ref(false);
const activeCollectionFilters = ref<Filter[]>([]);
const activeRecordFilters = ref<Filter[]>([]);
const newCollectionFilter = ref<Filter>({ field: '', operator: '', value: '' });
const newRecordFilter = ref<Filter>({ field: '', operator: '', value: '' });
const searchQuery = ref("");
const collectionFilters = ref({
  is_active: "",
});

// Pagination
const pagination = ref<Pagination>({
  page: 1,
  limit: 25
});

// Sorting
const sortField = ref("");
const sortDirection = ref<"asc" | "desc">("asc");

// Auto refresh
const autoRefresh = ref(false);
let refreshInterval: NodeJS.Timeout | null = null;
let searchTimeout: NodeJS.Timeout;

// Modals
const showCreateModal = ref(false);
const showInsertModal = ref(false);
const showDeleteModal = ref(false);
const showBulkDeleteModal = ref(false);
const editingCollection = ref<Collection | null>(null);
const editingRecord = ref<any>(null);
const collectionToDelete = ref<Collection | null>(null);
const recordToDelete = ref<any>(null);

// Forms
const form = ref({
  name: "",
  is_active: true,
  metadata: { description: "" },
  auth_rules: {
    select: "authenticated",
    insert: "authenticated", 
    update: "owner",
    delete: "owner"
  },
  schema: {
    fields: {},
    relations: {},
    timestamps: true,
    indexes: []
  }
});

const schemaFields = ref<any[]>([]);
const relationList = ref<any[]>([]);
const indexesInput = ref("");
const authCreateInput = ref("authenticated");
const authReadInput = ref("public");
const authUpdateInput = ref("owner, admin");
const authDeleteInput = ref("admin");

const recordForm = ref<any>({});
const jsonErrors = ref<any>({});
const uploadProgress = ref<any>({});

// Computed properties
const canInsertRecords = computed(() => {
  return currentCollection.value?.auth_rules?.insert !== "none";
});

const canUpdateRecords = computed(() => {
  return currentCollection.value?.auth_rules?.update !== "none";
});

const canDeleteRecords = computed(() => {
  return currentCollection.value?.auth_rules?.delete !== "none";
});

const hasActiveCollectionFilters = computed(() => {
  return activeCollectionFilters.value.length > 0 || 
         searchQuery.value.length > 0 ||
         collectionFilters.value.is_active !== "";
});

const hasActiveRecordFilters = computed(() => {
  return activeRecordFilters.value.length > 0 || 
         searchQuery.value.length > 0;
});

const hasActiveFilters = computed(() => {
  return currentCollection.value ? hasActiveRecordFilters.value : hasActiveCollectionFilters.value;
});

const filteredCollections = computed(() => {
  let filtered = [...collections.value];
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.metadata?.description?.toLowerCase().includes(query)
    );
  }
  
  // Apply basic filters
  if (collectionFilters.value.is_active !== "") {
    const isActive = collectionFilters.value.is_active === "true";
    filtered = filtered.filter(c => c.is_active === isActive);
  }
  
  // Apply advanced filters
  activeCollectionFilters.value.forEach(filter => {
    filtered = filtered.filter(item => {
      const value = item[filter.field as keyof Collection];
      switch (filter.operator) {
        case 'eq': return value === filter.value;
        case 'ne': return value !== filter.value;
        case 'gt': return Number(value) > Number(filter.value);
        case 'gte': return Number(value) >= Number(filter.value);
        case 'lt': return Number(value) < Number(filter.value);
        case 'lte': return Number(value) <= Number(filter.value);
        case 'like': return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'starts_with': return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
        case 'ends_with': return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
        default: return true;
      }
    });
  });
  
  return filtered;
});

const filteredRecords = computed(() => {
  let filtered = [...records.value];
  
  // Apply search
  if (searchQuery.value && currentCollection.value) {
    const query = searchQuery.value.toLowerCase();
    const searchableFields = Object.keys(currentCollection.value.schema?.fields || {})
      .filter(field => {
        const fieldType = currentCollection.value!.schema.fields[field].type;
        return ['string', 'text', 'email', 'url'].includes(fieldType);
      });
    
    filtered = filtered.filter(record => 
      searchableFields.some(field => 
        String(record[field] || '').toLowerCase().includes(query)
      )
    );
  }
  
  // Apply advanced filters
  activeRecordFilters.value.forEach(filter => {
    filtered = filtered.filter(item => {
      const value = item[filter.field];
      switch (filter.operator) {
        case 'eq': return value === filter.value;
        case 'ne': return value !== filter.value;
        case 'gt': return Number(value) > Number(filter.value);
        case 'gte': return Number(value) >= Number(filter.value);
        case 'lt': return Number(value) < Number(filter.value);
        case 'lte': return Number(value) <= Number(filter.value);
        case 'like': return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'starts_with': return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
        case 'ends_with': return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
        default: return true;
      }
    });
  });
  
  return filtered;
});

const filteredCollectionsCount = computed(() => filteredCollections.value.length);
const filteredRecordsCount = computed(() => filteredRecords.value.length);

const totalItems = computed(() => {
  return currentCollection.value ? filteredRecordsCount.value : filteredCollectionsCount.value;
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pagination.value.limit);
});

const paginatedCollections = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.limit;
  const end = start + pagination.value.limit;
  return filteredCollections.value.slice(start, end);
});

const paginatedRecords = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.limit;
  const end = start + pagination.value.limit;
  return filteredRecords.value.slice(start, end);
});

// Methods
async function loadCollections() {
  try {
    loading.value = true;
    
    const response = await adminCollections.list({
      page: 1,
      limit: 1000
    });
    
    const responseData = response.data as any;
    collections.value = responseData.data || [];
    
    await loadCollectionsStats();
    
  } catch (error: any) {
    console.error("Error loading collections:", error);
  } finally {
    loading.value = false;
  }
}

async function loadCollectionsStats() {
  try {
    const statsResponse = await adminCollections.getStats();
    const responseData = statsResponse.data as any;
    
    if (responseData?.success === true && responseData?.data) {
      collectionsStats.value = responseData.data;
    } else {
      throw new Error('Invalid stats response format');
    }
  } catch (error: any) {
    console.warn("Stats endpoint failed, calculating locally:", error.message);
    
    // Fallback calculation
    const total = collections.value.length;
    const active = collections.value.filter(c => c.is_active).length;
    const totalRecords = collections.value.reduce((sum, c) => sum + (c.record_count || 0), 0);
    
    collectionsStats.value = {
      total,
      active,
      totalRecords,
      averageRecords: total > 0 ? Math.round(totalRecords / total) : 0,
      topCollectionsByRecords: [],
      recentlyCreated: []
    };
  }
}

async function loadRecords() {
  if (!currentCollection.value) return;
  
  try {
    loading.value = true;
    
    const response = await recordsAPI.getAll(currentCollection.value.name, {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: searchQuery.value,
      filters: JSON.stringify(activeRecordFilters.value),
      sort: sortField.value ? JSON.stringify([{
        field: sortField.value,
        direction: sortDirection.value.toUpperCase()
      }]) : undefined
    });
    
    const responseData = response.data as any;
    records.value = responseData.data || [];
    
    // Load record stats
    recordsStats.value = {
      total: responseData.meta?.total || records.value.length,
      filtered: filteredRecordsCount.value
    };
    
  } catch (error: any) {
    console.error("Error loading records:", error);
  } finally {
    loading.value = false;
  }
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1;
    if (currentCollection.value) {
      loadRecords();
    }
  }, 300);
}

function goToPage(page: number) {
  pagination.value.page = page;
  if (currentCollection.value) {
    loadRecords();
  }
}

function sortBy(field: string) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
  
  if (currentCollection.value) {
    loadRecords();
  }
}

// View and navigation functions
function viewData(collection: Collection) {
  //router.push(`/admin/collections/${collection.name}/data`);
  viewCollection(collection);
}

function viewCollection(collection: Collection) {
  currentCollection.value = collection;
  selectedRecords.value = [];
  pagination.value.page = 1;
  searchQuery.value = "";
  activeRecordFilters.value = [];
  loadRecords();
}

function goBack() {
  currentCollection.value = null;
  recordsStats.value = null;
  selectedRecords.value = [];
  pagination.value.page = 1;
  searchQuery.value = "";
  activeRecordFilters.value = [];
  router.push({path: '/collections'});
}

// Modal functions
function openCreate() {
  editingCollection.value = null;
  resetForm();
  showCreateModal.value = true;
}

function openEdit(collection: Collection) {
  editingCollection.value = collection;
  populateForm(collection);
  showCreateModal.value = true;
}

function closeCreateModal() {
  showCreateModal.value = false;
  editingCollection.value = null;
  resetForm();
}

function openInsertModal() {
  editingRecord.value = null;
  resetRecordForm();
  showInsertModal.value = true;
}

function openEditRecord(record: any) {
  editingRecord.value = record;
  populateRecordForm(record);
  showInsertModal.value = true;
}

function closeInsertModal() {
  showInsertModal.value = false;
  editingRecord.value = null;
  resetRecordForm();
}

function openDelete(collection: Collection) {
  collectionToDelete.value = collection;
  showDeleteModal.value = true;
}

function openDeleteRecord(record: any) {
  recordToDelete.value = record;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  collectionToDelete.value = null;
  recordToDelete.value = null;
}

function openBulkDeleteModal() {
  showBulkDeleteModal.value = true;
}

function closeBulkDeleteModal() {
  showBulkDeleteModal.value = false;
}

// Event handlers para CreateCollectionModal
function updateForm(key: string, value: any) {
  form.value = { ...form.value, [key]: value };
}

function updateFormMetadata(key: string, value: any) {
  form.value.metadata = { ...form.value.metadata, [key]: value };
}

function updateFormSchema(key: string, value: any) {
  form.value.schema = { ...form.value.schema, [key]: value };
}

function updateSchemaField(index: number, key: string, value: any) {
  if (schemaFields.value[index]) {
    schemaFields.value[index] = { ...schemaFields.value[index], [key]: value };
  }
}

function updateRelation(index: number, key: string, value: any) {
  if (relationList.value[index]) {
    relationList.value[index] = { ...relationList.value[index], [key]: value };
  }
}

// Form management
function resetForm() {
  form.value = {
    name: "",
    is_active: true,
    metadata: { description: "" },
    auth_rules: {
      select: "authenticated",
      insert: "authenticated", 
      update: "owner",
      delete: "owner"
    },
    schema: {
      fields: {},
      relations: {},
      timestamps: true,
      indexes: []
    }
  };
  schemaFields.value = [];
  relationList.value = [];
  indexesInput.value = "";
  authCreateInput.value = "authenticated";
  authReadInput.value = "public";
  authUpdateInput.value = "owner, admin";
  authDeleteInput.value = "admin";
}

function populateForm(collection: Collection) {
  form.value.name = collection.name;
  form.value.is_active = collection.is_active;
  form.value.metadata = collection.metadata || { description: "" };
  form.value.auth_rules = collection.auth_rules || {
    select: "authenticated",
    insert: "authenticated",
    update: "owner",
    delete: "owner"
  };
  form.value.schema = collection.schema || {
    fields: {},
    relations: {},
    timestamps: true,
    indexes: []
  };

  // Populate schema fields
  schemaFields.value = [];
  const fields = collection.schema?.fields || {};
  for (const [fieldName, fieldConfig] of Object.entries(fields)) {
    const config = fieldConfig as any;
    schemaFields.value.push({
      id: cryptoRandomId(),
      name: fieldName,
      type: config.type || 'string',
      required: config.required || false,
      unique: config.unique || false,
      default: config.default || '',
      maxLength: config.maxLength || undefined,
      min: config.min || undefined,
      max: config.max || undefined
    });
  }

  // Populate relations
  relationList.value = [];
  const relations = collection.schema?.relations || {};
  for (const [fieldName, relationConfig] of Object.entries(relations)) {
    const config = relationConfig as any;
    relationList.value.push({
      _id: cryptoRandomId(),
      field: fieldName,
      type: config.type || 'belongs_to',
      references: config.references || '',
      extra: config.through || config.display_field || 'name'
    });
  }

  // Populate auth inputs
  const ar = collection.auth_rules as any;
  authCreateInput.value = Array.isArray(ar?.create) ? ar.create.join(", ") : "authenticated";
  authReadInput.value = Array.isArray(ar?.read) ? ar.read.join(", ") : "public";
  authUpdateInput.value = Array.isArray(ar?.update) ? ar.update.join(", ") : "owner, admin";
  authDeleteInput.value = Array.isArray(ar?.delete) ? ar.delete.join(", ") : "admin";

  // Populate indexes
  indexesInput.value = Array.isArray(collection.schema?.indexes) ? collection.schema.indexes.join(", ") : "";
}

function resetRecordForm() {
  recordForm.value = {};
  jsonErrors.value = {};
  uploadProgress.value = {};
  
  if (currentCollection.value?.schema?.fields) {
    Object.keys(currentCollection.value.schema.fields).forEach(fieldName => {
      const fieldDef = currentCollection.value!.schema.fields[fieldName];
      if (fieldDef.type === 'json') {
        recordForm.value[fieldName + '_json_string'] = '';
      }
    });
  }
}

function populateRecordForm(record: any) {
  recordForm.value = { ...record };
  jsonErrors.value = {};
  
  if (currentCollection.value?.schema?.fields) {
    Object.keys(currentCollection.value.schema.fields).forEach(fieldName => {
      const fieldDef = currentCollection.value!.schema.fields[fieldName];
      
      // Manejar campos JSON
      if (fieldDef.type === 'json' && record[fieldName]) {
        recordForm.value[fieldName + '_json_string'] = JSON.stringify(record[fieldName], null, 2);
      }
      
      // Manejar relaciones belongs_to
      if (currentCollection.value!.schema?.relations?.[fieldName]?.type === 'belongs_to') {
        if (typeof record[fieldName] === 'object' && record[fieldName]?.id) {
          // Si viene como objeto con relación expandida
          recordForm.value[fieldName] = record[fieldName].id;
        } else if (typeof record[fieldName] === 'string' || typeof record[fieldName] === 'number') {
          // Si viene como ID directo
          recordForm.value[fieldName] = record[fieldName].toString();
        } else {
          // Si es null o undefined
          recordForm.value[fieldName] = '';
        }
      }
    });
  }
}

// Schema field management
function addSchemaField() {
  schemaFields.value.push({
    id: cryptoRandomId(),
    name: "",
    type: "string",
    required: false,
    unique: false,
    default: "",
    maxLength: undefined,
    min: undefined,
    max: undefined
  });
}

function removeSchemaField(index: number) {
  schemaFields.value.splice(index, 1);
}

// Relation management
function addRelation() {
  relationList.value.push({
    _id: cryptoRandomId(),
    field: "",
    type: "belongs_to",
    references: "",
    extra: "name"
  });
}

function removeRelation(index: number) {
  relationList.value.splice(index, 1);
}

function cryptoRandomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Filter management
function toggleAdvancedFilters() {
  showAdvancedFilters.value = !showAdvancedFilters.value;
}

function addCollectionFilter() {
  if (newCollectionFilter.value.field && newCollectionFilter.value.operator && newCollectionFilter.value.value) {
    activeCollectionFilters.value.push({ ...newCollectionFilter.value });
    newCollectionFilter.value = { field: '', operator: '', value: '' };
    pagination.value.page = 1;
  }
}

function removeCollectionFilter(index: number) {
  activeCollectionFilters.value.splice(index, 1);
  pagination.value.page = 1;
}

function addRecordFilter() {
  if (newRecordFilter.value.field && newRecordFilter.value.operator && newRecordFilter.value.value) {
    activeRecordFilters.value.push({ ...newRecordFilter.value });
    newRecordFilter.value = { field: '', operator: '', value: '' };
    pagination.value.page = 1;
    if (currentCollection.value) {
      loadRecords();
    }
  }
}

function removeRecordFilter(index: number) {
  activeRecordFilters.value.splice(index, 1);
  pagination.value.page = 1;
  if (currentCollection.value) {
    loadRecords();
  }
}

function clearAdvancedFilters() {
  if (currentCollection.value) {
    activeRecordFilters.value = [];
    loadRecords();
  } else {
    activeCollectionFilters.value = [];
  }
  pagination.value.page = 1;
}

function applyFilters() {
  pagination.value.page = 1;
  if (currentCollection.value) {
    loadRecords();
  }
}

function clearAllFilters() {
  searchQuery.value = "";
  collectionFilters.value.is_active = "";
  activeCollectionFilters.value = [];
  activeRecordFilters.value = [];
  pagination.value.page = 1;
  
  if (currentCollection.value) {
    loadRecords();
  }
}

// Record selection
function toggleSelectRecord(recordId: string) {
  const index = selectedRecords.value.indexOf(recordId);
  if (index > -1) {
    selectedRecords.value.splice(index, 1);
  } else {
    selectedRecords.value.push(recordId);
  }
}

function toggleSelectAllVisibleRecords() {
  const visibleRecordIds = paginatedRecords.value.map(r => r.id);
  const allSelected = visibleRecordIds.every(id => selectedRecords.value.includes(id));
  
  if (allSelected) {
    // Deselect all visible
    selectedRecords.value = selectedRecords.value.filter(id => !visibleRecordIds.includes(id));
  } else {
    // Select all visible
    visibleRecordIds.forEach(id => {
      if (!selectedRecords.value.includes(id)) {
        selectedRecords.value.push(id);
      }
    });
  }
}

// Auto refresh
function toggleAutoRefresh() {
  autoRefresh.value = !autoRefresh.value;
  
  if (autoRefresh.value) {
    refreshInterval = setInterval(() => {
      if (currentCollection.value) {
        loadRecords();
      } else {
        loadCollections();
      }
    }, 30000); // 30 seconds
  } else {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }
}

// Export functions
async function exportCollections() {
  exportingCollections.value = true;
  try {
    const collectionsData = filteredCollections.value.map(c => ({
      name: c.name,
      is_active: c.is_active,
      record_count: c.record_count,
      description: c.metadata?.description,
      created_at: c.created_at
    }));
    
    const csvContent = generateCSV(collectionsData);
    downloadCSV(csvContent, 'collections.csv');
  } catch (error: any) {
    console.error("Error exporting collections:", error);
  } finally {
    exportingCollections.value = false;
  }
}

async function exportRecords() {
  if (!currentCollection.value) return;
  
  exportingRecords.value = true;
  try {
    const recordsData = filteredRecords.value.map(record => {
      const exportRecord: any = {};
      Object.keys(currentCollection.value!.schema.fields).forEach(field => {
        exportRecord[field] = record[field];
      });
      exportRecord.created_at = record.created_at;
      exportRecord.updated_at = record.updated_at;
      return exportRecord;
    });
    
    const csvContent = generateCSV(recordsData);
    downloadCSV(csvContent, `${currentCollection.value.name}_records.csv`);
  } catch (error: any) {
    console.error("Error exporting records:", error);
  } finally {
    exportingRecords.value = false;
  }
}

function generateCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Save operations
async function saveCollection() {
  try {
    saving.value = true;
    
    // Build schema from fields
    const fields: any = {};
    schemaFields.value.forEach(field => {
      if (field.name) {
        const fieldConfig: any = {
          type: field.type,
        };
        
        if (field.required) fieldConfig.required = field.required;
        if (field.unique) fieldConfig.unique = field.unique;
        if (field.default !== '' && field.default !== undefined && field.default !== null) {
          fieldConfig.default = field.default;
        }
        if (field.maxLength && field.maxLength > 0) fieldConfig.maxLength = field.maxLength;
        if (field.min !== undefined && field.min !== null && field.min !== '') fieldConfig.min = field.min;
        if (field.max !== undefined && field.max !== null && field.max !== '') fieldConfig.max = field.max;
        
        fields[field.name] = fieldConfig;
      }
    });
    
    // Build relations
    const relations: any = {};
    relationList.value.forEach(rel => {
      if (rel.field && rel.references) {
        const relationConfig: any = {
          type: rel.type,
          references: rel.references
        };
        
        if (rel.type === 'many_to_many' && rel.extra) {
          relationConfig.through = rel.extra;
        } else if (rel.extra && rel.extra !== 'name' && rel.extra !== '') {
          relationConfig.display_field = rel.extra;
        }
        
        relations[rel.field] = relationConfig;
      }
    });
    
    // Build auth rules
    const authRules = {
      create: authCreateInput.value ? authCreateInput.value.split(',').map(s => s.trim()).filter(Boolean) : [],
      read: authReadInput.value ? authReadInput.value.split(',').map(s => s.trim()).filter(Boolean) : [],
      update: authUpdateInput.value ? authUpdateInput.value.split(',').map(s => s.trim()).filter(Boolean) : [],
      delete: authDeleteInput.value ? authDeleteInput.value.split(',').map(s => s.trim()).filter(Boolean) : []
    };
    
    // Build indexes
    const indexes = indexesInput.value ? indexesInput.value.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    let collectionData: any;
    
    if (editingCollection.value) {
      // PAYLOAD PARA EDITAR - Solo campos permitidos por UpdateCollectionDto
      collectionData = {
        schema: {
          fields,
          relations: Object.keys(relations).length > 0 ? relations : undefined,
          timestamps: form.value.schema.timestamps,
          indexes: indexes.length > 0 ? indexes : undefined
        },
        auth_rules: authRules,
        metadata: {
          description: form.value.metadata?.description || ''
        },
        is_active: form.value.is_active
      };
      
      // Limpiar campos undefined del schema
      Object.keys(collectionData.schema).forEach(key => {
        if (collectionData.schema[key] === undefined) {
          delete collectionData.schema[key];
        }
      });
      
    } else {
      // PAYLOAD PARA CREAR - Incluye todos los campos necesarios
      collectionData = {
        name: form.value.name,
        schema: {
          fields,
          relations: Object.keys(relations).length > 0 ? relations : undefined,
          timestamps: form.value.schema.timestamps,
          indexes: indexes.length > 0 ? indexes : undefined
        },
        auth_rules: authRules,
        metadata: {
          description: form.value.metadata?.description || ''
        },
        is_active: form.value.is_active
      };
      
      // Limpiar undefined del schema
      Object.keys(collectionData.schema).forEach(key => {
        if (collectionData.schema[key] === undefined) {
          delete collectionData.schema[key];
        }
      });
    }
    
    console.log('=== PAYLOAD DEBUG ===');
    console.log('Editing:', !!editingCollection.value);
    console.log('Collection name:', editingCollection.value?.name || form.value.name);
    console.log('Payload:', JSON.stringify(collectionData, null, 2));
    
    if (editingCollection.value) {
      await adminCollections.update(editingCollection.value.name, collectionData);
      showSuccess(
        'Collection actualizada', 
        `La collection "${editingCollection.value.name}" se actualizó correctamente.`
      );
    } else {
      await adminCollections.create(collectionData);
      showSuccess(
        'Collection creada', 
        `La collection "${form.value.name}" se creó correctamente.`
      );
    }
    
    await loadCollections();
    closeCreateModal();
    
  } catch (error: any) {
    console.error("Error saving collection:", error);
    console.error("Response data:", error.response?.data);
    
    let errorMessage = 'Error desconocido al guardar la collection.';
    
    // Mostrar mensaje específico del backend
    if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
      console.error("Backend validation errors:", error.response.data.message);
      errorMessage = `Errores de validación:\n${error.response.data.message.join('\n')}`;
    } else if (error.response?.data?.message) {
      console.error("Backend error message:", error.response.data.message);
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showError(
      'Error al guardar collection',
      errorMessage
    );
  } finally {
    saving.value = false;
  }
}

async function saveRecord() {
  if (!currentCollection.value) return;
  
  try {
    savingRecord.value = true;
    
    const recordData = { ...recordForm.value };
    
    // ✅ ELIMINAR campos del sistema que el backend maneja automáticamente
    delete recordData.id;
    delete recordData.created_at;
    delete recordData.updated_at;
    
    // Process JSON fields
    if (currentCollection.value.schema?.fields) {
      Object.keys(currentCollection.value.schema.fields).forEach(fieldName => {
        const fieldDef = currentCollection.value!.schema.fields[fieldName];
        if (fieldDef.type === 'json') {
          const jsonString = recordData[fieldName + '_json_string'];
          if (jsonString) {
            try {
              recordData[fieldName] = JSON.parse(jsonString);
            } catch (error) {
              jsonErrors.value[fieldName] = 'JSON inválido';
              throw new Error(`Invalid JSON in field ${fieldName}`);
            }
          }
          delete recordData[fieldName + '_json_string'];
        }
      });
    }
    
    if (editingRecord.value) {
      await recordsAPI.update(currentCollection.value.name, editingRecord.value.id, recordData);
    } else {
      await recordsAPI.create(currentCollection.value.name, recordData);
    }
    
    await loadRecords();
    closeInsertModal();
  } catch (error: any) {
    console.error("Error saving record:", error);
  } finally {
    savingRecord.value = false;
  }
}

// Delete operations
async function confirmDelete() {
  try {
    deletingCollection.value = true;
    
    if (collectionToDelete.value) {
      console.log('=== DELETING COLLECTION ===');
      console.log('Collection:', collectionToDelete.value.name);
      await adminCollections.delete(collectionToDelete.value.name);
      await loadCollections();
    } else if (recordToDelete.value && currentCollection.value) {
      console.log('=== DELETING RECORD ===');
      console.log('Collection:', currentCollection.value.name);
      console.log('Record ID:', recordToDelete.value.id);
      console.log('Record data:', recordToDelete.value);
      
      await recordsAPI.delete(currentCollection.value.name, recordToDelete.value.id);
      await loadRecords();
    }
    
    closeDeleteModal();
  } catch (error: any) {
    console.error("Error deleting:", error);
    console.error("Response:", error.response?.data);
    
    showError(
      'Error al eliminar',
      error.response?.data?.message || error.message || 'Error desconocido'
    );
  } finally {
    deletingCollection.value = false;
  }
}

async function confirmBulkDelete() {
  if (!currentCollection.value || selectedRecords.value.length === 0) return;
  
  try {
    bulkDeleting.value = true;
    
    await Promise.all(
      selectedRecords.value.map(recordId =>
        recordsAPI.delete(currentCollection.value!.name, recordId)
      )
    );
    
    selectedRecords.value = [];
    await loadRecords();
    closeBulkDeleteModal();
  } catch (error: any) {
    console.error("Error bulk deleting:", error);
  } finally {
    bulkDeleting.value = false;
  }
}

// JSON validation
function validateJSON(fieldName: string) {
  const jsonString = recordForm.value[fieldName + '_json_string'];
  if (jsonString) {
    try {
      JSON.parse(jsonString);
      delete jsonErrors.value[fieldName];
    } catch (error) {
      jsonErrors.value[fieldName] = 'JSON inválido';
    }
  } else {
    delete jsonErrors.value[fieldName];
  }
}

// Lifecycle
onMounted(() => {
  const collectionName = route.params.collectionName as string;
  if (collectionName) {
    // Load specific collection
    adminCollections.getByName(collectionName).then(response => {
      currentCollection.value = response.data;
      loadRecords();
    }).catch(() => {
      router.push('/admin/collections');
    });
  } else {
    loadCollections();
  }
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  clearTimeout(searchTimeout);
});

// Watch for route changes
watch(() => route.params.collectionName, (newCollectionName) => {
  if (newCollectionName) {
    adminCollections.getByName(newCollectionName as string).then(response => {
      currentCollection.value = response.data;
      selectedRecords.value = [];
      pagination.value.page = 1;
      searchQuery.value = "";
      activeRecordFilters.value = [];
      loadRecords();
    }).catch(() => {
      router.push('/admin/collections');
    });
  } else {
    goBack();
  }
});
</script>
