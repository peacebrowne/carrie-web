<template>
  <div
    class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-neutral-900 dark:text-neutral-100"
  >
    <div class="layout-container flex h-full grow flex-col">
      <div class="flex flex-1 justify-center py-5">
        <div
          class="layout-content-container flex flex-col w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8"
        >
          <main class="flex-1 mt-8">
            <div class="flex flex-wrap justify-between gap-4 items-center p-4">
              <p
                class="text-neutral-900 dark:text-neutral-100 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72"
              >
                Your Stats
              </p>
              <div class="flex flex-wrap gap-2">
                <PButton
                  label="Last 30 days"
                  icon="pi pi-angle-down"
                  iconPos="right"
                  class="h-9 pl-4 pr-2 !bg-primary/20 dark:!bg-primary/30 text-primary dark:text-primary text-sm font-bold !border-none"
                />
                <PButton
                  label="Last 90 days"
                  class="h-9 px-4 !bg-neutral-100 dark:!bg-neutral-500/20 text-neutral-900 dark:text-neutral-100 text-sm font-medium !border-none"
                />
                <PButton
                  label="This year"
                  class="h-9 px-4 !bg-neutral-100 dark:!bg-neutral-500/20 text-neutral-900 dark:text-neutral-100 text-sm font-medium !border-none"
                />
                <PButton
                  label="All time"
                  class="h-9 px-4 !bg-neutral-100 dark:!bg-neutral-500/20 text-neutral-900 dark:text-neutral-100 text-sm font-medium !border-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
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
                    <div
                      class="flex items-center gap-1 text-success text-sm font-medium leading-normal"
                    >
                      <i class="pi pi-chart-line text-base"></i>
                      <span>{{ stat.change }}</span>
                    </div>
                  </div>
                </template>
              </PCard>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
              <PCard
                class="lg:col-span-2 !shadow-none !border border-neutral-200 dark:border-neutral-500/20 !bg-white dark:!bg-background-dark"
              >
                <template #content>
                  <div class="flex flex-col gap-2">
                    <p
                      class="text-neutral-900 dark:text-neutral-100 text-base font-medium leading-normal"
                    >
                      Views (Last 30 Days)
                    </p>
                    <p
                      class="text-neutral-900 dark:text-neutral-100 tracking-light text-4xl font-bold leading-tight truncate"
                    >
                      12,149
                    </p>
                    <div class="flex gap-1">
                      <p
                        class="text-neutral-500 text-sm font-normal leading-normal"
                      >
                        vs. previous 30 days
                      </p>
                      <p
                        class="text-success text-sm font-medium leading-normal"
                      >
                        +15.2%
                      </p>
                    </div>
                    <div class="flex min-h-[220px] flex-1 flex-col gap-8 py-4">
                      <svg
                        fill="none"
                        height="100%"
                        preserveaspectratio="none"
                        viewBox="-3 0 478 150"
                        width="100%"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                          fill="url(#paint0_linear_1131_5935)"
                        ></path>
                        <path
                          d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                          stroke="#17cf91"
                          stroke-linecap="round"
                          stroke-width="3"
                        ></path>
                        <defs>
                          <lineargradient
                            gradientUnits="userSpaceOnUse"
                            id="paint0_linear_1131_5935"
                            x1="236"
                            x2="236"
                            y1="1"
                            y2="149"
                          >
                            <stop
                              stop-color="#17cf91"
                              stop-opacity="0.3"
                            ></stop>
                            <stop
                              offset="1"
                              stop-color="#17cf91"
                              stop-opacity="0"
                            ></stop>
                          </lineargradient>
                        </defs>
                      </svg>
                      <div class="flex justify-between">
                        <p
                          class="text-neutral-500 text-xs font-bold leading-normal tracking-[0.015em]"
                          v-for="i in 6"
                          :key="i"
                        >
                          {{ i * 5 }}
                        </p>
                        <p
                          class="text-neutral-500 text-xs font-bold leading-normal tracking-[0.015em]"
                        >
                          30
                        </p>
                      </div>
                    </div>
                  </div>
                </template>
              </PCard>

              <PCard
                class="!shadow-none !border border-neutral-200 dark:border-neutral-500/20 !bg-white dark:!bg-background-dark"
              >
                <template #content>
                  <p
                    class="text-neutral-900 dark:text-neutral-100 text-base font-medium leading-normal"
                  >
                    Traffic Sources
                  </p>
                  <div
                    class="flex items-center justify-center min-h-[220px] flex-1"
                  >
                    <div class="relative w-48 h-48">
                      <svg class="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#6366f1"
                          stroke-dasharray="60, 100"
                          stroke-width="3.8"
                        ></path>
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#ec4899"
                          stroke-dasharray="25, 100"
                          stroke-dashoffset="-60"
                          stroke-width="3.8"
                        ></path>
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#8b5cf6"
                          stroke-dasharray="10, 100"
                          stroke-dashoffset="-85"
                          stroke-width="3.8"
                        ></path>
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          stroke-dasharray="5, 100"
                          stroke-dashoffset="-95"
                          stroke-width="3.8"
                        ></path>
                      </svg>
                      <div
                        class="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <span
                          class="text-3xl font-bold text-neutral-900 dark:text-neutral-100"
                          >2.1k</span
                        >
                        <span class="text-sm text-neutral-500">Referrals</span>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div
                      v-for="source in trafficSources"
                      :key="source.name"
                      class="flex items-center gap-2"
                    >
                      <div
                        class="w-2 h-2 rounded-full"
                        :style="{ backgroundColor: source.color }"
                      ></div>
                      <span class="text-neutral-900 dark:text-neutral-100"
                        >{{ source.name }} ({{ source.percent }})</span
                      >
                    </div>
                  </div>
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
                <PDataTable
                  :value="storyData"
                  stripedRows
                  class="p-datatable-sm"
                  :pt="{
                    header: {
                      class: '!bg-neutral-100 dark:!bg-neutral-500/10',
                    },
                    thead: {
                      class:
                        'text-neutral-500 uppercase tracking-wider font-medium',
                    },
                    bodyRow: {
                      class:
                        'hover:!bg-neutral-100/50 dark:hover:!bg-neutral-500/10',
                    },
                    column: {
                      headercell: { class: 'px-6 py-3' },
                      bodycell: { class: 'px-6 py-4' },
                    },
                  }"
                >
                  <PColumn
                    field="story"
                    header="Story"
                    class="font-medium text-neutral-900 dark:text-neutral-100"
                  ></PColumn>
                  <PColumn field="views" header="Views"></PColumn>
                  <PColumn field="reads" header="Reads"></PColumn>
                  <PColumn field="readRatio" header="Read Ratio"></PColumn>
                  <PColumn field="claps" header="Claps"></PColumn>
                  <PColumn field="published" header="Published"></PColumn>
                </PDataTable>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PCard from "primevue/card";
import PButton from "primevue/button";
import PDataTable from "primevue/datatable";
import PColumn from "primevue/column";

// Navigation data for Menubar (though custom HTML was used in the template)
const menuItems = ref([
  {
    label: "Home",
    url: "#",
    class:
      "text-neutral-900 dark:text-neutral-100 text-sm font-medium leading-normal",
  },
  {
    label: "Stories",
    url: "#",
    class:
      "text-neutral-900 dark:text-neutral-100 text-sm font-medium leading-normal",
  },
  {
    label: "Stats",
    url: "#",
    class: "text-primary dark:text-primary text-sm font-bold leading-normal",
  },
]);

// Data for the summary stats cards
const stats = ref([
  { title: "Views", value: "12.1K", change: "+15.2%" },
  { title: "Reads", value: "8,432", change: "+12.8%" },
  { title: "Claps", value: "1,204", change: "+9.1%" },
]);

// Data for the traffic sources legend
const trafficSources = ref([
  { name: "Internal", percent: "60%", color: "#6366f1" },
  { name: "Social", percent: "25%", color: "#ec4899" },
  { name: "Search", percent: "10%", color: "#8b5cf6" },
  { name: "Direct", percent: "5%", color: "#10b981" },
]);

// Data for the DataTable
const storyData = ref([
  {
    story: "The Future of UI Design in a Post-AI World",
    views: "4,812",
    reads: "3,120",
    readRatio: "65%",
    claps: "405",
    published: "Oct 2, 2023",
  },
  {
    story: "10 Tailwind CSS Tricks You Didn't Know",
    views: "3,509",
    reads: "2,980",
    readRatio: "85%",
    claps: "312",
    published: "Sep 15, 2023",
  },
  {
    story: "A Guide to Minimalist Web Design",
    views: "2,105",
    reads: "1,450",
    readRatio: "69%",
    claps: "250",
    published: "Aug 28, 2023",
  },
  {
    story: "Why I Switched from Figma to Penpot",
    views: "1,560",
    reads: "980",
    readRatio: "63%",
    claps: "188",
    published: "Aug 5, 2023",
  },
  {
    story: "Creating Your First Design System",
    views: "976",
    reads: "761",
    readRatio: "78%",
    claps: "149",
    published: "Jul 21, 2023",
  },
]);
</script>

<style scoped>
/* Scoped styles can be used here for any necessary fine-tuning or to include the google material icons (if you didn't add the font links globally) */
</style>
