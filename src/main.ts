import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import "./assets/styles/main.css";

import App from "./App.vue";
import { useAuthStore } from "./stores/auth";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout.vue";

// Pages - usando las rutas originales
import DashboardView from "./pages/dashboard/DashboardView.vue";
import CollectionsView from "./pages/collections/CollectionsView.vue";
import UsersView from "./pages/users/UsersView.vue";

// Nuevas páginas
import ConfigurationView from "./pages/configuration/ConfigurationView.vue";
import ActivityLogsView from "./pages/configuration/ActivityLogsView.vue";
import BackupView from "./pages/configuration/BackupView.vue";
import ApiKeysView from "./pages/configuration/ApiKeysView.vue";
import StorageView from "./components/admin/StorageView.vue";
// ✅ AGREGAR - Webhooks
import WebhooksView from "./pages/webhooks/WebhooksView.vue";

// Auth/Login view
import LoginView from "./pages/LoginPage.vue";
import OAuthCallbackView from "./pages/OAuthCallback.vue";

// Router actualizado
const routes = [
  // Login route (sin layout)
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false, title: "Iniciar Sesión" },
  },

  {
    path: "/auth/callback",
    name: "OAuthCallback",
    component: OAuthCallbackView,
    meta: { requiresAuth: false, title: "Authenticating..." },
  },

  // Protected routes (con DashboardLayout)
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: DashboardView,
        meta: { requiresAuth: true, title: "Dashboard" },
      },
      {
        path: "collections",
        name: "Collections",
        component: CollectionsView,
        meta: { requiresAuth: true, title: "Collections" },
      },
      {
        path: "users",
        name: "Users",
        component: UsersView,
        meta: { requiresAuth: true, requiresAdmin: true, title: "Users" },
      },
      {
        path: "storage",
        name: "Storage",
        component: StorageView,
        meta: { requiresAuth: true, requiresAdmin: true, title: "Storage" },
      },
      // ✅ AGREGAR - Ruta de webhooks
      {
        path: "webhooks",
        name: "Webhooks",
        component: WebhooksView,
        meta: { requiresAuth: true, requiresAdmin: true, title: "Webhooks" },
      },
      {
        path: "configuration",
        name: "Configuration",
        component: ConfigurationView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
          title: "Configuration",
        },
      },
      {
        path: "activity-logs",
        name: "ActivityLogs",
        component: ActivityLogsView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
          title: "Activity Logs",
        },
      },
      {
        path: "backup",
        name: "Backup",
        component: BackupView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
          title: "Backup & Restore",
        },
      },
      {
        path: "api-keys",
        name: "ApiKeys",
        component: ApiKeysView,
        meta: { requiresAuth: true, requiresAdmin: true, title: "API Keys" },
      },
    ],
  },

  // Catch all 404
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// ✅ Configurar router guard DESPUÉS de instalar pinia
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Set page title
  if (to.meta?.title) {
    document.title = `${to.meta.title} - NexaBase`;
  }

  // ✅ Si va a login y ya está autenticado, redirigir al dashboard
  if (to.name === "Login" && authStore.isAuthenticated) {
    next("/");
    return;
  }

  // ✅ Si requiere auth pero no está autenticado, ir a login
  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
    return;
  }

  // ✅ Si requiere admin pero no es admin, ir al dashboard (no login)
  if (to.meta?.requiresAdmin && !authStore.isAdmin) {
    next("/");
    return;
  }

  // ✅ Todo OK, continuar
  next();
});

app.use(router);
app.mount("#app");
