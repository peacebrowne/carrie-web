<template>
  <div class="animate-pulse px-2">
    <div v-if="type === 'list'" class="flex flex-col gap-4">
      <Skeleton width="6rem" height="1.2rem" class="mt-6 mb-4"></Skeleton>
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center justify-between py-2"
      >
        <div class="flex items-center gap-2">
          <Skeleton shape="circle" size="2.5rem"></Skeleton>
          <div class="flex flex-col gap-2">
            <Skeleton width="8rem" height="0.9rem"></Skeleton>
            <Skeleton width="12rem" height="0.7rem"></Skeleton>
          </div>
        </div>
        <Skeleton width="4.5rem" height="1.8rem" borderRadius="2rem"></Skeleton>
      </div>
    </div>

    <div v-else class="flex flex-col gap-4">
      <div class="flex items-center gap-2 mt-6 mb-2">
        <Skeleton shape="circle" size="1.2rem"></Skeleton>
        <Skeleton width="5rem" height="1rem"></Skeleton>
      </div>
      <div v-for="i in 3" :key="'comp-' + i" class="flex items-center gap-2">
        <Skeleton shape="circle" size="1.5rem"></Skeleton>
        <Skeleton width="7rem" height="0.9rem"></Skeleton>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
defineProps({ type: { type: String, default: "compact" } });
</script>
