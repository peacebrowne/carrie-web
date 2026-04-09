<template>
  <div class="w-full">
    <nav class="w-full sticky z-[200] flex top-0 bg-white border-b p-4">
      <Skeleton width="150px" height="2rem" />
      <div class="ml-auto flex gap-4">
        <Skeleton shape="circle" size="2rem" />
        <Skeleton width="80px" height="2rem" />
      </div>
    </nav>

    <div
      class="container m-auto flex w-full h-full md:px-8 lg:px-36 2xl:px-52 flex-col"
    >
      <div class="flex gap-6 border-b py-4 overflow-hidden">
        <Skeleton width="120px" height="2rem" borderRadius="20px" />
        <Skeleton
          v-for="i in 5"
          :key="i"
          width="100px"
          height="2rem"
          borderRadius="20px"
        />
      </div>

      <div class="m-0 p-8 flex flex-col justify-center items-center gap-4">
        <Skeleton width="250px" height="3rem" />
        <div class="flex items-center gap-2">
          <Skeleton width="100px" height="1rem" />
          <Skeleton shape="circle" size="4px" />
          <Skeleton width="100px" height="1rem" />
        </div>
        <Skeleton width="80px" height="2.5rem" borderRadius="20px" />
      </div>

      <div class="p-6 flex flex-col gap-8">
        <Skeleton width="200px" height="2rem" />
        <div class="grid grid-cols-2 gap-6">
          <div v-for="i in 2" :key="'rec-lg-' + i" class="flex flex-col gap-3">
            <Skeleton width="100%" height="250px" />
            <div class="flex items-center gap-2 mt-2">
              <Skeleton shape="circle" size="2.5rem" />
              <Skeleton width="120px" height="1rem" />
            </div>
            <Skeleton width="90%" height="1.5rem" />
            <Skeleton width="100%" height="3rem" />
            <div class="flex justify-between mt-4">
              <Skeleton width="150px" height="1rem" />
              <Skeleton width="30px" height="2rem" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <div v-for="i in 3" :key="'rec-sm-' + i" class="flex flex-col gap-3">
            <Skeleton width="100%" height="180px" />
            <div class="flex items-center gap-2">
              <Skeleton shape="circle" size="2rem" />
              <Skeleton width="100px" height="0.8rem" />
            </div>
            <Skeleton width="100%" height="1.2rem" />
            <Skeleton width="100%" height="2rem" />
          </div>
        </div>
      </div>

      <Divider class="py-8" />

      <div class="p-6 flex flex-col gap-8">
        <Skeleton width="150px" height="2rem" />
        <div class="grid grid-cols-4 gap-6">
          <div
            v-for="i in 4"
            :key="'author-' + i"
            class="border p-4 flex flex-col gap-4 items-center text-center"
          >
            <Skeleton shape="circle" size="5rem" />
            <Skeleton width="120px" height="1.2rem" />
            <Skeleton width="150px" height="0.8rem" />
            <Skeleton width="100%" height="2.5rem" />
            <Skeleton width="100%" height="2rem" borderRadius="20px" />
          </div>
        </div>
      </div>

      <Divider class="py-8" />

      <div class="p-6 flex flex-row gap-8">
        <div class="basis-1/3">
          <Skeleton width="150px" height="2rem" />
        </div>
        <div class="basis-2/3 flex flex-col gap-6">
          <div
            v-for="i in 3"
            :key="'latest-' + i"
            class="border-b pb-6 flex flex-col gap-4"
          >
            <div class="flex items-center gap-2">
              <Skeleton shape="circle" size="2rem" />
              <Skeleton width="120px" height="1rem" />
            </div>
            <div class="flex flex-row gap-4">
              <div class="basis-3/4 flex flex-col gap-2">
                <Skeleton width="90%" height="1.5rem" />
                <Skeleton width="100%" height="3rem" />
                <div class="flex gap-4 mt-4">
                  <Skeleton width="100px" height="1rem" />
                  <Skeleton width="50px" height="1rem" />
                </div>
              </div>
              <div class="basis-1/4">
                <Skeleton width="100%" height="100px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import Divider from "primevue/divider";
</script>
