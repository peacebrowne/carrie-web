<template>
  <nav
    class="w-full sticky z-[500] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>
  <main class="flex-1 overflow-hidden">
    <ScrollPanel id="main-content" class="flex w-full h-full">
      <div
        class="container flex flex-col w-full h-full m-auto md:px-8 lg:px-36 2xl:px-52"
      >
        <section>
          <RouterView class="w-full" />
        </section>
      </div>
    </ScrollPanel>
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
