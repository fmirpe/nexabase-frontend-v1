import { ref, computed } from "vue";
import { hooksAPI } from "@/services/api";
import { useNotifications } from "./useNotifications";

export interface Hook {
  id: string; // ✅ AGREGAR
  name: string;
  trigger: string;
  collections?: string[];
  priority?: number;
  async?: boolean;
  active?: boolean;
  executions?: number;
  code?: string;
}

export function useHooks() {
  const { showSuccess, showError } = useNotifications();
  const hooks = ref<Hook[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const stats = computed(() => {
    // ✅ VALIDAR que sea un array
    if (!Array.isArray(hooks.value)) {
      return {
        total: 0,
        active: 0,
        byTrigger: {},
        totalExecutions: 0,
      };
    }

    const byTrigger: Record<string, number> = {};

    hooks.value.forEach((hook) => {
      const trigger = hook.trigger.split(":")[0];
      byTrigger[trigger] = (byTrigger[trigger] || 0) + 1;
    });

    return {
      total: hooks.value.length,
      active: hooks.value.filter((h) => h.active !== false).length,
      byTrigger,
      totalExecutions: hooks.value.reduce(
        (sum, h) => sum + (h.executions || 0),
        0
      ),
    };
  });

  async function loadHooks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await hooksAPI.getAll();

      // ✅ CORRECTO: Extraer el array de data
      hooks.value = (response as any).data?.data || [];

      console.log("✅ Hooks loaded:", hooks.value);
    } catch (err: any) {
      console.error("❌ Error loading hooks:", err);
      console.error("❌ Error response:", err.response?.data);
      error.value = err.message || "Failed to load hooks";
      showError(error.value || "Failed to load hooks", "Error");
      hooks.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function registerHook(hookData: any) {
    try {
      const payload = {
        name: hookData.name,
        trigger: hookData.trigger,
        collections: hookData.collections || [],
        priority: hookData.priority || 0,
        async: hookData.async || false,
        code: hookData.code, // Solo enviar el código como string
        description: hookData.description || "",
      };

      await hooksAPI.register(payload);
      await loadHooks();
      showSuccess("Hook registered successfully", "");
    } catch (err: any) {
      showError(err.message || "Failed to register hook", "");
      throw err;
    }
  }

  async function updateHook(id: string, updates: any) {
    try {
      await hooksAPI.update(id, updates); // ✅ Usar ID, no name
      const index = hooks.value.findIndex((h) => h.id === id); // ✅ Buscar por ID
      if (index !== -1) {
        hooks.value[index] = { ...hooks.value[index], ...updates };
      }
      showSuccess("Hook updated successfully", "");
    } catch (err: any) {
      showError(err.message || "Failed to update hook", "");
      throw err;
    }
  }

  async function deleteHook(id: string) {
    try {
      await hooksAPI.delete(id); // ✅ Usar ID, no name
      hooks.value = hooks.value.filter((h) => h.id !== id); // ✅ Filtrar por ID
      showSuccess("Hook deleted successfully", "");
    } catch (err: any) {
      showError(err.message || "Failed to delete hook", "");
      throw err;
    }
  }

  async function toggleStatus(id: string, currentActive: boolean) {
    try {
      const newStatus = !currentActive;
      await hooksAPI.update(id, { active: newStatus }); // ✅ Usar ID, no name
      const hook = hooks.value.find((h) => h.id === id); // ✅ Buscar por ID
      if (hook) {
        hook.active = newStatus;
      }
      showSuccess(`Hook ${newStatus ? "activated" : "deactivated"}`, "");
    } catch (err: any) {
      showError(err.message || "Failed to toggle hook status", "");
      throw err;
    }
  }

  async function triggerHook(id: string, context: any) {
    try {
      const result = await hooksAPI.trigger(id, context); // ✅ Usar ID, no name
      showSuccess("Hook triggered successfully", "");
      return result;
    } catch (err: any) {
      showError(err.message || "Failed to trigger hook", "");
      throw err;
    }
  }

  return {
    hooks,
    loading,
    error,
    stats,
    loadHooks,
    registerHook,
    updateHook,
    deleteHook,
    toggleStatus,
    triggerHook,
  };
}
