import { createRouter, createWebHistory } from "vue-router";
import AppView from "@/views/AppView.vue";
import LoginView from "@/views/LoginView.vue";
import ArticleList from "@/components/articles/ArticleList.vue";
import AddArticle from "@/components/articles/AddArticle.vue";
import ArticleDetail from "@/components/articles/ArticleDetail.vue";
import LoginForm from "@/components/forms/LoginForm.vue";
import RegistrationForm from "@/components/forms/RegistrationForm.vue";
import DashBoard from "@/components/dashboard/DashBoard.vue";
import LandingPage from "@/views/LandingPage.vue";
// import NotFound from "@/views/NotFound.vue"; // Uncomment and create NotFound component

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
        path: "dashboard",
        component: DashBoard,
        name: "dashboard",
      },
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
    component: LandingPage,
    name: "landing-page",
  },
  {
    path: "/auth",
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
    path: "/:catchAll(.*)",
    // component: NotFound, // Uncomment when NotFound component is created
    name: "not-found",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
