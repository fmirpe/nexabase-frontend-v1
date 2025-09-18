// composables/useNotifications.ts
import { ref, h, render } from "vue";
import NotificationToast from "../components/NotificationToast.vue";

const notifications = ref<any[]>([]);

export function useNotifications() {
  function showNotification(options: {
    type?: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
  }) {
    const id = Date.now() + Math.random();

    // Crear el componente
    const vnode = h(NotificationToast, {
      ...options,
      onClose: () => removeNotification(id),
    });

    // Crear contenedor y renderizar
    const container = document.createElement("div");
    render(vnode, container);
    document.body.appendChild(container);

    // Agregar a la lista
    notifications.value.push({ id, container });
  }

  function removeNotification(id: number) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      const notification = notifications.value[index];
      document.body.removeChild(notification.container);
      notifications.value.splice(index, 1);
    }
  }

  function showSuccess(title: string, message: string) {
    showNotification({ type: "success", title, message });
  }

  function showError(title: string, message: string) {
    showNotification({ type: "error", title, message });
  }

  function showWarning(title: string, message: string) {
    showNotification({ type: "warning", title, message });
  }

  function showInfo(title: string, message: string) {
    showNotification({ type: "info", title, message });
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
