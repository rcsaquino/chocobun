import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./registerServiceWorker";

// CSS
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "typeface-roboto/index.css";
import "animate.css/animate.min.css";

// Google Analytics
import VueGtag from "vue-gtag";

const dev =
  window.location.href.includes("chocobunapp") ||
  window.location.href.includes("localhost") ||
  process.env.NODE_ENV !== "production";

Vue.use(
  VueGtag,
  {
    config: { id: dev ? "UA-148983903-6" : "UA-148983903-5" },
  },
  router
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
