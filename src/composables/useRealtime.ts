// src/composables/useRealtime.ts
import { ref, onMounted, onUnmounted } from "vue";
import { io, Socket } from "socket.io-client";

export function useRealtime() {
  const socket = ref<Socket | null>(null);
  const connected = ref(false);
  const subscriptions = ref<Map<string, any>>(new Map());

  const connect = (token?: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    socket.value = io(`${baseUrl}/realtime`, {
      auth: { token },
      autoConnect: false,
    });

    socket.value.on("connect", () => {
      connected.value = true;
      console.log("Real-time connected");
    });

    socket.value.on("disconnect", () => {
      connected.value = false;
      console.log("Real-time disconnected");
    });

    socket.value.on("collection_change", (data) => {
      // Emitir evento para que los componentes lo escuchen
      window.dispatchEvent(
        new CustomEvent("nexabase:collection_change", { detail: data })
      );
    });

    socket.value.connect();
  };

  const subscribe = (collection: string, filter?: any) => {
    if (!socket.value || !connected.value) return;

    socket.value.emit("subscribe", { collection, filter });
    subscriptions.value.set(collection, filter);
  };

  const unsubscribe = (collection: string) => {
    if (!socket.value) return;

    socket.value.emit("unsubscribe", { collection });
    subscriptions.value.delete(collection);
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    connected,
    connect,
    subscribe,
    unsubscribe,
    disconnect,
    subscriptions,
  };
}
