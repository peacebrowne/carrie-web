<template>
  <div>
    <div>
      <div class="flex items-center gap-2 px-2 pt-6 pb-2 text-xs">
        <i class="pi pi-user-plus"></i>
        <h3 class="font-bold">History</h3>
      </div>
      <div class="card flex flex-col gap-2 px-2">
        <div v-for="author in followedAuthors" :key="author.id">
          <div class="flex items-center gap-2">
            <Avatar
              v-if="author.image"
              :image="author.image"
              shape="circle"
              size="small"
              class="w-10 h-10"
            />

            <Avatar
              v-else
              icon="pi pi-user text-white text-xs"
              size="small"
              shape="circle"
              class="bg-[#1B4D3E] w-10 h-10"
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
  </div>
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

import { handleImage } from "@/assets/js/util";

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
