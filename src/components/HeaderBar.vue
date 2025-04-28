<template>
  <div class="">
    <div class="w-[60%] flex items-center justify-between">
      <span class="text-4xl font-semibold p-4">{{ title }}</span>
      <div class="flex justify-center items-center gap-4">
        <router-link :to="{ name: 'write' }">
          <Button
            label="Write a Story"
            class="bg-[#1B4D3E] text-white text-xs"
            rounded
          />
        </router-link>
        <Button
          label="Import a Story"
          severity="contrast"
          class="text-xs"
          variant="outlined"
          rounded
        />
      </div>
      <!-- <BreadCrumbs /> -->
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
