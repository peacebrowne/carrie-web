<template>
  <nav
    class="w-full sticky z-[500] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>
  <main class="flex-1 overflow-hidden">
    <PublicArticleList />
  </main>
</template>

<script setup>
import PublicArticleList from "@/components/articles/PublicArticleList.vue";
import NavBar from "@/components/NavBar.vue";
</script>

<style scoped></style>
