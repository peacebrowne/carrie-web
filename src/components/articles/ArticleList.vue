<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />
  <div id="main-content" class="w-full h-dvh">
    <div class="container m-auto flex w-full h-dvh md:px-8 lg:px-36 2xl:px-52">
      <div class="flex flex-col gap-4 flex-1">
        <header class="w-full">
          <HeaderBar :activeSection="'Stories'" />
        </header>

        <Tabs :value="currentTabParam" class="w-full mx-auto h-full">
          <TabList>
            <Tab v-for="item in feeds" :key="item.label" :value="item.param">
              <router-link
                v-if="item.route"
                v-slot="{ href, navigate }"
                :to="item.route"
                custom
              >
                <a
                  v-ripple
                  :href="href"
                  @click="navigate"
                  class="flex items-center gap-2 text-inherit"
                >
                  <i :class="item.icon" class="text-sm" />
                  <span class="text-xs">{{ item.label }}</span>
                </a>
              </router-link>
              <span v-else>
                <i :class="item.icon" />
                <span>{{ item.label }}</span>
              </span>
            </Tab>
          </TabList>

          <TabPanels class="h-full p-0">
            <TabPanel
              v-for="item in feeds"
              :key="item.param"
              :value="item.param"
              class="h-full p-0"
            >
              <ScrollPanel class="w-full h-full pb-16">
                <ArticleCard
                  :articlesFeed="articlesFeed"
                  :isLoading="isInitialLoading"
                  type="private"
                />
                <Divider type="dashed" />
                <InfiniteLoading :key="currentTabParam" @infinite="load">
                  <template #complete>
                    <p class="py-4 text-center text-gray-500">
                      No more articles to show.
                    </p>
                  </template>
                </InfiniteLoading>
              </ScrollPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <Divider layout="vertical" />
      <div class="w-[21rem] h-full mx-auto pt-4">
        <ScrollPanel class="w-full h-full pb-16">
          <RecommendedTopics type="chips" />
          <ReadingList />
          <RecommendedAuthors type="home" />
        </ScrollPanel>
      </div>
    </div>
    <ScrollTop />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderBar from "@/components/HeaderBar.vue";
import ArticleCard from "./ArticleCard.vue"; // Same as in publish feed
import { userStore } from "@/stores";
import InfiniteLoading from "v3-infinite-loading";
import { attachArticleImage, handleImage } from "@/assets/js/util";
import { useToast } from "primevue/usetoast";
import RecommendedTopics from "../personalization/suggestions/TopicSuggestions.vue";
import RecommendedAuthors from "../personalization/suggestions/AuthorSuggestions.vue";
import { getAuthorArticles } from "@/assets/js/service";
import ReadingList from "./ReadingList.vue";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const user = ref(null);
const articlesFeed = ref([]);
const totalRecords = ref();
const isInitialLoading = ref(true);
const params = ref({ start: 0, limit: 10, status: "draft" });

const activeSection = defineModel("activeSection");
const breadCrumbs = defineModel("breadCrumbs");

// Define feeds/tabs
const feeds = ref([
  {
    label: "Draft",
    param: "draft",
    icon: "pi pi-file-edit",
    route: { name: "stories", query: { tab: "drafts" } },
  },
  {
    label: "Scheduled",
    param: "scheduled",
    icon: "pi pi-clock",
    route: { name: "stories", query: { tab: "posts-scheduled" } },
  },
  {
    label: "Published",
    param: "published",
    icon: "pi pi-check-circle",
    route: { name: "stories", query: { tab: "post-published" } },
  },
]);

// Determine current tab from route query (fallback to draft)
const currentTabParam = computed(() => {
  const tab = route.query.tab;
  if (tab === "posts-scheduled") return "scheduled";
  if (tab === "post-published") return "published";
  return "draft";
});

// Update activeSection and breadcrumbs on route change
watch(
  () => route.path,
  (path) => {
    const currentSection = path.split("/")[2];
    activeSection.value = currentSection;
    breadCrumbs.value = [currentSection];
  }
);

// Infinite scroll loader
const load = async ($state) => {
  try {
    const newArticles = await fetchAuthorArticles();

    if (newArticles.length > 0) {
      articlesFeed.value.push(...newArticles);
      params.value.start += params.value.limit;
      $state.loaded();
    } else {
      $state.complete();
    }
  } catch (error) {
    console.error("Infinite Load Error:", error);
    $state.error();
  } finally {
    isInitialLoading.value = false;
  }
};

const fetchAuthorArticles = async () => {
  // 1. Safety check: If user isn't loaded yet, return empty so load() can try again later
  if (!user.value) {
    return [];
  }

  isInitialLoading.value = true;
  const cleanedParams = cleanParams(params.value);

  try {
    const result = await getAuthorArticles(user.value.id, cleanedParams);

    if (result?.data) {
      const { values: articles } = result.data;

      const articlesWithImage = await attachArticleImage(articles);

      // Map author data
      for (const article of articlesWithImage) {
        article.author = {
          ...user.value,
          image: await handleImage(user.value.id),
        };
      }

      return articlesWithImage;
    }
    return [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  } finally {
    isInitialLoading.value = false;
  }
};

watch(
  currentTabParam,
  async (newTab) => {
    params.value = { start: 0, limit: 10, status: newTab };
    isInitialLoading.value = true;
    articlesFeed.value = await fetchAuthorArticles();
  },
  { immediate: true }
);

const cleanParams = (params) => {
  const cleanedParams = {};
  for (const key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      cleanedParams[key] = params[key];
    }
  }
  return cleanedParams;
};

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};

// Initial load on mount
onMounted(async () => {
  const { getUser } = userStore();
  const userData = await getUser();
  user.value = userData;
  articlesFeed.value = await fetchAuthorArticles();
});
</script>

<style scoped></style>
