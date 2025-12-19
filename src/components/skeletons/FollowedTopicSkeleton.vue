<template>
  <div class="animate-pulse px-2">
    <Skeleton width="6rem" height="1.2rem" class="mt-6 mb-4"></Skeleton>

    <div
      v-for="i in 5"
      :key="i"
      class="flex items-center justify-between py-2 mb-2"
    >
      <div class="flex items-start gap-2 flex-1">
        <Skeleton shape="circle" size="2.5rem" class="flex-shrink-0"></Skeleton>

        <div class="flex flex-col gap-2 w-full mt-1">
          <Skeleton width="40%" height="0.9rem"></Skeleton>
          <div class="flex items-center gap-2">
            <Skeleton width="25%" height="0.7rem"></Skeleton>
            <Skeleton shape="circle" size="0.2rem"></Skeleton>
            <Skeleton width="20%" height="0.7rem"></Skeleton>
          </div>
        </div>
      </div>

      <div class="pt-2">
        <Skeleton width="4.5rem" height="1.8rem" borderRadius="2rem"></Skeleton>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
