import { createRouter, createWebHistory } from "vue-router";
import AppView from "@/views/AppView.vue";
import ArticleList from "@/components/articles/ArticleList.vue";
import AddArticle from "@/components/articles/AddArticle.vue";
import ArticleDetail from "@/components/articles/ArticleDetail.vue";

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
        children: [
          {
            path: "list",
            children: [
              {
                path: "",
                component: ArticleList,
                name: "list",
              },
              {
                path: ":title",
                component: ArticleDetail,
                name: "article-detail",
              },
            ],
          },
          {
            path: "write",
            component: AddArticle,
            name: "write",
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
    // path: "*", // Catch-all route for 404
    // component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
