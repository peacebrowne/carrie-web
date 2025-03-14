<template>
  <nav class="sticky w-full z-50 top-0">
    <NavBar />
  </nav>
  <main class="bg-[#1B4D3E]">
    <div class="p-menubar items-start border-0 rounded-none py-0">
      <div class="container py-0 mx-auto px-16">
        <div
          class="p-menubar border-none pt-6 flex items-start gap-10 h-[calc(100vh-56px)]"
        >
          <aside class="flex gap-2 pt-3">
            <SideBar />
          </aside>
          <ScrollPanel id="main-content" class="w-full h-full">
            <header>
              <HeaderBar v-model:activeSection="activeSection" />
            </header>
            <section class="p-menubar w-full">
              <RouterView class="w-full" />
            </section>
          </ScrollPanel>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";

import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { ref, watch } from "vue";

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

<style></style>
