import { ref, computed } from "vue";
import { functionsAPI } from "@/services/api";
import type { EdgeFunction, CreateFunctionDto } from "@/types/functions";
import { useNotifications } from "./useNotifications";

export function useFunctions() {
  const { showSuccess, showError } = useNotifications();
  const functions = ref<EdgeFunction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const stats = computed(() => ({
    total: functions.value.length,
    active: functions.value.filter((f) => f.status === "active").length,
    errors: functions.value.filter((f) => f.errors > 0).length,
    totalInvocations: functions.value.reduce(
      (sum, f) => sum + f.invocations,
      0
    ),
  }));

  async function loadFunctions() {
    loading.value = true;
    error.value = null;
    try {
      const response = await functionsAPI.getAll();
      functions.value = (response.data as EdgeFunction[]) || [];
    } catch (err: any) {
      error.value = err.message || "Failed to load functions";
      showError("Error", error.value || "Failed to load functions");
    } finally {
      loading.value = false;
    }
  }

  async function createFunction(dto: CreateFunctionDto) {
    try {
      const response = await functionsAPI.create(dto);
      const newFunction = response.data || response;
      functions.value.push(newFunction as EdgeFunction);
      showSuccess("Ok", "Function created successfully");
      return newFunction;
    } catch (err: any) {
      showError("Error", err.message || "Failed to create function");
      throw err;
    }
  }

  async function updateFunction(id: string, dto: Partial<CreateFunctionDto>) {
    try {
      const response = await functionsAPI.update(id, dto);
      const updated = response.data || response;
      const index = functions.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        functions.value[index] = { ...functions.value[index], ...updated };
      }
      showSuccess("Ok", "Function updated successfully");
      return updated;
    } catch (err: any) {
      showError("Error", err.message || "Failed to update function");
      throw err;
    }
  }

  async function deleteFunction(id: string) {
    try {
      await functionsAPI.delete(id);
      functions.value = functions.value.filter((f) => f.id !== id);
      showSuccess("Delete", "Function deleted successfully");
    } catch (err: any) {
      showError("Error", err.message || "Failed to delete function");
      throw err;
    }
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await functionsAPI.toggleStatus(id, newStatus);
      const updated = response.data || response;
      const index = functions.value.findIndex((f) => f.id === id);
      if (index !== -1) {
        functions.value[index] = { ...functions.value[index], ...updated };
      }
      showSuccess(
        "Ok",
        `Function ${newStatus === "active" ? "activated" : "deactivated"}`
      );
    } catch (err: any) {
      showError("Error", err.message || "Failed to toggle function status");
      throw err;
    }
  }

  return {
    functions,
    loading,
    error,
    stats,
    loadFunctions,
    createFunction,
    updateFunction,
    deleteFunction,
    toggleStatus,
  };
}
