// src/stores/auth.ts - VERSIÓN COMPLETA CORREGIDA

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authAPI, tenantsAPI } from "../services/api";

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
  tenantId?: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
  avatar_url?: string;
  last_login_at?: string;
}

// ✅ INTERFACES PARA RESPUESTAS API
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  requires_organization?: boolean;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    tenantId?: string | null;
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
  tenantId?: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
  avatar_url?: string;
  last_login_at?: string;
}

interface CreateOrganizationResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    tenantId: string;
    requires_organization: boolean;
  };
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user?: Partial<User>;
}

interface UpdateProfileResponse {
  user: Partial<User>;
}

interface ApiErrorResponse {
  message: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const tokens = ref<Tokens | null>(null);
  const loading = ref(false);
  const error = ref<string | undefined>(undefined); // ✅ CAMBIO: undefined en lugar de null

  // Computed properties
  const isAuthenticated = computed((): boolean => !!tokens.value?.access_token);
  const isAdmin = computed((): boolean => user.value?.role === "admin");
  const isDeveloper = computed((): boolean => user.value?.role === "developer");
  const isModerator = computed(
    (): boolean => isAdmin.value || isDeveloper.value
  );

  const currentTenantId = computed(
    (): string | null | undefined => user.value?.tenantId
  );
  const hasTenant = computed((): boolean => !!currentTenantId.value);

  const fullName = computed((): string => {
    if (!user.value) return "";
    return (
      `${user.value.first_name} ${user.value.last_name}`.trim() ||
      user.value.email
    );
  });

  const userInitials = computed((): string => {
    if (!user.value) return "?";
    const first = user.value.first_name?.[0] || "";
    const last = user.value.last_name?.[0] || "";
    return (
      (first + last).toUpperCase() || user.value.email.slice(0, 2).toUpperCase()
    );
  });

  const requiresOrganization = computed((): boolean => {
    return (
      !user.value ||
      !user.value.tenantId ||
      user.value.tenantId === null ||
      user.value.tenantId === "null"
    );
  });

  const clearError = (): void => {
    error.value = undefined; // ✅ CAMBIO
  };

  const initializeAuth = (): void => {
    try {
      const rawT = localStorage.getItem("nexa_tokens");
      const rawU = localStorage.getItem("nexa_user");
      if (rawT) tokens.value = JSON.parse(rawT) as Tokens;
      if (rawU) user.value = JSON.parse(rawU) as User;
    } catch {
      tokens.value = null;
      user.value = null;
      error.value = undefined; // ✅ CAMBIO
      localStorage.removeItem("nexa_tokens");
      localStorage.removeItem("nexa_user");
    }
  };

  const persistSession = (t: Tokens | null, u: User | null): void => {
    if (t?.access_token) localStorage.setItem("nexa_tokens", JSON.stringify(t));
    else localStorage.removeItem("nexa_tokens");

    if (u) localStorage.setItem("nexa_user", JSON.stringify(u));
    else localStorage.removeItem("nexa_user");
  };

  const fetchCurrentUser = async (): Promise<User | null> => {
    if (!tokens.value?.access_token) return null;

    try {
      const res = await authAPI.getCurrentUser();
      const userData = res.data as UserResponse;

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

  const login = async (data: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    loading.value = true;
    error.value = undefined; // ✅ CAMBIO
    try {
      const res = await authAPI.login(data);
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

      return { success: true };
    } catch (e: any) {
      const apiError = e?.response?.data as ApiErrorResponse;
      error.value = apiError?.message || e?.message || "Error de autenticación";
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
  }): Promise<{ success: boolean; error?: string }> => {
    loading.value = true;
    error.value = undefined; // ✅ CAMBIO
    try {
      const res = await authAPI.register(data);

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
      const apiError = e?.response?.data as ApiErrorResponse;
      error.value = apiError?.message || e?.message || "Error al registrar";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (
    profileData: Partial<User>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!tokens.value?.access_token)
      return { success: false, error: "No authenticated" };

    loading.value = true;
    error.value = undefined; // ✅ CAMBIO
    try {
      const res = await authAPI.updateProfile(profileData);

      if (res.data && typeof res.data === "object" && "user" in res.data) {
        const updateResponse = res.data as UpdateProfileResponse;
        const updatedUser = { ...user.value, ...updateResponse.user } as User;
        user.value = updatedUser;
        localStorage.setItem("nexa_user", JSON.stringify(updatedUser));
      }

      return { success: true };
    } catch (e: any) {
      const apiError = e?.response?.data as ApiErrorResponse;
      error.value =
        apiError?.message || e?.message || "Error actualizando perfil";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const changePassword = async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!tokens.value?.access_token)
      return { success: false, error: "No authenticated" };

    loading.value = true;
    error.value = undefined; // ✅ CAMBIO
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (e: any) {
      const apiError = e?.response?.data as ApiErrorResponse;
      error.value =
        apiError?.message || e?.message || "Error cambiando contraseña";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    if (!tokens.value?.refresh_token) return false;

    try {
      const res = await authAPI.refresh(tokens.value.refresh_token);
      const refreshData = res.data as RefreshResponse;

      const newTokens: Tokens = {
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token,
        expires_in: refreshData.expires_in,
        token_type: refreshData.token_type || "Bearer",
      };

      if (refreshData.user && user.value) {
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

  const logout = async (): Promise<void> => {
    if (tokens.value?.access_token) {
      try {
        await authAPI.logout();
      } catch (e) {
        console.warn("Logout API call failed:", e);
      }
    }

    tokens.value = null;
    user.value = null;
    error.value = undefined; // ✅ CAMBIO
    localStorage.removeItem("nexa_tokens");
    localStorage.removeItem("nexa_user");
  };

  const handleOAuthCallback = async (
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    loading.value = true;
    error.value = undefined; // ✅ CAMBIO

    try {
      tokens.value = {
        access_token: token,
        token_type: "Bearer",
      };

      localStorage.setItem("nexa_tokens", JSON.stringify(tokens.value));

      const userData = await fetchCurrentUser();

      if (userData) {
        return { success: true };
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (e: any) {
      error.value = e?.message || "OAuth authentication failed";
      tokens.value = null;
      user.value = null;
      localStorage.removeItem("nexa_tokens");
      localStorage.removeItem("nexa_user"); // ✅ CORREGIDO
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const checkTokenExpiration = (): boolean => {
    if (!tokens.value?.expires_in) return true;
    return true;
  };

  const refreshCurrentOrganization = async (): Promise<void> => {
    if (!tokens.value?.access_token) return;

    try {
      const response = await tenantsAPI.getUserOrganizations();
      const data = response.data as {
        organizations: any[];
        currentTenantId: string | null;
      };

      if (data.organizations && data.organizations.length > 0 && user.value) {
        const currentOrg = data.organizations.find((org) => org.isActive);
        if (currentOrg) {
          user.value.tenantId = currentOrg.id;
          localStorage.setItem("nexa_user", JSON.stringify(user.value));
        }
      }
    } catch (error) {
      console.warn("Failed to refresh organization:", error);
    }
  };

  const createFirstOrganization = async (orgData: {
    name: string;
    slug?: string;
    description?: string;
    planId?: string;
    paymentMethod?: string;
  }): Promise<{ success: boolean; error?: string; organization?: any }> => {
    loading.value = true;
    error.value = undefined; // ✅ CAMBIO

    try {
      const res = await authAPI.createFirstOrganization(orgData);
      const responseData = res.data as CreateOrganizationResponse;

      if (user.value && responseData.user) {
        user.value = {
          ...user.value,
          tenantId: responseData.user.tenantId,
        };

        localStorage.setItem("nexa_user", JSON.stringify(user.value));
      }

      return { success: true, organization: responseData.organization };
    } catch (e: any) {
      const apiError = e?.response?.data as ApiErrorResponse;
      error.value =
        apiError?.message || e?.message || "Error creando organización";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  // Initialize
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
    requiresOrganization,
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
    handleOAuthCallback,
    createFirstOrganization,
    refreshCurrentOrganization,
  };
});
