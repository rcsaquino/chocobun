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
      },
      dark: {
        primary: "#795548",
        secondary: "#795548",
        accent: "#795548",
        // primary: "#263238",
        // secondary: "#424242",
        // accent: "#9E9E9E",
        // anchor: "#607D8B"
      }
    },
  },
  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
});
