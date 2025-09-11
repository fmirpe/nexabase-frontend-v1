import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import "./assets/styles/main.css";

import App from "./App.vue";
import { useAuthStore } from "./stores/auth";

// Pages
import DashboardView from "./pages/dashboard/DashboardView.vue";
import CollectionsView from "./pages/collections/CollectionsView.vue";
import UsersView from "./pages/users/UsersView.vue";

// Router
const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true, title: "Dashboard" },
  },
  {
    path: "/collections",
    name: "Collections",
    component: CollectionsView,
    meta: { requiresAuth: true, title: "Collections" },
  },
  {
    path: "/users",
    name: "Users",
    component: UsersView,
    meta: { requiresAuth: true, requiresAdmin: true, title: "Users" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.loading) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/");
    return;
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next("/");
    return;
  }

  next();
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Eliminar estas dos líneas si existían:
// const authStore = useAuthStore();
// authStore.setupInterceptors();

app.mount("#app");
