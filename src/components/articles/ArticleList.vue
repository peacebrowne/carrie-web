<template>
  <header>
    <HeaderBar v-model:activeSection="activeSection" />
  </header>
  <div class="container m-auto flex w-full h-full">
    <Tabs value="0" class="flex-1 mx-auto h-full">
      <TabList>
        <Tab value="0" @click="async () => await fetchAuthorArticles('draft')"
          >Draft</Tab
        >
        <Tab value="1" @click="async () => await fetchAuthorArticles('pending')"
          >Pending</Tab
        >
        <Tab
          value="2"
          @click="async () => await fetchAuthorArticles('published')"
          >Published</Tab
        >
      </TabList>
      <TabPanels class="h-full">
        <TabPanel value="0" class="h-full">
          <ScrollPanel class="w-full h-full">
            <Panel
              v-for="article in mainArticles"
              :key="article.id"
              class="border-none relative"
            >
              <div class="flex">
                <router-link
                  class="w-full"
                  :to="{
                    name: 'edit-article',
                    params: { title: article.title },
                  }"
                  @click="handleArticleStore(article)"
                >
                  <Card
                    pt:header:class="w-48 h-32"
                    pt:body:class="flex-1 pl-0 py-0 m-auto"
                    class="shadow-none rounded-none items-start justify-between overflow-hidden flex-row-reverse w-full gap-4"
                  >
                    <!-- Image -->
                    <template #header>
                      <img
                        v-if="article.image"
                        :src="article.image"
                        class="w-full h-full object-cover"
                      />
                      <img
                        v-else
                        src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                        alt="Mock Negotiation"
                        class="w-full h-full object-cover"
                      />
                    </template>

                    <!-- Text Content -->
                    <template #content>
                      <div class="text-start">
                        <h3 class="font-black text-lg md:text-2xl">
                          {{ handleTitleFormat(article.title) }}
                        </h3>
                        <p class="text-1xl">
                          {{ handleDescriptionFormat(article.description) }}
                        </p>
                      </div>
                    </template>

                    <template #footer>
                      <div
                        class="flex flex-wrap items-center justify-between gap-4"
                      >
                        <div class="flex items-center gap-4">
                          <div
                            class="flex gap-1 items-enter"
                            v-tooltip.top="`${article.totalLikes} likes`"
                          >
                            <span class="pi pi-thumbs-up text-xs"></span>
                            <span class="text-xs">{{
                              article.totalLikes
                            }}</span>
                          </div>
                          <div
                            class="flex gap-1 items-center"
                            v-tooltip.top="`${article.totalDislikes} dislikes`"
                          >
                            <span class="pi pi-thumbs-down text-xs"></span>
                            <span class="text-xs">{{
                              article.totalDislikes
                            }}</span>
                          </div>

                          <div
                            class="flex gap-1 items-center"
                            v-tooltip.top="`${article.totalComments} comments`"
                          >
                            <span class="pi pi-comments text-xs"></span>
                            <span class="text-xs">{{
                              article.totalComments
                            }}</span>
                          </div>

                          <div
                            v-tooltip.top="'50 shares'"
                            class="flex gap-1 items-center"
                          >
                            <span class="pi pi-share-alt text-xs"></span>
                            <span class="text-xs">50</span>
                          </div>
                        </div>

                        <div class="flex gap-1 items-center">
                          <span class="pi pi-calendar text-xs"></span>
                          <span
                            class="text-surface-500 text-xs font-bold dark:text-surface-400"
                            >{{ handleDateFormat(article.createdAt) }}</span
                          >
                        </div>
                      </div>
                    </template>
                  </Card>
                </router-link>
              </div>
            </Panel>

            <Divider type="dashed" />

            <InfiniteLoading @infinite="load" />
          </ScrollPanel>
        </TabPanel>

        <TabPanel value="1">
          <ScrollPanel class="w-full h-full">
            <Panel
              v-for="article in mainArticles"
              :key="article.id"
              class="border-none relative"
            >
              <div class="flex">
                <router-link
                  class="w-full"
                  :to="{
                    name: 'edit-article',
                    params: { title: article.title },
                  }"
                  @click="handleArticleStore(article)"
                >
                  <Card
                    pt:header:class="w-48 h-32"
                    pt:body:class="flex-1 pl-0 py-0 m-auto"
                    class="shadow-none rounded-none items-start justify-between overflow-hidden flex-row-reverse w-full gap-4"
                  >
                    <!-- Image -->
                    <template #header>
                      <img
                        v-if="article.image"
                        :src="article.image"
                        class="w-full h-full object-cover"
                      />
                      <img
                        v-else
                        src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                        alt="Mock Negotiation"
                        class="w-full h-full object-cover"
                      />
                    </template>

                    <!-- Text Content -->
                    <template #content>
                      <div class="text-start">
                        <h3 class="font-black text-lg md:text-2xl">
                          {{ handleTitleFormat(article.title) }}
                        </h3>
                        <p class="text-1xl">
                          {{ handleDescriptionFormat(article.description) }}
                        </p>
                      </div>
                    </template>

                    <template #footer>
                      <div
                        class="flex flex-wrap items-center justify-between gap-4"
                      >
                        <div class="flex items-center gap-4">
                          <div
                            class="flex gap-1 items-enter"
                            v-tooltip.top="`${article.totalLikes} likes`"
                          >
                            <span class="pi pi-thumbs-up text-xs"></span>
                            <span class="text-xs">{{
                              article.totalLikes
                            }}</span>
                          </div>
                          <div
                            class="flex gap-1 items-center"
                            v-tooltip.top="`${article.totalDislikes} dislikes`"
                          >
                            <span class="pi pi-thumbs-down text-xs"></span>
                            <span class="text-xs">{{
                              article.totalDislikes
                            }}</span>
                          </div>

                          <div
                            class="flex gap-1 items-center"
                            v-tooltip.top="`${article.totalComments} comments`"
                          >
                            <span class="pi pi-comments text-xs"></span>
                            <span class="text-xs">{{
                              article.totalComments
                            }}</span>
                          </div>

                          <div
                            v-tooltip.top="'50 shares'"
                            class="flex gap-1 items-center"
                          >
                            <span class="pi pi-share-alt text-xs"></span>
                            <span class="text-xs">50</span>
                          </div>
                        </div>

                        <div class="flex gap-1 items-center">
                          <span class="pi pi-calendar text-xs"></span>
                          <span
                            class="text-surface-500 text-xs font-bold dark:text-surface-400"
                            >{{ handleDateFormat(article.createdAt) }}</span
                          >
                        </div>
                      </div>
                    </template>
                  </Card>
                </router-link>
              </div>
            </Panel>

            <Divider type="dashed" />

            <InfiniteLoading @infinite="load" />
          </ScrollPanel>
        </TabPanel>

        <TabPanel value="2">
          <ScrollPanel class="w-full h-full">
            <Panel
              v-for="article in mainArticles"
              :key="article.id"
              class="border-none relative"
            >
              <div class="flex">
                <router-link
                  class="w-full"
                  :to="{
                    name: 'edit-article',
                    params: { title: article.title },
                  }"
                  @click="handleArticleStore(article)"
                >
                  <Card
                    pt:header:class="w-48 h-32"
                    pt:body:class="flex-1 pl-0 py-0 m-auto"
                    class="shadow-none rounded-none items-start justify-between overflow-hidden flex-row-reverse w-full gap-4"
                  >
                    <!-- Image -->
                    <template #header>
                      <img
                        v-if="article.image"
                        :src="article.image"
                        class="w-full h-full object-cover"
                      />
                      <img
                        v-else
                        src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                        alt="Mock Negotiation"
                        class="w-full h-full object-cover"
                      />
                    </template>

                    <!-- Text Content -->
                    <template #content>
                      <div class="text-start">
                        <h3 class="font-black text-lg md:text-2xl">
                          {{ handleTitleFormat(article.title) }}
                        </h3>
                        <p class="text-1xl">
                          {{ handleDescriptionFormat(article.description) }}
                        </p>
                      </div>
                    </template>

                    <template #footer>
                      <div
                        class="flex flex-wrap items-center justify-between gap-4"
                      >
                        <div class="flex items-center gap-4">
                          <div
                            class="flex gap-1 items-enter"
                            v-tooltip.top="`${article.totalLikes} likes`"
                          >
                            <span class="pi pi-thumbs-up text-xs"></span>
                            <span class="text-xs">{{
                              article.totalLikes
                            }}</span>
                          </div>
                          <div
                            class="flex gap-1 items-center"
                            v-tooltip.top="`${article.totalDislikes} dislikes`"
                          >
                            <span class="pi pi-thumbs-down text-xs"></span>
                            <span class="text-xs">{{
                              article.totalDislikes
                            }}</span>
                          </div>

                          <div
                            class="flex gap-1 items-center"
                            v-tooltip.top="`${article.totalComments} comments`"
                          >
                            <span class="pi pi-comments text-xs"></span>
                            <span class="text-xs">{{
                              article.totalComments
                            }}</span>
                          </div>

                          <div
                            v-tooltip.top="'50 shares'"
                            class="flex gap-1 items-center"
                          >
                            <span class="pi pi-share-alt text-xs"></span>
                            <span class="text-xs">50</span>
                          </div>
                        </div>

                        <div class="flex gap-1 items-center">
                          <span class="pi pi-calendar text-xs"></span>
                          <span
                            class="text-surface-500 text-xs font-bold dark:text-surface-400"
                            >{{ handleDateFormat(article.createdAt) }}</span
                          >
                        </div>
                      </div>
                    </template>
                  </Card>
                </router-link>
              </div>
            </Panel>

            <Divider type="dashed" />

            <InfiniteLoading @infinite="load" />
          </ScrollPanel>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <Divider layout="vertical" />
    <div class="w-72"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { getAuthorById, getAuthorArticles } from "@/assets/js/service";
import { articleStore } from "../../stores";

import InfiniteLoading from "v3-infinite-loading";
import {
  attachArticleImage,
  handleImage,
  handleDateFormat,
} from "@/assets/js/util";
import { useRoute } from "vue-router";

const params = computed(() => ({
  start: 0,
  limit: 10,
  status: "draft",
}));

const breadCrumbs = defineModel("breadCrumbs");
const activeSection = defineModel("activeSection");
const route = useRoute();

activeSection.value = route.path.split("/")[2];

watch(
  () => route.path,
  (path) => {
    const currentSection = path.split("/")[2];
    activeSection.value = currentSection;
    breadCrumbs.value = [currentSection];
  }
);

const mainArticles = ref([]);
const id = localStorage.getItem("app-author-id");

const load = async ($state) => {
  console.log("loading...");

  try {
    params.value.start += 10;
    const response = await getAuthorArticles();

    if (response.data) {
      if (response.data.length) {
        const { total, values: articles } = response.data;
        mainArticles.value.push(...(await attachArticleImage(articles)));
        $state.loaded();
      } else {
        $state.complete();
      }
    } else {
      console.error("Failed to fetch articles:", response.error);
    }
  } catch (error) {
    console.log({ error });
    $state.error();
  }
};

const fetchAuthorArticles = async (type) => {
  params.value.status = type;
  const cleanedParams = cleanParams(params.value);

  const result = await getAuthorArticles(
    localStorage.getItem("app-author-id"),
    cleanedParams
  );

  if (result.data) {
    const { total, values: articles } = result.data;
    mainArticles.value = await attachArticleImage(articles);
    console.log(mainArticles.value);
  } else {
    console.error("Failed to fetch articles:", result.error);
  }
};

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

const menu = ref(null);

const handleTitleFormat = (title) => {
  const characters = 50;

  return title.length > characters ? `${title.slice(0, characters)}...` : title;
};

const handleDescriptionFormat = (description) => {
  let characters = 50;

  return description && description.length > characters
    ? `${description.slice(0, characters)}...`
    : description;
};

onMounted(async () => await fetchAuthorArticles("draft"));

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};
</script>

<style scoped></style>
