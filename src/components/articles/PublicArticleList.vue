<template>
  <div id="main-content" class="flex w-full h-[calc(90vh-56px)]">
    <div class="container m-auto flex w-full h-full md:px-8 lg:px-36 2xl:px-52">
      <Tabs value="0" class="flex-1 mx-auto h-full">
        <TabList>
          <Tab value="0">Home</Tab>
          <Tab value="1">Following</Tab>
          <Tab value="2">Shared</Tab>
        </TabList>
        <TabPanels class="h-full">
          <TabPanel value="0" class="h-full">
            <ScrollPanel class="w-full h-full">
              <Panel
                v-for="article in mainArticles"
                :key="article.id"
                class="border-none relative"
              >
                <template #header>
                  <div class="flex items-center gap-2">
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

                    <Button
                      v-if="article.followed"
                      class="text-xs"
                      rounded
                      text
                      label="Following"
                      disabled
                    />
                    <Button
                      v-else-if="!article.followed && article.author.id !== id"
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
                <div class="flex">
                  <router-link
                    class="w-full"
                    :to="{
                      name: 'public-article-detail',
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
                              v-tooltip.top="
                                `${article.totalDislikes} dislikes`
                              "
                            >
                              <span class="pi pi-thumbs-down text-xs"></span>
                              <span class="text-xs">{{
                                article.totalDislikes
                              }}</span>
                            </div>

                            <div
                              class="flex gap-1 items-center"
                              v-tooltip.top="
                                `${article.totalComments} comments`
                              "
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
            <p class="m-0">Coming soon!</p>
          </TabPanel>

          <TabPanel value="2">
            <p class="m-0">Coming soon!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Divider layout="vertical" />
      <div class="w-72"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import Menu from "primevue/menu";
import {
  getFollowedArticles,
  getArticles,
  getAuthorById,
  getFollowedAuthors,
  followAuthor,
} from "@/assets/js/service";

import { articleStore } from "@/stores";

import InfiniteLoading from "v3-infinite-loading";
import {
  attachArticleImage,
  fetchUserImage,
  handleDateFormat,
} from "@/assets/js/util";

let comments = ref([]);
const params = computed(() => ({
  start: 0,
  limit: 10,
  status: "published",
}));

const mainArticles = ref([]);
const totalRecords = ref();
const id = localStorage.getItem("app-author-id");

let page = 1;
const load = async ($state) => {
  console.log("loading...");

  try {
    // const id = localStorage.getItem("app-author-id");
    // const interestedArticles = await getFollowedArticles(id, {
    //   status: "published",
    //   start: 0,
    //   limit: 10,
    // });

    params.value.start += 10;
    const response = await getArticles(params.value);

    if (response.data) {
      if (response.data.length) {
        const { total, values: articles } = response.data;
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
      console.error("Failed to fetch articles:", response.error);
    }
  } catch (error) {
    console.log({ error });
    $state.error();
  }
};

const fetchArticles = async () => {
  // const id = localStorage.getItem("app-author-id");
  // const interestedArticles = await getFollowedArticles(id, {
  //   status: "published",
  //   start: 0,
  //   limit: 10,
  // });

  const result = await getArticles(params.value);

  if (result.data) {
    const { total, values: articles } = result.data;

    const articleWithImage = await attachArticleImage(articles);

    mainArticles.value = await attachAuthorToArticles(articleWithImage);
    await handleFollowedAuthors(id, mainArticles.value);
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

      author.image = await fetchUserImage(article.authorID);
      article.author = author;
      delete article.authorID;
      return article;
    })
  );
};

const menu = ref(null);
const router = useRouter();

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

const handleFollowedAuthors = async (id, articles) => {
  const followedAuthors = await getFollowedAuthors(id);

  if (followedAuthors?.data.length) {
    const authors = followedAuthors.data.filter((author) => author.id !== id);

    articles.forEach((article) => {
      authors.forEach((author) => {
        if (article.author.id === author.id) {
          article.followed = true;
        }
      });
    });
  }
};

const addAuthorFollower = async (author) => {
  const follower = localStorage.getItem("app-author-id");

  if (follower === author) {
    return;
  }
  const followedAuthor = await followAuthor(follower, author);

  const { data: authors } = followedAuthor;
  console.log({ authors });

  if (authors) {
    mainArticles.value.forEach((article) => {
      if (article.author.id === author) {
        article.followed = true;
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

onMounted(async () => await fetchArticles());

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};
</script>
