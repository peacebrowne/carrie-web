<template>
  <div class="w-[100vw] overflow-hidden flex flex-col">
    <nav class="w-full relative h-16 z-50 flex top-0">
      <NavBar />
    </nav>
    <main class="flex-1 overflow-hidden">
      <PublicArticleList />
    </main>
  </div>
</template>

<script setup>
import PublicArticleList from "@/components/articles/PublicArticleList.vue";
import NavBar from "@/components/NavBar.vue";
</script>

<style scoped></style>
