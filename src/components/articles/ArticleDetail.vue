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
          <img
            v-else
            src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
            alt="Image"
            class="w-full h-80"
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

          <p :id="$style.content" v-html="article.content"></p>

          <!-- ACTIONS -->
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <Button
                class="py-1 rounded-lg"
                size="small"
                severity="secondary"
                text
                @click="handleArticleClaps"
              >
                <i class="pi pi-thumbs-up text-2xl"></i>
                <span class="text-sm">{{ article.likes }}</span>
              </Button>
            </div>
            <div class="flex items-center gap-2">
              <a href="#editor">
                <Button
                  class="py-1 rounded-lg"
                  size="small"
                  severity="secondary"
                  text
                >
                  <i class="pi pi-comments text-2xl font-light"></i>
                  <span class="text-sm">{{ article.totalComments }}</span>
                </Button>
              </a>
            </div>
            <div class="flex items-center gap-2" disabled>
              <Button
                class="py-1 rounded-lg"
                size="small"
                severity="secondary"
                text
              >
                <i class="pi pi-share-alt text-2xl"></i>
                <span class="text-sm">0</span>
              </Button>
            </div>
          </div>

          <!-- WRITTEN BY -->
          <Panel toggleable id="writtenBy">
            <template #header>
              <div class="flex items-center gap-2">
                <Avatar
                  v-if="author.image"
                  :image="author.image"
                  shape="circle"
                  size="large"
                />

                <Avatar
                  v-else
                  icon="pi pi-user text-white text-xs"
                  shape="circle"
                  size="large"
                  class="bg-[#1B4D3E]"
                />
                <div>
                  <span class="font-black"
                    >Written by {{ author.firstName }}
                    {{ author.lastName }}</span
                  >
                  <div class="flex gap-2 text-xs">
                    <span>1.7K followers</span><span></span>16 following
                  </div>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="w-full flex justify-end">
                <Button
                  v-if="author.followed"
                  class="text-xs"
                  rounded
                  text
                  label="Following"
                  disabled
                />
                <Button
                  v-else
                  class="text-xs"
                  rounded
                  text
                  label="Follow"
                  @click="addAuthorFollower(author.id)"
                />
              </div>
            </template>
            <p class="m-0 text-sm">
              {{ author.biography }}
            </p>
          </Panel>

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
import {
  addClaps,
  followAuthor,
  getAuthorById,
  getAuthorFollowers,
} from "@/assets/js/service.js";
import { articleStore } from "../../stores/index.js";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores";

import ArticleComments from "./ArticleComments.vue";
import NavBar from "../NavBar.vue";
import { handleImage } from "@/assets/js/util.js";

const store = articleStore();
const author = ref("");
const user = ref("");
const article = ref("");
const commentData = ref({
  likes: 0,
  comments: 0,
  id: null,
});

const fetchArticleById = async () => {
  const fetchedArticle = await store.getArticle();
  const fetchedAuthor = await fetchArticleAuthor(fetchedArticle?.authorID);

  article.value = fetchedArticle;
  author.value = fetchedAuthor;
  handleAuthorFollowers(fetchedAuthor);

  commentData.value.likes = fetchedArticle.likes;
  commentData.value.comments = fetchedArticle.totalComments;
  commentData.value.id = fetchedArticle.id;
};

const fetchArticleAuthor = async (id) => {
  const { data: fetchedAuthor } = await getAuthorById(id);
  fetchedAuthor.image = await handleImage(id);
  return fetchedAuthor;
};

const handleAuthorFollowers = async ({ id }) => {
  const { data } = await getAuthorFollowers(id);
  const followers = data?.values || [];

  const isFollowing = followers.some(
    (follower) => follower.id === user.value.id
  );

  author.value.followed = isFollowing;
};

const addAuthorFollower = async (id) => {
  const follower = user.value.id;

  if (follower === id) return;

  const { data: followedAuthor } = await followAuthor(follower, id);
  if (followedAuthor) author.value.followed = true;
};

const handleArticleClaps = async () => {
  const data = {
    authorID: user.value.id,
    articleID: article.value.id,
  };

  const { result, ok } = await addClaps(data);
  if (ok) article.value.likes++;
};

onMounted(async () => {
  await fetchArticleById();
  const { getUser } = userStore();
  user.value = await getUser();
});
</script>

<style module>
#custom-scrollpanel ::-webkit-scrollbar {
  display: none;
}

#custom-scrollpanel {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#content > p > span,
#content > p {
  font-size: 0.9rem;
  color: #e5e7eb;
}
</style>
