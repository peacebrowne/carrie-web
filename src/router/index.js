import { createRouter, createWebHistory } from "vue-router";
import AppView from "@/views/AppView.vue";
import LoginView from "@/views/LoginView.vue";
import ArticleList from "@/components/articles/ArticleList.vue";
import AddArticle from "@/components/articles/AddArticle.vue";
import ArticleDetail from "@/components/articles/ArticleDetail.vue";
import LoginForm from "@/components/forms/LoginForm.vue";
import RegistrationForm from "@/components/forms/RegistrationForm.vue";
import DashBoard from "@/components/dashboard/DashBoard.vue";

const routes = [
  {
    path: "/app",
    component: AppView,
    name: "app",
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        // TODO add landing page.
        name: "landing-page",
      },
      {
        path: "dashboard",
        // TODO add dashboard component.
        component: DashBoard,
        name: "dashboard",
      },
      {
        path: "list",
        // TODO add dashboard component.
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
      // {
      //   path: "articles",
      //   children: [
      //     {
      //       path: "list",
      //       children: [
      //         {
      //           path: "",
      //           component: ArticleList,
      //           name: "list",
      //         },
      //         {
      //           path: ":title",
      //           component: ArticleDetail,
      //           name: "article-detail",
      //         },
      //       ],
      //     },
      // {
      //   path: "write",
      //   component: AddArticle,
      //   name: "write",
      // },
      //   ],
      // },
      {
        path: "trash",
        // TODO add trash component.
        name: "trash",
      },
      {
        path: "profile",
        // TODO add author profile component.
        name: "profile",
      },
    ],
  },
  {
    path: "/",
    component: LoginView,
    children: [
      {
        path: "login",
        component: LoginForm,
        name: "login",
        meta: {
          logoutRequired: true,
        },
      },
      {
        path: "register",
        component: RegistrationForm,
        name: "register",
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
