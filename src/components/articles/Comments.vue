<template>
  <Fieldset class="w-full">
    <template #legend>
      <div class="flex items-center pl-2">
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          shape="circle"
        />
        <div class="flex flex-col ml-2">
          <span class="font-black text-surface-900 dark:text-surface-0 text-sm"
            >{{ comment.author.firstName }} {{ comment.author.lastName }}</span
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
            @click="handleCommentClaps(comment)"
          >
            <i class="pi pi-thumbs-up text-xs"></i>
            <span>{{ comment.totalClaps }}</span>
          </Button>

          <!-- TOGGLE REPLIES -->
          <Button
            variant="text"
            size="small"
            class="text-xs py-1 capitalize"
            @click="fetchCommentReplies(comment)"
            :disabled="comment.totalReplies ? false : true"
          >
            <i class="pi pi-comments text-xs"></i>
            <span> {{ comment.totalReplies }}</span>
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
                @click="updateCommentTarget(comment.id, 'comment')"
              />
            </div>
          </Form>
        </div>

        <!-- COMMENT REPLIES -->
        <div v-if="comment.repliesVisible">
          <Comments
            v-for="reply in comment.replies"
            :key="reply.id"
            class="pl-6"
            :comment="reply"
            :attachAuthorToComments="attachAuthorToComments"
          />
        </div>
      </div>
    </div>
  </Fieldset>
</template>

<script setup>
import { addClaps, addComment, getCommentReplies } from "@/assets/js/service";
import { ref } from "vue";
import { handleDateFormat } from "@/assets/js/util.js";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { z } from "zod";

defineOptions({ name: "Comments" });

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  attachAuthorToComments: Function,
});

const postCommentId = ref("");
const postCommentType = ref("");
const loading = ref(false);

const handleCommentClaps = async (comment) => {
  const data = {
    authorID: "22cd93b5-01dc-4f3a-b33d-c77af55af1ed",
    commentID: comment.id,
  };

  const { result, ok } = await addClaps(data);
  if (ok) comment.totalClaps++;
};

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

const updateCommentTarget = (id, type) => {
  postCommentId.value = id;
  postCommentType.value = type;
};

const onFormSubmit = async ({ valid, states }) => {
  load();

  const data = handleCommentData(
    states.comment.value,
    postCommentType.value,
    postCommentId.value
  );

  if (valid) {
    const { ok, result } = await addComment(data);

    toast.add({
      severity: ok ? "success" : "error",
      summary: result.message,
      life: 10000,
    });
  }
};

const handleCommentData = (content, type, targetID) => {
  const typeMapping = {
    article: { articleID: targetID },
    comment: { parentCommentID: targetID },
  };

  return {
    ...typeMapping[type],
    authorID: "149ebfda-a27e-4cef-9882-ee7ec44ac349",
    content,
  };
};

const fetchCommentReplies = async (comment) => {
  const replies = await getCommentReplies(comment.id);
  comment.replies = await props.attachAuthorToComments(replies.data.values);
  comment.repliesVisible = !comment.repliesVisible;
};

const load = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>
