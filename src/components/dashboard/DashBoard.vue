<template>
  <div
    class="container m-auto md:px-8 lg:px-36 2xl:px-52 pt-6 relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-neutral-900 dark:text-neutral-100"
  >
    <div class="layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center py-5">
        <div
          class="layout-content-container flex flex-col w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8"
        >
          <main class="flex-1 mt-6">
            <div class="flex flex-wrap justify-between gap-4 items-center p-4">
              <p
                class="text-neutral-900 dark:text-neutral-100 text-3xl font-black leading-tight tracking-[-0.033em] min-w-72"
              >
                Your Stats
              </p>
              <div class="flex flex-wrap gap-2">
                <Select
                  v-model="selectedTimeRange"
                  :options="timeRanges"
                  optionLabel="label"
                  class="w-full md:w-56 rounded-full text-sm"
                  placeholder="Last 30 days"
                  @change="onChange"
                  variant="outlined"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <PCard
                v-for="stat in stats"
                :key="stat.title"
                class="!shadow-none !border border-neutral-200 dark:border-neutral-500/20 !bg-white dark:!bg-background-dark"
              >
                <template #content>
                  <div class="flex flex-col gap-2">
                    <p
                      class="text-neutral-900 dark:text-neutral-100 text-base font-medium leading-normal"
                    >
                      {{ stat.title }}
                    </p>
                    <p
                      class="text-neutral-900 dark:text-neutral-100 tracking-light text-3xl font-bold leading-tight"
                    >
                      {{ stat.value }}
                    </p>
                  </div>

                  <div
                    class="flex items-center gap-1 text-sm font-medium leading-normal"
                    :class="stat.isPositive ? 'text-green-700' : 'text-red-700'"
                  >
                    <i
                      :class="
                        stat.isPositive
                          ? 'pi pi-chart-line'
                          : 'pi pi-chart-scatter'
                      "
                      class="text-base"
                    ></i>

                    <span>{{ stat.change }}</span>
                  </div>
                </template>
              </PCard>
            </div>

            <div class="w-full p-4">
              <PCard
                class="w-full !shadow-none !border border-neutral-200 dark:border-neutral-500/20 !bg-white dark:!bg-background-dark"
              >
                <template #content>
                  <div class="flex flex-col px-4 gap-2">
                    <h4
                      class="text-neutral-900 dark:text-neutral-100 text-base font-black leading-normal"
                    >
                      Monthly
                      <Chip
                        :label="currentDate.month"
                        variant="contrast"
                        class="text-sm py-1"
                      />
                    </h4>
                    <p class="text-xs">
                      {{ currentDate.fullDate }} – Today (UTC)
                    </p>
                  </div>
                  <Line />
                </template>
              </PCard>
            </div>

            <div class="p-4">
              <div
                class="bg-white dark:bg-background-dark border border-neutral-200 dark:border-neutral-500/20 rounded-lg overflow-hidden"
              >
                <h3
                  class="text-lg font-bold p-6 text-neutral-900 dark:text-neutral-100"
                >
                  Story Stats
                </h3>
                <DataTable
                  :value="storyData"
                  stripedRows
                  tableStyle="min-width: 50rem"
                  :pt="{
                    header: {
                      class: '!bg-neutral-100 dark:!bg-neutral-500/10',
                    },
                    thead: {
                      class:
                        'text-neutral-500 uppercase text-xs tracking-wider font-medium',
                    },
                    bodyRow: {
                      class:
                        'hover:!bg-neutral-100/50 dark:hover:!bg-neutral-500/10 text-xs text-center',
                    },
                    column: {
                      headercell: { class: 'px-6 py-3 ' },
                      bodycell: { class: 'px-6 py-4 ' },
                    },
                  }"
                >
                  <Column
                    header="Story"
                    class="font-medium text-neutral-900 dark:text-neutral-100 text-left"
                  >
                    <template #body="slotProps">
                      <router-link
                        :to="{
                          name: 'public-article-detail',
                          params: { route: slotProps.data.route },
                        }"
                        class="hover:text-blue-500 hover:underline transition-colors duration-200 title-preview"
                      >
                        {{ truncateText(slotProps.data.title) }}
                      </router-link>
                    </template>
                  </Column>

                  <Column field="views" header="Views"></Column>
                  <Column field="reads" header="Reads"></Column>
                  <Column field="readRatio" header="Read Ratio"></Column>
                  <Column field="claps" header="Claps"></Column>
                  <Column field="published" header="Published"></Column>
                </DataTable>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import PCard from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { userStore } from "@/stores";
import {
  getArticleAnalytics,
  getUserBestPerformingArticles,
  getUserStats,
} from "@/assets/js/service";
import {
  capitalize,
  describeNumberScale,
  handleDateFormat,
  slugify,
  truncateText,
} from "@/assets/js/util";
import Line from "./charts/Line.vue";

const selectedTimeRange = ref();
const stats = ref([]);
const user = ref("");
const currentDate = ref({
  month: "",
  fullDate: "",
});
const timeRanges = ref([
  { label: "Last 30 days", value: "30 days" },
  { label: "Last 90 days", value: "90 days" },
  { label: "This year", value: "this_year" },
  { label: "All time", value: "" },
]);

// Data for the DataTable
const storyData = ref([]);

const fetchUserStatistics = async (duration) => {
  const { data: statistics } = await getUserStats({
    userId: user.value.id,
    duration,
  });

  const currentKeys = Object.keys(statistics).filter((key) =>
    key.startsWith("current_")
  );

  const values = currentKeys.map((key) => {
    // Transform 'current_views' -> 'views'
    const baseName = key.replace("current_", "");

    const currentValue = statistics[key] || 0;
    const previousValue = statistics[`previous_${baseName}`] || 0;

    return {
      title: capitalize(baseName.split("_").join(" ")),
      value: describeNumberScale(currentValue),
      change: calculatePercentageChange(currentValue, previousValue),
      isPositive: currentValue >= previousValue,
    };
  });

  stats.value = values;
};

const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }
  const diff = ((current - previous) / previous) * 100;
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
};

const onChange = async (event) => {
  fetchUserStatistics(event.value.value);
};

const startOfMonth = () => {
  const date = new Date();
  currentDate.value.fullDate = handleDateFormat(
    new Date(date.getFullYear(), date.getMonth(), 1),
    "MMMM DD, YYYY"
  );

  currentDate.value.month = handleDateFormat(date, "MMMM");
};

const fetchUserBestArticles = async () => {
  try {
    const { data: articles = [] } = await getUserBestPerformingArticles(
      user.value.id
    );

    const updatedArticles = await Promise.all(
      articles.map(async (article) => {
        if (!article.id) return article;

        const { data: analytics } = await getArticleAnalytics(article.id);

        return {
          ...article,
          ...analytics,
          readRatio: calculateReadRatio(analytics.reads, analytics.views),
          published: handleDateFormat(article.publish_date, "MMM DD, YYYY"),
          route: slugify(article.title),
        };
      })
    );

    storyData.value = updatedArticles;
    console.log(storyData.value);
  } catch (error) {
    console.error("Failed to fetch article stats:", error);
  }
};

const calculateReadRatio = (reads, views) => {
  if (!views || views === 0) return "0%";
  const ratio = (reads / views) * 100;
  return `${Math.round(ratio)}%`;
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  startOfMonth();
  await fetchUserStatistics("30 days");
  await fetchUserBestArticles();
});
</script>

<style>
.title-preview {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
