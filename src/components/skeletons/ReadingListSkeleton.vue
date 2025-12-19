<template>
  <div>
    <div class="px-2 pt-6 pb-2">
      <Skeleton width="10rem" height="1.2rem" class="mb-2"></Skeleton>
    </div>

    <div
      v-for="n in 3"
      :key="n"
      class="border-b border-surface-200 dark:border-surface-700 py-4 px-2"
    >
      <div class="flex items-center gap-2 mb-3">
        <Skeleton shape="circle" size="2rem" class="w-8 h-8"></Skeleton>
        <Skeleton width="8rem" height="0.8rem"></Skeleton>
      </div>

      <div class="mb-3">
        <Skeleton width="100%" height="1rem" class="mb-2"></Skeleton>
        <Skeleton width="60%" height="1rem"></Skeleton>
      </div>

      <div class="flex items-center justify-between">
        <Skeleton width="4rem" height="0.6rem"></Skeleton>
      </div>
    </div>

    <div class="mt-4 px-2">
      <Skeleton width="6rem" height="2rem" border-radius="20px"></Skeleton>
    </div>
  </div>
</template>
<script></script>
