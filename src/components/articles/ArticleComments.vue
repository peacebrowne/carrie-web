<template>
  <div class="flex flex-col gap-10 w-full">
    <!-- COMMENTS -->
    <div class="flex flex-col gap-6">
      <h3 class="text-sm md:text-lg font-light">
        Comments ({{ commentData.comments }})
      </h3>

      <!-- COMMENT FORM -->
      <div class="flex items-center gap-2">
        <Avatar v-if="user.image" :image="user.image" shape="circle" />

        <Avatar v-else icon="pi pi-user text-xs" shape="circle" />
        <span class="font-bold">{{ user.firstName }} {{ user.lastName }}</span>
      </div>

      <div :id="`_${commentData.id}`" class="pb-4">
        <Form
          v-slot="$form"
          class="flex flex-col gap-4"
          @submit="onFormSubmit"
          :initialValues="initialValues"
        >
          <div class="border rounded-lg">
            <Editor id="editor" />
          </div>
          <div class="flex justify-end">
            <Button
              class="py-1 text-xs"
              type="submit"
              severity="primary"
              :disabled="$form.comment?.value ? false : true"
              label="Post Comment"
            />
          </div>
        </Form>
      </div>

      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :attachAuthorToComments="attachAuthorToComments"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, provide } from "vue";
import CommentItem from "./CommentItem.vue";
import { getAuthorById, getComments, addComment } from "@/assets/js/service";
import { userStore } from "@/stores";
import { handleImage } from "@/assets/js/util";
import Editor from "../editors/CommentEditor.vue";

const props = defineProps({
  commentData: {
    type: Object,
    required: true,
  },
});

const totalComments = ref(0);
const initialValues = ref({
  comment: "",
});

const content = defineModel("content");
provide("content", content);
const user = ref("");
const comments = ref([]);
const postCommentId = ref();
const postCommentType = ref("article");
const loading = ref(false);
const emit = defineEmits(["update-total-comments"]);

const fetchComments = async (articleId) => {
  const { data } = await getComments(articleId);
  const { total, values: enrichedComments } = data;
  comments.value = await attachAuthorToComments(enrichedComments);
  totalComments.value = total;
  emit("update-total-comments", total);
};

watch(
  () => props.commentData.id,
  async (newId, oldId) => {
    if (newId) await fetchComments(newId);
  }
);

const attachAuthorToComments = (comments) => {
  const repliesVisible = false;
  return Promise.all(
    comments.map(async (comment) => {
      const { data: author } = await getAuthorById(comment.authorID);
      author.image = await handleImage(comment.authorID);
      return { ...comment, repliesVisible, author };
    })
  );
};

const onFormSubmit = async ({ valid, states, reset }) => {
  load();

  postCommentId.value = props.commentData.id;
  const data = handleCommentData(
    states.comment.value,
    postCommentType.value,
    postCommentId.value
  );

  if (valid) {
    const { ok, result } = await addComment(data);

    if (ok) {
      fetchComments(data.articleID);
      resetForm(reset);
    }
  }
};

const resetForm = (reset) => {
  reset();
  content.value = "";
};

const handleCommentData = (content, type, targetID) => {
  const typeMapping = {
    article: { articleID: targetID },
    comment: { parentCommentID: targetID },
  };

  return {
    ...typeMapping[type],
    authorID: user.value.id,
    content,
  };
};

const load = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

onMounted(async () => {
  const { getUser } = userStore();
  user.value = await getUser();
});
</script>

<style>
#writtenBy {
  border: none;
  border-bottom: 1px solid
    color-mix(
      in srgb,
      var(--p-surface-200) calc(100% * var(--tw-border-opacity, 1)),
      transparent
    );
}
</style>
