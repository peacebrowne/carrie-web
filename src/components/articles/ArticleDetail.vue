<template>
  <nav class="w-full relative h-16 z-50 flex top-0">
    <NavBar />
  </nav>
  <div id="main-content" class="flex w-full h-[calc(90vh-56px)] pt-6">
    <div class="container m-auto flex w-full h-full md:px-8 lg:px-36 2xl:px-52">
      <ScrollPanel id="custom-scrollpanel" class="w-full mx-auto px-2">
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
      <Divider layout="vertical" />
      <div class="w-72"></div>
    </div>
  </div>
</template>

<script setup>
import { getArticleById, getImage } from "@/assets/js/service.js";
import { articleStore } from "../../stores/index.js";
import { onMounted, ref } from "vue";

import ArticleComments from "./ArticleComments.vue";
import NavBar from "../NavBar.vue";
// NavBar

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
#custom-scrollpanel ::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
}

#custom-scrollpanel {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

#content > p > span {
  font-size: 0.9rem;
}
</style>
