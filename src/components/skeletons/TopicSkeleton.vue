<template>
  <div v-if="type === 'list'" class="w-full flex flex-col gap-4 animate-pulse">
    <div class="px-2 pt-6 pb-4">
      <Skeleton width="6rem" height="1rem"></Skeleton>
    </div>

    <div
      v-for="i in 3"
      :key="i"
      class="w-full flex items-start gap-2 pr-2 px-2"
    >
      <div class="flex items-start gap-2 flex-1">
        <Skeleton shape="circle" size="2rem" class="flex-shrink-0"></Skeleton>

        <div class="flex flex-col gap-2 w-full mt-1">
          <Skeleton width="40%" height="0.9rem"></Skeleton>
          <div class="flex items-center gap-2">
            <Skeleton width="25%" height="0.7rem"></Skeleton>
            <Skeleton shape="circle" size="0.25rem"></Skeleton>
            <Skeleton width="20%" height="0.7rem"></Skeleton>
          </div>
        </div>
      </div>

      <div class="pt-2">
        <Skeleton width="4.5rem" height="1.8rem" borderRadius="2rem"></Skeleton>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col gap-2 px-2 animate-pulse">
    <div class="pt-4 pb-4">
      <Skeleton width="8rem" height="1rem"></Skeleton>
    </div>
    <div class="flex flex-wrap gap-2">
      <Skeleton
        v-for="i in 6"
        :key="'chip-' + i"
        width="5rem"
        height="2rem"
        borderRadius="2rem"
      ></Skeleton>
    </div>
    <div class="mt-2">
      <Skeleton width="7rem" height="1.5rem"></Skeleton>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";

defineProps({
  // 'list' for Suggestions page, 'chips' for Home page
  type: {
    type: String,
    default: "list",
  },
});
</script>
