<template>
  <Toast />
  <div class="flex flex-col w-full p-4">
    <div class="p-2">
      <span class="text-lg font-black">Create new article</span>
    </div>
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex w-full gap-6"
    >
      <div class="w-[65%] flex flex-col gap-4">
        <!-- IMAGE -->
        <UploadArticleImage
          name="image"
          v-model:src="src"
          v-model:image="image"
        />

        <!-- TITLE -->
        <div class="flex flex-col gap-1">
          <InputText name="title" type="text" placeholder="Title" fluid />
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
            v-model:content="content"
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
            <div class="p-menubar flex justify-between">
              <span class="font-bold py-2">Publish</span>
              <ToggleSwitch v-model="published" />
            </div>
          </div>

          <!-- TAGS -->
          <div class="tags">
            <div
              class="p-menubar rounded-es-none rounded-ee-none border-b-0 flex justify-between"
            >
              <span class="font-bold py-2">Tags</span>
            </div>
            <div
              class="p-menubar rounded-ss-none rounded-se-none p-2 flex flex-col"
            >
              <div id="tag-input" class="flex gap-2 w-full justify-between">
                <InputText
                  v-model="tempTag"
                  type="text"
                  fluid
                  class="py-1 w-[85%] h-[2rem]"
                />

                <Button
                  @click="addTags"
                  icon="pi pi-plus text-xs"
                  rounded
                  aria-label="Add Tag"
                  raised
                  class="w-[2rem] !h-[2rem]"
                  variant="outlined"
                  severity="warn"
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
              class="p-menubar rounded-es-none rounded-ee-none border-b-0 flex justify-between"
            >
              <span class="font-bold py-2">Meta</span>
            </div>
            <div class="p-menubar rounded-ss-none rounded-se-none p-2">
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
            class="py-1 text-xs"
            raised
          />

          <Button
            type="submit"
            severity="warn"
            label="Submit"
            icon="pi pi-check text-sm"
            class="py-1 text-xs"
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
import { ref, reactive } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import UploadArticleImage from "./UploadArticleImage.vue";
import Editor from "./Editor.vue";
import { addArticle } from "@/assets/js/service.js";

const published = ref(false);
const tempTag = ref(null);
const tags = ref([]);
const description = ref("");
const loading = ref(false);
const image = defineModel("image");
const src = defineModel("src");
const content = defineModel("content");
const toast = useToast();

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
  return {
    title: values.title,
    content: values.content,
    description: description.value,
    tags: tags.value,
    isPublished: published.value,
    authorID: localStorage.getItem("app-author-id"),
  };
};

const onFormSubmit = async ({ valid, values }) => {
  load();

  const article = handleArticleData(values);

  const data = new FormData();
  data.append("image", image.value);
  data.append(
    "article",
    new Blob([JSON.stringify(article)], { type: "application/json" })
  );

  if (valid) {
    const { ok, result } = await addArticle(data);

    toast.add({
      severity: ok ? "success" : "error",
      summary: result.message,
      life: 10000,
    });
  }
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

const load = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>

<style></style>
