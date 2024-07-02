import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignupView from "../views/SignupView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { checkAuth: true, checkAlreadyAuthenticated: false },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { checkAuth: false, checkAlreadyAuthenticated: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
      meta: { checkAuth: false, checkAlreadyAuthenticated: true },
    },
  ],
});

export default router;
