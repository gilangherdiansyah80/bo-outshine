import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/pages/LoginPage/index.vue";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage/index.vue";
import ResetPasswordPage from "@/pages/ResetPasswordPage/index.vue";
import DashboardPage from "@/pages/DashboardPage/index.vue";
import ManagementPage from "@/pages/ManagementPage/index.vue";
import OrderPage from "@/pages/OrderPage/index.vue";
import DetailOrderPage from "@/pages/DetailOrderPage/index.vue";
import UsersPage from "@/pages/UsersPage/index.vue";
import ReviewPage from "@/pages/ReviewPage/index.vue";

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
    path: "/order",
    redirect: "/outshine/order",
  },
  {
    path: "/order/:id",
    redirect: "/outshine/order/:id",
  },
  {
    path: "/review",
    redirect: "/outshine/review",
  },
  {
    path: "/users",
    redirect: "/outshine/users",
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
        path: "order",
        name: "Order",
        component: OrderPage,
      },
      {
        path: "order/:id",
        name: "DetailOrder",
        component: DetailOrderPage,
        meta: { hideNav: true },
      },
      {
        path: "review",
        name: "Review",
        component: ReviewPage,
      },
      {
        path: "users",
        name: "Users",
        component: UsersPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
