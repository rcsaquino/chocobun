import Vue from "vue";
import VueRouter from "vue-router";
import Transmute from "@/views/Transmute.vue";
import Courses from "@/views/Courses.vue";
import Tools from "@/views/Tools.vue";
import Settings from "@/views/Settings.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/index.html",
    component: Transmute,
  },
  {
    path: "/",
    name: "Transmute",
    component: Transmute,
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
  },
  {
    path: "/tools",
    name: "Tools",
    component: Tools,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (store.state.canChangeHash || from.hash) {
    next();
    store.state.canChangeHash && store.commit("requestChangeHash", false);
  } else {
    next(false);
  }
});

export default router;
