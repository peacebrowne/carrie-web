<template>
  <nav
    class="w-full sticky z-[200] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>
  <main class="flex-1 overflow-hidden">
    <section>
      <RouterView class="w-full" />
    </section>
  </main>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";

import NavBar from "@/components/NavBar.vue";
import { watch } from "vue";

const breadCrumbs = defineModel("breadCrumbs");
const activeSection = defineModel("activeSection");
const route = useRoute();

activeSection.value = route.path.split("/")[2];

watch(
  () => route.path,
  (path) => {
    const currentSection = path.split("/")[2];
    activeSection.value = currentSection;
    breadCrumbs.value = [currentSection];
  }
);
</script>

<style scoped></style>
