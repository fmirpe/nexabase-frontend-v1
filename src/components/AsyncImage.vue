<script setup>
import nexabase from "@/service/nexabase";
import { onMounted, ref } from "vue";

const props = defineProps({
  imageData: Object,
  alt: String,
});

const imageUrl = ref(null);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  if (props.imageData && props.imageData.id) {
    try {
      imageUrl.value = await nexabase.getSignedFileUrl(
        props.imageData.id,
        3600
      );
    } catch (e) {
      console.error("Error loading image:", e);
      error.value = true;
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});
</script>

<template>
  <div
    v-if="loading"
    class="bg-gray-100 border-round flex align-items-center justify-content-center"
    style="width: 50px; height: 50px"
  >
    <i class="pi pi-spin pi-spinner text-400 text-sm"></i>
  </div>
  <img
    v-else-if="imageUrl && !error"
    :src="imageUrl"
    :alt="alt"
    class="border-round shadow-1"
    style="width: 50px; height: 50px; object-fit: cover"
    @error="error = true"
  />
  <div
    v-else
    class="bg-primary-100 border-round flex align-items-center justify-content-center"
    style="width: 50px; height: 50px"
  >
    <i class="pi pi-image text-primary text-xl"></i>
  </div>
</template>
