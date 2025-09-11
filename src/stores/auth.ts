import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authAPI } from "../services/api";

interface Tokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "user" | "admin";
  created_at: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const tokens = ref<Tokens | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Autenticado si hay token y/o user (usa OR para no bloquear UI si /auth/me tarda)
  const isAuthenticated = computed(() => !!tokens.value?.access_token);
  const isAdmin = computed(() => user.value?.role === "admin");

  const clearError = () => (error.value = null);

  const initializeAuth = () => {
    try {
      const rawT = localStorage.getItem("nexo_tokens");
      const rawU = localStorage.getItem("nexo_user");
      if (rawT) tokens.value = JSON.parse(rawT);
      if (rawU) user.value = JSON.parse(rawU);
    } catch {
      tokens.value = null;
      user.value = null;
      localStorage.removeItem("nexo_tokens");
      localStorage.removeItem("nexo_user");
    }
  };

  const persistSession = (t: Tokens | null, u: User | null) => {
    if (t?.access_token) localStorage.setItem("nexo_tokens", JSON.stringify(t));
    else localStorage.removeItem("nexo_tokens");

    if (u) localStorage.setItem("nexo_user", JSON.stringify(u));
    else localStorage.removeItem("nexo_user");
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await authAPI.getCurrentUser();
      // Ajusta el mapeo según tu contrato de /auth/me
      // Ejemplo esperado: { id, email, first_name, last_name, role, created_at }
      const u: User = {
        id: res.data.id,
        email: res.data.email,
        first_name: res.data.first_name ?? "",
        last_name: res.data.last_name ?? "",
        role: res.data.role ?? "user",
        created_at: res.data.created_at ?? new Date().toISOString(),
      };
      user.value = u;
      localStorage.setItem("nexo_user", JSON.stringify(u));
      return u;
    } catch (e) {
      // Si /auth/me falla, mantenemos el token y dejamos user = null
      return null;
    }
  };

  const login = async (data: { email: string; password: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await authAPI.login(data);
      // El backend no devuelve user; mapear tokens:
      const t: Tokens = {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        expires_in: res.data.expires_in,
        token_type: res.data.token_type || "Bearer",
      };
      tokens.value = t;
      persistSession(t, user.value);

      // Obtener perfil actual
      await fetchCurrentUser();
      return true;
    } catch (e: any) {
      error.value =
        e?.response?.data?.message || e?.message || "Error de autenticación";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await authAPI.register(data);
      // Si el backend no devuelve tokens en register, omite y pide login manual
      const access = res.data?.access_token;
      if (access) {
        const t: Tokens = {
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
          expires_in: res.data.expires_in,
          token_type: res.data.token_type || "Bearer",
        };
        tokens.value = t;
        persistSession(t, user.value);
        await fetchCurrentUser();
      }
      return true;
    } catch (e: any) {
      error.value =
        e?.response?.data?.message || e?.message || "Error al registrar";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    tokens.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem("nexo_tokens");
    localStorage.removeItem("nexo_user");
  };

  return {
    user,
    tokens,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    initializeAuth,
    login,
    register,
    logout,
    clearError,
  };
});
