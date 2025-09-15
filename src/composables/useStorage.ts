import { ref, computed } from "vue";

export interface UploadOptions {
  folder?: string;
  collection?: string;
  record_id?: string;
  field?: string;
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
  generateThumbnail?: boolean;
}

export interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  storage_path: string;
  folder: string;
  url: string;
  created_at: string;
  is_public?: boolean;
  metadata?: Record<string, any>;
}

export interface FileListResponse {
  data: UploadedFile[];
  total: number;
  page: number;
  pages: number;
}

export function useStorage() {
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getAuthToken = (): string => {
    try {
      const tokens = localStorage.getItem("nexa_tokens");
      return tokens ? JSON.parse(tokens).access_token : "";
    } catch {
      return "";
    }
  };

  const getBaseUrl = (): string => {
    return import.meta.env.VITE_API_URL || "http://localhost:3000";
  };

  const handleError = (e: any): never => {
    const message =
      e?.response?.data?.message ||
      e?.message ||
      "An unexpected error occurred";
    error.value = message;
    throw new Error(message);
  };

  const uploadFile = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadedFile> => {
    try {
      uploading.value = true;
      error.value = null;
      uploadProgress.value = 0;

      const formData = new FormData();
      formData.append("file", file);

      const params = new URLSearchParams();
      if (options.folder) params.append("folder", options.folder);
      if (options.collection) params.append("collection", options.collection);
      if (options.record_id) params.append("record_id", options.record_id);
      if (options.field) params.append("field", options.field);

      const url = `${getBaseUrl()}/api/storage/upload${
        params.toString() ? "?" + params.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message);
      }

      const result = await response.json();
      uploadProgress.value = 100;

      return result;
    } catch (e: any) {
      return handleError(e);
    } finally {
      uploading.value = false;
    }
  };

  const listFiles = async (
    params: {
      folder?: string;
      collection?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<FileListResponse> => {
    try {
      loading.value = true;
      error.value = null;

      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${getBaseUrl()}/api/storage${
        searchParams.toString() ? "?" + searchParams.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message);
      }

      return await response.json();
    } catch (e: any) {
      return handleError(e);
    } finally {
      loading.value = false;
    }
  };

  const getFile = async (fileId: string): Promise<UploadedFile> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`${getBaseUrl()}/api/storage/${fileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message);
      }

      return await response.json();
    } catch (e: any) {
      return handleError(e);
    } finally {
      loading.value = false;
    }
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`${getBaseUrl()}/api/storage/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message);
      }
    } catch (e: any) {
      return handleError(e);
    } finally {
      loading.value = false;
    }
  };

  const getStats = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`${getBaseUrl()}/api/storage/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message);
      }

      return await response.json();
    } catch (e: any) {
      return handleError(e);
    } finally {
      loading.value = false;
    }
  };

  const getFileUrl = (fileId: string): string => {
    return `${getBaseUrl()}/api/storage/${fileId}/download`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const isImage = (mimeType: string): boolean => {
    return mimeType.startsWith("image/");
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType === "application/pdf") return "📄";
    if (mimeType.includes("document") || mimeType.includes("word")) return "📝";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
      return "📊";
    return "📄";
  };

  return {
    // State
    uploading: computed(() => uploading.value),
    loading: computed(() => loading.value || uploading.value),
    uploadProgress: computed(() => uploadProgress.value),
    error: computed(() => error.value),

    // Methods
    uploadFile,
    listFiles,
    getFile,
    deleteFile,
    getStats,

    // Utilities
    getFileUrl,
    formatFileSize,
    isImage,
    getFileIcon,
    clearError: () => {
      error.value = null;
    },
  };
}
