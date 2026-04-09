<template>
  <div class="card flex justify-center">
    <div class="flex gap-4">
      <IconField v-if="!writeMode" id="search" @focusin="toggle">
        <InputIcon class="pi pi-search text-sm" />
        <InputText
          v-model="searchTerm"
          class="py-1 rounded-full text-sm"
          placeholder="Search"
          @keyup.enter="handleSearch"
        />
        <InputIcon v-if="isSearching" class="pi pi-spin pi-spinner" />
      </IconField>
    </div>

    <Popover ref="op" class="w-72">
      <div class="flex flex-col gap-4 py-3">
        <div v-if="recentSearches.length > 0 && !searchTerm">
          <span
            class="font-medium uppercase block px-2 text-xs text-surface-500"
            >Recent Searches</span
          >
          <Divider />

          <ul class="list-none p-0 m-0 flex flex-col mt-2">
            <li
              v-for="(search, index) in recentSearches"
              :key="index"
              class="flex items-center justify-between gap-2 px-2 py-2 cursor-pointer rounded-border"
              @click="applyRecentSearch(search)"
            >
              <div
                class="flex gap-2 items-center text-xs font-medium text-surface-500"
              >
                <i class="text-xs pi pi-search"></i>
                <span>{{ search }}</span>
              </div>
              <i
                class="pi pi-times text-[10px]"
                @click.stop.prevent="removeSearch(index)"
              ></i>
            </li>
          </ul>
          <Divider />
          <router-link
            :to="{ path: '/explore-topics' }"
            class="w-full flex items-center justify-between px-2 text-xs py-1"
          >
            <span class="text-xs font-medium text-surface-500 uppercase">
              Explore topics
            </span>
            <i class="pi pi-arrow-up-right font-thin text-xs"></i>
          </router-link>
        </div>

        <div v-else>
          <ul class="list-none p-0 m-0 flex flex-col gap-2">
            <li
              v-for="group in searchResults"
              :key="group.label"
              class="flex flex-col"
            >
              <template v-if="group.values && group.values.length > 0">
                <span
                  class="font-medium uppercase block px-2 py-1 text-xs text-surface-500 tracking-wider"
                >
                  {{ group.label }}
                </span>

                <Divider class="my-2" />

                <ul class="list-none p-0 m-0" v-if="group.label === 'People'">
                  <li v-for="author in group.values" :key="author.id">
                    <router-link
                      :to="{
                        name: 'author-profile',
                        params: { username: author.username },
                      }"
                      class="flex items-center gap-2 px-2 py-2 text-xs cursor-pointer rounded-border no-underline text-inherit"
                      @click="op.hide()"
                    >
                      <div class="flex items-center gap-2">
                        <div>
                          <Avatar
                            v-if="author.image"
                            :image="author.image"
                            shape="circle"
                            class="w-6 h-6"
                          />
                          <Avatar
                            v-else
                            icon="pi pi-user text-xs"
                            style="background-color: #dee9fc; color: #1a2551"
                            shape="circle"
                            class="w-6 h-6"
                          />
                        </div>
                        <span class="font-medium text-xs">
                          {{ author.firstName }} {{ author.lastName }}
                        </span>
                      </div>
                    </router-link>
                  </li>
                </ul>

                <ul
                  class="list-none p-0 m-0"
                  v-else-if="group.label === 'Stories'"
                >
                  <li v-for="article in group.values" :key="article.id">
                    <router-link
                      :to="{
                        name: 'public-article-detail',
                        params: { route: article.route },
                      }"
                      class="flex items-center gap-2 px-2 py-2 text-xs cursor-pointer rounded-border no-underline text-inherit"
                      @click="op.hide()"
                    >
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-xs title-preview">
                          {{ article.title }}
                        </span>
                      </div>
                    </router-link>
                  </li>
                </ul>

                <ul class="list-none p-0 m-0" v-else>
                  <li v-for="topic in group.values" :key="topic.id">
                    <router-link
                      :to="{
                        name: 'tag-detail',
                        params: { route: topic.route },
                      }"
                      class="flex items-center gap-2 px-2 py-2 text-xs cursor-pointer rounded-border no-underline text-inherit"
                      @click="op.hide()"
                    >
                      <div class="flex items-center gap-2">
                        <i class="pi pi-book"></i>
                        <span class="font-medium text-xs title-preview">
                          {{ topic.name }}
                        </span>
                      </div>
                    </router-link>
                  </li>
                </ul>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import { searchArticles, searchAuthors, searchTags } from "@/assets/js/service";
import { slugify } from "@/assets/js/util";
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const searchTerm = ref("");
const op = ref();
const selectedMember = ref(null);
const recentSearches = ref([]);
const isLoading = ref(false);
const router = useRouter();
const members = ref([]);

// Load history on mount
onMounted(() => {
  const saved = localStorage.getItem("recent_searches");
  if (saved) recentSearches.value = JSON.parse(saved);
});

// Filter members based on typing
const searchResults = ref([]);
const isSearching = ref(false);

const performSearch = async (term) => {
  if (!term || term.trim() === "") {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  try {
    const [articlesRes, tagsRes, authorsRes] = await Promise.all([
      searchArticles({ term, sort: "popular" }),
      searchTags({ term }),
      searchAuthors({ term }),
    ]);

    const results = [
      {
        label: "People",
        values: authorsRes.data?.values || [],
      },
      {
        label: "Stories",
        values: handleArticleRoutes(articlesRes.data?.values) || [],
      },
      {
        label: "Topics",
        values: handleTopicRoutes(tagsRes.data) || [],
      },
    ];

    searchResults.value = results.filter((group) => group.values.length > 0);
  } catch (error) {
    console.error("Search error:", error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const handleArticleRoutes = (articles) => {
  for (const article of articles) {
    article.route = slugify(article.title);
  }
  return articles;
};

const handleTopicRoutes = (topics) => {
  for (const topic of topics) {
    topic.route = slugify(topic.name);
  }

  return topics;
};

let saveTimer;

const debouncedSearch = (query) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    performSearch(query);
  }, 300);
};

watch(
  () => searchTerm.value,
  (query) => {
    debouncedSearch(query);
  },
  { deep: true }
);

const toggle = (event) => {
  op.value.show(event);
};

// Handle Search Execution (Pressing Enter)
const handleSearch = async () => {
  if (!searchTerm.value.trim()) return;

  const term = searchTerm.value.trim();

  // Update Recent Searches
  let history = [...recentSearches.value];
  history = history.filter((item) => item !== term);
  history.unshift(term);
  history = history.slice(0, 5);

  recentSearches.value = history;
  localStorage.setItem("recent_searches", JSON.stringify(history));

  if (op.value) op.value.hide();
  try {
    await router.push({
      name: "search",
      params: { type: "posts" },
      query: { q: term },
    });
  } catch (error) {
    console.error("Navigation Error: ", error);
  }
};

const applyRecentSearch = (search) => {
  searchTerm.value = search;
  handleSearch();
};

const removeSearch = (index) => {
  recentSearches.value.splice(index, 1);
  localStorage.setItem("recent_searches", JSON.stringify(recentSearches.value));
};

const selectMember = (member) => {
  selectedMember.value = member;
  op.value.hide();
};
</script>
<style>
.title-preview {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
