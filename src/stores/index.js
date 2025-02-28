// stores/article.store.js
import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";
import { getAuthorById } from "@/assets/js/service";

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
  const author = ref({});

  const setAuthor = (data) => {
    author.value = data;
    localStorage.setItem("app-author-id", data.id);
  };

  const getAuthor = async () => {
    if (Object.keys(author.value).includes("firstName")) {
      return author.value;
    }

    const { data } = await getAuthorById(localStorage.getItem("app-author-id"));

    return data;
  };

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
