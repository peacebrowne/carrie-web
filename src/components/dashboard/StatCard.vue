<template>
  <div
    class="bg-white rounded-3xl flex shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition"
  >
    <i
      :class="`pi ${icon} text-3xl mb-3`"
      :style="{ color: colors[color] }"
    ></i>
    <div>
      <p class="text-sm text-gray-600">{{ label }}</p>
      <p class="text-4xl font-bold text-gray-900 mt-2">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  value: [String, Number],
  color: String,
});

const colors = {
  green: "#43B977",
  blue: "#4361EE",
  orange: "#FF8C00",
  red: "#F46565",
};
</script>
