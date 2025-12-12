<template>
  <ScrollPanel class="w-full h-full pb-16 pr-1">
    <!-- RECOMMENDED TOPICS -->
    <div class="flex flex-col gap-2">
      <div class="px-2 pt-6 pb-4">
        <h3 class="font-bold">Recommended Topics</h3>
      </div>
      <div class="card flex flex-wrap gap-2">
        <router-link
          v-for="topic in recommendedTopics"
          :key="topic.id"
          :to="{
            name: 'tag-detail',
            params: { route: topic.route },
          }"
        >
          <Chip class="text-sm" :label="topic.name" />
        </router-link>
      </div>
      <div>
        <router-link :to="{ path: '/explore-topics' }">
          <Button
            v-if="totalRecommendedTopics"
            label="See more topics"
            severity="secondary"
            variant="text"
            class="text-xs font-semibold"
            rounded
          />
        </router-link>
      </div>
    </div>

    <!-- WHO TO FOLLOW -->
    <div class="flex flex-col gap-2">
      <div class="px-2 pt-6">
        <h3 class="font-bold">Who to follow</h3>
      </div>

      <div
        v-for="author in recommendedAuthors"
        :key="author.id"
        class="w-full flex items-start gap-2 pr-2"
      >
        <router-link>
          <Panel
            class="border-0 py-2"
            pt:header:class="px-2 py-1"
            pt:content:class="px-2 py-1"
            pt:footer:class="px-2 py-1"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <Avatar
                  v-if="author.image"
                  :image="author.image"
                  shape="circle"
                />

                <Avatar
                  v-else
                  icon="pi pi-user text-white text-xs"
                  shape="circle"
                  class="bg-[#1B4D3E]"
                />
                <span class="font-bold text-sm"
                  >{{ author.firstName }} {{ author.lastName }}</span
                >
              </div>
            </template>

            <p class="m-0 text-sm w-[11rem]">
              {{ truncateText(author.biography) }}
            </p>
          </Panel>
        </router-link>
        <div class="pt-4 ml-auto">
          <Button
            v-if="author.isFollowed"
            class="text-xs"
            severity="contrast"
            variant="outlined"
            rounded
            label="Following"
            @click="removeAuthorFollower(author)"
          />

          <Button
            v-else
            class="text-xs"
            severity="contrast"
            variant="outlined"
            rounded
            label="Follow"
            @click="addAuthorFollower(author)"
          />
        </div>
      </div>

      <router-link>
        <Button
          v-if="totalRecommendedAuthors"
          label="See more suggestions"
          severity="secondary"
          variant="text"
          class="text-xs font-semibold"
          rounded
        />
      </router-link>
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
        v-for="list in userReadingList"
        :key="list.id"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <Avatar
              v-if="list.author.image"
              :image="list.author.image"
              shape="circle"
              size="small"
              class="w-7 h-7"
            />

            <Avatar
              v-else
              icon="pi pi-user text-white text-xs"
              size="small"
              shape="circle"
              class="bg-[#1B4D3E] w-7 h-7"
            />
            <span class="font-bold text-xs"
              >{{ list.author.firstName }} {{ list.author.lastName }}</span
            >
          </div>
        </template>
        <template #footer>
          <router-link>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <span
                class="text-surface-500 dark:text-surface-400 text-xs font-normal"
                >{{ handleDateFormat(list.createdAt, "MMM DD") }}</span
              >
            </div>
          </router-link>
        </template>
        <router-link>
          <p class="m-0 font-black">
            {{ truncateText(list.title) }}
          </p>
        </router-link>
      </Panel>

      <div>
        <router-link>
          <Button
            v-if="totalReadingList > 4"
            severity="secondary"
            variant="text"
            class="text-xs font-semibold"
            rounded
          >
            <span>See all ({{ totalReadingList }})</span>
          </Button>
        </router-link>
      </div>
    </div>

    <!-- AUTHORS YOU ARE FOLLOWING -->
    <div>
      <div class="flex items-center gap-2 px-2 pt-6 pb-2">
        <i class="pi pi-users"></i>
        <h3 class="font-bold">Following</h3>
      </div>
      <div class="card flex flex-col gap-2 px-2">
        <div v-for="author in followedAuthors" :key="author.id">
          <div class="flex items-center gap-2">
            <Avatar
              v-if="author.image"
              :image="author.image"
              shape="circle"
              size="small"
            />

            <Avatar
              v-else
              icon="pi pi-user text-white text-xs"
              size="small"
              shape="circle"
              class="bg-[#1B4D3E]"
            />
            <span class="font-bold text-sm"
              >{{ author.firstName }} {{ author.lastName }}</span
            >
            <div class="w-1 h-1 bg-green-700 rounded-full"></div>
          </div>
        </div>

        <div class="flex items-start text-gray-500 gap-2">
          <span class="pi pi-plus text-sm"> </span>
          <span class="font-semibold text-xs w-[11rem]">
            Find writers to follow.
          </span>
        </div>

        <router-link>
          <Button
            label="See suggestions"
            severity="secondary"
            variant="text"
            class="text-xs font-semibold"
            rounded
          />
        </router-link>
      </div>
    </div>
  </ScrollPanel>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAuthorById,
  getFollowedAuthors,
  followAuthor,
  unfollowAuthor,
  getRecommendedAuthorTopics,
  getAuthorReadingList,
  getRecommendedAuthors,
  getArticleById,
} from "@/assets/js/service";

import { userStore, articleStore } from "@/stores";

import { handleImage, handleDateFormat, truncateText } from "@/assets/js/util";

const user = ref("");

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

const attachAuthorFollowers = async (userId) => {
  const { data: followedAuthors = [] } = await getFollowedAuthors(userId);

  if (!followedAuthors.length) return false;

  // Create a Set for faster lookups
  const followedAuthorIds = new Set(
    followedAuthors
      .filter((author) => author.id !== userId)
      .map((author) => author.id)
  );

  return followedAuthorIds.has(userId);
};

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

const totalRecommendedTopics = ref(0);
const recommendedTopics = ref([]);
const fetchRecommendedTopics = async () => {
  const currentUserId = user.value.id;

  const { data: fetchedTopics = [] } = await getRecommendedAuthorTopics(
    currentUserId,
    8
  );

  fetchedTopics.forEach((topic) => {
    topic.route = topic.name.toLocaleLowerCase().split(" ").join("-");
  });

  totalRecommendedTopics.value = fetchedTopics.length;
  recommendedTopics.value = fetchedTopics;
};

const totalRecommendedAuthors = ref(0);
const recommendedAuthors = ref([]);
const fetchRecommendedAuthors = async () => {
  const currentUserId = user.value.id;

  const { data: fetchedAuthors } = await getRecommendedAuthors(
    currentUserId,
    null,
    5
  );

  for (const author of fetchedAuthors) {
    author.image = await handleImage(author.id);
    author.isFollowed = await attachAuthorFollowers(author.id);
  }

  totalRecommendedAuthors.value = fetchedAuthors.length;
  recommendedAuthors.value = fetchedAuthors.slice(0, 3);
};

const userReadingList = ref([]);
const totalReadingList = ref(0);
const fetchReadingList = async () => {
  const currentUserId = user.value.id;

  const { data } = await getAuthorReadingList(currentUserId);
  const { values: readingList = [] } = data;

  if (!readingList.length) return;

  const readingListArticles = await Promise.all(
    readingList.map((list) => getArticleById(list.articleId))
  );

  const articles = readingListArticles
    .map((article) => article.data)
    .slice(0, 4);
  userReadingList.value = await attachAuthorToArticles(articles);
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

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchRecommendedTopics();
  await fetchRecommendedAuthors();
  await fetchFollowedAuthors();
  await fetchReadingList();
});

const handleTagStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};
</script>
