import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignupView from "../views/SignupView.vue";
import LoginView from "../views/LoginView.vue";
import { getUser } from "../services/auth.service";
import { removeSession } from "../lib/utils";
import envConfig from "../lib/envConfig";

const isAuthenticated = async (to: any, _: any, next: any) => {
  try {
    const res = await getUser();
    localStorage.setItem("user", JSON.stringify(res.data));
    next();
    return;
  } catch (error) {
    removeSession();
    router.push({
      name: "login",
      params: {
        returnTo: to.path,
        query: to.query,
      },
    });
  }
};

const isAlreadyAuthenticated = async (to: any, _: any, next: any) => {
  try {
    // can check if token is available at all before sending request to save request time
    const res = await getUser();
    localStorage.setItem("user", JSON.stringify(res.data));
    router.push({
      name: "home",
      params: {
        returnTo: to.path,
        query: to.query,
      },
    });
  } catch (error) {
    removeSession();
    next();
    return;
  }
};

const router = createRouter({
  history: createWebHistory(envConfig.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: isAuthenticated,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter: isAlreadyAuthenticated,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
      beforeEnter: isAlreadyAuthenticated,
    },
  ],
});

export default router;
