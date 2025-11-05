<template>
  <div id="main-content" class="w-full h-dvh">
    <div class="container m-auto flex w-full h-full md:px-8 lg:px-36 2xl:px-52">
      <Tabs value="0" class="flex-1 mx-auto h-full">
        <TabList>
          <Tab value="0">Home</Tab>
          <Tab value="1">Following</Tab>
          <Tab value="2">Shared</Tab>
        </TabList>
        <TabPanels class="h-full p-0">
          <TabPanel value="0" class="h-full p-0">
            <ScrollPanel class="w-full h-full pb-16">
              <Panel
                v-for="article in mainArticles"
                :key="article.id"
                class="border relative p-2 rounded-none border-t-0 border-r-0 border-l-0"
              >
                <template #header>
                  <div class="flex items-center gap-2">
                    <router-link
                      class="text-sm font-bold flex items-center gap-2"
                    >
                      <Avatar
                        v-if="article.author.image"
                        :image="article.author.image"
                        shape="circle"
                      />

                      <Avatar
                        v-else
                        icon="pi pi-user text-white text-xs"
                        shape="circle"
                        class="bg-[#1B4D3E]"
                      />
                      <span class="font-bold"
                        >{{ article.author.firstName }}
                        {{ article.author.lastName }}</span
                      >
                    </router-link>

                    <Button
                      v-if="article.author.followed"
                      class="text-xs"
                      rounded
                      text
                      label="Following"
                      @click="removeAuthorFollower(article.author.id)"
                    />
                    <Button
                      v-else-if="
                        !article.author.followed && article.author.id !== id
                      "
                      class="text-xs"
                      rounded
                      text
                      label="Follow"
                      @click="addAuthorFollower(article.author.id)"
                    />
                  </div>
                </template>
                <template #icons>
                  <Button
                    icon="pi pi-ellipsis-h"
                    severity="secondary"
                    rounded
                    text
                    @click="toggle"
                  />
                  <Menu ref="menu" id="config_menu" :model="items" popup />
                </template>
                <div class="bg-red-500">
                  <router-link
                    class="w-full"
                    :to="{
                      name: 'public-article-detail',
                      params: { title: article.title },
                    }"
                    @click="handleArticleStore(article)"
                  >
                    <Card
                      pt:body:class="flex-1 p-0 m-auto"
                      class="shadow-none rounded-none items-start justify-between overflow-hidden flex-row-reverse w-full gap-4"
                    >
                      <!-- Text Content -->
                      <template #content>
                        <div class="flex flex-row w-full">
                          <div class="basis-3/4">
                            <h3 class="font-black text-xl md:text-2xl">
                              {{ handleTitleFormat(article.title) }}
                            </h3>

                            <p class="text-lg">
                              {{ handleDescriptionFormat(article.description) }}
                            </p>
                          </div>

                          <!-- Image -->
                          <div class="basis-1/4 max-h-24">
                            <img
                              v-if="article.image"
                              :src="article.image"
                              class="w-full h-full object-cover"
                            />
                            <img
                              v-else
                              src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                              alt="Mock Negotiation"
                              class="w-full h-full object-cover bas"
                            />
                          </div>
                        </div>
                      </template>
                    </Card>
                  </router-link>
                </div>
                <template #footer>
                  <div
                    class="w-54 flex flex-wrap items-center justify-between gap-4 p-1"
                  >
                    <router-link
                      :to="{
                        name: 'public-article-detail',
                        params: { title: article.title },
                      }"
                      @click="handleArticleStore(article)"
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class="flex gap-1 items-enter"
                          v-tooltip.top="`${article.likes} likes`"
                        >
                          <span class="pi pi-thumbs-up text-sm"></span>
                          <span class="text-sm">{{ article.likes }}</span>
                        </div>
                        <div
                          class="flex gap-1 items-center"
                          v-tooltip.top="`${article.dislikes} dislikes`"
                        >
                          <span class="pi pi-thumbs-down text-sm"></span>
                          <span class="text-sm">{{ article.dislikes }}</span>
                        </div>

                        <div
                          class="flex gap-1 items-center"
                          v-tooltip.top="`${article.totalComments} comments`"
                        >
                          <span class="pi pi-comments text-sm"></span>
                          <span class="text-sm">{{
                            article.totalComments
                          }}</span>
                        </div>

                        <div
                          v-tooltip.top="'50 shares'"
                          class="flex gap-1 items-center"
                        >
                          <span class="pi pi-share-alt text-sm"></span>
                          <span class="text-sm">50</span>
                        </div>
                      </div>
                    </router-link>

                    <div class="flex gap-1 items-center">
                      <span class="pi pi-calendar text-sm"></span>
                      <span
                        class="text-surface-500 text-sm font-bold dark:text-surface-400"
                        >{{ handleDateFormat(article.createdAt) }}</span
                      >
                    </div>
                  </div>
                </template>
              </Panel>

              <Divider type="dashed" />

              <InfiniteLoading @infinite="load" />
            </ScrollPanel>
          </TabPanel>

          <TabPanel value="1">
            <p class="m-0">Coming soon!</p>
          </TabPanel>

          <TabPanel value="2">
            <p class="m-0">Coming soon!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Divider layout="vertical" />
      <div class="w-72 h-full mx-auto">
        <ScrollPanel class="w-full h-full pb-16">
          <!-- RECOMMENDED TOPICS -->
          <div>
            <div class="px-2 pt-6 pb-2">
              <h3 class="font-bold">Recommended Topics</h3>
            </div>
            <div class="card flex flex-wrap gap-2">
              <router-link
                v-for="topic in recommendedTopics"
                :key="topic.id"
                :to="{
                  name: 'tag-detail',
                  params: { name: topic.name },
                }"
              >
                <Chip class="text-sm" :label="topic.name" />
              </router-link>
            </div>
          </div>

          <!-- WHO TO FOLLOW -->
          <div>
            <div class="px-2 pt-6 pb-2">
              <h3 class="font-bold">Who to follow</h3>
            </div>

            <Panel
              class="border-0 py-2"
              pt:header:class="px-2 py-1"
              pt:content:class="px-2 py-1"
              pt:footer:class="px-2 py-1"
            >
              <template #header>
                <div class="flex items-center gap-2">
                  <Avatar
                    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                    shape="circle"
                    class="w-10 h-10"
                  />
                  <span class="font-bold text-xs">Amy Elsner</span>
                </div>
              </template>
              <template #footer>
                <Button
                  class="text-xs"
                  severity="contrast"
                  variant="outlined"
                  rounded
                  label="Follow"
                />
              </template>

              <p class="m-0 font-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              </p>
            </Panel>
          </div>

          <!-- YOUR READING LIST -->
          <div>
            <div class="px-2 pt-6 pb-2">
              <h3 class="font-bold">Your reading list</h3>
            </div>

            <Panel
              class="border-0 py-2"
              pt:header:class="px-2 py-1"
              pt:content:class="px-2 py-1"
              pt:footer:class="px-2 py-1"
            >
              <template #header>
                <div class="flex items-center gap-2">
                  <Avatar
                    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                    shape="circle"
                    class="w-6 h-6"
                  />
                  <span class="font-bold text-xs">Amy Elsner</span>
                </div>
              </template>
              <template #footer>
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <span
                    class="text-surface-500 dark:text-surface-400 text-xs font-normal"
                    >July 5</span
                  >
                </div>
              </template>

              <p class="m-0 font-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              </p>
            </Panel>

            <Panel
              class="border-0 py-2"
              pt:header:class="px-2 py-1"
              pt:content:class="px-2 py-1"
              pt:footer:class="px-2 py-1"
            >
              <template #header>
                <div class="flex items-center gap-2">
                  <Avatar
                    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                    shape="circle"
                    class="w-6 h-6"
                  />
                  <span class="font-bold text-xs">Amy Elsner</span>
                </div>
              </template>
              <template #footer>
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <span
                    class="text-surface-500 dark:text-surface-400 text-xs font-normal"
                    >July 5</span
                  >
                </div>
              </template>

              <p class="m-0 font-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              </p>
            </Panel>
          </div>

          <!-- AUTHORS YOU ARE FOLLOWING -->
          <div>
            <div class="flex items-center gap-2 px-2 pt-6 pb-2">
              <i class="pi pi-users"></i>
              <h3 class="font-bold">Following</h3>
            </div>
            <div class="card flex flex-col gap-2 px-2">
              <div v-for="n in 5" :key="n">
                <div class="flex items-center gap-2">
                  <Avatar
                    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                    shape="circle"
                    class="w-6 h-6"
                  />
                  <span
                    class="font-normal text-xs text-surface-500 dark:text-surface-400"
                  >
                    Amy Elsner
                  </span>
                  <div class="w-1 h-1 bg-green-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollPanel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Menu from "primevue/menu";
import {
  getAuthorById,
  getFollowedAuthors,
  followAuthor,
  getAuthorInterestedArticles,
  unfollowAuthor,
  getRecommendedTopic,
} from "@/assets/js/service";

import { userStore, articleStore } from "@/stores";

import InfiniteLoading from "v3-infinite-loading";
import {
  attachArticleImage,
  handleImage,
  handleDateFormat,
} from "@/assets/js/util";

const params = computed(() => ({
  start: 0,
  limit: 10,
  status: "published",
}));

const blocked = ref(false);

const mainArticles = ref([]);
const totalRecords = ref();
const id = localStorage.getItem("app-author-id");
const user = ref("");

const load = async ($state) => {
  console.log("loading...");

  try {
    params.value.start += 10;
    // const result = await getArticles(params.value);

    const result = await getAuthorInterestedArticles(id, params.value);

    if (result.data) {
      if (result.data.length) {
        const { total, values: articles } = result.data;
        const articleWithImage = await attachArticleImage(articles);
        mainArticles.value.push(
          ...(await attachAuthorToArticles(articleWithImage))
        );
        totalRecords.value = total;
        await handleFollowedAuthors(id, mainArticles.value);
        $state.loaded();
      } else {
        $state.complete();
      }
    } else {
      console.error("Failed to fetch articles:", result.error);
    }
  } catch (error) {
    console.log({ error });
    $state.error();
  }
};

const fetchArticles = async () => {
  // const result = await getArticles(params.value);
  const result = await getAuthorInterestedArticles(user.value.id, params.value);

  if (result.data) {
    const { total, values: articles } = result.data;

    console.log({ articles });

    const articleWithImage = await attachArticleImage(articles);

    mainArticles.value = await attachAuthorToArticles(articleWithImage);

    await handleFollowedAuthors(user.value.id, mainArticles.value);
    console.log(mainArticles.value);
    totalRecords.value = total;
  } else {
    console.error("Failed to fetch articles:", result.error);
  }
};

const attachAuthorToArticles = (articles) => {
  return Promise.all(
    articles.map(async (article) => {
      const { data: author } = await getAuthorById(article.authorID);

      author.image = await handleImage(article.authorID);
      article = { author, ...article };
      return article;
    })
  );
};

const menu = ref(null);

const items = ref([
  {
    label: "Refresh",
    icon: "pi pi-refresh",
  },
  {
    label: "Search",
    icon: "pi pi-search",
  },
  {
    separator: true,
  },
  {
    label: "Delete",
    icon: "pi pi-times",
  },
]);

const handleFollowedAuthors = async (userId, articles) => {
  try {
    const { data: followedAuthors = [] } = await getFollowedAuthors(userId);

    if (!followedAuthors.length) return;

    // Create a Set for faster lookups
    const followedAuthorIds = new Set(
      followedAuthors
        .filter((author) => author.id !== userId)
        .map((author) => author.id)
    );

    // Update articles' author.followed flag
    articles.forEach((article) => {
      article.author.followed = followedAuthorIds.has(article.author.id);
    });
  } catch (error) {
    console.error("Failed to fetch followed authors:", error);
  }
};

const addAuthorFollower = async (author) => {
  const follower = user.value?.id;

  if (follower === author) return;

  const { data: followedAuthors } = await followAuthor(follower, author);

  if (followedAuthors) {
    mainArticles.value.forEach((article) => {
      if (article.author.id === author) {
        article.author.followed = true;
      }
    });
  }
};

const removeAuthorFollower = async (author) => {
  const follower = user.value?.id;

  if (follower === author) return;

  const { data: followedAuthors } = await unfollowAuthor(follower, author);

  if (followedAuthors) {
    mainArticles.value.forEach((article) => {
      if (article.author.id === author) {
        article.author.followed = false;
      }
    });
  }
};

const toggle = (event) => {
  menu.value.toggle(event);
};

const handleTitleFormat = (title) => {
  const characters = 50;

  return title.length > characters ? `${title.slice(0, characters)}...` : title;
};

const handleDescriptionFormat = (description, layout) => {
  let characters = 50;

  return description && description.length > characters
    ? `${description.slice(0, characters)}...`
    : description;
};

const recommendedTopics = ref([]);
const fetchRecommendedTopics = async () => {
  const { data } = await getRecommendedTopic(user.value.id);
  recommendedTopics.value = data;
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchArticles();
  await fetchRecommendedTopics();
});

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};
</script>
