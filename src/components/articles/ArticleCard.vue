<template>
  <div class="flex flex-col gap-4">
    <DataView
      :data-key="dataKey"
      :value="articles"
      :layout="layout"
      class="w-full"
      :paginator="true"
      always-show-paginator
      @page="onPage"
      :first="first"
      :rows="rows"
      :total-records="totalRecords"
    >
      <template #header>
        <div class="w-full flex justify-between items-center">
          <Select
            v-model="sortKey"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort by"
            @change="onSortChange($event)"
            class="text-xs flex items-center py-0 h-[30px]"
            dropdownIcon="pi pi-angle-down text-xs"
          />

          <div class="flex items-center gap-3">
            <InputText
              placeholder="Search"
              type="text"
              class="py-1 text-sm h-[30px]"
              v-model="search"
            />

            <SelectButton
              class=""
              v-model="layout"
              :options="options"
              :allowEmpty="false"
            >
              <template #option="{ option }">
                <i
                  :class="[
                    option === 'list' ? 'pi pi-bars' : 'pi pi-table',
                    'text-xs',
                  ]"
                />
              </template>
            </SelectButton>
          </div>
        </div>
      </template>

      <template #list>
        <div class="flex flex-col" id="list-template">
          <div v-for="article in articles" :key="article.id">
            <div
              class="flex flex-col xl:flex-row xl:items-start p-6 gap-6 card"
              :class="{
                'border-t border-surface-200 dark:border-surface-700': i !== 0,
              }"
            >
              <router-link
                :to="{
                  name: 'article-detail',
                  params: { title: article.title },
                }"
                @click="handleArticleStore(article)"
              >
                <Card
                  class="mx-auto relative overflow-hidden rounded-lg flex-row w-full h-[12rem]"
                >
                  <!-- Image -->
                  <template #header>
                    <img
                      v-if="article.image"
                      :src="article.image"
                      alt="Mock Negotiation"
                      class="w-full h-full object-cover contrast-100 brightness-75"
                    />
                    <img
                      v-else
                      src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg"
                      alt="Mock Negotiation"
                      class="w-full h-full object-cover contrast-100 brightness-75"
                    />
                  </template>

                  <!-- Text Content -->
                  <template #content>
                    <div class="text-start text-white">
                      <h3 class="font-black text-primary text-3xl">
                        {{ handleTitleFormat(article.title, "list") }}
                      </h3>
                      <p class="text-1xl">
                        {{
                          handleDescriptionFormat(article.description, "list")
                        }}
                      </p>
                    </div>
                  </template>

                  <template #footer>
                    <div
                      class="absolute z-50 top-0 right-3 py-4 h-full flex flex-col items-center justify-between"
                    >
                      <div>
                        <Chip
                          class="text-black bg-white font-black text-xs py-1 px-2"
                        >
                          <i class="pi pi-clock text-xs"></i>
                          <span>{{ handleDateFormat(article.createdAt) }}</span>
                        </Chip>
                      </div>
                      <div class="flex gap-1">
                        <Tag
                          icon="pi pi-thumbs-up"
                          :value="article.totalClaps"
                        ></Tag>
                        <Tag
                          icon="pi pi-comments"
                          :value="article.totalComments"
                        ></Tag>
                      </div>
                    </div>
                  </template>
                </Card>
              </router-link>
            </div>
          </div>
        </div>
      </template>

      <template #grid>
        <div class="grid grid-cols-12 gap-4" id="grid-template">
          <div
            v-for="article in articles"
            :key="article.id"
            class="col-span-12 gap-4 sm:col-span-6 xl:col-span-4 p-2"
          >
            <router-link
              :to="{
                name: 'article-detail',
                params: { title: article.title },
              }"
              @click="handleArticleStore(article)"
            >
              <Card class="w-full mx-auto relative overflow-hidden rounded-lg">
                <!-- Image -->
                <template #header>
                  <img
                    v-if="article.image"
                    :src="article.image"
                    class="w-full object-cover contrast-100 brightness-50"
                  />
                  <img
                    v-else
                    src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg"
                    class="w-full object-cover contrast-100 brightness-50"
                  />
                </template>

                <!-- Text Content -->
                <template #content>
                  <div
                    class="absolute z-50 top-2 px-2 w-full flex justify-between"
                  >
                    <div class="flex gap-1">
                      <Tag
                        icon="pi pi-thumbs-up"
                        :value="article.totalClaps"
                      ></Tag>
                      <Tag
                        icon="pi pi-comments"
                        :value="article.totalComments"
                      ></Tag>
                    </div>
                    <Chip
                      class="text-black bg-white font-black text-xs py-1 px-2"
                    >
                      <i class="pi pi-clock text-xs"></i>
                      <span>{{ handleDateFormat(article.createdAt) }}</span>
                    </Chip>
                  </div>

                  <div class="text-start p-4 text-white">
                    <h3
                      class="font-black text-primary text ms:text-sm md:text-lg md:leading-4"
                    >
                      {{ handleTitleFormat(article.title, "grid") }}
                    </h3>
                    <p class="text-sm leading-4">
                      {{ handleDescriptionFormat(article.description, "grid") }}
                    </p>
                  </div>
                </template>
              </Card>
            </router-link>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import {
  getAuthorArticles,
  getImage,
} from "../../assets/js/service.js";

import { articleStore } from "../../stores/article.store.js";
import { handleDateFormat } from "@/assets/js/util.js";

const articles = ref([]);
const layout = ref("grid");
const options = ref(["list", "grid"]);
const sortKey = ref();
const sortField = ref("updatedAt");
const totalRecords = ref();
const search = ref("");
const dataKey = ref("1");
const first = ref(0);
const rows = ref(6);

const params = computed(() => ({
  start: first.value,
  limit: rows.value,
  sort: sortField.value,
}));

const sortOptions = ref([
  { label: "Last Updated", value: "updatedAt" },
  { label: "Title", value: "title" },
]);

const onSearchTerm = async (term) => {
  params.value.term = term;
  await fetchAuthorArticles();
};

watch(search, async (newTerm) => {
  await onSearchTerm(newTerm);
});

const onSortChange = async (event) => {
  sortField.value = event.value.value;
  await fetchAuthorArticles();
};

const attachArticleImage = async (articleData) => {
  try {
    return await Promise.all(
      articleData.map(async (article) => {
        const { data, ok } = await getImage(article.id);
        let image;
        if (ok && data.size) {
          image = URL.createObjectURL(data);
        }
        return { ...article, image };
      })
    );
  } catch (error) {
    console.error("Error handling article images:", error);
    return articleData;
  }
};

const handleTitleFormat = (title, layout) => {
  let character;

  switch (layout) {
    case "grid":
      character = 25;
      break;
    case "list":
      character = 50;
    default:
      break;
  }

  return title.length > character ? `${title.slice(0, character)}...` : title;
};

const handleDescriptionFormat = (description, layout) => {
  let character;

  switch (layout) {
    case "grid":
      character = 50;
      break;
    case "list":
      character = 75;
    default:
      break;
  }

  return description && description.length > character
    ? `${description.slice(0, character)}...`
    : description;
};

const fetchAuthorArticles = async () => {
  const result = await getAuthorArticles(
    "149ebfda-a27e-4cef-9882-ee7ec44ac349",
    params.value
  );

  if (result.data) {
    const { total, values } = result.data;
    articles.value = await attachArticleImage(values);
    totalRecords.value = total;
    dataKey.value += 1;
  } else {
    console.error("Failed to fetch articles:", result.error);
  }
};

onMounted(async () => {
  await fetchAuthorArticles();
});

const onPage = async (event) => {
  first.value = event.first;
  await fetchAuthorArticles();
};

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};
</script>

<style>
#grid-template .p-card-header {
  height: 11.2rem;
  max-height: 11.2rem;
  background-color: #000000eb;
}
#grid-template .p-card-body {
  position: absolute;
  height: 100%;
  width: 100%;
  justify-content: end;
  padding: 0 !important;
  background: transparent;
}

.p-select-option {
  font-size: small !important;
}

#list-template .p-card-header {
  width: 15rem !important;
}

#list-template .p-card-body {
  max-width: 50%;
}

#list-template a {
  width: 100%;
}
</style>
