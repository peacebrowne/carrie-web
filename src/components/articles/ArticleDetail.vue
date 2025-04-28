<template>
  <div class="pt-8">
    <ScrollPanel
      id="main-content"
      class="w-full mx-auto px-2 md:px-8 lg:px-52 h-[calc(100vh-56px)] container"
    >
      <div id="article-detail" class="w-full flex flex-col lg:px-16 gap-4">
        <Image
          v-if="article.image"
          :src="article.image"
          alt="Image"
          class="w-full h-80"
          imageClass="w-full h-full object-cover"
          preview
        />
        <Image
          v-else
          src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg"
          alt="Image"
          class="w-full h-80"
          imageClass="w-full h-full object-cover"
          preview
        />

        <div>
          <h1 class="text-3xl font-black">
            {{ article.title }}
          </h1>
        </div>

        <div>
          <p class="font-bold">
            {{ article.description }}
          </p>
        </div>

        <div class="flex gap-1">
          <Tag
            v-for="tag in article.tags"
            :key="tag"
            :value="tag"
            severity="contrast"
            rounded
            class="py-1 text-xs"
          ></Tag>
        </div>

        <div :id="$style.content" v-html="article.content"></div>
        <ArticleComments :commentData="commentData" />
      </div>
      <ScrollTop
        target="parent"
        :threshold="100"
        icon="pi pi-arrow-up"
        :buttonProps="{ severity: 'contrast', raised: true, rounded: true }"
      />
    </ScrollPanel>
  </div>
</template>

<script setup>
import { getArticleById, getImage } from "@/assets/js/service.js";
import { articleStore } from "../../stores/index.js";
import { onMounted, ref } from "vue";

import ArticleComments from "./ArticleComments.vue";

const store = articleStore();
const article = ref("");
const commentData = ref({
  likes: 0,
  comments: 0,
  id: null,
});

const fetchArticleById = async () => {
  const cachedArticle = store.getArticle();

  const id = cachedArticle
    ? cachedArticle.id
    : localStorage.getItem("app-article-id");

  const fetchedArticle = await getArticleById(id);

  console.log({ fetchedArticle });

  article.value =
    cachedArticle ?? (await handleArticleImage(fetchedArticle.data));

  commentData.value.likes = article.value.totalLikes;
  commentData.value.comments = article.value.totalComments;
  commentData.value.id = id;
};

const handleArticleImage = async (articleData) => {
  const { data, ok } = await getImage(articleData.id);
  let image;

  if (ok && data.size) {
    image = URL.createObjectURL(data);
  }

  return { ...articleData, image };
};

onMounted(async () => {
  await fetchArticleById();
});
</script>

<style module>
#content > p > span {
  font-size: 0.9rem;
}
</style>
