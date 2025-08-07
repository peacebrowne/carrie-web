<template>
  <div>
    <Editor
      class="flex-col gap-0 p-0 m-0"
      :style="{ minHeight: (editorData?.height || '320') + 'px' }"
      :name="editorData?.name || 'content'"
      :placeholder="editorData?.placeholder || 'Tell your story'"
      v-model="content"
    />

    <!-- <Editor
      class="flex-col gap-0 p-0 m-0"
      :style="{ height: (editorData?.height || '320') + 'px' }"
      :name="editorData?.name || 'content'"
      :placeholder="editorData?.placeholder || 'Tell your story'"
      v-model="content"
    >
      <template v-slot:toolbar>
        <span class="ql-formats">
          <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
          <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
          <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
        </span>
      </template>
    </Editor> -->
  </div>
</template>

<script setup>
import { inject, watch } from "vue";
const props = defineProps({
  editorData: {
    type: Object,
    required: true,
  },
});
const content = inject("content");
</script>

<style>
.ql-toolbar.ql-snow,
.ql-container.ql-snow {
  width: 100%;
  border: none;
}
</style>
