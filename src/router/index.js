import Vue from "vue";
import VueRouter from "vue-router";
import Transmute from "@/views/Transmute.vue";
import Courses from "@/views/Courses.vue";
import Settings from "@/views/Settings.vue";

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
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
