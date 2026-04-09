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
          <div class="pt-10 pb-6 flex flex-col gap-4">
            <span class="text-5xl font-semibold">
              {{ author?.firstName }} {{ author?.lastName }}
            </span>
          </div>

          <Tabs :value="currentTab" class="w-full mx-auto h-full">
            <TabList>
              <Tab
                v-for="tab in profileTab"
                :key="tab.label"
                :value="tab.param"
              >
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
              </Tab>
            </TabList>

            <TabPanels class="w-full h-full p-0">
              <TabPanel
                v-for="tab in profileTab"
                :key="tab.param"
                :value="tab.param"
                class="h-full p-0"
              >
                <div v-if="currentTab === 'posts'">
                  <ArticleCard
                    :articlesFeed="articlesFeed"
                    :isLoading="isInitialLoading"
                    type="public"
                    @reading-list="handleReadingList"
                  />

                  <Divider type="dashed" />

                  <InfiniteLoading :key="currentTab" @infinite="load">
                    <template #complete>
                      <p class="py-4 text-center text-gray-500">
                        No more articles to show.
                      </p>
                    </template>
                  </InfiniteLoading>
                </div>

                <div v-if="tab.param === 'about'">
                  <div class="flex flex-col gap-4 pt-4 px-2">
                    {{ author?.biography }}
                  </div>
                  <div class="flex px-3 py-8 gap-6 text-xs">
                    <span
                      >Carrie member since
                      <strong>{{
                        handleDateFormat(author?.createdAt, "MMM DD, YYYY")
                      }}</strong>
                    </span>

                    <span>-</span>
                    <div class="flex gap-2 text-green-800">
                      <span
                        >{{
                          describeNumberScale(author?.followers)
                        }}
                        followers</span
                      >
                      <i class="pi pi-dot"></i>
                      <span
                        >{{
                          describeNumberScale(author?.following)
                        }}
                        following</span
                      >
                    </div>
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
          <Card
            class="w-full overflow-hidden shadow-none"
            pt:footer:class="mt-auto"
            pt:body:class="h-full p-[1rem]"
          >
            <template #content>
              <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-6">
                  <div>
                    <Avatar
                      v-if="author.image"
                      :image="author.image"
                      shape="circle"
                      size="xlarge"
                    />

                    <Avatar
                      v-else
                      icon="pi pi-user text-white text-xs"
                      shape="circle"
                      size="xlarge"
                      class="bg-[#1B4D3E]"
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <span class="font-bold text-sm"
                      >{{ author.firstName }} {{ author.lastName }}</span
                    >
                    <div class="flex gap-2 text-xs">
                      <span
                        >{{
                          describeNumberScale(author?.followers)
                        }}
                        followers</span
                      >
                    </div>
                  </div>
                </div>

                <div>
                  <p class="text-xs description-preview">
                    {{ author.biography }}
                  </p>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="mt-4 flex items-center">
                <Button
                  v-if="author.isFollowed"
                  severity="contrast"
                  variant="outlined"
                  class="text-xs"
                  rounded
                  label="Following"
                  @click.stop.prevent="removeAuthorFollower(author)"
                />
                <Button
                  v-else-if="!author.isFollowed && author.id !== id"
                  severity="contrast"
                  variant="outlined"
                  class="text-xs"
                  rounded
                  label="Follow"
                  @click.stop.prevent="addAuthorFollower(author)"
                />
              </div>
            </template>
          </Card>
          <div class="mt-2">
            <div class="flex items-center gap-2 px-2 pt-6 pb-2">
              <i class="pi pi-users text-sm"></i>
              <h3 class="font-bold text-sm">Following</h3>
            </div>

            <div class="card flex flex-col gap-3 px-2">
              <div
                v-for="author in followedAuthors.slice(0, 3)"
                :key="author.id"
                class="flex items-center gap-2"
              >
                <Avatar
                  v-if="author.image"
                  :image="author.image"
                  shape="circle"
                  class="w-8 h-8"
                />
                <Avatar
                  v-else
                  icon="pi pi-user text-white text-[10px]"
                  shape="circle"
                  class="bg-[#1B4D3E] w-8 h-8"
                />
                <span class="font-bold text-sm"
                  >{{ author.firstName }} {{ author.lastName }}</span
                >
                <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>

              <div
                v-if="!followedAuthors.length"
                class="flex items-start text-gray-500 gap-2 py-2"
              >
                <span class="pi pi-plus text-xs mt-0.5"></span>
                <span class="font-medium text-xs">Find writers to follow.</span>
              </div>

              <router-link
                :to="{
                  name: 'personalization-category',
                  params: { category: 'suggestions' },
                }"
              >
                <Button
                  label="See suggestions"
                  severity="secondary"
                  variant="text"
                  class="text-xs font-semibold p-0"
                  rounded
                />
              </router-link>
            </div>
          </div>
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
import NavBar from "../NavBar.vue";
import {
  getAuthorByUsername,
  getAuthorReadingList,
  getAuthorArticles,
  followAuthor,
  unfollowAuthor,
  getFollowedAuthors,
  getAuthorFollowers,
} from "@/assets/js/service";
import {
  attachArticleImage,
  slugify,
  describeNumberScale,
  handleDateFormat,
  handleImage,
} from "@/assets/js/util";
const route = useRoute();
const router = useRouter();

const author = ref({});
const user = ref({});
const articlesFeed = ref([]);
const isInitialLoading = ref(true);
const followedAuthors = ref([]);
const totalFollowedAuthors = ref(0);
const topFiveAuthors = ref([]);

// Get the tab type from the URL path parameter
const currentTab = computed(() => {
  return route.name === "author-about" ? "about" : "posts";
});
const params = ref({ start: 0, limit: 10 });
const profileTab = computed(() => [
  {
    label: "Home",
    param: "posts",
    icon: "pi pi-home",
    route: {
      name: "author-profile",
      params: { username: route.params.username },
    },
  },
  {
    label: "About",
    param: "about",
    icon: "pi pi-info-circle",
    route: {
      name: "author-about",
      params: { username: route.params.username },
    },
  },
]);

const fetchAuthorArticles = async () => {
  isInitialLoading.value = true;
  const cleanedParams = params.value;

  try {
    const result = await getAuthorArticles(author.value?.id, cleanedParams);

    if (result?.data) {
      const { values: articles = [] } = result.data;

      const articlesWithImage = await attachArticleImage(articles);

      await handleSavedArticles(articlesWithImage);
      handleArticleRoute(articlesWithImage);

      articlesFeed.value = articlesWithImage;
    }
    isInitialLoading.value = false;
    return [];
  } catch (error) {
    console.error("Fetch Logic Error:", error);
    return [];
  }
};

const fetchAuthorInformation = async () => {
  try {
    const { data: res } = await getAuthorByUsername(route.params.username);
    await attachAuthorFollowers(res);
    res.image = await handleImage(res.id);

    author.value = res;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
};

const handleSavedArticles = async (articles) => {
  try {
    const currenAuthorId = author.value.id;

    const { data: readingList = [] } = await getAuthorReadingList(
      currenAuthorId
    );
    if (!readingList.values.length) return;

    // Create a Set for faster lookups
    const readingListAuthorIds = new Set(
      readingList.values
        .filter((list) => list.authorId === currenAuthorId)
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

const handleArticleRoute = (articles) => {
  for (const article of articles) {
    article.route = slugify(article.title);
  }
  return articles;
};

const addAuthorFollower = async (author) => {
  const follower = user.value?.id;

  if (follower === author.id) return;

  const { data: followedAuthor } = await followAuthor(follower, author.id);

  if (followedAuthor) author.isFollowed = true;
};

const removeAuthorFollower = async (author) => {
  const follower = user.value?.id;

  if (follower === author.id) return;

  const { data: followedAuthor } = await unfollowAuthor(follower, author.id);
  if (followedAuthor) author.isFollowed = false;
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

const fetchFollowedAuthors = async () => {
  if (!author.value?.id) return;
  try {
    const { data } = await getFollowedAuthors(author.value.id);
    if (data?.values) {
      const authors = data.values;
      for (const a of authors) {
        a.image = await handleImage(a.id);
        a.isFollowed = true;
      }
      followedAuthors.value = authors;
      totalFollowedAuthors.value = data.total;
      topFiveAuthors.value = authors.slice(0, 5);
    }
  } finally {
  }
};

// Initial load on mount
onMounted(async () => {
  const { getUser } = userStore();
  const userData = await getUser();
  user.value = userData;
  await fetchAuthorInformation();
  await fetchAuthorArticles();
  await fetchFollowedAuthors();
});
</script>

<style>
.p-scrollpanel-bar {
  display: none !important;
}
</style>
