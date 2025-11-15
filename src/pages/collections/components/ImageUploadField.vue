<template>
  <div class="space-y-4">
    <div
      :class="[
        'relative border-2 border-dashed rounded-xl p-6 transition-colors duration-200',
        isDragging
          ? 'border-green-500 bg-green-50'
          : 'border-gray-300 hover:border-gray-400',
        uploadProgress !== undefined ? 'opacity-50 pointer-events-none' : '',
      ]"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
    >
      <div
        v-if="uploadProgress !== undefined"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl"
      >
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 relative">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke-width="4"
                stroke="#e5e7eb"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke-width="4"
                stroke="#10b981"
                fill="transparent"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="
                  circumference - (uploadProgress / 100) * circumference
                "
                class="transition-all duration-300"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-sm font-semibold text-green-600"
                >{{ uploadProgress }}%</span
              >
            </div>
          </div>
          <p class="text-sm font-medium text-gray-700">
            Subiendo imagen{{ isMultiple ? "es" : "" }}...
          </p>
        </div>
      </div>

      <div v-if="!currentImages.length" class="text-center">
        <svg
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ isMultiple ? "Subir imágenes" : "Subir imagen" }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Arrastra y suelta
          {{ isMultiple ? "imágenes aquí" : "una imagen aquí" }} o haz clic para
          seleccionar
        </p>
        <button
          type="button"
          @click="triggerFileInput"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg
            class="w-4 h-4 mr-2"
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
          Seleccionar {{ isMultiple ? "imágenes" : "imagen" }}
        </button>
        <p class="text-xs text-gray-500 mt-2">
          JPG, PNG, GIF, WebP • Máximo 5MB por imagen
        </p>
      </div>

      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-gray-900">
            {{ currentImages.length }} imagen{{
              currentImages.length !== 1 ? "es" : ""
            }}
          </h4>
          <button
            type="button"
            @click="triggerFileInput"
            class="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {{ isMultiple ? "Agregar más" : "Cambiar imagen" }}
          </button>
        </div>

        <div
          v-if="!isMultiple && currentImages.length === 1"
          class="relative group"
        >
          <div class="relative w-full h-32 rounded-lg overflow-hidden">
            <img
              :data-file-id="currentImages[0]?.id"
              :src="getSignedImageUrl(currentImages[0])"
              :alt="getImageName(currentImages[0])"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div
              class="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-5 transition-all duration-200 flex items-center justify-center"
            >
              <div
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2"
              >
                <button
                  type="button"
                  @click="previewImage(currentImages[0])"
                  class="p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-5 transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="removeFile(0)"
                  class="p-2 bg-red-500 bg-opacity-10 rounded-lg hover:bg-opacity-5 transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-white"
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
          <div class="mt-2 text-center">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ getImageName(currentImages[0]) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ getImageSize(currentImages[0]) }}
            </p>
          </div>
        </div>

        <div
          v-else-if="isMultiple"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <div
            v-for="(image, index) in currentImages"
            :key="index"
            class="relative group aspect-square"
          >
            <div class="relative w-full h-full rounded-lg overflow-hidden">
              <img
                :data-file-id="image?.id"
                :src="getSignedImageUrl(image)"
                :alt="getImageName(image)"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                class="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-5 transition-all duration-200 flex items-center justify-center"
              >
                <div
                  class="opacity-0 group-hover:opacity-5 transition-opacity duration-200 flex space-x-1"
                >
                  <button
                    type="button"
                    @click="previewImage(image)"
                    class="p-1.5 bg-white bg-opacity-10 rounded-md hover:bg-opacity-5 transition-colors"
                  >
                    <svg
                      class="w-3 h-3 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="p-1.5 bg-red-500 bg-opacity-10 rounded-md hover:bg-opacity-5 transition-colors"
                  >
                    <svg
                      class="w-3 h-3 text-white"
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
            </div>
            <p class="text-xs text-gray-600 mt-1 truncate text-center">
              {{ getImageName(image) }}
            </p>
          </div>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        :multiple="isMultiple"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <div
      v-if="currentImages.length > 0"
      class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3"
    >
      <div class="flex items-center space-x-4">
        <span
          >{{ currentImages.length }} imagen{{
            currentImages.length !== 1 ? "es" : ""
          }}</span
        >
        <span>{{ getTotalSize() }}</span>
        <span v-if="isMultiple">Máximo 8 imágenes</span>
      </div>
    </div>

    <div
      v-if="previewImageUrl"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="closePreview"
    >
      <div class="relative max-w-4xl max-h-full">
        <img
          :src="previewImageUrl"
          class="max-w-full max-h-full object-contain rounded-lg"
          alt="Preview"
        />
        <button
          @click="closePreview"
          class="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black bg-opacity-5 rounded-full"
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
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../../../stores/auth";
import { ref, computed, watch, nextTick } from "vue";

const authStore = useAuthStore();

interface Props {
  fieldName: string;
  currentValue: any;
  uploadProgress?: number;
  isMultiple: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "file-upload": [event: Event];
  "file-remove": [index: number];
}>();

const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const previewImageUrl = ref<string | null>(null);
const circumference = 2 * Math.PI * 28;
const signedUrlsCache = ref<Map<string, { url: string; expires: number }>>(
  new Map()
);

const currentImages = computed(() => {
  if (!props.currentValue) return [];

  if (props.isMultiple) {
    return Array.isArray(props.currentValue) ? props.currentValue : [];
  } else {
    return props.currentValue ? [props.currentValue] : [];
  }
});

watch(
  () => props.currentValue,
  async (newValue) => {
    if (!newValue) return;

    const images = Array.isArray(newValue) ? newValue : [newValue];

    for (const image of images) {
      if (image?.id) {
        loadSignedUrl(image.id);
      }
    }
  },
  { immediate: true, deep: true }
);

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
    await nextTick(); // AGREGAR ESTA LÍNEA

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

async function previewImage(image: any) {
  if (image instanceof File) {
    previewImageUrl.value = URL.createObjectURL(image);
  } else if (image?.id) {
    const cached = signedUrlsCache.value.get(image.id);
    if (cached) {
      previewImageUrl.value = cached.url;
    } else {
      const url = await loadSignedUrl(image.id);
      previewImageUrl.value = signedUrlsCache.value.get(image.id)?.url || "";
    }
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    for (let i = 0; i < target.files.length; i++) {
      if (!target.files[i].type.startsWith("image/")) {
        alert(`El archivo "${target.files[i].name}" no es una imagen válida.`);
        return;
      }
    }

    if (
      props.isMultiple &&
      currentImages.value.length + target.files.length > 8
    ) {
      alert("Máximo 8 imágenes permitidas");
      return;
    }

    for (let i = 0; i < target.files.length; i++) {
      if (target.files[i].size > 5 * 1024 * 1024) {
        alert(
          `La imagen "${target.files[i].name}" es muy grande. Máximo 5MB por imagen.`
        );
        return;
      }
    }

    emit("file-upload", event);
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragEnter(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault();
  if (
    !(event.currentTarget as HTMLElement)?.contains(event.relatedTarget as Node)
  ) {
    isDragging.value = false;
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith("image/")) {
        alert(`El archivo "${files[i].name}" no es una imagen válida.`);
        return;
      }
    }

    if (props.isMultiple && currentImages.value.length + files.length > 8) {
      alert("Máximo 8 imágenes permitidas");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        alert(
          `La imagen "${files[i].name}" es muy grande. Máximo 5MB por imagen.`
        );
        return;
      }
    }

    const mockEvent = { target: { files } } as any;
    emit("file-upload", mockEvent);
  }
}

function removeFile(index: number) {
  emit("file-remove", index);
}

function closePreview() {
  previewImageUrl.value = null;
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = getFallbackImageUrl();
}

function getImageName(image: any): string {
  if (typeof image === "string") return `imagen_${image.substring(0, 8)}...`;
  return (
    image?.name ||
    image?.filename ||
    image?.original_name ||
    "Imagen sin nombre"
  );
}

function getImageSize(image: any): string {
  if (typeof image === "string") return "Tamaño desconocido";

  const size = image?.size;
  if (!size) return "Tamaño desconocido";

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getTotalSize(): string {
  let totalSize = 0;
  currentImages.value.forEach((image) => {
    if (typeof image !== "string" && image?.size) {
      totalSize += image.size;
    }
  });

  if (totalSize === 0) return "Tamaño total desconocido";
  if (totalSize < 1024 * 1024)
    return `${(totalSize / 1024).toFixed(1)} KB total`;
  return `${(totalSize / (1024 * 1024)).toFixed(1)} MB total`;
}
</script>
