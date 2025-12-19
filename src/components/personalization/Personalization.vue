<template>
  <div id="main-content" class="w-full h-dvh">
    <div class="container m-auto flex w-full h-dvh gap-4">
      <div class="flex-1 flex flex-col">
        <div class="pt-8 pb-4 flex flex-col gap-4">
          <h2 class="text-3xl font-semibold">Refine recommendations</h2>
          <p class="text-sm">
            Adjust recommendations by updating what you’re following and your
            reading history.
          </p>
        </div>
        <Tabs class="w-full h-full" :value="activeCategoryParam">
          <TabList>
            <Tab v-for="tab in items" :key="tab.label" :value="tab.param">
              <router-link
                v-if="tab.route"
                v-slot="{ href, navigate }"
                :to="tab.route"
                custom
              >
                <a
                  v-ripple
                  :href="href"
                  @click="navigate"
                  class="flex items-center gap-2 text-inherit"
                >
                  <i :class="tab.icon" class="text-sm" />
                  <span class="text-xs">{{ tab.label }}</span>
                </a>
              </router-link>

              <span v-else>
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
              </span>
            </Tab>
          </TabList>
          <TabPanels class="h-full p-0">
            <TabPanel key="following" value="following" class="h-full p-0">
              <ScrollPanel class="w-full h-full p-0">
                <FollowedAuthors />
                <FollowedTopics />
              </ScrollPanel>
            </TabPanel>
            <TabPanel key="history" value="history" class="h-full p-0">
              <ScrollPanel class="w-full h-full p-0">
                <History />
              </ScrollPanel>
            </TabPanel>
            <TabPanel key="suggestions" value="suggestions" class="h-full p-0">
              <ScrollPanel class="w-full h-full p-0 pb-8">
                <AuthorSuggestion type="suggestions" />

                <TopicsSuggestion type="list" />
              </ScrollPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <Divider layout="vertical" />
      <div class="w-[21rem] h-full mx-auto pr-4 py-6">
        <div v-if="activeCategoryParam !== 'suggestions'">
          <AuthorSuggestion />
        </div>
      </div>
    </div>
    <ScrollTop />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import History from "./readings/History.vue";
import FollowedAuthors from "./following/FollowedAuthors.vue";

import AuthorSuggestion from "./suggestions/AuthorSuggestions.vue";
import { useToast } from "primevue/usetoast";
import TopicsSuggestion from "./suggestions/TopicSuggestions.vue";
import FollowedTopics from "./following/FollowedTopics.vue";

const toast = useToast();
const route = useRoute();

const items = ref([
  {
    route: {
      name: "personalization-category",
      params: { category: "following" },
    },
    param: "following",
    label: "Following",
    icon: "pi pi-user-plus",
  },
  {
    route: {
      name: "personalization-category",
      params: { category: "history" },
    },
    param: "history",
    label: "Reading History",
    icon: "pi pi-history",
  },
  {
    route: {
      name: "personalization-category",
      params: { category: "suggestions" },
    },
    param: "suggestions",
    label: "Suggestions",
    icon: "pi pi-lightbulb",
  },
]);

const activeCategoryParam = computed(() => route.params.category);
</script>
