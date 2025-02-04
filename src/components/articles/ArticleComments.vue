<template>
  <Toast />

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

    <Comments
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :attachAuthorToComments="attachAuthorToComments"
      class="p-menubar w-full border-none"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Comments from "./Comments.vue";
import {
  getAuthorById,
  getComments,
} from "@/assets/js/service";

const props = defineProps({
  commentData: {
    type: Object,
    required: true,
  },
});

const comments = ref([]);
const fetchComments = async (articleId) => {
  const enrichedComments = await getComments(articleId);
  comments.value = await attachAuthorToComments(enrichedComments.data.values);
};

watch(
  () => props.commentData.id,
  async (newId, oldId) => {
    if (newId) {
      await fetchComments(newId);
    }
  }
);

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
</script>
