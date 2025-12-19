<template>
  <ReadingListSkeleton v-if="isLoading" />

  <template v-else>
    <div>
      <div class="px-2 pt-6 pb-2">
        <h3 class="font-bold text-sm">Your reading list</h3>
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
          <router-link
            :to="{
              name: 'author-profile',
              params: { username: list.author.username },
            }"
            class="text-sm font-bold flex items-center gap-2"
          >
            <Avatar
              v-if="list.author.image"
              :image="list.author.image"
              shape="circle"
              size="small"
              class="w-8 h-8"
            />

            <Avatar
              v-else
              icon="pi pi-user text-white text-xs"
              size="small"
              shape="circle"
              class="bg-[#1B4D3E] w-8 h-8"
            />
            <span class="font-bold text-xs"
              >{{ list.author.firstName }} {{ list.author.lastName }}</span
            >
          </router-link>
        </template>

        <router-link
          class="w-full"
          :to="{
            name: 'public-article-detail',
            params: { url: list.url },
          }"
          @click="handleArticleStore(list)"
        >
          <Card
            pt:body:class="flex-1 p-0 m-auto"
            class="shadow-none rounded-none items-start justify-between overflow-hidden flex-row-reverse w-full gap-4"
          >
            <template #content>
              <p class="title-preview m-0 font-black text-xs">
                {{ list.title }}
              </p>
            </template>
            <template #footer>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <span
                  class="text-surface-500 dark:text-surface-400 text-xs font-normal"
                  >{{ handleDateFormat(list.createdAt, "MMM DD") }}</span
                >
              </div>
            </template>
          </Card>
        </router-link>
      </Panel>
      <div>
        <Button
          v-if="totalReadingList > 4"
          severity="secondary"
          variant="text"
          class="text-xs font-semibold"
          rounded
        >
          <span>See all ({{ totalReadingList }})</span>
        </Button>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  getAuthorById,
  getAuthorReadingList,
  getArticleById,
} from "@/assets/js/service";

import { userStore, articleStore } from "@/stores";

import { handleImage, handleDateFormat, slugify } from "@/assets/js/util";
import ReadingListSkeleton from "../skeletons/ReadingListSkeleton.vue";

const user = ref("");
const isLoading = ref(true);
const userReadingList = ref([]);
const totalReadingList = ref(0);

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

const props = defineProps({
  readingListItem: {
    type: Object,
    required: true,
  },
});

watch(
  () => props.readingListItem,
  (newValue, oldValue) => {
    handleReadingList(newValue);
  },
  { deep: true }
);

const handleReadingList = ({ action, targetArticle }) => {
  switch (action) {
    case "add":
      // Check if it already exists to prevent duplicates
      const exists = userReadingList.value.some(
        (item) => item.id === targetArticle.id
      );
      if (!exists) {
        userReadingList.value.unshift(targetArticle);
      }
      break;

    case "remove":
      userReadingList.value = userReadingList.value.filter(
        (item) => item.id !== targetArticle.id
      );

      break;

    default:
      console.warn(`Action ${action} is not recognized.`);
      break;
  }
};

const handleArticleUrl = (articles) => {
  for (const article of articles) {
    article.data.url = slugify(article.data.title);
  }
};

const fetchReadingList = async () => {
  const currentUserId = user.value.id;

  if (!currentUserId) return;
  isLoading.value = true;

  try {
    const { data } = await getAuthorReadingList(currentUserId);
    const { total, values: readingList = [] } = data;

    if (!readingList.length) return;

    const readingListArticles = await Promise.all(
      readingList.map((list) => getArticleById(list.articleId))
    );

    totalReadingList.value = total;
    handleArticleUrl(readingListArticles);
    const articles = readingListArticles
      .map((article) => article.data)
      .slice(0, 4);
    userReadingList.value = await attachAuthorToArticles(articles);
  } finally {
    isLoading.value = false;
  }
};

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchReadingList();
});
</script>

<style>
.title-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description-preview {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
