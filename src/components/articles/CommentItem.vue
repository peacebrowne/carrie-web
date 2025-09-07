<template>
  <Panel pt:footer:class="pb-0">
    <template #header>
      <div class="flex items-center gap-2">
        <Avatar
          v-if="comment.author.image"
          :image="comment.author.image"
          shape="circle"
        />

        <Avatar v-else icon="pi pi-user text-xs" shape="circle" />
        <div class="flex flex-col">
          <span class="font-black text-surface-900 dark:text-surface-0 text-xs"
            >{{ comment.author.firstName }} {{ comment.author.lastName }}</span
          >
          <span
            class="font-semibold text-surface-600 dark:text-surface-200 m-0 text-xs"
            >{{ handleDateFormat(comment.createdAt) }}</span
          >
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-wrap items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <!-- LIKE COMMENTS -->
          <Button
            class="py-1"
            size="small"
            severity="secondary"
            text
            @click="handleCommentClaps(comment)"
          >
            <i class="pi pi-thumbs-up text-xs"></i>
            <span>{{ comment.likes }}</span>
          </Button>

          <!-- TOGGLE REPLIES -->
          <Button
            severity="secondary"
            class="py-1"
            size="small"
            text
            @click="fetchCommentReplies(comment, 'comment')"
            :disabled="!comment.totalReplies"
          >
            <i class="pi pi-comments text-sm"></i>
            <span>
              {{
                !comment.repliesVisible ? comment.totalReplies : "Hide Replies"
              }}</span
            >
          </Button>

          <!-- POST COMMENT BUTTON -->
          <Button
            severity="secondary"
            text
            size="small"
            class="text-xs py-1"
            label="Reply"
            v-styleclass="{
              selector: `#_${comment.id}`,
              toggleClass: 'hidden',
            }"
          />
        </div>
      </div>

      <div class="comment-action-btn flex flex-col gap-4">
        <!-- COMMENT FORM -->
        <div :id="`_${comment.id}`" class="hidden pb-4">
          <Form
            v-slot="$form"
            :initialValues="initialValues"
            @submit="onFormSubmit"
            class="flex flex-col gap-4"
          >
            <div class="border rounded-lg">
              <Editor :editorData="editorData" />
            </div>
            <div class="flex justify-end">
              <Button
                class="py-1 text-xs"
                type="submit"
                severity="primary"
                :disabled="$form.comment?.value ? false : true"
                label="Post reply"
                @click="fetchCommentReplies(comment, 'comment')"
              />
            </div>
          </Form>
        </div>

        <!-- COMMENT REPLIES -->
        <div
          v-if="comment.repliesVisible"
          class="flex flex-col gap-3 pb-4"
          id="replies"
        >
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :attachAuthorToComments="attachAuthorToComments"
          />
        </div>
      </div>
    </template>

    <template #icons>
      <Button
        icon="pi pi-ellipsis-h text-sm"
        severity="secondary"
        rounded
        text
        @click="toggle"
      />
      <Menu ref="menu" id="config_menu" :model="items" popup />
    </template>
    <div class="flex flex-col gap-2">
      <p class="m-0" v-html="comment.content"></p>
      <!-- <p class="m-0">
        {{ comment.content }}
      </p> -->
    </div>
  </Panel>
</template>

<script setup>
import { addClaps, addComment, getCommentReplies } from "@/assets/js/service";
import { ref } from "vue";
import { handleDateFormat } from "@/assets/js/util.js";
import { useToast } from "primevue/usetoast";
import Menu from "primevue/menu";

defineOptions({ name: "CommentItem" });

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  attachAuthorToComments: Function,
});

const editorData = ref({
  height: "120",
  placeholder: "What are your thoughts?",
  name: "comment",
});

const postCommentId = ref("");
const postCommentType = ref("");
const loading = ref(false);

const handleCommentClaps = async (comment) => {
  const data = {
    authorID: localStorage.getItem("app-author-id"),
    commentID: comment.id,
  };

  const { result, ok } = await addClaps(data);
  if (ok) comment.likes++;
};

const menu = ref(null);
const toast = useToast();
const initialValues = ref({
  comment: "",
});

const items = ref([
  {
    label: "Refresh",
    icon: "pi pi-refresh text-sm",
  },
  {
    label: "Search",
    icon: "pi pi-search text-sm",
  },
  {
    separator: true,
  },
  {
    label: "Delete",
    icon: "pi pi-times text-sm",
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const save = () => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Data Saved",
    life: 3000,
  });
};

const updateCommentTarget = (id, type) => {
  postCommentId.value = id;
  postCommentType.value = type;
};

const onFormSubmit = async ({ valid, states, reset }) => {
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

    states.comment.value = "";
  }
};

const handleCommentData = (content, type, targetID) => {
  const typeMapping = {
    article: { articleID: targetID },
    comment: { parentCommentID: targetID },
  };

  return {
    ...typeMapping[type],
    authorID: localStorage.getItem("app-author-id"),
    content,
  };
};

const fetchCommentReplies = async (comment, type) => {
  updateCommentTarget(comment.id, type);
  comment.repliesVisible = !comment.repliesVisible;

  setTimeout(async () => {
    const replies = await getCommentReplies(comment.id);
    comment.replies = await props.attachAuthorToComments(replies.data.values);
  }, 2000);
};

const load = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>

<style>
#replies .p-panel {
  border: none;
  border-left: 1px solid
    color-mix(
      in srgb,
      var(--p-surface-200) calc(100% * var(--tw-border-opacity, 1)),
      transparent
    );
  border-radius: 0;
  margin-left: 1rem;
}
</style>
