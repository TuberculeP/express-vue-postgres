import { createRouter, createWebHistory } from "vue-router";

import LoginView from "./views/auth/LoginView.vue";
import RegisterView from "./views/auth/RegisterView.vue";

import { useAuthStore } from "./stores/authStore";
import apiClient from "./lib/utils/apiClient";
import type { User } from "./lib/utils/types";
import Main from "./views/Main.vue";

async function authGuard(to: any, from: any, next: any) {
  const authStore = useAuthStore();
  const check = await apiClient.get<{ user: User }>("/auth/check");
  if (check.error) {
    next({ name: "app-login", query: { redirect: to.name } });
    return;
  }
  if (check.data && check.data.user) {
    authStore.user = check.data.user;
    next();
  } else {
    next({ name: "app-login", query: { redirect: to.name } });
  }
}

async function adminGuard(to: any, _from: any, next: any) {
  const authStore = useAuthStore();
  const check = await apiClient.get<{ user: User }>("/auth/check");

  if (check.error || !check.data?.user) {
    next({ name: "app-login", query: { redirect: to.name } });
    return;
  }

  authStore.user = check.data.user;

  if (check.data.user.role !== "ROLE_ADMIN") {
    next({ name: "landing-main" });
    return;
  }

  next();
}

const routes = [
  { path: "/", redirect: "/app", name: "home-redirect" },
  { path: "/app", component: Main, name: "landing-main" },
  { path: "/login", component: LoginView, name: "app-login" },
  { path: "/register", component: RegisterView, name: "app-register" },
  {
    path: "/app/admin/users",
    component: () => import("./views/admin/AdminUsers.vue"),
    name: "admin-users",
    meta: { requiresAdmin: true },
  },
  {
    path: "/app/profile",
    component: () => import("./views/ProfileView.vue"),
    name: "profile",
  },
];

const getGuardedRoutes = () => {
  const guardedMatches = ["app"];
  return routes.map((route: any) => {
    if (route.meta?.requiresAdmin) {
      return {
        ...route,
        beforeEnter: adminGuard,
      };
    }
    if (guardedMatches.some((match) => route.path.includes(match))) {
      return {
        ...route,
        beforeEnter: authGuard,
      };
    }
    return route;
  });
};

export const router = createRouter({
  history: createWebHistory(),
  routes: getGuardedRoutes(),
});
