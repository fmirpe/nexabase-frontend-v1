<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  // Initialize auth when app starts
  authStore.initializeAuth();
});
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
