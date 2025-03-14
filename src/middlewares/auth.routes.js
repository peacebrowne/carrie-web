import router from "@/router";
import { cookiesStore } from "@/stores";

router.beforeEach((to, from, next) => {
  const { getIsAuthenticated, getCookie, setIsAuthenticated } = cookiesStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.fullPath !== "/auth/login" && to.fullPath !== "/") {
      const token = getCookie();
      if (token) {
        setIsAuthenticated();
      }
    }

    console.log(getIsAuthenticated());
 
    if (!getIsAuthenticated()) {
      next({
        path: "/auth/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
