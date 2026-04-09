<template>
  <div class="card">
    <Chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      class="h-[20rem]"
    />
  </div>
</template>

<script setup>
import { getUserDailyStats } from "@/assets/js/service";
import { handleDateFormat } from "@/assets/js/util";
import { userStore } from "@/stores";
import { ref, onMounted, watch } from "vue";

const chartData = ref();
const chartOptions = ref();
const userDailyStatistics = ref([]);
const user = ref();
const labels = ref([]);
const claps = ref();
const reads = ref();
const views = ref();

const setChartData = () => {
  return {
    labels: labels.value,
    datasets: [
      {
        label: "Views",
        data: views.value,
        fill: false,
        tension: 0.4,
        borderColor: "#4988C4",
      },
      {
        label: "Reads",
        data: reads.value,
        fill: false,
        borderDash: [5, 5],
        tension: 0.4,
        borderColor: "#DE802B",
      },
      {
        label: "Claps",
        data: claps.value,
        fill: true,
        borderColor: "#1B3C53",
        tension: 0.4,
        backgroundColor: "rgba(107, 114, 128, 0.2)",
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--p-text-muted-color"
  );
  const surfaceBorder = documentStyle.getPropertyValue(
    "--p-content-border-color"
  );

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          stepSize: 8,
          autoSkip: false,
          maxRotation: 0,
          color: textColorSecondary,
        },
        grid: {
          color: "#EEEEEE",
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: "#EEEEEE",
        },
      },
    },
  };
};
const fetchUserDailyStatistics = async () => {
  try {
    const { data: statistics } = await getUserDailyStats(user.value.id);

    labels.value = statistics.map((item, i) => {
      return i % 8 === 0 ? handleDateFormat(item.label, "MMM DD") : "";
    });

    claps.value = statistics.map(() => Math.floor(Math.random() * 251));
    // claps.value = statistics.map((statistic) => statistic.clap);

    reads.value = statistics.map(() => Math.floor(Math.random() * 601));
    // claps.value = statistics.map((statistic) => statistic.reads);

    views.value = statistics.map(() => Math.floor(Math.random() * 501));
    // claps.value = statistics.map((statistic) => statistic.views);
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();

  await fetchUserDailyStatistics();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>
