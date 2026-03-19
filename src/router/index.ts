import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/pages/LoginPage/index.vue";
import HomePage from "@/pages/HomePage/index.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
