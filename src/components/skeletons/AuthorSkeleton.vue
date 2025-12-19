<template>
  <div class="w-full flex flex-col gap-2 animate-pulse">
    <div class="px-2 pt-6 pb-4">
      <Skeleton width="8rem" height="1.2rem"></Skeleton>
    </div>

    <div
      v-for="i in 5"
      :key="i"
      class="w-full flex items-start gap-2 pr-2 px-2"
    >
      <div class="flex items-start gap-2 flex-1 py-2">
        <Skeleton shape="circle" size="2.5rem" class="flex-shrink-0"></Skeleton>

        <div class="flex flex-col gap-2 w-full mt-1">
          <Skeleton width="50%" height="0.9rem"></Skeleton>
          <Skeleton width="85%" height="0.7rem"></Skeleton>
          <Skeleton width="60%" height="0.7rem"></Skeleton>
        </div>
      </div>

      <div class="pt-4">
        <Skeleton width="4.5rem" height="1.8rem" borderRadius="2rem"></Skeleton>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
