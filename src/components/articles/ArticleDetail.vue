<template>
  <div id="article-detail" class="w-full flex flex-col gap-4">
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
    <div class="w-full flex justify-end">
      <Button class="py-1 px-1 font-bold" icon="pi pi-pencil" />
    </div>

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
</template>

<script setup>
import { getArticleById, getImage } from "@/assets/js/service.js";
import { articleStore } from "../../stores/article.store.js";
import { onMounted, ref } from "vue";

import ArticleComments from "./ArticleComments.vue";

const store = articleStore();
const article = ref("");
const commentData = ref({
  claps: 0,
  comments: 0,
  id: null,
});

const fetchArticleById = async () => {
  const cachedArticle = store.getArticle();

  const id = cachedArticle
    ? cachedArticle.id
    : localStorage.getItem("app-article-id");

  const fetchedArticle = await getArticleById(id);

  article.value =
    cachedArticle ?? (await handleArticleImage(fetchedArticle.data));

  commentData.value.claps = article.value.totalClaps;
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
  color: white !important;
  font-size: 0.9rem;
}
</style>
