<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />

  <nav
    class="w-full sticky z-[500] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>
  <div id="main-content" class="w-full h-full">
    <div
      class="container m-auto flex w-full h-full md:px-8 lg:px-36 2xl:px-52 pt-6"
    >
      <div class="flex-1 mx-auto h-full">
        <ScrollPanel class="flex-1 w-full mx-auto px-2">
          <div id="article-detail" class="w-full flex flex-col gap-8">
            <div>
              <h1 class="text-4xl font-black">
                {{ article.title }}
              </h1>
            </div>

            <div class="flex items-center gap-5">
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
                  shape="circle"
                  size="small"
                  class="bg-[#1B4D3E]"
                />
                <span class="font-bold">
                  {{ author.firstName }} {{ author.lastName }}</span
                >
              </div>

              <div class="flex" v-if="user?.id !== author.id">
                <div v-if="author.isFollowed">
                  <Button
                    v-if="author.isFollowed"
                    class="text-xs"
                    rounded
                    severity="contrast"
                    variant="outlined"
                    label="Following"
                    @click="removeAuthorFollower(author.id)"
                  />
                </div>

                <Button
                  v-else
                  class="text-xs"
                  severity="contrast"
                  variant="outlined"
                  rounded
                  label="Follow"
                  @click="addAuthorFollower(author.id)"
                />
              </div>

              <div class="flex text-sm">
                <span
                  >{{ readingTime }} min read -
                  {{ handleDateFormat(article.createdAt) }}</span
                >
              </div>
            </div>

            <!-- ACTIONS -->
            <div class="flex gap-3 border-t border-b py-1">
              <div class="flex items-center gap-2">
                <Button
                  class="py-1 rounded-lg"
                  size="small"
                  severity="secondary"
                  text
                  @click="handleArticleClaps"
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
                    <i class="pi pi-comments text-lg font-light"></i>
                    <span class="text-sm">{{ article.totalComments }}</span>
                  </Button>
                </a>
              </div>
              <div class="flex items-center ml-auto gap-2">
                <div class="ml-auto flex justify-center">
                  <Button
                    v-tooltip.top="isSpeaking && !isPaused ? 'Pause' : 'Listen'"
                    class="text-sm"
                    :icon="
                      isSpeaking && !isPaused
                        ? 'pi pi-pause-circle'
                        : 'pi pi-play-circle'
                    "
                    :severity="isSpeaking ? 'primary' : 'secondary'"
                    variant="text"
                    rounded
                    @click="toggleSpeech(article)"
                  />

                  <Button
                    v-if="isSpeaking"
                    v-tooltip.top="'Stop'"
                    icon="pi pi-stop-circle"
                    severity="danger"
                    variant="text"
                    rounded
                    @click="
                      synth.cancel();
                      isSpeaking = false;
                    "
                  />
                </div>

                <div class="ml-auto flex justify-center">
                  <Button
                    v-if="article.isSaved"
                    v-tooltip.top="'Saved'"
                    icon="pi pi-bookmark-fill"
                    severity="secondary"
                    variant="text"
                    rounded
                    @click="removeArticleFromReadingList(article.id)"
                  />
                  <Button
                    v-else
                    v-tooltip.top="'Save'"
                    icon="pi pi-bookmark"
                    severity="secondary"
                    variant="text"
                    rounded
                    @click="addArticleToReadingList(article.id)"
                  />
                </div>
              </div>
            </div>

            <div>
              <p class="text-2xl">
                {{ article.description }}
              </p>
            </div>

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

            <div class="gap-1 hidden">
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
                      <span
                        >{{
                          describeNumberScale(author?.followers)
                        }}
                        followers</span
                      ><span></span
                      >{{ describeNumberScale(author?.following) }} following
                    </div>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="w-full flex justify-end">
                  <Button
                    v-if="author.isFollowed"
                    class="text-xs"
                    rounded
                    severity="contrast"
                    variant="outlined"
                    label="Following"
                    @click="removeAuthorFollower(author.id)"
                  />
                  <Button
                    v-else
                    class="text-xs"
                    rounded
                    severity="contrast"
                    variant="outlined"
                    label="Follow"
                    @click="addAuthorFollower(author.id)"
                  />
                </div>
              </template>

              <p :id="$style.biography" v-html="author.biography"></p>
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
      </div>

      <Divider layout="vertical" class="mx-8" />

      <div class="w-[21rem] h-full mx-auto pt-4">
        <ScrollPanel class="w-full h-full pb-16">
          <RecommendedTopics type="chips" />
          <!-- <ReadingList :readingListItem="readingListItem" /> -->
          <RecommendedAuthors type="home" />
        </ScrollPanel>
      </div>
    </div>
    <ScrollTop />
  </div>
</template>

<script setup>
import {
  addClaps,
  addToReadingList,
  followAuthor,
  getArticleByTitle,
  getAuthorById,
  getAuthorFollowers,
  getAuthorReadingList,
  getFollowedAuthors,
  removeFromReadingList,
  unfollowAuthor,
} from "@/assets/js/service.js";
import { articleStore } from "../../stores/index.js";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores";
import { useToast } from "primevue/usetoast";

import RecommendedTopics from "../personalization/suggestions/TopicSuggestions.vue";
import RecommendedAuthors from "../personalization/suggestions/AuthorSuggestions.vue";
import ArticleComments from "./ArticleComments.vue";
import NavBar from "../NavBar.vue";
import {
  describeNumberScale,
  handleDateFormat,
  handleImage,
} from "@/assets/js/util.js";
import { useRoute } from "vue-router";
// import ArticleSkeleton from "../skeletons/ArticleSkeleton.vue";

const toast = useToast();
const store = articleStore();
const author = ref("");
const user = ref("");
const article = ref("");
const commentData = ref({
  likes: 0,
  comments: 0,
  id: null,
});
const route = useRoute();

const fetchArticleById = async () => {
  let fetchedArticle = await store.getArticle();

  if (!fetchedArticle) {
    const title = route.params.url || route.fullPath;
    const { data } = await getArticleByTitle(title);
    fetchedArticle = data;
  }

  article.value = fetchedArticle;
  await handleSavedArticles(fetchedArticle);

  const fetchedAuthor = await fetchArticleAuthor(fetchedArticle?.authorID);
  author.value = fetchedAuthor;
  await handleAuthorFollowers(fetchedAuthor);

  commentData.value.likes = fetchedArticle.likes;
  commentData.value.comments = fetchedArticle.totalComments;
  commentData.value.id = fetchedArticle.id;

  calculateReadingTime(article.value.description, article.value.content);
};

const handleSavedArticles = async (article) => {
  try {
    const currentUserId = user.value.id;

    const { data } = await getAuthorReadingList(currentUserId);
    const { values: readingList = [] } = data;

    if (!readingList.length) return;

    // Create a Set for faster lookups
    const isReadingListExist = readingList.some(
      (list) => list.authorId === currentUserId && list.articleId === article.id
    );

    // Update articles' author.isSaved flag
    article.isSaved = isReadingListExist;
  } catch (error) {
    console.error("Failed to fetch followed authors:", error);
  }
};

const fetchArticleAuthor = async (id) => {
  const { data: fetchedAuthor } = await getAuthorById(id);
  fetchedAuthor.image = await handleImage(id);
  return fetchedAuthor;
};

const handleAuthorFollowers = async ({ id }) => {
  const { data: followedAuthorData } = await getFollowedAuthors(id);
  const { values: followedAuthors = [], total: totalFollowedAuthors } =
    followedAuthorData;

  const { data: authorFollowersData } = await getAuthorFollowers(id);
  const { values: followingAuthors, total: totalAuthorFollowers } =
    authorFollowersData;

  if (!totalFollowedAuthors && !totalAuthorFollowers) return false;

  const isFollowing = followingAuthors.some(
    (follower) => follower.id === user.value.id
  );

  author.value.followers = totalAuthorFollowers;
  author.value.following = totalFollowedAuthors;
  author.value.isFollowed = isFollowing;
};

const addAuthorFollower = async (id) => {
  const follower = user.value?.id;

  if (follower === id) return;

  const { data: followedAuthor } = await followAuthor(follower, id);
  if (followedAuthor) author.value.isFollowed = true;
};

const removeAuthorFollower = async (id) => {
  const follower = user.value?.id;

  if (follower === id) return;

  const { data: followedAuthor } = await unfollowAuthor(follower, id);
  if (followedAuthor) author.value.isFollowed = false;
};

const handleArticleClaps = async () => {
  const data = {
    authorID: user.value.id,
    articleID: article.value.id,
  };

  const { result, ok } = await addClaps(data);
  if (ok) article.value.likes++;
};

const readingTime = ref(0);
const calculateReadingTime = (description, content) => {
  const text = [description, content].join(" ");
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  readingTime.value = Math.ceil(words / wpm);
};

const addArticleToReadingList = async (articleIdentifier) => {
  const currentUserId = user.value.id;

  const { result, ok } = await addToReadingList(
    currentUserId,
    articleIdentifier
  );

  toast.add({
    severity: "contrast",
    summary: result.message,
    life: 3000,
  });

  if (ok) {
    article.value.isSaved = true;
  }
};

const removeArticleFromReadingList = async (articleIdentifier) => {
  const currentUserId = user.value.id;

  const { result, ok } = await removeFromReadingList(
    currentUserId,
    articleIdentifier
  );

  toast.add({
    severity: "contrast",
    summary: result.message,
    life: 3000,
  });

  if (ok) {
    article.value.isSaved = false;
  }
};

const isSpeaking = ref(false);
const isPaused = ref(false);
const synth = window.speechSynthesis;

const toggleSpeech = (article) => {
  // 1. If we are currently speaking (active or paused)
  if (synth.speaking) {
    if (isPaused.value) {
      synth.resume();
      isPaused.value = false;
    } else {
      // Force a slight delay or check before pausing
      synth.pause();
      isPaused.value = true;
    }
    return;
  }

  // 2. Start new speech
  // It's safer to cancel any ghost processes before starting
  synth.cancel();

  const { title, description, content } = article;
  const cleanContent = content.replace(/<[^>]*>/g, "");
  const fullText = `${title}. ${description}. ${cleanContent}`;

  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.voice = synth.getVoices()[0];

  // 3. State Management Listeners
  utterance.onstart = () => {
    isSpeaking.value = true;
    isPaused.value = false;
  };

  utterance.onend = () => {
    isSpeaking.value = false;
    isPaused.value = false;
  };

  utterance.onerror = (event) => {
    console.error("Speech error:", event);
    isSpeaking.value = false;
    isPaused.value = false;
  };

  synth.speak(utterance);
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchArticleById();
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
  font-size: large;
}

#biography > p > span,
#biography > p {
  font-size: small;
}
</style>
