<template>
  <div class="flex flex-col gap-6 justify-between">
    <div class="flex flex-col p-4">
      <span class="text-4xl font-semibold"
        >Good day, {{ author.firstName }}</span
      >
      <span>We are collecting articles for you</span>
    </div>

    <div class="flex flex-row gap-6 w-full">
      <div class="flex basis-3/3 px-4 w-full">
        <div class="flex flex-row gap-6 w-full">
          <div
            class="flex flex-col basis-64 h-32 shadow-lg border rounded-2xl p-4 gap-2"
          >
            <Tag rounded severity="success">
              <span class="pi pi-book"> </span>
              <span class="text-xs">Total Articles</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal">
              {{ animatedTotal }}
            </span>
          </div>
          <div
            class="flex flex-col basis-64 h-32 shadow-lg border rounded-2xl p-4 gap-2"
          >
            <Tag rounded severity="info">
              <span class="pi pi-file-check"> </span>
              <span class="text-xs">Published</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal">
              {{ animatedPublished }}
            </span>
          </div>

          <div
            class="flex flex-col basis-64 h-32 shadow-lg border rounded-2xl p-4 gap-2"
          >
            <Tag rounded severity="warn">
              <span class="pi pi-file-export"> </span>
              <span class="text-xs">Pending</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal">
              {{ animatedPending }}
            </span>
          </div>

          <div
            class="flex flex-col basis-64 h-32 shadow-lg border rounded-2xl p-4 gap-2"
          >
            <Tag rounded severity="danger">
              <span class="pi pi-file-edit"> </span>
              <span class="text-xs">Draft</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal">
              {{ animatedDraft }}
            </span>
          </div>
        </div>
      </div>

      <!-- <div class="basis-1/3"></div> -->
    </div>

    <div class="flex flex-row gap-6 px-4">
      <div class="basis-1/3 shadow-lg border rounded-2xl p-4">
        <DoughNut />
      </div>
      <div class="basis-2/3 shadow-lg border rounded-2xl p-4">
        <Calender />
      </div>
    </div>

    <div class="flex flex-row gap-6 px-4 mt-6">
      <div class="basis-2/3 flex flex-col gap-4">
        <span class="text-2xl font-bold">Latest Articles</span>
        <div class="flex flex-row gap-6">
          <div class="basis-128">
            <Card class="rounded-2xl shadow-lg border">
              <template #header>
                <img
                  alt="user header"
                  class="rounded-2xl"
                  src="../../assets/images/pexels-juanpphotoandvideo-877971.jpg"
                />
              </template>
              <template #title>Advanced Card</template>
              <template #subtitle>Card subtitle</template>
              <template #footer>
                <div class="flex gap-4 mt-1">
                  <Avatar
                    image="../../assets/images/onyamalimba.png"
                    shape="circle"
                  />
                  <span>John Doe</span>
                </div>
              </template>
            </Card>
          </div>
          <div class="basis-128">
            <Card class="rounded-2xl shadow-lg border">
              <template #header>
                <img
                  alt="user header"
                  class="rounded-2xl"
                  src="../../assets/images/pexels-juanpphotoandvideo-877971.jpg"
                />
              </template>
              <template #title>Advanced Card</template>
              <template #subtitle>Card subtitle</template>
              <template #footer>
                <div class="flex gap-4 mt-1">
                  <Avatar
                    image="../../assets/images/onyamalimba.png"
                    shape="circle"
                  />
                  <span>John Doe</span>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
      <div class="basis-1/3 flex flex-col gap-4">
        <span class="text-2xl font-bold">Popular</span>
        <div class="px-4 py-2 rounded-2xl border shadow-lg flex flex-col gap-4">
          <!-- CATEGORIES -->
          <div>
            <div class="w-full">
              <span class="text-sm font-bold">Categories</span>
            </div>

            <OrderList
              v-model="categories"
              dataKey="id"
              breakpoint="575px"
              responsive
              pt:pcListbox:root="w-full"
            >
              <template #option="{ option }">
                <div
                  class="flex flex-wrap p-1 items-center justify-between w-full"
                >
                  <span class="text-sm">
                    {{ option.name }}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm sm:ml-8">{{
                      option.likes
                    }}</span>
                    <span class="text-xs pi pi-arrow-right"></span>
                  </div>
                </div>
              </template>
            </OrderList>
          </div>

          <!-- TAGS -->
          <div>
            <div class="w-full">
              <span class="text-sm font-bold">Tags</span>
            </div>

            <div class="p-2 w-full rounded-2xl border flex gap-2 flex-wrap">
              <Chip
                v-for="tag in tags"
                :key="tag"
                :label="tag"
                class="mx-1 my-1 cursor-pointer capitalize text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import Calender from "./Calender.vue";
import { userStore } from "@/stores";
import { getArticleAnalytics } from "@/assets/js/service";

const author = ref("");
const analytics = ref({
  total: 0,
  published: 0,
  pending: 0,
  draft: 0,
  likes: 0,
  dislikes: 0,
  shares: 0,
});

provide("analytics", analytics);

const animatedTotal = ref(0);
const animatedPublished = ref(0);
const animatedPending = ref(0);
const animatedDraft = ref(0);

const animateIncrement = (start, end, duration, callback) => {
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const value = Math.floor(progress * (end - start) + start);

    callback(value);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const fetchAuthorArticlesAnalytics = async (id) => {
  const result = await getArticleAnalytics(id);
  analytics.value = result.data;

  const duration = 1000;

  animateIncrement(0, analytics.value.total, duration, (value) => {
    animatedTotal.value = value;
  });
  animateIncrement(0, analytics.value.published, duration, (value) => {
    animatedPublished.value = value;
  });
  animateIncrement(0, analytics.value.pending, duration, (value) => {
    animatedPending.value = value;
  });
  animateIncrement(0, analytics.value.draft, duration, (value) => {
    animatedDraft.value = value;
  });
};

onMounted(async () => {
  const { getUser } = userStore();
  author.value = await getUser();
  fetchAuthorArticlesAnalytics(author.value.id);
});

const categories = ref([
  {
    name: "Management",
    likes: "4k",
  },
  {
    name: "Management",
    likes: "4k",
  },
  {
    name: "Management",
    likes: "4k",
  },
  {
    name: "Management",
    likes: "4k",
  },
]);

const tags = ref(["kdjfka", "dkfjak"]);
</script>

<style>
.p-orderlist-controls {
  display: none !important;
}

.p-listbox-option {
  padding-top: 0.1rem !important;
  padding-bottom: 0.1rem !important;
}
</style>
