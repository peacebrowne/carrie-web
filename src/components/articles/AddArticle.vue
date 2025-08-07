<template>
  <Toast />

  <div class="flex flex-col w-full p-4">
    <div class="py-2 w-full flex gap-3 items-center justify-between">
      <div class="flex gap-3 items-center">
        <span class="text-4xl font-semibold">Your Story</span>
        <span :class="currentStatus?.color">{{ currentStatus?.name }}</span>
      </div>
      <!-- <div class="flex items-center">
        <router-link
          v-if="title"
          :to="{ name: 'me-article-detail', params: { title } }"
          target="_blank"
        >
          <Button
            icon="pi pi-arrow-right text-xs"
            label="preview"
            severity="contrast"
            class="py-1 text-xs flex flex-row-reverse items-center"
          />
        </router-link>
      </div> -->
    </div>
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex w-full gap-6"
      ref="formRef"
    >
      <div class="w-[65%] flex flex-col gap-4">
        <!-- IMAGE -->
        <AddImage v-model:image="image" v-model:src="src" />

        <!-- TITLE -->
        <div class="flex flex-col gap-1">
          <InputText
            name="title"
            v-model="title"
            type="text"
            placeholder="Title"
            fluid
          />
          <Message
            v-if="$form.title?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.title.error?.message }}</Message
          >
        </div>

        <!-- EDITOR -->
        <div class="flex flex-col gap-1">
          <Editor
            :class="[$form.content?.invalid ? 'p-invalid' : '', 'p-inputtext']"
            :editorData="{}"
          />
          <Message
            v-if="$form.content?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.content.error?.message }}</Message
          >
        </div>
      </div>
      <div class="w-[35%] flex flex-col gap-4 col-span-2">
        <div class="article-meta flex flex-col gap-4">
          <!-- PUBLISH -->
          <div class="publish">
            <div
              class="border px-2 rounded-lg rounded-es-none rounded-ee-none border-b-0 flex justify-between"
            >
              <span class="font-bold py-2">Status</span>
            </div>
            <div
              class="border rounded-ss-none rounded-se-none p-2 flex flex-col"
            >
              <div id="tag-input" class="flex gap-2 w-full justify-between">
                <Select
                  v-model="currentStatus"
                  :options="statuses"
                  optionLabel="name"
                  placeholder="Select a status"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- SCHEDULE -->
          <div v-if="pendingSchedule" class="schedule">
            <div
              class="border px-2 rounded-lg rounded-es-none rounded-ee-none border-b-0 flex justify-between"
            >
              <span class="font-bold py-2">Scheduled Date</span>
            </div>
            <div
              class="border rounded-ss-none rounded-se-none p-2 flex flex-col"
            >
              <div id="tag-input" class="flex gap-2 w-full justify-between">
                <DatePicker
                  v-model="pendingDate"
                  class="w-full h-8"
                  showIcon
                  fluid
                  iconDisplay="input"
                />
              </div>
            </div>
          </div>

          <!-- TAGS -->
          <div class="tags">
            <div
              class="border px-2 rounded-lg rounded-es-none rounded-ee-none border-b-0 flex justify-between"
            >
              <span class="font-bold py-2">Tags</span>
            </div>
            <div
              class="border rounded-ss-none rounded-se-none p-2 flex flex-col"
            >
              <div id="tag-input" class="flex gap-2 w-full justify-between">
                <InputText
                  v-model="tempTag"
                  type="text"
                  fluid
                  class="py-1 w-[85%] h-8"
                />

                <Button
                  @click="addTags"
                  icon="pi pi-plus text-xs"
                  rounded
                  aria-label="Add Tag"
                  raised
                  class="w-[2rem] !h-[2rem] cursor-pointer"
                  severity="contrast"
                />
              </div>
              <div>
                <Chip
                  v-for="tag in tags"
                  :key="tag"
                  @click="deleteTags(tag)"
                  :label="tag"
                  class="mx-1 my-1 cursor-pointer capitalize text-xs"
                  removable
                />
              </div>
            </div>
          </div>

          <!-- META -->
          <div class="meta">
            <div
              class="border rounded-lg px-2 rounded-es-none rounded-ee-none border-b-0 flex justify-between"
            >
              <span class="font-bold py-2">Meta</span>
            </div>
            <div class="border rounded-lg rounded-ss-none rounded-se-none p-2">
              <Textarea
                v-model="description"
                placeholder="Description"
                type="text"
                fluid
                rows="3"
              ></Textarea>
            </div>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex justify-end gap-2">
          <Button
            severity="danger"
            variant="outlined"
            icon="pi pi-trash text-sm"
            label="Discard"
            class="py-1 text-xs flex items-center"
            raised
          />

          <Button
            type="submit"
            severity="warn"
            label="Submit"
            icon="pi pi-check text-sm"
            class="py-1 text-xs flex items-center"
            :loading="loading"
            raised
          />
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { ref, reactive, watch, onMounted, provide } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import AddImage from "./AddImage.vue";
import Editor from "./Editor.vue";
import { addArticle, editArticle } from "@/assets/js/service.js";
import { useRoute } from "vue-router";
import { articleStore, userStore } from "@/stores";

const tags = ref([]);
const tempTag = ref(null);
const description = ref("");
const loading = ref(false);
const image = defineModel("image");
const src = defineModel("src");
const content = defineModel("content");
const title = ref();
const toast = useToast();
const pendingDate = ref();
const formRef = ref(null);
const user = ref("");

provide("content", content);

const initialValues = reactive({
  title: "",
  content: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      title: z.string().min(1, { message: "Title is required." }),
      content: z.string().min(1, { message: "Content is required." }),
    })
  )
);

const handleArticleData = (values) => {
  article.value.title = values.title;
  article.value.content = values.content;
  article.value.description = description.value;
  article.value.tags = tags.value;
  article.value.authorID = user.value.id;
  article.value.status = currentStatus.value.value;

  return article.value;
};

const article = ref({
  title: "",
  content: "",
  description: "",
  tags: [],
  authorID: user.value.id,
  status: "draft",
});

const onFormSubmit = async ({ valid, values }) => {
  if (!valid) return;

  loading.value = true;

  const data = new FormData();

  data.append("image", image.value);
  data.append(
    "article",
    new Blob([JSON.stringify(handleArticleData(values))], {
      type: "application/json",
    })
  );

  const { ok, result } = route.path.split("/").includes("edit")
    ? await editArticle(localStorage.getItem("app-article-id"), data)
    : await addArticle(data);

  // const { ok, result } = await addArticle(data);

  toast.add({
    severity: ok ? "success" : "error",
    summary: result?.message,
    life: 10000,
  });

  loading.value = false;
};

const addTags = () => {
  if (tempTag.value) {
    if (!tags.value.includes(tempTag.value)) {
      tags.value.push(tempTag.value);
      tempTag.value = "";
    }
  }
};

const deleteTags = (item) => {
  tags.value = tags.value.filter((tag) => tag !== item);
};

const pendingSchedule = ref(false);

const showPendingSchedule = (status) => {
  pendingSchedule.value = status.value === "pending";
};

const currentStatus = ref({
  name: "Draft",
  value: "draft",
  color: "text-red-700",
});

watch(currentStatus, (n, o) => showPendingSchedule(!n ? o : n));

//
const handlePendingSchedule = (date) => {
  const pad = (n, z = 2) => ("00" + n).slice(-z);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  const millisecond = pad(date.getMilliseconds(), 3);

  // Add microseconds (.000000 format)
  const microseconds = millisecond + "000";

  const formatted = `${year}-${month}-${day} ${hour}:${minute}:${second}.${microseconds}`;
};

watch(pendingDate, handlePendingSchedule);

const statuses = ref([
  { name: "Draft", value: "draft", color: "text-red-700" },
  { name: "Pending", value: "pending", color: "text-blue-700" },
  { name: "Published", value: "published", color: "text-green-700" },
]);

const store = articleStore();
const fetchArticleById = async () => {
  const cachedArticle = await store.getArticle();

  title.value = cachedArticle.title;
  content.value = cachedArticle.content;
  tags.value = cachedArticle.tags || [];
  description.value = cachedArticle.description;
  src.value = cachedArticle.image;
  image.value = cachedArticle.image;
  currentStatus.value = statuses.value.find(
    (status) => status.value === cachedArticle.status
  );

  // Update initial form values
  const form = await formRef.value.states;
  form.content.value = cachedArticle.content;
  form.title.value = cachedArticle.title;
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

  // Update initial form values
  const form = await formRef.value.states;
  form.content.value = "";
  form.title.value = "";
};

const route = useRoute();
const switchFormMode = async (url) => {
  url.path.split("/").includes("edit")
    ? await fetchArticleById()
    : await resetForm();
};

watch(route, switchFormMode);
onMounted(async () => {
  await switchFormMode(route);
  const { getUser } = userStore();
  user.value = await getUser();
});
</script>

<style></style>
