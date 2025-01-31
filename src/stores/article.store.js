// stores/article.store.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const articleStore = defineStore("article", () => {
  const article = ref(null);

  const setArticle = (data) => {
    article.value = data;
    localStorage.setItem("app-article-id", data.id);
  };

  const getArticle = () => article.value;

  return { getArticle, article, setArticle };
});
