import router from "@/router";
import { cookiesStore } from "@/stores";

router.beforeEach((to, from, next) => {
  const { getIsAuthenticated, getCookie, setIsAuthenticated } = cookiesStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const token = getCookie();

  // Auto-set authentication if token exists but not yet set
  if (token && !getIsAuthenticated()) {
    setIsAuthenticated();
  }

  if (requiresAuth && !getIsAuthenticated()) {
    return next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }

  next();
});

export default router;
