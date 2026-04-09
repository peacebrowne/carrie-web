<template>
  <Toast position="top-center" class="w-[32rem] text-sm" />

  <TopicsSkeleton v-if="isLoading" :type="type" />

  <template v-else>
    <!-- SUGGESTED TOPICS - ONLY on /me/personalization/suggestions -->
    <div v-if="type === 'list'">
      <div class="px-2 pt-6 pb-4">
        <h3 class="font-bold text-sm">Topics to follow</h3>
      </div>
      <router-link
        :to="{ path: '/explore-topics' }"
        class="w-full flex items-start gap-2 pr-2"
      >
        <Panel
          class="border-0 py-2"
          pt:header:class="px-2 py-1"
          pt:content:class="px-2 py-1"
          pt:footer:class="px-2 py-1"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <Avatar
                icon="pi pi-compass text-sm"
                class="w-10 h-10"
                shape="circle"
              />
              <span class="font-bold text-sm"> Explore topics </span>
            </div>
          </template>
        </Panel>
        <div class="pt-4 ml-auto">
          <i class="pi pi-arrow-up-right font-thin text-sm"></i>
        </div>
      </router-link>

      <div
        v-for="topic in topThreeTopics"
        :key="topic.id"
        class="w-full flex items-start gap-2 pr-2"
      >
        <!-- ... existing topic item ... -->
        <router-link
          :to="{ name: 'tag-detail', params: { route: topic.route } }"
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
                    icon="pi pi-book text-sm"
                    class="w-10 h-10"
                    shape="circle"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-sm">{{ topic.name }}</span>
                  <div class="flex items-center gap-2 font-thin">
                    <span class="pi pi-circle-fill text-[0.25rem]"></span>
                    <span class="text-sm"
                      >{{
                        describeNumberScale(topic.popularity)
                      }}
                      followers</span
                    >
                    <span class="pi pi-circle-fill text-[0.25rem]"></span>
                    <span class="text-sm"
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

      <Button
        v-if="totalRecommendedTopics > 3"
        label="See more suggestions"
        severity="secondary"
        variant="text"
        class="text-xs font-semibold"
        rounded
        @click="visible = true"
      />
    </div>

    <!-- RECOMMENDED TOPICS (chips) - ONLY on home page -->
    <div v-else-if="type === 'chips'" class="flex flex-col gap-2">
      <div class="flex items-center gap-2 px-2 pt-4 pb-4 text-sm">
        <h3 class="font-bold">Recommended Topics</h3>
      </div>
      <div class="card flex flex-wrap gap-2">
        <router-link
          v-for="topic in recommendedTopics"
          :key="topic.id"
          :to="{ name: 'tag-detail', params: { route: topic.route } }"
        >
          <Chip class="text-xs font-normal" :label="topic.name" />
        </router-link>
      </div>
      <div>
        <router-link :to="{ path: '/explore-topics' }">
          <Button
            v-if="totalRecommendedTopics"
            label="See more topics"
            severity="secondary"
            variant="text"
            class="text-xs font-semibold"
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
    :header="`Authors to follow `"
    key="authorSuggestions"
    appendTo="#main-content"
    :showHeader="true"
    class="w-full z-index-[300] h-full max-h-full rounded-none top-0 px-24"
  >
    <div class="flex flex-col max-w-[1024px] h-full md:px-8 mx-auto">
      <div
        v-for="topic in recommendedTopics"
        :key="topic.id"
        class="flex items-start gap-8 pr-2 mx-auto justify-between w-[30rem]"
      >
        <router-link
          :to="{ name: 'tag-detail', params: { route: topic.route } }"
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
                    icon="pi pi-book text-sm"
                    class="w-10 h-10"
                    shape="circle"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-sm">{{ topic.name }}</span>
                  <div class="flex items-center gap-2 font-thin">
                    <span class="pi pi-circle-fill text-[0.25rem]"></span>
                    <span class="text-sm"
                      >{{
                        describeNumberScale(topic.popularity)
                      }}
                      followers</span
                    >
                    <span class="pi pi-circle-fill text-[0.25rem]"></span>
                    <span class="text-sm"
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
    </div>
  </Dialog>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getRecommendedAuthorTopics,
  followTag,
  unfollowTag,
} from "@/assets/js/service";
import { userStore } from "@/stores";
import { describeNumberScale } from "@/assets/js/util";
import TopicsSkeleton from "@/components/skeletons/TopicSkeleton.vue";

const isLoading = ref(true);

const props = defineProps({
  type: {
    type: String,
    default: "chips", // 'chips' or 'list'
    validator: (value) => ["chips", "list"].includes(value),
  },
});

const user = ref(null);
const visible = ref(false);
const totalRecommendedTopics = ref(0);
const recommendedTopics = ref([]);
const topThreeTopics = ref([]);

const handleTopicFollow = async (topic) => {
  const authorId = user.value?.id;
  if (!authorId) return;

  topic.isFollowed
    ? await unfollowTag(topic.id, authorId)
    : await followTag(topic.id, authorId);

  topic.isFollowed = !topic.isFollowed;
};

const fetchRecommendedTopics = async () => {
  if (!user.value?.id) return;
  isLoading.value = true;

  try {
    const { data: fetchedTopics = [] } = await getRecommendedAuthorTopics(
      user.value.id,
      8
    );

    fetchedTopics.forEach((topic) => {
      topic.route = topic.name.toLowerCase().split(" ").join("-");
      topic.isFollowed = false;
    });

    totalRecommendedTopics.value = fetchedTopics.length;
    recommendedTopics.value = fetchedTopics;
    topThreeTopics.value = fetchedTopics.slice(0, 3);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchRecommendedTopics();
});
</script>
