<template>
  <div class="file-uploader">
    <!-- Drop Zone -->
    <div
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
        isDragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400',
      ]"
      @click="openFileDialog"
    >
      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="handleFileSelect"
        class="hidden"
      />

      <div v-if="!uploading">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          />
        </svg>

        <div class="text-sm text-gray-600">
          <span class="font-medium text-blue-600 hover:text-blue-500">
            Clic para subir {{ multiple ? "archivos" : "archivo" }}
          </span>
          <span> o arrastra y suelta aquí</span>
        </div>

        <p class="text-xs text-gray-500 mt-2">
          {{ acceptText }}
        </p>

        <p class="text-xs text-gray-400 mt-1">
          Máximo {{ maxSizeMB }}MB por archivo
        </p>
      </div>

      <div v-else class="space-y-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
        ></div>
        <div>
          <p class="text-sm text-gray-600">
            Subiendo archivo{{
              multiple && selectedFiles.length > 1 ? "s" : ""
            }}...
          </p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="`width: ${uploadProgress}%`"
            ></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ uploadProgress }}%</p>
          <p class="text-xs text-gray-400 mt-1" v-if="selectedFiles.length > 0">
            {{ selectedFiles.map((f) => f.name).join(", ") }}
          </p>
        </div>
      </div>
    </div>

    <!-- File List -->
    <div v-if="uploadedFiles.length > 0" class="mt-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">
        {{ uploadedFiles.length }} archivo{{
          uploadedFiles.length > 1 ? "s" : ""
        }}
        subido{{ uploadedFiles.length > 1 ? "s" : "" }}:
      </h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="file in uploadedFiles"
          :key="file.id"
          class="relative group border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <!-- File Icon/Preview -->
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div
                v-if="isImage(file.mime_type)"
                class="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  :src="getFileUrl(file.id)"
                  :alt="file.original_name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              <div
                v-else
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg"
              >
                {{ getFileIcon(file.mime_type) }}
              </div>
            </div>

            <!-- File Info -->
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 truncate"
                :title="file.original_name"
              >
                {{ file.original_name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }}
              </p>
              <p class="text-xs text-gray-400">
                {{ file.mime_type }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-1">
              <button
                @click="downloadFile(file)"
                class="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Descargar"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>

              <button
                @click="removeFile(file)"
                class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
    >
      <div class="flex">
        <svg
          class="w-5 h-5 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="ml-3 text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStorage } from "../composables/useStorage";

interface Props {
  multiple?: boolean;
  accept?: string;
  folder?: string;
  collection?: string;
  record_id?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  accept: "image/*,application/pdf,.txt,.json",
  maxSize: 50,
  maxFiles: 10,
});

const emit = defineEmits<{
  uploaded: [files: any[]];
  error: [error: string];
}>();

const {
  uploading,
  uploadProgress,
  error,
  uploadFile,
  deleteFile,
  getFileUrl,
  formatFileSize,
  isImage,
  getFileIcon,
  clearError,
} = useStorage();

const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);
const uploadedFiles = ref<any[]>([]);
const selectedFiles = ref<File[]>([]);

const maxSizeMB = computed(() => props.maxSize);

const acceptText = computed(() => {
  const types = props.accept.split(",").map((type) => type.trim());
  if (types.includes("image/*")) {
    return "Imágenes, PDFs y documentos";
  }
  return `Archivos: ${types.join(", ")}`;
});

const openFileDialog = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  await processFiles(files);
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = Array.from(event.dataTransfer?.files || []);
  await processFiles(files);
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const processFiles = async (files: File[]) => {
  if (files.length === 0) return;

  clearError();

  // Validations
  if (files.length > props.maxFiles) {
    emit("error", `Máximo ${props.maxFiles} archivos permitidos`);
    return;
  }

  const oversizedFiles = files.filter(
    (file) => file.size > props.maxSize * 1024 * 1024
  );
  if (oversizedFiles.length > 0) {
    emit(
      "error",
      `Algunos archivos exceden ${props.maxSize}MB: ${oversizedFiles
        .map((f) => f.name)
        .join(", ")}`
    );
    return;
  }

  selectedFiles.value = files;

  try {
    const uploadPromises = files.map((file) =>
      uploadFile(file, {
        folder: props.folder,
        collection: props.collection,
        record_id: props.record_id,
      })
    );

    const results = await Promise.all(uploadPromises);

    uploadedFiles.value.push(...results);
    emit("uploaded", results);

    // Clear input
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    selectedFiles.value = [];
  } catch (e: any) {
    emit("error", e.message);
  }
};

const removeFile = async (file: any) => {
  try {
    await deleteFile(file.id);
    const index = uploadedFiles.value.findIndex((f) => f.id === file.id);
    if (index !== -1) {
      uploadedFiles.value.splice(index, 1);
    }
  } catch (e: any) {
    emit("error", e.message);
  }
};

const downloadFile = (file: any) => {
  const link = document.createElement("a");
  link.href = getFileUrl(file.id);
  link.download = file.original_name;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = "none";
  }
};
</script>
