<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />

  <AuthorSkeleton v-if="isLoading" />

  <template v-else>
    <div class="flex items-center gap-2 px-2 pt-6 pb-4">
      <h3 class="font-bold text-sm">
        {{ type === "home" ? "Who to follow" : "Writers to follow" }}
      </h3>
    </div>

    <div
      v-for="author in topFiveAuthors"
      :key="author.id"
      class="w-full flex items-start gap-2 pr-2"
    >
      <router-link
        :to="{ name: 'author-profile', params: { username: author.username } }"
        class="flex-1"
      >
        <Panel class="border-0 py-2" pt:header:class="px-2 py-1">
          <template #header>
            <div class="flex items-start gap-2">
              <div>
                <Avatar
                  v-if="author.image"
                  :image="author.image"
                  shape="circle"
                  class="w-8 h-8"
                />
                <Avatar
                  v-else
                  icon="pi pi-user text-white text-xs"
                  shape="circle"
                  class="bg-[#1B4D3E] w-8 h-8"
                />
              </div>

              <div>
                <span class="font-bold text-sm"
                  >{{ author.firstName }} {{ author.lastName }}</span
                >
                <p class="m-0 text-xs text-surface-500">
                  {{ truncateText(author.biography) }}
                </p>
              </div>
            </div>
          </template>
        </Panel>
      </router-link>

      <div class="pt-4 ml-auto">
        <Button
          class="text-xs"
          rounded
          severity="contrast"
          variant="outlined"
          :label="author.isFollowed ? 'Following' : 'Follow'"
          @click="
            author.isFollowed
              ? removeAuthorFollower(author)
              : addAuthorFollower(author)
          "
        />
      </div>
    </div>

    <div v-if="totalRecommendedAuthors > 0" class="px-2">
      <router-link
        v-if="type === 'home' || type === 'following'"
        :to="{
          name: 'personalization-category',
          params: { category: 'suggestions' },
        }"
      >
        <Button
          label="See more suggestions"
          severity="secondary"
          variant="text"
          class="text-xs font-semibold"
          rounded
        />
      </router-link>

      <Button
        v-else-if="type === 'suggestions' && totalRecommendedAuthors > 5"
        label="See more suggestions"
        severity="secondary"
        variant="text"
        class="text-xs font-semibold"
        rounded
        @click="visible = true"
      />
    </div>
  </template>

  <Dialog
    :blockScroll="true"
    v-model:visible="visible"
    :pt="{
      closeButton: {
        class:
          'hover:bg-red-50 text-red-500 rounded-full transition-colors duration-150',
      },
    }"
    modal
    :header="`Authors to follow `"
    key="authorSuggestions"
    appendTo="#main-content"
    :showHeader="true"
    class="w-full z-index-[300] h-full max-h-full rounded-none top-0 px-24"
  >
    <div class="flex flex-col max-w-[1024px] h-full md:px-8 mx-auto">
      <div
        v-for="author in recommendedAuthors"
        :key="author.id"
        class="mx-auto flex items-start gap-2 pr-2 justify-between w-[30rem]"
      >
        <router-link
          :to="{
            name: 'author-profile',
            params: { username: author.username },
          }"
          class="flex-1"
        >
          <Panel class="border-0 py-2" pt:header:class="px-2 py-1">
            <template #header>
              <div class="flex items-start gap-2">
                <div>
                  <Avatar
                    v-if="author.image"
                    :image="author.image"
                    shape="circle"
                    class="w-8 h-8"
                  />
                  <Avatar
                    v-else
                    icon="pi pi-user text-white text-xs"
                    shape="circle"
                    class="bg-[#1B4D3E] w-8 h-8"
                  />
                </div>

                <div>
                  <span class="font-bold text-sm"
                    >{{ author.firstName }} {{ author.lastName }}</span
                  >
                  <p class="m-0 text-xs text-surface-500">
                    {{ truncateText(author.biography) }}
                  </p>
                </div>
              </div>
            </template>
          </Panel>
        </router-link>

        <div class="pt-4 ml-auto">
          <Button
            class="text-xs"
            rounded
            severity="contrast"
            variant="outlined"
            :label="author.isFollowed ? 'Following' : 'Follow'"
            @click="
              author.isFollowed
                ? removeAuthorFollower(author)
                : addAuthorFollower(author)
            "
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getFollowedAuthors,
  followAuthor,
  unfollowAuthor,
  getRecommendedAuthors,
} from "@/assets/js/service";

import { userStore } from "@/stores";
import { handleImage, truncateText } from "@/assets/js/util";
import AuthorSkeleton from "@/components/skeletons/AuthorSkeleton.vue";

const props = defineProps({
  type: {
    type: String,
    default: "home",
    validator: (value) => ["home", "suggestions", "following"].includes(value),
  },
});

const user = ref("");
const isLoading = ref(true);
const visible = ref(false);

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

const totalRecommendedAuthors = ref(0);
const topFiveAuthors = ref([]);
const recommendedAuthors = ref([]);
const fetchRecommendedAuthors = async () => {
  const currentUserId = user.value.id;
  isLoading.value = true;

  try {
    const { data: fetchedAuthors } = await getRecommendedAuthors(
      currentUserId,
      null,
      20
    );

    for (const author of fetchedAuthors) {
      author.image = await handleImage(author.id);
      author.isFollowed = await attachAuthorFollowers(author.id);
    }

    totalRecommendedAuthors.value = fetchedAuthors.length;
    recommendedAuthors.value = fetchedAuthors;
    topFiveAuthors.value = fetchedAuthors.slice(0, 5);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchRecommendedAuthors();
});
</script>
