<template>
  <div>
    <Editor
      class="flex-col gap-0 p-0 m-0"
      :style="{
        minHeight: '120px',
      }"
      :name="'comment'"
      placeholder="What are your thoughts?"
      v-model="content"
    />
  </div>
</template>

<script setup>
import { inject } from "vue";

const content = inject("content");
</script>

<style>
.ql-toolbar.ql-snow,
.ql-container.ql-snow {
  width: 100%;
  border: none;
}
</style>
