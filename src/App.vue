<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Loading Screen -->
    <div
      v-if="authStore.loading"
      class="fixed inset-0 bg-white flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading NexaBase Dashboard...</p>
      </div>
    </div>

    <!-- Main App -->
    <div v-else>
      <!-- Login Page -->
      <LoginPage v-if="!authStore.isAuthenticated" />

      <!-- Dashboard Layout -->
      <DashboardLayout v-else>
        <router-view />
      </DashboardLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import LoginPage from "./pages/LoginPage.vue";
import DashboardLayout from "./layouts/DashboardLayout.vue";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initializeAuth();
});
</script>
