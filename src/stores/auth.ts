// src/stores/auth.ts
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
  role: "user" | "admin" | "developer";
  tenantId?: string;
  status: string;
  is_active: boolean;
  created_at: string;
  avatar_url?: string;
  last_login_at?: string;
}

// ✅ INTERFACES PARA LAS RESPUESTAS DEL BACKEND
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    tenantId?: string;
    status: string;
    is_active: boolean;
    created_at: string;
  };
}

interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  tenantId?: string;
  status: string;
  is_active: boolean;
  created_at: string;
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
  const isDeveloper = computed(() => user.value?.role === "developer");
  const isModerator = computed(() => isAdmin.value || isDeveloper.value);

  const currentTenantId = computed(() => user.value?.tenantId);
  const hasTenant = computed(() => !!currentTenantId.value);

  const fullName = computed(() => {
    if (!user.value) return "";
    return (
      `${user.value.first_name} ${user.value.last_name}`.trim() ||
      user.value.email
    );
  });

  const userInitials = computed(() => {
    if (!user.value) return "?";
    const first = user.value.first_name?.[0] || "";
    const last = user.value.last_name?.[0] || "";
    return (
      (first + last).toUpperCase() || user.value.email.slice(0, 2).toUpperCase()
    );
  });

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
      const userData = res.data as UserResponse; // ✅ TYPE ASSERTION

      const u: User = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name ?? "",
        last_name: userData.last_name ?? "",
        role: userData.role as "user" | "admin" | "developer",
        tenantId: userData.tenantId,
        status: userData.status,
        is_active: userData.is_active ?? true,
        created_at: userData.created_at ?? new Date().toISOString(),
        avatar_url: userData.avatar_url,
        last_login_at: userData.last_login_at,
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
      const loginData = res.data as LoginResponse; // ✅ TYPE ASSERTION

      const t: Tokens = {
        access_token: loginData.access_token,
        refresh_token: loginData.refresh_token,
        expires_in: loginData.expires_in,
        token_type: loginData.token_type || "Bearer",
      };

      const u: User = {
        id: loginData.user.id,
        email: loginData.user.email,
        first_name: loginData.user.first_name,
        last_name: loginData.user.last_name,
        role: loginData.user.role as "user" | "admin" | "developer",
        tenantId: loginData.user.tenantId,
        status: loginData.user.status,
        is_active: loginData.user.is_active,
        created_at: loginData.user.created_at,
      };

      tokens.value = t;
      user.value = u;
      persistSession(t, u);

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

      // ✅ VERIFICAR SI EXISTE access_token
      if (
        res.data &&
        typeof res.data === "object" &&
        "access_token" in res.data
      ) {
        const loginData = res.data as LoginResponse;

        const t: Tokens = {
          access_token: loginData.access_token,
          refresh_token: loginData.refresh_token,
          expires_in: loginData.expires_in,
          token_type: loginData.token_type || "Bearer",
        };

        const u: User = {
          id: loginData.user.id,
          email: loginData.user.email,
          first_name: loginData.user.first_name,
          last_name: loginData.user.last_name,
          role: loginData.user.role as "user" | "admin" | "developer",
          tenantId: loginData.user.tenantId,
          status: loginData.user.status,
          is_active: loginData.user.is_active,
          created_at: loginData.user.created_at,
        };

        tokens.value = t;
        user.value = u;
        persistSession(t, u);
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

      if (res.data && typeof res.data === "object" && "user" in res.data) {
        const updatedUser = { ...user.value, ...(res.data as any).user };
        user.value = updatedUser;
        localStorage.setItem("nexa_user", JSON.stringify(updatedUser));
      }

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
      const refreshData = res.data as any; // ✅ TYPE ASSERTION TEMPORAL

      const newTokens: Tokens = {
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token,
        expires_in: refreshData.expires_in,
        token_type: refreshData.token_type || "Bearer",
      };

      if (refreshData.user) {
        user.value = { ...user.value, ...refreshData.user };
        localStorage.setItem("nexa_user", JSON.stringify(user.value));
      }

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
    if (tokens.value?.access_token) {
      try {
        await authAPI.logout();
      } catch (e) {
        console.warn("Logout API call failed:", e);
      }
    }

    tokens.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem("nexa_tokens");
    localStorage.removeItem("nexa_user");
  };

  const checkTokenExpiration = () => {
    if (!tokens.value?.expires_in) return true;
    return true;
  };

  initializeAuth();

  if (tokens.value?.access_token && !user.value) {
    fetchCurrentUser();
  }

  return {
    user,
    tokens,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isDeveloper,
    isModerator,
    fullName,
    userInitials,
    currentTenantId,
    hasTenant,
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
