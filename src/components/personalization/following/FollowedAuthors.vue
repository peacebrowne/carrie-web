<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />

  <FollowingSkeleton
    v-if="isLoading"
    :type="type === 'list' ? 'list' : 'compact'"
  />

  <template v-else>
    <div v-if="type === 'list'">
      <div class="px-2 pt-6 pb-4">
        <h3 class="font-bold text-sm">{{ totalFollowedAuthors }} Authors</h3>
      </div>

      <div
        v-for="author in topFiveAuthors"
        :key="author.id"
        class="w-full flex items-start gap-2 pr-2"
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
                    class="w-10 h-10"
                  />
                  <Avatar
                    v-else
                    icon="pi pi-user text-white text-xs"
                    shape="circle"
                    class="bg-[#1B4D3E] w-10 h-10"
                  />
                </div>
                <div>
                  <span class="font-bold text-sm"
                    >{{ author.firstName }} {{ author.lastName }}</span
                  >
                  <p class="m-0 text-xs text-surface-500">
                    {{ author.biography }}
                  </p>
                </div>
              </div>
            </template>
          </Panel>
        </router-link>
        <div class="pt-4 ml-auto">
          <Button
            :severity="author.isFollowed ? 'secondary' : 'contrast'"
            :variant="author.isFollowed ? 'outlined' : 'solid'"
            class="text-xs"
            rounded
            :label="author.isFollowed ? 'Following' : 'Follow'"
            @click="
              author.isFollowed
                ? removeAuthorFollower(author)
                : addAuthorFollower(author)
            "
          />
        </div>
      </div>

      <Button
        v-if="totalFollowedAuthors > 5"
        label="See all following"
        severity="secondary"
        variant="text"
        class="text-xs font-semibold px-2"
        rounded
        @click="visible = true"
      />
    </div>

    <div v-else-if="type === 'compact'">
      <div class="flex items-center gap-2 px-2 pt-6 pb-2">
        <i class="pi pi-users text-sm"></i>
        <h3 class="font-bold text-sm">Following</h3>
      </div>

      <div class="card flex flex-col gap-3 px-2">
        <div
          v-for="author in followedAuthors.slice(0, 3)"
          :key="author.id"
          class="flex items-center gap-2"
        >
          <Avatar
            v-if="author.image"
            :image="author.image"
            shape="circle"
            class="w-10 h-10"
          />
          <Avatar
            v-else
            icon="pi pi-user text-white text-[10px]"
            shape="circle"
            class="bg-[#1B4D3E] w-10 h-10"
          />
          <span class="font-bold text-sm"
            >{{ author.firstName }} {{ author.lastName }}</span
          >
          <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
        </div>

        <div
          v-if="!followedAuthors.length"
          class="flex items-start text-gray-500 gap-2 py-2"
        >
          <span class="pi pi-plus text-xs mt-0.5"></span>
          <span class="font-medium text-xs">Find writers to follow.</span>
        </div>

        <router-link
          :to="{
            name: 'personalization-category',
            params: { category: 'suggestions' },
          }"
        >
          <Button
            label="See suggestions"
            severity="secondary"
            variant="text"
            class="text-xs font-semibold p-0"
            rounded
          />
        </router-link>
      </div>
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
    :header="`Following ${totalFollowedAuthors} topics`"
    appendTo="#main-content"
    key="followedAuthors"
    :showHeader="true"
    class="w-full z-index-[300] h-full max-h-full rounded-none top-0 px-24"
  >
    <div class="flex flex-col max-w-[1024px] h-full md:px-8 mx-auto">
      <div
        v-for="author in followedAuthors"
        :key="author.id"
        class="flex items-start gap-8 pr-2 mx-auto justify-between w-[30rem]"
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
                    class="w-10 h-10"
                  />
                  <Avatar
                    v-else
                    icon="pi pi-user text-white text-xs"
                    shape="circle"
                    class="bg-[#1B4D3E] w-10 h-10"
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
            :severity="author.isFollowed ? 'secondary' : 'contrast'"
            :variant="author.isFollowed ? 'outlined' : 'solid'"
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
} from "@/assets/js/service";

import { userStore } from "@/stores";
import { handleImage, truncateText } from "@/assets/js/util";
import FollowingSkeleton from "@/components/skeletons/FollowedAuthorSkeleton.vue";

const user = ref("");
const isLoading = ref(true);
const visible = ref(false);
const followedAuthors = ref([]);
const totalFollowedAuthors = ref(0);
const topFiveAuthors = ref([]);
const emit = defineEmits(["total-followed-author"]);

const props = defineProps({
  type: {
    type: String,
    default: "list", // 'list' or 'compact'
    validator: (value) => ["list", "compact"].includes(value),
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

const fetchFollowedAuthors = async () => {
  if (!user.value?.id) return;
  isLoading.value = true;
  try {
    const { data } = await getFollowedAuthors(user.value.id);
    if (data?.values) {
      const authors = data.values;
      for (const author of authors) {
        author.image = await handleImage(author.id);
        author.isFollowed = true;
      }
      followedAuthors.value = authors;
      totalFollowedAuthors.value = data.total;
      topFiveAuthors.value = authors.slice(0, 5);
      emit("total-followed-author", data.total);
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchFollowedAuthors();
});
</script>
