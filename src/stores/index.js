import { defineStore } from "pinia";
import { ref } from "vue";
import Cookies from "js-cookie";
import { getAuthorById, getArticleById } from "@/assets/js/service";
import { jwtDecode } from "jwt-decode";
import { attachArticleImage, handleImage } from "@/assets/js/util";

export const articleStore = defineStore("article", () => {
  const article = ref(null);

  const setArticle = (data) => {
    article.value = data;
    localStorage.setItem("app-article-id", data.id);
  };

  const getArticle = async () => {
    const cachedArticle = article.value;

    if (cachedArticle) return cachedArticle;

    const id = localStorage.getItem("app-article-id");
    const { data: fetchedArticle } = await getArticleById(id);

    article.value = await attachArticleImage(fetchedArticle);

    return article.value;
  };

  return { getArticle, article, setArticle };
});

export const userStore = defineStore("userStore", () => {
  const user = ref({});

  const setUser = (data) => {
    user.value = data;
    localStorage.setItem("app-author-id", data.id);
  };

  const getUser = async () => {
    if (Object.keys(user.value).includes("firstName")) {
      return user.value;
    }
    const id = localStorage.getItem("app-author-id");
    const { data: fetchedAuthor } = await getAuthorById(id);

    fetchedAuthor.image = await handleImage(id);
    user.value = fetchedAuthor;

    return user.value;
  };

  return { getUser, setUser };
});

export const cookiesStore = defineStore("cookiesStore", () => {
  const isAuthenticated = ref(null);

  const getCookie = () => Cookies.get("token");
  const setCookie = (token) => {
    const decoded = jwtDecode(token);

    console.log({ decoded });

    Cookies.set("token", token, {
      expires: (1 / 1440) * 30,
      sameSite: "Strict",
    });
  };

  const removeCookie = () => {
    Cookies.remove("token");
    isAuthenticated.value = null;
  };

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
