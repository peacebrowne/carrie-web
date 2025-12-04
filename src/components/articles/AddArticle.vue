<template>
  <Toast />
  <nav
    class="w-full sticky z-[200] flex top-0"
    style="transform: translateY(0px)"
  >
    <NavBar />
  </nav>

  <div class="max-w-[1024px] flex flex-col p-4 mx-auto gap-6">
    <div
      class="py-2 px-[0.8rem] w-full flex gap-3 items-center justify-between"
    >
      <div class="flex gap-3 items-center">
        <span class="text-3xl font-semibold">Your Story</span>
        <div v-if="isEditPage" class="flex gap-2">
          <!-- Status + author line -->
          <div class="flex gap-1 items-center">
            <span class="text-sm font-semibold" :class="currentStatus?.color">
              {{ currentStatus?.name }}
            </span>
            <span class="text-surface-500 text-sm font-semibold">
              in {{ user?.firstName }} {{ user?.lastName }}
            </span>
          </div>

          <!-- Saving / Saved indicator -->
          <div class="flex items-center gap-2">
            <span v-if="saving" class="text-xs text-gray-500">Saving…</span>
            <i v-else class="pi pi-check text-green-600 text-xs"></i>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <Button
          severity="warn"
          label="Publish"
          class="py-1 text-sm flex items-center rounded-full"
          :disabled="progress"
          @click="visible = true"
        />
        <Button
          icon="pi pi-ellipsis-h"
          label="Delete"
          severity="secondary"
          class="py-1 text-xs items-center rounded-full hidden"
          rounded
          text
          @click="toggle"
        />
        <Menu ref="menu" id="config_menu" :model="items" popup />
      </div>
    </div>

    <!-- :initialValues="initialValues"
    :resolver="resolver" -->
    <Form
      v-slot="$form"
      id="article-form"
      class="flex flex-col w-full gap-6"
      ref="formRef"
    >
      <!-- TITLE -->
      <div class="flex flex-col gap-1">
        <InputText
          name="title"
          v-model="title"
          type="text"
          placeholder="Title"
          fluid
          class="border-0 shadow-none text-3xl rounded-none"
        />
        <Message
          v-if="$form.title?.invalid"
          class="px-4"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.title.error?.message }}</Message
        >
      </div>

      <!-- EDITOR -->
      <div class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1 w-full">
          <Editor
            :class="[
              $form.content?.invalid ? 'p-invalid' : '',
              'p-inputtext border-none p-0 text-2xl',
            ]"
          />
          <Message
            v-if="$form.content?.invalid"
            class="px-4"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.content.error?.message }}</Message
          >
        </div>
      </div>

      <Dialog
        v-model:visible="visible"
        :pt="{
          closeButton: {
            class:
              'hover:bg-red-50 text-red-500 rounded-full transition-colors duration-150',
          },
        }"
        modal
        header="Edit"
        appendTo="#article-form"
        :showHeader="true"
        class="w-full z-index-[300] h-full max-h-full rounded-none top-0 px-24"
      >
        <div class="flex max-w-[1024px] h-full md:px-8 m-auto">
          <div class="flex flex-col gap-4 px-8 py-12 w-3/6 h-full">
            <span class="font-bold">Story Preview</span>
            <AddImage v-model:image="image" v-model:src="src" />

            <!-- TITLE -->
            <div class="flex flex-col gap-1">
              <InputText
                name="title"
                v-model="title"
                type="text"
                placeholder="Write a preview title"
                fluid
                class="border-0 border-b rounded-none pl-0"
              />
              <Message
                v-if="$form.title?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.title.error?.message }}</Message
              >
            </div>

            <!-- DESCRIPTION -->
            <div class="flex flex-col gap-1">
              <InputText
                name="description"
                v-model="description"
                type="text"
                placeholder="Write a preview subtitle"
                fluid
                class="border-0 border-b rounded-none pl-0"
              />
            </div>
            <span class="text-sm"
              ><strong>Note:</strong> Changes here will affect how your story
              appears in public places like Medium’s homepage and in
              subscribers’ inboxes — not the contents of the story itself.</span
            >
          </div>

          <div class="flex flex-col gap-4 px-8 py-12 w-3/6 h-full">
            <span class=""
              >Publishing to:
              <strong>{{ user?.firstName }} {{ user?.lastName }} </strong>
            </span>

            <!-- TAGS -->
            <div class="tags">
              <div>
                <span class="text-sm leading-[.25rem]"
                  >Add or change topics (up to 5) so readers know what your
                  story is about</span
                >
              </div>
              <div class="border rounded-ss-none rounded-se-none flex flex-col">
                <div id="tag-input" class="flex w-full justify-between">
                  <MultiSelect
                    v-model="selected"
                    display="chip"
                    :options="topicOptions"
                    @filter="onFilter"
                    optionLabel="name"
                    filter
                    :selectAll="selectAll"
                    placeholder="Select Topics"
                    :maxSelectedLabels="5"
                    class="w-full border-none rounded-none p-2 text-sm bg-gray-50"
                    @selectall-change="onSelectAllChange($event)"
                    @change="onChange($event)"
                  />
                </div>
              </div>
            </div>

            <!-- SCHEDULING -->
            <div class="flex flex-col gap-4" v-if="scheduled">
              <div class="">
                <span class="text-sm leading-[.25rem]"
                  >Schedule a time to publish:</span
                >
                <div
                  id="tag-input"
                  class="border-b flex w-full justify-between"
                >
                  <DatePicker
                    id="datepicker-24h"
                    v-model="displayDate"
                    updateModelType="date"
                    name="pendingDate"
                    showTime
                    hourFormat="12"
                    showIcon
                    fluid
                    iconDisplay="input"
                    class="w-full shadow-none"
                    dateFormat="M dd, yy"
                    @update:modelValue="handleDateChange"
                  />
                </div>
                <Message
                  v-if="$form.pendingDate?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.pendingDate.error?.message }}</Message
                >
              </div>
              <div>
                <span class="text-sm leading-25rem"
                  >This story will be published automatically within five
                  minutes of the specified time.</span
                >
              </div>
            </div>

            <div class="mt-4 flex gap-2" v-if="!scheduled">
              <Button
                severity="warn"
                label="Publish now"
                type="submit"
                class="py-1 text-sm flex items-center rounded-full"
                @click="publishNow"
                :disabled="progress"
              />
              <Button
                label="Schedule for later"
                severity="secondary"
                class="py-1 text-sm flex items-center rounded-full"
                variant="text"
                :disabled="progress"
                @click="openScheduling(true)"
              />
            </div>

            <div class="mt-4 flex gap-2" v-else>
              <Button
                severity="warn"
                label="Schedule to publish"
                type="submit"
                class="py-1 text-sm flex items-center rounded-full"
                @click="publishLater"
                :disabled="progress"
              />
              <Button
                label="Cancel scheduling"
                severity="secondary"
                class="py-1 text-sm flex items-center rounded-full"
                variant="text"
                @click="openScheduling(false)"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </Form>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { ref, watch, onMounted, provide, computed } from "vue";
import Menu from "primevue/menu";
import Editor from "../editors/ArticleEditor.vue";
import {
  addArticle,
  editArticle,
  publishArticleLater,
  publishArticleNow,
  searchTags,
} from "@/assets/js/service.js";
import { articleStore, userStore } from "@/stores";
import AddImage from "./AddImage.vue";
import { handleDateFormat, capitalize } from "@/assets/js/util";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";

const tags = ref([]);
const description = ref("");
const loading = ref(false);
const image = defineModel("image");
const src = defineModel("src");
const content = ref("");
const title = ref("");
const toast = useToast();
const formRef = ref(null);
const user = ref("");
const visible = ref(false);
const selectAll = ref(false);
const topicOptions = ref([]);
const selected = ref([]);
const scheduled = ref(false);
const writeMode = ref(true);
const saving = ref(false);
const router = useRouter();
const pendingSchedule = ref(false);
const progress = ref(false);
const route = useRoute();
const isEditPage = computed(() => route.path.includes("/edit"));

provide("content", content);
provide("writeMode", writeMode);

const in30Minutes = dayjs().add(30, "minute");

const displayDate = ref(in30Minutes.toDate());
const pendingDate = ref(handleDateFormat(in30Minutes, "YYYY-MM-DD HH:mm:ss"));

const handleDateChange = (selected) => {
  if (!selected) return;
  displayDate.value = selected;
  pendingDate.value = handleDateFormat(selected, "YYYY-MM-DD HH:mm:ss");
};

const initialized = ref(false);

watch(
  [title, description, image, content, selected],
  () => {
    if (!initialized.value) return;
    autoSave();
  },
  { deep: true }
);

let saveTimer;

const autoSave = () => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    const payload = {
      title: title.value,
      content: content.value,
      description: description.value,
      tags: selected.value.map((option) => option.name),
      authorID: user.value.id,
      status: currentStatus.value.value,
    };

    onFormSubmit(payload);
  }, 300);
};

const onFormSubmit = async (payload) => {
  loading.value = true;

  const data = new FormData();
  if (image.value) data.append("image", image.value);
  data.append(
    "article",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );

  try {
    // Decide: ADD (first time) or EDIT (already has ID)
    const articleId = isEditPage.value
      ? localStorage.getItem("app-article-id")
      : null;

    const { ok, result } = isEditPage.value
      ? await editArticle(articleId, data)
      : await addArticle(data);

    if (ok) {
      //  FIRST SAVE (addArticle) → redirect to edit
      if (!isEditPage.value && result.data?.id) {
        handleArticleStore(result.data);

        saving.value = true;

        // Replace current history entry + push edit route
        await router.replace({
          name: "edit-article",
          params: { id: result.data.id },
        });
      }

      //  EDIT SAVE → just show toast
      saving.value = true;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: error.message || "Something went wrong",
      life: 5000,
    });
  }
};

watch(saving, (val) => {
  if (!val) return;
  const timer = setTimeout(() => (saving.value = false), 2000);
  return () => clearTimeout(timer);
});

const showPendingSchedule = (status) => {
  pendingSchedule.value = status.value === "pending";
};

const currentStatus = ref({
  name: "Draft",
  value: "draft",
  color: "text-red-500",
});

const statuses = ref([
  { name: "Draft", value: "draft", color: "text-red-500" },
  { name: "Pending", value: "pending", color: "text-blue-500" },
  { name: "Published", value: "published", color: "text-green-500" },
]);
watch(currentStatus, (n, o) => showPendingSchedule(!n ? o : n));

watch([title, content], ([newTitle, newContent]) => {
  progress.value = newTitle || newContent ? false : true;
});

const store = articleStore();

const fetchArticleById = async () => {
  const cachedArticle = await store.getArticle();

  if (!cachedArticle) {
    await router.replace({
      name: "write",
    });
    return;
  }

  title.value = cachedArticle.title;
  content.value = cachedArticle.content;
  description.value = cachedArticle.description;
  src.value = cachedArticle.image;
  image.value = cachedArticle.image;

  // Update Status
  currentStatus.value = statuses.value.find(
    (status) => status.value === cachedArticle.status
  );

  // Convert saved tags (strings) → objects
  selected.value = (cachedArticle.tags || []).map((tag) => ({
    name: capitalize(tag),
  }));

  // pre-fill topicOptions with selected so chips show immediately
  topicOptions.value = [...selected.value];

  // Update form
  const form = formRef.value?.states;
  if (form) {
    form.title.value = cachedArticle.title;
    form.content.value = cachedArticle.content;
  }
};

const resetForm = async () => {
  // Stop loader
  loading.value = false;

  // Reset form fields
  title.value = "";
  content.value = "";
  tags.value = [];
  description.value = "";
  src.value = "";
  image.value = "";
  selected.value = [];
  topicOptions.value = [];

  // Update initial form values
  const form = await formRef.value.states;
  form.content.value = "";
  if (form.title) {
    form.title.value = "";
  }
};

const switchFormMode = async () => {
  isEditPage.value ? await fetchArticleById() : await resetForm();
};

onMounted(async () => {
  await switchFormMode();
  const { getUser } = userStore();
  user.value = await getUser();

  initialized.value = true;
});

const menu = ref(null);

const items = ref([
  {
    label: "Refresh",
    icon: "pi pi-refresh",
  },
  {
    label: "Search",
    icon: "pi pi-search",
  },
  {
    separator: true,
  },
  {
    label: "Delete",
    icon: "pi pi-times",
  },
]);

const toggle = (event) => menu.value.toggle(event);
const onFilter = async (event) => {
  const query = event.value;

  if (!query || query.length < 2) return;

  const { data } = await searchTags(query);

  // Merge selected items with new results (avoid duplicates)
  const merged = [...selected.value, ...data];
  topicOptions.value = merged.filter(
    (v, i, arr) => arr.findIndex((o) => o.name === v.name) === i
  );
};

const openScheduling = (value) => {
  scheduled.value = value;
};

const onSelectAllChange = (event) => {
  selected.value = event.checked ? [...topicOptions.value] : [];
  selectAll.value = event.checked;
};

const onChange = (event) => {
  selectAll.value = event.value.length === topicOptions.value.length;
};

const handleArticleStore = (data) => {
  const { setArticle } = articleStore();
  setArticle(data);
};

const publishNow = async () => {
  const { getArticle } = articleStore();
  const { id } = await getArticle();
  const { ok, result } = await publishArticleNow(id);

  if (ok) {
    toast.add({
      severity: "success",
      summary: result.message,
      life: 3000,
    });

    initialized.value = false;
    await resetForm();
    visible.value = false;
    saving.value = true;

    await router.replace({ name: "write" });

    setTimeout(() => (initialized.value = true), 500);
  }
};

const publishLater = async () => {
  const { getArticle } = articleStore();
  const { id } = await getArticle();

  const { ok, result } = await publishArticleLater(id, pendingDate.value);
  if (ok) {
    toast.add({
      severity: "success",
      summary: result.message,
      life: 3000,
    });

    initialized.value = false;
    await resetForm();
    visible.value = false;
    saving.value = true;

    await router.replace({ name: "write" });

    setTimeout(() => (initialized.value = true), 500);
  }
};
</script>

<style>
.p-datepicker-input {
  border: 0;
  border-radius: none;
  font-size: small;
  padding-left: 0;
}
</style>
