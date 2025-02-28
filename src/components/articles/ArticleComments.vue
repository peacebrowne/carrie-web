<template>
  <Toast />

  <div class="flex flex-col gap-4 w-full">
    <div class="flex gap-4">
      <div class="flex items-center gap-2">
        <span class="pi pi-thumbs-up text-2xl font-bold"></span>
        <Badge :value="commentData.likes" severity="contrast"></Badge>
      </div>
      <div class="flex items-center gap-2">
        <span class="pi pi-comments text-2xl font-bold"></span>
        <Badge :value="commentData.comments" severity="contrast"></Badge>
      </div>
      <div class="flex items-center gap-2">
        <span class="pi pi-share-alt text-2xl font-bold"></span>
        <Badge value="0" severity="contrast"></Badge>
      </div>
    </div>

    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :attachAuthorToComments="attachAuthorToComments"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import CommentItem from "./CommentItem.vue";
import { getAuthorById, getComments } from "@/assets/js/service";

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
