<template>
  <Editor
    pt:content:class="text-lg"
    class="flex-col gap-0 p-0 m-0 h-full w-full shadow-none"
    name="content"
    placeholder="Tell your story"
    v-model="content"
  />
</template>

<script setup>
import { inject, watch } from "vue";

const content = inject("content");
</script>

<style>
.ql-toolbar.ql-snow,
.ql-container.ql-snow {
  width: 100%;
  border: none;
}
</style>
