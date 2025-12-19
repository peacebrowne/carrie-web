<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />

  <FollowedTopicSkeleton v-if="isLoading" />

  <template v-else>
    <div class="px-2 pt-6 pb-4">
      <h3 class="font-bold text-sm">{{ totalFollowedTopics }} Topics</h3>
    </div>
    <div
      v-for="topic in topFiveTopics"
      :key="topic.id"
      class="w-full flex items-start gap-2 pr-2"
    >
      <router-link
        :to="{
          name: 'tag-detail',
          params: { route: topic.route },
        }"
      >
        <Panel
          class="border-0 py-2"
          pt:header:class="px-2 py-1"
          pt:content:class="px-2 py-1"
          pt:footer:class="px-2 py-1"
        >
          <template #header>
            <div class="flex items-start gap-2">
              <div>
                <Avatar
                  icon="pi pi-book text-white text-sm"
                  shape="circle"
                  class="bg-[#1B4D3E] w-10 h-10"
                />
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-sm">
                  {{ topic.name }}
                </span>
                <div class="flex items-center gap-2 font-thin">
                  <span class="pi pi-circle-fill text-[0.25rem]"></span
                  ><span class="text-sm"
                    >{{ describeNumberScale(topic.popularity) }} followers</span
                  >
                  <span class="pi pi-circle-fill text-[0.25rem]"></span
                  ><span class="text-sm"
                    >{{ describeNumberScale(topic.stories) }} stories</span
                  >
                </div>
              </div>
            </div>
          </template>
        </Panel>
      </router-link>
      <div class="pt-4 ml-auto">
        <Button
          v-if="topic.isFollowed"
          class="text-xs"
          severity="secondary"
          variant="outlined"
          rounded
          label="Following"
          @click="handleTopicFollow(topic)"
        />
        <Button
          v-else
          class="text-xs"
          severity="contrast"
          rounded
          label="Follow"
          @click="handleTopicFollow(topic)"
        />
      </div>
    </div>

    <div>
      <Button
        v-if="totalFollowedTopics > 5"
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
    :header="`Following ${totalFollowedTopics} topics`"
    appendTo="#main-content"
    :showHeader="true"
    key="followedTopics"
    class="w-full z-index-[300] h-full max-h-full rounded-none top-0 px-24"
  >
    <div class="flex flex-col max-w-[1024px] h-full md:px-8 mx-auto">
      <div
        v-for="topic in followedTopics"
        :key="topic.id"
        class="flex items-start gap-8 pr-2 mx-auto justify-between w-[30rem]"
      >
        <router-link
          :to="{
            name: 'tag-detail',
            params: { route: topic.route },
          }"
        >
          <Panel
            class="border-0 py-2"
            pt:header:class="px-2 py-1"
            pt:content:class="px-2 py-1"
            pt:footer:class="px-2 py-1"
          >
            <template #header>
              <div class="flex items-start gap-2">
                <div>
                  <Avatar
                    icon="pi pi-book text-white text-sm"
                    class="bg-[#1B4D3E] w-10 h-10"
                    shape="circle"
                  />
                </div>
                <div>
                  <span class="font-bold text-sm">
                    {{ topic.name }}
                  </span>
                  <div class="flex items-center gap-2 font-thin">
                    <span class="pi pi-circle-fill text-[0.25rem]"></span
                    ><span class="text-sm"
                      >{{
                        describeNumberScale(topic.popularity)
                      }}
                      followers</span
                    >
                    <span class="pi pi-circle-fill text-[0.25rem]"></span
                    ><span class="text-sm"
                      >{{ describeNumberScale(topic.stories) }} stories</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </Panel>
        </router-link>
        <div class="pt-4">
          <Button
            v-if="topic.isFollowed"
            class="text-xs"
            severity="secondary"
            variant="outlined"
            rounded
            label="Following"
            @click="handleTopicFollow(topic)"
          />
          <Button
            v-else
            class="text-xs"
            severity="contrast"
            rounded
            label="Follow"
            @click="handleTopicFollow(topic)"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  followTag,
  unfollowTag,
  getAuthorInterests,
} from "@/assets/js/service";

import { userStore } from "@/stores";

import { describeNumberScale } from "@/assets/js/util";
import FollowedTopicSkeleton from "@/components/skeletons/FollowedTopicSkeleton.vue";

const props = defineProps({
  type: {
    type: String,
    default: "list",
  },
});
const user = ref("");
const isLoading = ref(true);
const visible = ref(false);
const totalFollowedTopics = ref(0);
const followedTopics = ref([]);
const topFiveTopics = ref([]);
const emit = defineEmits(["total-followed-topics"]);

const handleTopicFollow = async (topic) => {
  const authorId = user.value?.id;
  if (!authorId) return;

  topic.isFollowed
    ? await unfollowTag(topic.id, authorId)
    : await followTag(topic.id, authorId);
  topic.isFollowed = !topic.isFollowed;
};

const fetchFollowedTopics = async () => {
  const currentUserId = user.value?.id;

  if (!currentUserId) return;
  isLoading.value = true;

  try {
    const { data: fetchedTopics = [] } = await getAuthorInterests(
      currentUserId
    );
    fetchedTopics.forEach((topic) => {
      topic.route = topic.name.toLowerCase().split(" ").join("-");
      topic.isFollowed = true;
    });

    totalFollowedTopics.value = fetchedTopics.length;
    followedTopics.value = fetchedTopics;
    topFiveTopics.value = fetchedTopics.slice(0, 5);
    emit("total-followed-topics", fetchedTopics.length);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchFollowedTopics();
});
</script>
