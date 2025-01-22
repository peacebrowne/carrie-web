<template>
  <DataView
    :value="articles"
    :layout="layout"
    :sortOrder="sortOrder"
    :sortField="sortField"
    class="w-full"
    paginator
    :rows="6"
    :data-key="1"
    :totalRecords="totalRecords"
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
            type="search"
            class="py-1 text-sm h-[30px]"
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
      <div class="flex flex-col">
        <div v-for="i in 8" :key="i">
          <div
            class="flex flex-col xl:flex-row xl:items-start p-6 gap-6 card"
            :class="{
              'border-t border-surface-200 dark:border-surface-700': i !== 0,
            }"
          >
            <Skeleton class="!w-9/12 sm:!w-64 xl:!w-40 !h-24 mx-auto" />
            <div
              class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-6"
            >
              <div class="flex flex-col items-center sm:items-start gap-4">
                <Skeleton width="8rem" height="2rem" />
                <Skeleton width="6rem" height="1rem" />

                <div class="flex items-center gap-4">
                  <Skeleton width="6rem" height="1rem" />
                  <Skeleton width="3rem" height="1rem" />
                </div>
              </div>
              <div
                class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2"
              >
                <Skeleton width="4rem" height="2rem" />
                <Skeleton size="3rem" shape="circle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #grid="slotProps">
      <div class="grid grid-cols-12 gap-4">
        <div
          v-for="(article, index) in slotProps.items"
          :key="index"
          class="col-span-12 gap-4 sm:col-span-6 xl:col-span-4 p-2"
        >
          <router-link>
            <Card class="max-w-sm mx-auto relative overflow-hidden rounded-lg">
              <!-- Image -->
              <template #header>
                <img
                  src="../../assets/images/galleria10.jpg"
                  alt="Mock Negotiation"
                  class="w-full object-cover contrast-100 brightness-75"
                />
              </template>

              <!-- Text Content -->
              <template #content>
                <Chip
                  class="text-black bg-white font-black absolute z-50 text-xs top-2 right-2 py-1 px-2"
                >
                  <i class="pi pi-clock text-xs"></i>
                  <span>{{ handleDateFormat(article.createdAt) }}</span>
                </Chip>

                <div class="text-start p-4 text-white">
                  <h3 class="font-black text-primary md:text-sm">
                    {{ handleTitleFormat(article.title) }}
                  </h3>
                  <p class="text-xs font-semibold">
                    {{ handleDescriptionFormat(article.description) }}
                  </p>
                </div>
              </template>
            </Card>
          </router-link>

          <!-- <div
              class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <Skeleton width="6rem" height="2rem" />
                <Skeleton width="3rem" height="1rem" />
              </div>
              <div class="flex flex-col items-center gap-4 py-8">
                <Skeleton width="75%" height="10rem" />
                <Skeleton width="8rem" height="2rem" />
                <Skeleton width="6rem" height="1rem" />
              </div>
              <div class="flex items-center justify-between">
                <Skeleton width="4rem" height="2rem" />
                <Skeleton
                  width="6rem"
                  height="1rem"
                  shape="circle"
                  size="3rem"
                />
              </div>
            </div> -->
        </div>
      </div>
    </template>
  </DataView>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuthorArticles } from "../../assets/js/service/ArticleService.js";
import dayjs from "dayjs";

const articles = ref("");
const layout = ref("grid");
const options = ref(["list", "grid"]);
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const totalRecords = ref();

const sortOptions = ref([
  { label: "Created", value: "created_at" },
  { label: "Last Updated", value: "updated_at" },
  { label: "Title", value: "updated_at" },
]);

const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf("!") === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  } else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};

const handleDateFormat = (date) => dayjs(date).format("MMM DD, YYYY");

const handleTitleFormat = (title) =>
  title.length > 20 ? `${title.slice(0, 20)}...` : title;

const handleDescriptionFormat = (description) =>
  description && description.length > 50
    ? `${description.slice(0, 50)}...`
    : description;

onMounted(async () => {
  const result = await getAuthorArticles(
    "149ebfda-a27e-4cef-9882-ee7ec44ac349"
  );

  const { total, values } = result.data;
  articles.value = values;
  totalRecords.value = total;

  console.log(articles.value);
});
</script>

<style>
.p-card-body {
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

/* .p-tag-icon {
  line-height: 0.8rem !important;
}
.p-tag-label {
  font-size: smaller !important;
} */
</style>
