<template>
  <div class="flex flex-col gap-6 justify-between mb-10">
    <div class="flex flex-col p-4">
      <span class="text-3xl font-black">Good day, {{ author.firstName }}</span
      ><span>We are collecting articles for you</span>
    </div>

    <div class="flex flex-row gap-6 w-full">
      <div class="flex basis-3/3 px-4 w-full">
        <div class="flex flex-row gap-6 w-full">
          <div
            class="flex flex-col basis-64 h-28 shadow-lg border rounded-2xl p-4"
          >
            <Tag rounded severity="success">
              <span class="pi pi-book"> </span>
              <span class="text-xs">Total Articles</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal"> 0 </span>
          </div>
          <div
            class="flex flex-col basis-64 h-28 shadow-lg border rounded-2xl p-4"
          >
            <Tag rounded severity="info">
              <span class="pi pi-file-check"> </span>
              <span class="text-xs">Published</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal"> 0 </span>
          </div>

          <div
            class="flex flex-col basis-64 h-28 shadow-lg border rounded-2xl p-4"
          >
            <Tag rounded severity="warn">
              <span class="pi pi-file-export"> </span>
              <span class="text-xs">Pending</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal"> 0 </span>
          </div>

          <div
            class="flex flex-col basis-64 h-28 shadow-lg border rounded-2xl p-4"
          >
            <Tag rounded severity="danger">
              <span class="pi pi-file-edit"> </span>
              <span class="text-xs">Draft</span>
            </Tag>
            <span class="mx-auto text-6xl font-normal"> 0 </span>
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
import { ref, onMounted } from "vue";
import Calender from "./Calender.vue";
import { authorStore } from "@/stores";

const author = ref("");

onMounted(async () => {
  const { getAuthor } = authorStore();
  author.value = await getAuthor();
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
