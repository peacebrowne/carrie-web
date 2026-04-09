<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />
  <ConfirmDialog />

  <nav
    class="w-full sticky z-[500] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>
  <div id="main-content" class="w-full h-dvh">
    <div class="container m-auto flex w-full h-dvh md:px-8 lg:px-36 2xl:px-52">
      <div class="flex flex-col gap-4 h-full w-full">
        <ScrollPanel class="w-full h-full pb-16">
          <div class="pt-8 pb-4 flex flex-col gap-4">
            <h2 class="text-3xl text-surface-500 font-semibold">
              Result for <span class="text-black"> {{ searchTerm }}</span>
            </h2>
          </div>

          <Tabs :value="currentScope" class="w-full mx-auto h-full">
            <TabList>
              <Tab
                v-for="scope in searchScopes"
                :key="scope.label"
                :value="scope.param"
              >
                <router-link
                  v-if="scope.route"
                  v-slot="{ href, navigate }"
                  :to="scope.route"
                  custom
                >
                  <a
                    v-ripple
                    :href="href"
                    @click="navigate"
                    class="flex items-center gap-2 text-inherit"
                  >
                    <i :class="scope.icon" class="text-sm" />
                    <span class="text-xs">{{ scope.label }}</span>
                  </a>
                </router-link>
              </Tab>
            </TabList>

            <TabPanels class="w-full h-full p-0">
              <TabPanel
                v-for="scope in searchScopes"
                :key="scope.param"
                :value="scope.param"
                class="h-full p-0"
              >
                <div v-if="currentScope === 'posts'">
                  <ArticleCard
                    :articlesFeed="articlesFeed"
                    :isLoading="isInitialLoading"
                    type="public"
                    @reading-list="handleReadingList"
                  />

                  <Divider type="dashed" />

                  <InfiniteLoading :key="currentScope" @infinite="load">
                    <template #complete>
                      <p class="py-4 text-center text-gray-500">
                        No more articles to show.
                      </p>
                    </template>
                  </InfiniteLoading>
                </div>

                <div v-if="currentScope === 'users'">
                  <div class="flex flex-col gap-4 pt-4 px-2">
                    <div
                      v-for="author in authorFeed"
                      :key="author.id"
                      class="w-full flex items-start gap-2 pr-2"
                    >
                      <router-link
                        :to="{
                          name: 'author-profile',
                          params: { username: author.username },
                        }"
                        class="flex-1"
                      >
                        <Panel
                          class="border-0 py-2 flex justify-between items-center"
                          pt:header:class="px-2 py-1"
                          pt:footer:class="px-2 py-1"
                        >
                          <template #header>
                            <div class="flex items-start gap-2">
                              <div>
                                <Avatar
                                  v-if="author.image"
                                  :image="author.image"
                                  shape="circle"
                                  class="w-10 h-10"
                                />
                                <Avatar
                                  v-else
                                  icon="pi pi-user text-white text-xs"
                                  shape="circle"
                                  class="bg-[#1B4D3E] w-10 h-10"
                                />
                              </div>
                              <div>
                                <span class="font-bold text-sm"
                                  >{{ author.firstName }}
                                  {{ author.lastName }}</span
                                >
                                <p class="m-0 text-xs text-surface-500">
                                  {{ author.biography }}
                                </p>
                              </div>
                            </div>
                          </template>
                          <template #footer>
                            <div class="pt-4 ml-auto">
                              <Button
                                class="text-xs"
                                rounded
                                severity="contrast"
                                variant="outlined"
                                :label="
                                  author.isFollowed ? 'Following' : 'Follow'
                                "
                                @click="
                                  author.isFollowed
                                    ? removeAuthorFollower(author)
                                    : addAuthorFollower(author)
                                "
                              />
                            </div>
                          </template>
                        </Panel>
                      </router-link>
                    </div>
                  </div>
                </div>

                <div v-if="currentScope === 'tags'">
                  <div class="card flex flex-wrap py-4 gap-2">
                    <router-link
                      v-for="topic in tagFeed"
                      :key="topic.id"
                      :to="{
                        name: 'tag-detail',
                        params: { route: topic.route },
                      }"
                    >
                      <Chip class="text-xs font-normal" :label="topic.name" />
                    </router-link>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ScrollPanel>
      </div>

      <Divider layout="vertical" />

      <div class="w-[21rem] h-full mx-auto pt-4">
        <ScrollPanel class="w-full h-full pb-16">
          <TopicSuggestions type="chips" />
          <ReadingList />
          <AuthorSuggestions type="home" />
        </ScrollPanel>
      </div>
    </div>
    <ScrollTop />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/stores";
import InfiniteLoading from "v3-infinite-loading";
import { useToast } from "primevue/usetoast";
import ArticleCard from "../articles/ArticleCard.vue";
import ReadingList from "../articles/ReadingList.vue";
import TopicSuggestions from "./suggestions/TopicSuggestions.vue";
import AuthorSuggestions from "./suggestions/AuthorSuggestions.vue";
import NavBar from "../NavBar.vue";
import {
  getAuthorById,
  getFollowedAuthors,
  searchArticles,
  searchAuthors,
  searchTags,
  getAuthorReadingList,
  getAuthorFollowers,
  followAuthor,
  unfollowAuthor,
} from "@/assets/js/service";
import { attachArticleImage, handleImage, slugify } from "@/assets/js/util";
const route = useRoute();
const router = useRouter();

const user = ref(null);
const articlesFeed = ref([]);
const authorFeed = ref([]);
const tagFeed = ref([]);
const isInitialLoading = ref(true);

const searchTerm = computed(() => route.query.q);

// Get the tab type from the URL path parameter
const currentScope = computed(() => {
  return route.params.type || "posts";
});
const params = ref({ start: 0, limit: 10 });

const searchScopes = computed(() => [
  {
    label: "Stories",
    param: "posts",
    icon: "pi pi-book",
    // Points to /search/posts?q=...
    route: {
      name: "search",
      params: { type: "posts" },
      query: { q: searchTerm.value },
    },
  },
  {
    label: "People",
    param: "users",
    icon: "pi pi-users",
    route: {
      name: "search",
      params: { type: "users" },
      query: { q: searchTerm.value },
    },
  },
  {
    label: "Topics",
    param: "tags",
    icon: "pi pi-list",
    route: {
      name: "search",
      params: { type: "tags" },
      query: { q: searchTerm.value },
    },
  },
]);

watch(
  () => [route.query.q, route.params.type],
  ([newTerm, newType]) => {
    // currentScope.value = newType || "posts";

    performSearch(newTerm, newType || "posts");
  }
);

// Filter members based on typing
const searchResults = ref([]);

const performSearch = async (term, type = "posts") => {
  if (!term || term.trim() === "") {
    searchResults.value = [];
    return;
  }

  try {
    isInitialLoading.value = true;

    // Switch based on the active tab (scope)
    if (type === "posts") {
      articlesFeed.value = await fetchSearchedArticles();
      console.log(articlesFeed.value);
    } else if (type === "users") {
      authorFeed.value = await fetchSearchAuthors();
      console.log(authorFeed.value);
    } else if (type === "tags") {
      tagFeed.value = await fetchSearchTags();
      console.log(tagFeed.value);
    }
  } catch (error) {
    console.error("Search error:", error);
    searchResults.value = [];
  } finally {
    isInitialLoading.value = false;
  }
};

const fetchSearchedArticles = async () => {
  isInitialLoading.value = true;
  const cleanedParams = params.value;

  try {
    const result = await searchArticles({
      term: searchTerm.value,
      sort: "popular",
      ...cleanedParams,
    });

    if (result?.data) {
      const { values: articles = [] } = result.data;

      const articlesWithImage = await attachArticleImage(articles);
      const articleWithAuthor = await attachAuthorToArticles(articlesWithImage);

      await handleArticleAuthorFollowers(articleWithAuthor);
      await handleSavedArticles(articleWithAuthor);
      handleArticleRoute(articleWithAuthor);

      return articleWithAuthor;
    }
    isInitialLoading.value = false;
    return [];
  } catch (error) {
    console.error("Fetch Logic Error:", error);
    return [];
  }
};

const fetchSearchAuthors = async () => {
  try {
    const { data: res } = await searchAuthors({
      term: searchTerm.value,
      ...params.value,
    });

    if (res?.values) {
      const authors = res.values;
      console.log({ authors });
      for (const author of authors) {
        author.image = await handleImage(author.id);
        await attachAuthorFollowers(author);
      }
      return authors;
    }
    return res?.values || [];
  } catch (error) {
    console.error("Failed to fetch authors:", error);
    return [];
  }
};

const fetchSearchTags = async () => {
  try {
    const { data: res } = await searchTags({
      term: searchTerm.value,
      ...params.value,
    });

    if (res?.length) {
      const topics = res;
      for (const topic of topics) {
        topic.route = slugify(topic.name);
        handleTopicRoutes(topics);
      }
      return topics;
    }
    return res || [];
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
};

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

const handleArticleRoute = (articles) => {
  for (const article of articles) {
    article.route = slugify(article.title);
  }
  return articles;
};

const handleTopicRoutes = (topics) => {
  for (const topic of topics) {
    topic.route = slugify(topic.name);
  }

  return topics;
};

watch(
  () => route.query.q,
  (newTerm) => {
    performSearch(newTerm);
  }
);

const addAuthorFollower = async (author) => {
  const follower = user.value?.id;

  if (follower === author?.id) return;

  const { data: followedAuthors } = await followAuthor(follower, author?.id);

  if (followedAuthors) author.isFollowed = true;
};

const removeAuthorFollower = async (author) => {
  const follower = user.value?.id;

  if (follower === author?.id) return;

  const { data: followedAuthors } = await unfollowAuthor(follower, author?.id);

  if (followedAuthors) author.isFollowed = false;
};

// Initial load on mount
onMounted(async () => {
  const { getUser } = userStore();
  const userData = await getUser();
  user.value = userData;
  performSearch(searchTerm.value);
});
</script>

<style>
.p-scrollpanel-bar {
  display: none !important;
}
</style>
