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
          <div class="comment-action-btn flex flex-col gap-4">
            <div class="flex gap-1 items-center">
              <!-- CLAP COMMENTS -->
              <Button
                variant="text"
                size="small"
                class="text-xs py-1"
                @click="handleCommentClaps(comments, comment.id)"
              >
                <i class="pi pi-thumbs-up text-xs"></i>
                <span>{{ comment.totalClaps }}</span>
              </Button>

              <!-- TOGGLE REPLIES -->
              <Button
                v-if="comment.totalReplies"
                variant="text"
                size="small"
                class="text-xs py-1 capitalize"
                @click="fetchCommentReplies(comment)"
              >
                <i class="pi pi-comment text-xs"></i>
                <span>
                  {{ comment.totalReplies > 1 ? "Comments" : "Comment" }}
                  {{ comment.totalReplies }}</span
                >
              </Button>

              <!-- POST COMMENT BUTTON -->
              <Button
                variant="text"
                size="small"
                class="text-xs py-1 capitalize"
                label="Reply"
                v-styleclass="{
                  selector: `#_${comment.id}`,
                  toggleClass: 'hidden',
                }"
              />
            </div>

            <!-- COMMENT FORM -->
            <div :id="`_${comment.id}`" class="hidden">
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

            <div v-if="comment.repliesVisible">
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="pl-6"
              >
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
                          >{{ reply.author.firstName }}
                          {{ reply.author.lastName }}</span
                        >
                        <span
                          class="font-semibold text-surface-600 dark:text-surface-200 m-0 text-xs"
                          >{{ handleDateFormat(reply.createdAt) }}</span
                        >
                      </div>
                    </div>
                  </template>

                  <div class="flex flex-col gap-2">
                    <p class="m-0">
                      {{ reply.content }}
                    </p>
                    <div class="flex flex-col gap-4">
                      <div class="flex gap-1 items-center">
                        <!-- REPLY CLAP -->
                        <Button
                          variant="text"
                          size="small"
                          class="text-xs py-1"
                          @click="handleCommentClaps(comment.replies, reply.id)"
                        >
                          <i class="pi pi-thumbs-up text-xs"></i>
                          <span>{{ reply.totalClaps }}</span>
                        </Button>

                        <!-- TOGGLE REPLIES -->
                        <Button
                          variant="text"
                          size="small"
                          class="text-xs py-1 capitalize"
                          @click="fetchCommentReplies(comment)"
                        >
                          <i class="pi pi-comment text-xs"></i>
                          <span>
                            {{
                              reply.totalReplies > 1 ? "Comments" : "Comment"
                            }}
                            {{ reply.totalReplies }}</span
                          >
                        </Button>

                        <!-- POST COMMENT BUTTON -->
                        <Button
                          variant="text"
                          size="small"
                          class="text-xs py-1 capitalize"
                          label="Reply"
                          v-styleclass="{
                            selector: `#_${reply.id}`,
                            toggleClass: 'hidden',
                          }"
                        />
                      </div>
                      <div :id="`_${reply.id}`" class="hidden">
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
                    </div>
                  </div>
                </Fieldset>
              </div>
            </div>
          </div>
        </div>
      </Fieldset>
    </div>
  </div>
</template>

<script setup>
import {
  addClaps,
  getAuthorById,
  getComments,
  getCommentReplies,
} from "@/assets/js/service";
import { ref, watch } from "vue";
import CommentReplies from "./CommentReplies.vue";
import { handleDateFormat } from "@/assets/js/util.js";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { z } from "zod";

const props = defineProps({
  commentData: {
    type: Object,
    required: true,
  },
});

// const comments = ref(null);
const postComment = ref("");
const comments = ref("");

const attachAuthorToComments = (comments) => {
  return Promise.all(
    comments.map(async (comment) => {
      const { data: author } = await getAuthorById(comment.authorID);
      comment.author = author;
      comment.repliesVisible = false;
      return comment;
    })
  );
};

const fetchComments = async (articleId) => {
  const enrichedComments = await getComments(articleId);
  comments.value = await attachAuthorToComments(enrichedComments.data.values);
};

const handleCommentClaps = async (commentData, commentID) => {
  const data = {
    authorID: "22cd93b5-01dc-4f3a-b33d-c77af55af1ed",
    commentID,
  };

  const { result, ok } = await addClaps(data);
  if (ok) {
    commentData.forEach((comment) => {
      if (comment.id === commentID) {
        comment.totalClaps++;
      }
    });
  }
};

const fetchCommentReplies = async (comment) => {
  const replies = await getCommentReplies(comment.id);
  comment.replies = await attachAuthorToComments(replies.data.values);
  comment.repliesVisible = !comment.repliesVisible;
};

watch(
  () => props.commentData.id,
  async (newId, oldId) => {
    if (newId) {
      await fetchComments(newId);
    }
  }
);

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
</script>
