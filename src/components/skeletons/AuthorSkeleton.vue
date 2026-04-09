<template>
  <div class="w-full flex flex-col gap-4 animate-pulse">
    <div
      v-if="layout === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2"
    >
      <div
        v-for="i in 4"
        :key="'grid-' + i"
        class="flex flex-col p-5 bg-[#FBFBFB] border border-surface-200 rounded-xl shadow-sm"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-3">
            <Skeleton shape="circle" size="5rem"></Skeleton>
            <div class="flex flex-col gap-2">
              <Skeleton width="60%" height="1rem"></Skeleton>
              <div class="flex gap-2">
                <Skeleton width="3rem" height="0.75rem"></Skeleton>
                <Skeleton width="3rem" height="0.75rem"></Skeleton>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <Skeleton width="100%" height="0.65rem"></Skeleton>
            <Skeleton width="90%" height="0.65rem"></Skeleton>
            <Skeleton width="40%" height="0.65rem"></Skeleton>
          </div>
        </div>
        <div class="mt-6 w-full">
          <Skeleton
            width="100%"
            height="2.4rem"
            border-radius="2rem"
          ></Skeleton>
        </div>
      </div>
    </div>

    <div v-else-if="layout === 'list'" class="flex flex-col gap-1 px-2">
      <div
        v-for="i in 5"
        :key="'list-' + i"
        class="w-full flex items-center justify-between py-4 border-b border-surface-100 last:border-0"
      >
        <div class="flex items-center gap-3 flex-1">
          <Skeleton
            shape="circle"
            size="2.5rem"
            class="flex-shrink-0"
          ></Skeleton>
          <div class="flex flex-col gap-2 w-full">
            <Skeleton width="35%" height="0.9rem"></Skeleton>
            <Skeleton width="65%" height="0.7rem"></Skeleton>
          </div>
        </div>
        <div class="flex-shrink-0 ml-4">
          <Skeleton width="5rem" height="2rem" borderRadius="2rem"></Skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  // Accepts 'grid' or 'list'
  layout: {
    type: String,
    default: "list",
  },
});
</script>
