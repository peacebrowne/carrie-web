import { createRouter, createWebHistory } from "vue-router";
import AppView from "@/views/AppView.vue";
import ArticleList from "@/components/articles/ArticleList.vue";
import AddArticle from "@/components/articles/AddArticle.vue";
import Dialog from "@/components/articles/Editor.vue";

const routes = [
  {
    path: "/app",
    component: AppView,
    name: "app",
    children: [
      {
        path: "",
        // TODO add landing page.
        name: "landing-page",
      },
      {
        path: "dashboard",
        // TODO add dashboard component.
        name: "dashboard",
      },
      {
        path: "articles",
        // TODO add articles component.

        children: [
          {
            path: "list",
            component: ArticleList,
            name: "list",
          },
          {
            path: "edit",
            component: AddArticle,
            name: "edit",
          },
        ],
      },
      {
        path: "account",
        // TODO add author profile component.
        name: "account",
      },
    ],
  },

  {
    path: "/dialog",
    component: Dialog,
    name: "dialog",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
