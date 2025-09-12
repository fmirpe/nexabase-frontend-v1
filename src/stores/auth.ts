import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue"; // ✅ Agregar readonly al import
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
  role: "user" | "admin" | "moderator";
  created_at: string;
  is_active?: boolean;
  avatar_url?: string;
  last_login_at?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const tokens = ref<Tokens | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const isAuthenticated = computed(() => !!tokens.value?.access_token);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isModerator = computed(
    () => user.value?.role === "moderator" || isAdmin.value
  );

  // Full name helper
  const fullName = computed(() => {
    if (!user.value) return "";
    return (
      `${user.value.first_name} ${user.value.last_name}`.trim() ||
      user.value.email
    );
  });

  // User initials helper
  const userInitials = computed(() => {
    if (!user.value) return "?";
    const first = user.value.first_name?.[0] || "";
    const last = user.value.last_name?.[0] || "";
    return (
      (first + last).toUpperCase() || user.value.email.slice(0, 2).toUpperCase()
    );
  });

  // Actions
  const clearError = () => (error.value = null);

  const initializeAuth = () => {
    try {
      const rawT = localStorage.getItem("nexa_tokens");
      const rawU = localStorage.getItem("nexa_user");
      if (rawT) tokens.value = JSON.parse(rawT);
      if (rawU) user.value = JSON.parse(rawU);
    } catch {
      tokens.value = null;
      user.value = null;
      localStorage.removeItem("nexa_tokens");
      localStorage.removeItem("nexa_user");
    }
  };

  const persistSession = (t: Tokens | null, u: User | null) => {
    if (t?.access_token) localStorage.setItem("nexa_tokens", JSON.stringify(t));
    else localStorage.removeItem("nexa_tokens");

    if (u) localStorage.setItem("nexa_user", JSON.stringify(u));
    else localStorage.removeItem("nexa_user");
  };

  const fetchCurrentUser = async () => {
    if (!tokens.value?.access_token) return null;

    try {
      const res = await authAPI.getCurrentUser();
      const u: User = {
        id: res.data.id,
        email: res.data.email,
        first_name: res.data.first_name ?? "",
        last_name: res.data.last_name ?? "",
        role: res.data.role ?? "user",
        created_at: res.data.created_at ?? new Date().toISOString(),
        is_active: res.data.is_active ?? true,
        avatar_url: res.data.avatar_url,
        last_login_at: res.data.last_login_at,
      };
      user.value = u;
      localStorage.setItem("nexa_user", JSON.stringify(u));
      return u;
    } catch (e) {
      console.warn("Failed to fetch current user:", e);
      return null;
    }
  };

  const login = async (data: { email: string; password: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await authAPI.login(data);
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
      return { success: true };
    } catch (e: any) {
      error.value =
        e?.response?.data?.message || e?.message || "Error de autenticación";
      return { success: false, error: error.value };
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
      return { success: true };
    } catch (e: any) {
      error.value =
        e?.response?.data?.message || e?.message || "Error al registrar";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!tokens.value?.access_token)
      return { success: false, error: "No authenticated" };

    loading.value = true;
    error.value = null;
    try {
      const res = await authAPI.updateProfile(profileData);
      const updatedUser = { ...user.value, ...res.data.user };
      user.value = updatedUser;
      localStorage.setItem("nexa_user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (e: any) {
      error.value =
        e?.response?.data?.message || e?.message || "Error actualizando perfil";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const changePassword = async (passwordData: {
    current_password: string;
    new_password: string;
  }) => {
    if (!tokens.value?.access_token)
      return { success: false, error: "No authenticated" };

    loading.value = true;
    error.value = null;
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (e: any) {
      error.value =
        e?.response?.data?.message ||
        e?.message ||
        "Error cambiando contraseña";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const refreshTokens = async () => {
    if (!tokens.value?.refresh_token) return false;

    try {
      const res = await authAPI.refresh(tokens.value.refresh_token);
      const newTokens: Tokens = {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        expires_in: res.data.expires_in,
        token_type: res.data.token_type || "Bearer",
      };
      tokens.value = newTokens;
      localStorage.setItem("nexa_tokens", JSON.stringify(newTokens));
      return true;
    } catch (e) {
      console.warn("Failed to refresh tokens:", e);
      logout();
      return false;
    }
  };

  const logout = async () => {
    // Intentar cerrar sesión en el servidor (opcional)
    if (tokens.value?.access_token) {
      try {
        await authAPI.logout();
      } catch (e) {
        // Ignorar errores de logout del servidor
        console.warn("Logout API call failed:", e);
      }
    }

    // Limpiar estado local
    tokens.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem("nexa_tokens");
    localStorage.removeItem("nexa_user");
  };

  const checkTokenExpiration = () => {
    if (!tokens.value?.expires_in) return true;

    // Implementar lógica de verificación de expiración si es necesario
    // Por ahora, asumimos que el interceptor maneja el refresh automáticamente
    return true;
  };

  // Initialize auth when store is created
  initializeAuth();

  // Auto-fetch user if we have tokens but no user data
  if (tokens.value?.access_token && !user.value) {
    fetchCurrentUser();
  }

  return {
    // State - sin readonly para simplificar
    user,
    tokens,
    loading,
    error,

    // Computed
    isAuthenticated,
    isAdmin,
    isModerator,
    fullName,
    userInitials,

    // Actions
    initializeAuth,
    login,
    register,
    updateProfile,
    changePassword,
    refreshTokens,
    logout,
    fetchCurrentUser,
    clearError,
    checkTokenExpiration,
  };
});
