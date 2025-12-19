<template>
  <Toast position="top-center" class="max-w-[32rem] text-sm" />
  <nav
    class="w-full sticky z-[200] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>
  <div class="container m-auto flex w-full h-full md:px-8 lg:px-36 2xl:px-52">
    <div class="w-full">
      <Tabs v-model:value="activeTopicId" scrollable>
        <TabList>
          <Tab :value="activeTopicId">
            <router-link
              v-slot="{ href, navigate }"
              :to="{ path: '/explore-topics' }"
              custom
            >
              <a
                v-ripple
                :href="href"
                @click="navigate"
                class="flex items-center text-sm gap-2 text-inherit"
              >
                <i class="pi pi-compass"></i>
                <span>Explore Topics</span>
              </a>
            </router-link>
          </Tab>
          <Tab
            v-for="topic in recommendedTopics"
            :key="topic.name"
            :value="topic.id"
          >
            <router-link
              v-slot="{ href, navigate }"
              :to="'/tag/' + topic.route"
              custom
            >
              <a
                v-ripple
                :href="href"
                @click="navigate"
                class="flex items-center text-sm gap-2 text-inherit"
              >
                <span>{{ topic.name }}</span>
              </a>
            </router-link>
          </Tab>
        </TabList>
        <div class="m-0 p-8 flex flex-col justify-center items-center gap-10">
          <span class="text-4xl font-black">Explore topics</span>
          <div class="flex items-center gap-2 font-normal w-6/12">
            <IconField id="search" class="w-full items-center">
              <InputIcon class="pi pi-search text-sm" />
              <InputText
                class="rounded-full w-full"
                placeholder="Search all topics"
              />
            </IconField>
          </div>
        </div>
        <Divider class="py-4" />
        <div
          class="grid grid-cols-1 mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div v-for="mainTopic in TOPICS" :key="mainTopic.id" class="p-5">
            <!-- Main Topic -->
            <router-link
              v-slot="{ href, navigate }"
              :to="'/tag/' + mainTopic.route"
              custom
            >
              <a v-ripple :href="href" @click="navigate">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                  {{ mainTopic.name }}
                </h3>
              </a>
            </router-link>

            <!-- Sub-topics  -->
            <div
              v-for="subTopic in mainTopic.subTopics || []"
              :key="subTopic.id"
              class="mb-4 last:mb-0"
            >
              <router-link
                v-slot="{ href, navigate }"
                :to="'/tag/' + subTopic.route"
                custom
              >
                <a v-ripple :href="href" @click="navigate">
                  <h4 class="text-md font-medium text-gray-700 pl-4 mb-2">
                    {{ subTopic.name }}
                  </h4>
                </a>
              </router-link>

              <!--  topics under this sub-topic -->
              <ul
                class="list-disc list-inside text-sm text-gray-600 space-y-1 pl-6"
              >
                <li v-for="topic in subTopic.topics || []" :key="topic.id">
                  <router-link
                    v-slot="{ href, navigate }"
                    :to="'/tag/' + topic.route"
                    custom
                  >
                    <a v-ripple :href="href" @click="navigate">
                      <span> {{ topic.name }}</span>
                    </a>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
    <ScrollTop />
  </div>
</template>
<script setup>
import {
  getRecommendedAuthorTopics,
  getInterests,
  getRecommendedRandomTopics,
} from "@/assets/js/service";
import NavBar from "../NavBar.vue";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores";
import { useRoute } from "vue-router";

const user = ref("");
const activeTopicId = ref(1);
const route = useRoute();

const TOPICS = ref([]);
const fetchInterests = async () => {
  const { data: interests } = await getInterests();

  interests.forEach((interest) => {
    interest.route = interest.name.toLocaleLowerCase().split(" ").join("-");
  });

  const mainTopics = interests.filter(
    (interest) => interest.parentTagId === null
  );

  mainTopics.map((mainTopic) => {
    const subTopics = interests.filter(
      (interest) => interest.parentTagId === mainTopic.id
    );
    subTopics.forEach((subTopic) => {
      subTopic.topics = interests.filter(
        (interest) => interest.parentTagId === subTopic.id
      );
    });

    mainTopic.subTopics = subTopics;
  });

  TOPICS.value = mainTopics;

  await handleRecommendedTopics();
};

const recommendedTopics = ref([]);
const handleRecommendedTopics = async () => {
  const { data } = await getRecommendedAuthorTopics(user.value.id, 10);

  recommendedTopics.value = data.map((topic, index) => {
    topic.value = index;
    topic.route = topic.name.toLocaleLowerCase().split(" ").join("-");
    return topic;
  });
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
  await fetchInterests();
});
</script>
