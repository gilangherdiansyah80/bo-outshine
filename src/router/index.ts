import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/pages/LoginPage/index.vue";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage/index.vue";
import ResetPasswordPage from "@/pages/ResetPasswordPage/index.vue";
import DashboardPage from "@/pages/DashboardPage/index.vue";
import ManagementPage from "@/pages/ManagementPage/index.vue";

import MainLayout from "@/features/Layout/MainLayout/MainLayout.vue";

const routes = [
  {
    path: "/",
    redirect: "/outshine/login",
  },
  {
    path: "/login",
    redirect: "/outshine/login",
  },
  {
    path: "/dashboard",
    redirect: "/outshine/dashboard",
  },
  {
    path: "/forgot-password",
    redirect: "/outshine/forgot-password",
  },
  {
    path: "/reset-password",
    redirect: "/outshine/reset-password",
  },
  {
    path: "/management",
    redirect: "/outshine/management",
  },
  {
    path: "/sales",
    redirect: "/outshine/sales",
  },
  {
    path: "/stats",
    redirect: "/outshine/stats",
  },
  {
    path: "/outshine",
    component: MainLayout,
    children: [
      {
        path: "login",
        name: "Login",
        component: LoginPage,
        meta: { hideNav: true },
      },
      {
        path: "forgot-password",
        name: "ForgotPassword",
        component: ForgotPasswordPage,
        meta: { hideNav: true },
      },
      {
        path: "reset-password",
        name: "ResetPassword",
        component: ResetPasswordPage,
        meta: { hideNav: true },
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardPage,
      },
      // Placeholders for other footer routes
      {
        path: "management",
        name: "Management",
        component: ManagementPage,
      },
      {
        path: "sales",
        name: "Sales",
        component: DashboardPage,
      },
      {
        path: "stats",
        name: "Stats",
        component: DashboardPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
