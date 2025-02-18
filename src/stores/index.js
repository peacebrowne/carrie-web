// stores/article.store.js
import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";

export const articleStore = defineStore("article", () => {
  const article = ref(null);

  const setArticle = (data) => {
    article.value = data;
    localStorage.setItem("app-article-id", data.id);
  };

  const getArticle = () => article.value;

  return { getArticle, article, setArticle };
});

export const authorStore = defineStore("authorStore", () => {
  const author = ref(null);

  const setAuthor = (id) => {
    author.value = id;
    localStorage.setItem("app-author-id", id);
  };

  const getAuthor = () => author.value;

  return { getAuthor, setAuthor };
});

export const cookiesStore = defineStore("cookiesStore", () => {
  const isAuthenticated = ref(null);

  const getCookie = () => Cookies.get("token");
  const setCookie = (value) => {
    Cookies.set("token", value, {
      expires: (1 / 1440) * 30,
      sameSite: "Strict",
    });
  };

  const removeCookie = () => Cookies.remove("token");

  const setIsAuthenticated = () => {
    isAuthenticated.value = getCookie();
  };

  const getIsAuthenticated = () => isAuthenticated.value;

  return {
    removeCookie,
    getIsAuthenticated,
    getCookie,
    setCookie,
    setIsAuthenticated,
  };
});
