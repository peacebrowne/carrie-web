<template>
  <div class="flex flex-col gap-4">
    <div class="px-2">
      <span class="text-1xl font-black">Article's Interactions</span>
    </div>
    <div class="data flex gap-4 px-3">
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-1">
          <span class="p-[0.3rem] bg-[#198443] rounded-xl h-[1px]"></span>
          <span class="text-sm">Likes</span>
        </div>
        <span class="mb-1 text-sm font-black">{{ analytics.likes }}</span>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-1">
          <span class="p-[0.3rem] bg-[#E52020] rounded-xl h-[1px]"></span>
          <span class="text-sm">Dislikes</span>
        </div>
        <span class="mb-1 text-sm font-black">{{ analytics.dislikes }}</span>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-1">
          <span class="p-[0.3rem] bg-[#C14600] rounded-xl h-[1px]"></span>
          <span class="text-sm mx-auto">Shares</span>
        </div>
        <span class="mb-1 text-sm font-black">0</span>
      </div>
    </div>
    <div class="relative w-full mx-auto">
      <Chart
        type="doughnut"
        :data="chartData"
        :options="chartOptions"
        class="w-full md:w-[15rem] z-10 mx-auto"
      />
      <div
        class="absolute p-2 w-full h-full top-0 flex flex-col justify-center items-center"
      >
        <span class="font-bold">Total</span>
        <span class="text-6xl font-semibold">{{ totalInteractions }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from "vue";

const analytics = inject("analytics");

const chartData = ref();
const chartOptions = ref(null);

const setChartData = () => {
  return analytics.value
    ? {
        labels: ["Shares", "Dislikes", "Likes"],
        datasets: [
          {
            data: [10, analytics.value.dislikes, analytics.value.likes],
            backgroundColor: ["#E26B35", "#F46565", "#43B977"],
            hoverBackgroundColor: ["#C14600", "#E52020", "#198443"],
            cutout: "60%",
            responsive: true,
          },
        ],
      }
    : { labels: [], datasets: [] };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  return {
    plugins: {
      legend: {
        position: "none",
        labels: {
          color: textColor,
        },
      },
    },
  };
};

const totalInteractions = computed(() => {
  return analytics.value.likes + analytics.value.dislikes;
});

onMounted(() => {
  setTimeout(async () => {
    await analytics.value;
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  }, 1000);
});
</script>
