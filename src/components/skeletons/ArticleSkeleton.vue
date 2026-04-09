<template>
  <div v-if="type === 'grid'" class="w-full border-b p-4 animate-pulse">
    <Skeleton width="100%" height="300px" class="rounded-none"></Skeleton>

    <div class="flex flex-col gap-4 mt-2">
      <div class="flex items-center gap-2">
        <Skeleton shape="circle" size="2.5rem"></Skeleton>
        <Skeleton width="6rem" height="1rem"></Skeleton>
      </div>

      <div class="flex flex-col gap-2">
        <Skeleton
          width="90%"
          height="1.5rem"
          class="md:height-[2rem]"
        ></Skeleton>
        <Skeleton width="100%" height="1rem"></Skeleton>
        <Skeleton width="75%" height="1rem"></Skeleton>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between w-full">
      <div class="flex items-center gap-4">
        <Skeleton width="3rem" height="0.8rem"></Skeleton>
        <Skeleton width="3rem" height="0.8rem"></Skeleton>
        <Skeleton width="3rem" height="0.8rem"></Skeleton>
      </div>

      <div class="w-10 h-10 flex justify-center items-center">
        <Skeleton shape="circle" size="2rem"></Skeleton>
      </div>
    </div>
  </div>

  <div v-else class="w-full border-b p-4 animate-pulse">
    <div class="flex items-center gap-2 mb-4">
      <Skeleton shape="circle" size="2rem"></Skeleton>
      <Skeleton width="8rem" height="1rem"></Skeleton>
      <Skeleton
        width="4rem"
        height="1rem"
        class="ml-2"
        borderRadius="16px"
      ></Skeleton>
    </div>

    <div class="flex flex-row w-full gap-4">
      <div class="basis-3/4">
        <Skeleton width="90%" height="1.5rem" class="mb-3"></Skeleton>
        <Skeleton width="100%" height="1rem" class="mb-2"></Skeleton>
        <Skeleton width="75%" height="1rem" class="mb-4"></Skeleton>

        <div class="flex items-center gap-4 mt-4">
          <Skeleton width="3rem" height="0.8rem"></Skeleton>
          <Skeleton width="2rem" height="0.8rem"></Skeleton>
          <Skeleton width="2rem" height="0.8rem"></Skeleton>
          <div class="ml-auto">
            <Skeleton shape="circle" size="1.5rem"></Skeleton>
          </div>
        </div>
      </div>

      <div class="basis-1/4 h-24">
        <Skeleton width="100%" height="100%" borderRadius="4px"></Skeleton>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
defineProps({ type: { type: String, default: "list" } });
</script>
