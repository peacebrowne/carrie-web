<template>
  <div v-if="isLoading && !articlesFeed.length">
    <ArticleSkeleton v-for="i in 5" :key="'skel-' + i" />
  </div>

  <!-- PUBLIC ARTICLES -->
  <template v-else-if="articlesFeed.length && type === 'public'">
    <Panel
      v-for="article in articlesFeed"
      :key="article.id"
      class="border relative p-2 rounded-none border-t-0 border-r-0 border-l-0"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <router-link
            :to="{
              name: 'author-profile',
              params: { username: article.author.username },
            }"
            class="text-sm font-bold flex items-center gap-2"
          >
            <Avatar
              v-if="article.author.image"
              :image="article.author.image"
              shape="circle"
              class="w-8 h-8"
            />

            <Avatar
              v-else
              icon="pi pi-user text-white text-xs"
              shape="circle"
              class="bg-[#1B4D3E] w-8 h-8"
            />
            <span class="font-bold"
              >{{ article.author.firstName }}
              {{ article.author.lastName }}</span
            >
          </router-link>

          <div>
            <Button
              v-if="article.author.isFollowed"
              class="text-xs"
              rounded
              text
              label="Following"
              @click="removeAuthorFollower(article.author)"
            />
            <Button
              v-else-if="!article.author.isFollowed && article.author.id !== id"
              class="text-xs"
              rounded
              text
              label="Follow"
              @click="addAuthorFollower(article.author)"
            />
          </div>
        </div>
      </template>
      <template #icons>
        <Button
          icon="pi pi-ellipsis-h"
          severity="secondary"
          rounded
          text
          @click="toggle"
        />
        <Menu ref="menu" id="config_menu" :model="items" popup />
      </template>
      <router-link
        class="w-full"
        :to="{
          name: 'public-article-detail',
          params: { url: article.url },
        }"
        @click="handleArticleStore(article)"
      >
        <Card
          pt:body:class="flex-1 p-0 m-auto"
          class="shadow-none rounded-none items-start justify-between overflow-hidden flex-row-reverse w-full gap-4"
        >
          <!-- Text Content -->
          <template #content>
            <div class="flex flex-row w-full">
              <div class="basis-3/4">
                <h3 class="title-preview font-black text-2xl pr-4">
                  {{ article.title }}
                </h3>

                <p class="description-preview text-sm font-mono pr-4">
                  {{ article.description }}
                </p>

                <div class="mt-4 flex gap-3 items-center w-full">
                  <div class="flex gap-1 items-center">
                    <span
                      class="text-surface-500 text-sm font-normal dark:text-surface-400"
                      >{{ handleDateFormat(article.createdAt, "MMM DD") }}</span
                    >
                  </div>

                  <div
                    class="flex gap-1 items-enter"
                    v-tooltip.top="`${article.likes} likes`"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      aria-labelledby="clap-filled-static-desc"
                      viewBox="0 0 16 16"
                      class="mt-[0.1rem]"
                    >
                      <desc id="clap-filled-static-desc">A clap icon</desc>
                      <path
                        fill="#6B6B6B"
                        fill-rule="evenodd"
                        d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-sm">{{ article.likes }}</span>
                  </div>

                  <div
                    class="flex gap-1 items-center"
                    v-tooltip.top="`${article.totalComments} comments`"
                  >
                    <span class="pi pi-comments text-sm"></span>
                    <span class="text-sm">{{ article.totalComments }}</span>
                  </div>

                  <div
                    class="ml-auto w-32 flex absolute z-30 justify-center bottom-5 right-[12rem]"
                  >
                    <Button
                      v-if="article.isSaved"
                      v-tooltip.top="'Saved'"
                      class="text-sm"
                      icon="pi pi-bookmark-fill"
                      severity="secondary"
                      variant="text"
                      rounded
                      aria-label="Bookmark"
                      @click.stop.prevent="
                        removeArticleFromReadingList(article)
                      "
                    />

                    <Button
                      v-else
                      v-tooltip.top="'Save'"
                      class="text-sm"
                      icon="pi pi-bookmark"
                      severity="secondary"
                      variant="text"
                      rounded
                      aria-label="Bookmark"
                      @click.stop.prevent="addArticleToReadingList(article)"
                    />
                  </div>
                </div>
              </div>

              <!-- Image -->
              <div class="basis-1/4 max-h-24">
                <img
                  v-if="article.image"
                  :src="article.image"
                  class="w-full h-full object-cover"
                />
                <img
                  v-else
                  src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                  alt="Mock Negotiation"
                  class="w-full h-full object-cover bas"
                />
              </div>
            </div>
          </template>
        </Card>
      </router-link>
    </Panel>
  </template>

  <!-- PRIVATE ARTICLES -->
  <template v-else-if="articlesFeed.length && type === 'private'">
    <Panel
      v-for="(article, index) in articlesFeed"
      :key="article.id"
      class="border relative p-2 rounded-none border-t-0 border-r-0 border-l-0"
      >.
      <router-link
        class="w-full"
        :to="{
          name: 'edit-article',
          params: { id: article.id },
        }"
        v-slot="{ navigate }"
        @click="handleArticleStore(article)"
      >
        <Card
          pt:body:class="flex-1 p-0 m-auto"
          class="shadow-none rounded-none items-start justify-between overflow-hidden cursor-pointer flex-row-reverse w-full gap-4"
          @click="navigate"
        >
          <!-- Text Content -->
          <template #content>
            <div class="flex flex-row w-full">
              <div class="basis-3/4">
                <h3 class="title-preview font-black text-2xl pr-4">
                  {{ article.title }}
                </h3>

                <p class="description-preview text-sm font-mono pr-4">
                  {{ article.description }}
                </p>
                <div class="mt-4 flex items-center w-full">
                  <div class="flex items-center gap-4">
                    <div class="flex gap-1 items-center">
                      <span
                        class="text-surface-500 text-sm font-normal dark:text-surface-400"
                        >{{
                          handleDateFormat(article.createdAt, "MMM DD")
                        }}</span
                      >
                    </div>

                    <div
                      class="flex gap-1 items-enter"
                      v-tooltip.top="`${article.likes} likes`"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        aria-labelledby="clap-filled-static-desc"
                        viewBox="0 0 16 16"
                        class="mt-[0.1rem]"
                      >
                        <desc id="clap-filled-static-desc">A clap icon</desc>
                        <path
                          fill="#6B6B6B"
                          fill-rule="evenodd"
                          d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span class="text-sm">{{ article.likes }}</span>
                    </div>

                    <div
                      class="flex gap-1 items-center"
                      v-tooltip.top="`${article.totalComments} comments`"
                    >
                      <span class="pi pi-comments text-sm"></span>
                      <span class="text-sm">{{ article.totalComments }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Image -->
              <div class="basis-1/4 max-h-24">
                <div class="w-full">
                  <img
                    v-if="article.image"
                    :src="article.image"
                    class="w-full h-full object-cover"
                  />
                  <img
                    v-else
                    src="../../assets/images/pexels-vlada-karpovich-4452120.jpg"
                    alt="Mock Negotiation"
                    class="w-full h-full object-cover bas"
                  />
                </div>
              </div>

              <div
                class="ml-auto w-32 flex justify-center absolute bottom-5 z-30 right-[12rem]"
                @click.stop
              >
                <Button
                  icon="pi pi-ellipsis-h"
                  severity="secondary"
                  rounded
                  type="button"
                  text
                  aria-haspopup="true"
                  aria-controls="overlay_menu"
                  @click.stop.prevent="toggleMenu($event, article, index)"
                />
                <Popover ref="op">
                  <div class="flex flex-col gap-4">
                    <div>
                      <div class="w-full px-2 flex items-center"></div>
                      <ul class="list-none p-0 m-0 flex flex-col w-36">
                        <li
                          key="copy-link"
                          class="flex items-center gap-2 p-2 cursor-pointer rounded-border"
                        >
                          <div
                            class="flex items-center gap-2"
                            @click="copyToClipboard(article.id)"
                          >
                            <i class="pi pi-link text-xs"></i>
                            <span class="text-xs font-medium">Copy link</span>
                          </div>
                        </li>
                        <li
                          key="edit-story"
                          class="flex items-center gap-2 p-2 cursor-pointer rounded-border"
                        >
                          <router-link
                            class="w-full"
                            :to="{
                              name: 'edit-article',
                              params: { id: article.id },
                            }"
                            @click="handleArticleStore(article)"
                          >
                            <div class="flex items-center gap-2">
                              <i class="pi pi-pencil text-xs" />

                              <span class="font-medium text-xs"
                                >Edit Story</span
                              >
                            </div>
                          </router-link>
                        </li>
                        <Divider class="my-2" />
                        <li
                          key="delete-story"
                          class="flex items-center gap-2 p-2 cursor-pointer rounded-border"
                        >
                          <div class="flex items-center gap-2 text-red-500">
                            <i class="pi pi-trash text-xs" />

                            <span class="font-medium text-xs"
                              >Delete Story</span
                            >
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Popover>
              </div>
            </div>
          </template>
        </Card>
      </router-link>
    </Panel>
  </template>

  <div v-else class="p-8 text-center text-surface-500">No articles found.</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  followAuthor,
  unfollowAuthor,
  removeFromReadingList,
  addToReadingList,
} from "@/assets/js/service";

import { articleStore, userStore } from "@/stores";
import { handleDateFormat } from "@/assets/js/util";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const emit = defineEmits(["reading-list"]);
const user = ref("");
const props = defineProps({
  articlesFeed: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
  type: {
    type: String,
    default: "public",
    validate: (value) => ["private", "public"].includes(value),
  },
});

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

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};

const op = ref();
const selectedArticle = ref(null);

// Toggle function now accepts the article object
const toggleMenu = (event, article, index) => {
  selectedArticle.value = article;
  op.value[index].toggle(event);
};

const deleteArticle = (article) => {
  console.log("Deleting article:", article.id);
};

const copyToClipboard = async (articleIdentifier) => {
  // Construct the URL to adjust the path to match article actual routing
  const url = `${window.location.origin}/@${user.value?.username}/${articleIdentifier}`;
  try {
    await navigator.clipboard.writeText(url);
    console.log(await navigator.clipboard.readText());

    // Show a success toast
    toast.add({
      severity: "contrast",
      summary: "Link copied!",
      detail: "Link copied to clipboard",
      life: 2000,
    });
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const removeArticleFromReadingList = async (targetArticle) => {
  const currentUserId = user.value.id;

  const { result, ok } = await removeFromReadingList(
    currentUserId,
    targetArticle.id
  );

  toast.add({
    severity: "contrast",
    summary: result.message,
    life: 3000,
  });

  if (ok) {
    const { data: removedReadingListItem } = result;
    if (removedReadingListItem) {
      targetArticle.isSaved = false;
      emit("reading-list", { action: "remove", targetArticle });
    }
  }
};

const addArticleToReadingList = async (targetArticle) => {
  const currentUserId = user.value.id;
  const { ok, result } = await addToReadingList(
    currentUserId,
    targetArticle.id
  );

  toast.add({
    severity: "contrast",
    summary: result.message,
    life: 3000,
  });

  if (ok) {
    const { data: newReadingListItem } = result;
    if (newReadingListItem) {
      targetArticle.isSaved = true;
      emit("reading-list", { action: "add", targetArticle });
    }
  }
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
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
