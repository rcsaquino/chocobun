import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: "#795548",
        secondary: "#795548",
        accent: "#795548",
        scoresBtn: "#795548",
      },
      dark: {
        primary: "#795548",
        secondary: "#795548",
        accent: "#795548",
        scoresBtn: "#9E9E9E",
      },
    },
  },
  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
});
