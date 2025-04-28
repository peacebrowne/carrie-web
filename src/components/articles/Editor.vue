<template>
  <div>
    <Editor
      class="flex-col gap-0 p-0 m-0"
      name="content"
      editorStyle="height: 320px"
      placeholder="Tell your story"
      v-model="content"
    >
      <template v-slot:toolbar>
        <span class="ql-formats">
          <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
          <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
          <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
        </span>
      </template>
    </Editor>
  </div>
</template>

<script setup>
import {inject } from 'vue';

const content = inject('content');

</script>

<style>
.ql-toolbar.ql-snow,
.ql-container.ql-snow {
  width: 100%;
  border: none;
}
</style>
