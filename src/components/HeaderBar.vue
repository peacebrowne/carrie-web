<template>
  <div class="p-menubar border-0 rounded-none pb-4">
    <div class="max-w-7xl flex items-center">
      <span class="text-2xl font-bold p-4">{{ title }}</span>
      <BreadCrumbs />
    </div>
  </div>
</template>

<script setup>
import BreadCrumbs from "./BreadCrumbs.vue";

import { computed } from "vue";

const activeSection = defineModel("activeSection");

const title = computed(() => {
  return `${activeSection.value
    .split("")[0]
    .toUpperCase()}${activeSection.value.slice(1)}`;
});
</script>
