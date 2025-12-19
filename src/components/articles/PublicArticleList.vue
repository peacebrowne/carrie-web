<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />

  <div id="main-content" class="w-full h-dvh">
    <div class="container m-auto flex w-full h-dvh md:px-8 lg:px-36 2xl:px-52">
      <Tabs :value="currentFeedParam" class="flex-1 mx-auto h-full pt-4">
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
          <TabPanel value="default" key="default" class="h-full p-0">
            <ScrollPanel class="w-full h-full pb-16">
              <ArticleCard
                :articlesFeed="articlesFeed"
                :isLoading="isInitialLoading"
                @reading-list="handleReadingList"
              />

              <Divider type="dashed" />

              <InfiniteLoading @infinite="load" />
            </ScrollPanel>
          </TabPanel>
        </TabPanels>

        <TabPanels class="h-full p-0">
          <TabPanel value="trending" key="trending" class="h-full p-0">
            <ScrollPanel class="w-full h-full pb-16">
              <Panel
                v-for="article in articlesFeed"
                :key="article.id"
                class="border relative p-2 rounded-none border-t-0 border-r-0 border-l-0"
              >
                <template #header> TRENDING </template>
                <template #icons> </template>
                <div class="articles-content"></div>
              </Panel>

              <Divider type="dashed" />

              <InfiniteLoading :key="currentFeedParam" @infinite="load">
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

      <Divider layout="vertical" />

      <div class="w-[21rem] h-full mx-auto pt-4">
        <ScrollPanel class="w-full h-full pb-16">
          <RecommendedTopics type="chips" />
          <ReadingList :readingListItem="readingListItem" />
          <RecommendedAuthors type="home" />
        </ScrollPanel>
      </div>
    </div>
    <ScrollTop />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getAuthorById,
  getFollowedAuthors,
  getAuthorInterestedArticles,
  getAuthorReadingList,
  getTrendingArticles,
  getAuthorFollowers,
  getFeaturedArticles,
} from "@/assets/js/service";

import { userStore } from "@/stores";

import InfiniteLoading from "v3-infinite-loading";
import { attachArticleImage, handleImage, slugify } from "@/assets/js/util";
import { useToast } from "primevue/usetoast";
import RecommendedTopics from "../personalization/suggestions/TopicSuggestions.vue";
import RecommendedAuthors from "../personalization/suggestions/AuthorSuggestions.vue";
import ArticleCard from "./ArticleCard.vue";

const params = ref({ start: 0, limit: 10 });

const toast = useToast();
const articlesFeed = ref([]);
const totalRecords = ref();
const id = localStorage.getItem("app-author-id");
const user = ref("");
const isInitialLoading = ref(true);

const route = useRoute();
const router = useRouter();

const feeds = ref([
  {
    label: "For You",
    param: "default",
    icon: "pi pi-compass",
    route: { name: "landing-page", query: {} },
  },

  {
    label: "Trending",
    param: "trending",
    icon: "pi pi-chart-line",
    route: { name: "landing-page", query: { feed: "trending" } },
  },
]);

const currentFeedParam = computed(() => route.query.feed || "default");

const load = async ($state) => {
  try {
    const newArticles = await fetchArticles(currentFeedParam.value);

    if (newArticles && newArticles.length > 0) {
      // SPREAD the new articles into the feed
      articlesFeed.value.push(...newArticles);

      // Move the pointer for the NEXT request
      params.value.start += params.value.limit;

      $state.loaded();
    } else {
      $state.complete();
    }
  } catch (error) {
    console.error("Infinite Load Error:", error);
    $state.error();
  }
};

const fetchArticles = async (feedName) => {
  isInitialLoading.value = true;
  let fetchedArticles;
  const currentParams = params.value;

  // API Call logic
  switch (feedName) {
    case "trending":
      fetchedArticles = await getTrendingArticles();
      break;
    case "default":
    default:
      fetchedArticles = await getFeaturedArticles(user.value.id, currentParams);
      break;
  }

  try {
    if (fetchedArticles?.data) {
      const { total, values: articles } = fetchedArticles.data;
      totalRecords.value = total;

      // Transform the NEW articles batch only
      const articleWithImage = await attachArticleImage(articles);
      const articleWithAuthor = await attachAuthorToArticles(articleWithImage);

      await handleArticleAuthorFollowers(articleWithAuthor);
      await handleSavedArticles(articleWithAuthor);
      handleArticleUrl(articleWithAuthor);

      return articleWithAuthor;
    }
    isInitialLoading.value = false;
    return [];
  } catch (error) {
    console.error("Fetch Logic Error:", error);
    return [];
  }
};

const handleArticleUrl = (articles) => {
  for (const article of articles) {
    article.url = slugify(article.title);
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

/**
 *  Watch the value fo the current feed parameter and pass
 *  the new feed name directly to the function
 * */
watch(
  currentFeedParam,
  (newFeed) => {
    fetchArticles(newFeed);
  },
  { immediate: false }
);

const handleArticleAuthorFollowers = async (articles) => {
  try {
    // Update articles' author.isFollowed flag
    for (const article of articles) {
      await attachAuthorFollowers(article.author);
    }
  } catch (error) {
    console.error("Failed to fetch followed authors:", error);
  }
};

const attachAuthorFollowers = async (author) => {
  const { data: followedAuthorData } = await getFollowedAuthors(author?.id);
  const { values: followedAuthors = [], total: totalFollowedAuthors } =
    followedAuthorData;

  const { data: authorFollowersData } = await getAuthorFollowers(author?.id);
  const { values: followingAuthors = [], total: totalAuthorFollowers } =
    authorFollowersData;

  if (!totalFollowedAuthors && !totalAuthorFollowers) return false;

  // Create a Set for faster lookups
  const followedAuthorIds = new Set(
    followingAuthors
      .filter((followingAuthor) => followingAuthor.id !== author?.id)
      .map((followedAuthor) => followedAuthor.id)
  );

  author.followers = totalAuthorFollowers;
  author.following = totalFollowedAuthors;
  author.isFollowed = followedAuthorIds.has(user.value?.id);
};

const handleSavedArticles = async (articles) => {
  try {
    const currentUserId = user.value.id;

    const { data: readingList = [] } = await getAuthorReadingList(
      currentUserId
    );

    if (!readingList.values.length) return;

    // Create a Set for faster lookups
    const readingListAuthorIds = new Set(
      readingList.values
        .filter((list) => list.authorId === currentUserId)
        .map((list) => list.articleId)
    );

    // Update articles' author.isSaved flag
    articles.forEach((article) => {
      article.isSaved = readingListAuthorIds.has(article.id);
    });
  } catch (error) {
    console.error("Failed to fetch followed authors:", error);
  }
};

const followedAuthors = ref([]);
const fetchFollowedAuthors = async () => {
  const currentUserId = user.value.id;

  const { data: authors = [] } = await getFollowedAuthors(currentUserId);

  if (!authors.length) return false;

  for (const author of authors) {
    author.image = await handleImage(author.id);
  }

  followedAuthors.value = authors.slice(0, 10);
};

const readingListItem = ref("");
const handleReadingList = (data) => {
  readingListItem.value = data;
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  // Get the initial feed (default or from query) and pass it
  articlesFeed.value = await fetchArticles(currentFeedParam.value);
  await fetchFollowedAuthors();
});

// Reset the infinite loader params when switching feeds
const resetParams = () => {
  params.value = {
    start: 0,
    limit: 10,
  };
};
</script>
