<template>
  <div class="flex items-center gap-3">
    <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: color }"></div>
    <div>
      <p class="text-sm text-gray-600">{{ label }}</p>
      <p class="font-bold text-gray-900">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ color: String, label: String, value: [String, Number] });
</script>
