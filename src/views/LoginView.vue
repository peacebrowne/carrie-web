<template>
  <div class="grid grid-cols-2 h-dvh">
    <div class="h-full bg-[#E8751A] p-4 flex flex-col justify-between">
      <div class="flex justify-between gap-2 px-8">
        <span class="font-black">Carrie</span>
        <Button
          severity="contrast"
          variant="outlined"
          raised
          rounded
          class="py-1"
        >
          <router-link :to="{ name: 'landing-page' }">
            <span class="text-xs">Back to website</span>
          </router-link>
          <span class="pi pi-arrow-right text-sm"></span>
        </Button>
      </div>
    </div>
    <div class="h-full p-4 flex justify-center items-center">
      <RouterView />
    </div>
  </div>
</template>
<script setup>
import { RouterView } from "vue-router";
</script>
