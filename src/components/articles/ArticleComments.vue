<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex gap-4">
      <div class="flex items-center gap-2">
        <span class="text-2xl font-bold">Likes</span>
        <Badge :value="commentData.claps" severity="contrast"></Badge>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-2xl font-bold">Comments</span>
        <Badge :value="commentData.comments" severity="contrast"></Badge>
      </div>
    </div>

    <div
      class="p-menubar w-full border-none"
      v-for="comment in comments"
      :key="comment.id"
    >
      <Fieldset class="w-full">
        <template #legend>
          <div class="flex items-center pl-2">
            <Avatar
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              shape="circle"
            />
            <div class="flex flex-col ml-2">
              <span
                class="font-black text-surface-900 dark:text-surface-0 text-sm"
                >{{ comment.author.firstName }}
                {{ comment.author.lastName }}</span
              >
              <span
                class="font-semibold text-surface-600 dark:text-surface-200 m-0 text-xs"
                >{{ handleDateFormat(comment.createdAt) }}</span
              >
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-2">
          <p class="m-0">
            {{ comment.content }}
          </p>
          <div class="flex flex-col gap-4">
            <div class="flex gap-1 items-center">
              <Button
                variant="text"
                size="small"
                class="text-xs py-1"
                @click="handleCommentClaps(comment.id)"
              >
                <i class="pi pi-thumbs-up text-xs"></i>
                <span>{{ comment.totalClaps }}</span>
              </Button>

              <Button
                variant="text"
                size="small"
                class="text-xs py-1 capitalize"
              >
                <i class="pi pi-comment text-xs"></i>
                <span>Replies {{ comment.totalReplies }}</span>
              </Button>

              <Button
                variant="text"
                size="small"
                class="text-xs py-1 capitalize"
                label="Reply"
                v-styleclass="{
                  selector: `#${comment.author.firstName}-${comment.id}`,
                  toggleClass: 'hidden',
                }"
              />
            </div>
            <div
              :id="`${comment.author.firstName}-${comment.id}`"
              class="hidden"
            >
              <Form
                v-slot="$form"
                :resolver="resolver"
                :initialValues="initialValues"
                @submit="onFormSubmit"
                class="flex flex-col gap-4"
              >
                <div class="flex flex-col gap-1">
                  <Textarea
                    name="comment"
                    rows="2"
                    cols="30"
                    style="resize: none"
                    placeholder="Your comment"
                  />
                  <Message
                    v-if="$form.comment?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.comment.error?.message }}</Message
                  >
                </div>
                <div class="flex justify-end">
                  <Button
                    class="py-1 text-xs"
                    type="submit"
                    severity="primary"
                    label="Post Comment"
                  />
                </div>
              </Form>
            </div>
            <div class="container hidden">
              <Fieldset>
                <template #legend>
                  <div class="flex items-center pl-2">
                    <Avatar
                      image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                      shape="circle"
                    />
                    <div class="flex flex-col ml-2">
                      <span
                        class="font-black text-surface-900 dark:text-surface-0 text-sm"
                        >Amy Elsner</span
                      >
                      <span
                        class="font-semibold text-surface-600 dark:text-surface-200 m-0 text-xs"
                        >{{
                          handleDateFormat("2025-01-30 21:13:49.245523")
                        }}</span
                      >
                    </div>
                  </div>
                </template>

                <div class="flex flex-col gap-2">
                  <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <div class="flex flex-col gap-4">
                    <div class="flex gap-1 items-center">
                      <Button
                        variant="text"
                        size="small"
                        class="text-xs py-1"
                        label="40"
                        icon="pi pi-thumbs-up"
                      />
                      <Button
                        variant="text"
                        size="small"
                        class="text-xs py-1 capitalize"
                        label="Replies"
                        icon="pi pi-comment"
                      />
                      <Button
                        variant="text"
                        size="small"
                        class="text-xs py-1 capitalize"
                        label="Reply"
                        v-styleclass="{
                          selector: '#ab',
                          toggleClass: 'hidden',
                        }"
                      />
                    </div>
                    <div id="ab" class="hidden">
                      <Form
                        v-slot="$form"
                        :resolver="resolver"
                        :initialValues="initialValues"
                        @submit="onFormSubmit"
                        class="flex flex-col gap-4"
                      >
                        <div class="flex flex-col gap-1">
                          <Textarea
                            name="comment"
                            rows="2"
                            cols="30"
                            style="resize: none"
                            placeholder="Your comment"
                          />
                          <Message
                            v-if="$form.comment?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                            >{{ $form.comment.error?.message }}</Message
                          >
                        </div>
                        <div class="flex justify-end">
                          <Button
                            class="py-1 text-xs"
                            type="submit"
                            severity="primary"
                            label="Post Comment"
                          />
                        </div>
                      </Form>
                    </div>
                    <div class="container"></div>
                  </div>
                </div>
              </Fieldset>
            </div>
          </div>
        </div>
      </Fieldset>
    </div>
  </div>
</template>

<script setup>
import { addClaps, getAuthorById, getComments } from "@/assets/js/service";
import { ref, watch } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { z } from "zod";
import { handleDateFormat } from "@/assets/js/util.js";

const props = defineProps({
  commentData: {
    type: Object,
    required: true,
  },
});

// const comments = ref(null);
const postComment = ref("");
const comments = ref("");

const toast = useToast();
const initialValues = ref({
  comment: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      comment: z.string().min(1, { message: "Comment is required." }),
    })
  )
);

const onFormSubmit = ({ valid }) => {
  if (valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }
};

const attachAuthorToComments = (comments) => {
  return Promise.all(
    comments.map(async (comment) => {
      const { data: author } = await getAuthorById(comment.authorID);
      comment.author = author;
      return comment;
    })
  );
};

const fetchComments = async (articleId) => {
  const enrichedComments = await getComments(articleId);
  comments.value = await attachAuthorToComments(enrichedComments.data.values);
  console.log(comments.value);
};

const handleCommentClaps = async (commentID) => {
  const data = {
    authorID: "22cd93b5-01dc-4f3a-b33d-c77af55af1ed",
    commentID,
  };

  const { result, ok } = await addClaps(data);
  console.log({ result });
  comments.value.forEach((comment) => {
    if (comment.id === commentID) {
      comment.totalClaps++;
    }
  });
};

watch(
  () => props.commentData.id,
  async (newId, oldId) => {
    if (newId) {
      await fetchComments(newId);
    }
  }
);
</script>
