<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title class="textColor--text">Chocobun</v-toolbar-title>
    </v-app-bar>
    <div v-if="isInstalled || devMode">
      <BottomNav />
      <v-content class="no-scroll">
        <router-view />
      </v-content>
    </div>
    <v-content v-else>
      <InstallInstructions v-show="swStatus === 'ready'" />
      <div v-show="swStatus !== 'ready'" class="chocobun-bg no-scroll">
        <v-card color="#ffebcd">
          <v-card-text>
            Notes:
            <ul>
              <li>Please wait while the app loads.</li>
              <li>
                Make sure you are using
                <span class="font-weight-bold">{{ recommendedBrowser }}</span
                >.
              </li>
              <li>Other browsers are not yet supported.</li>
              <li>
                Need Help? Email:
                <a
                  onclick="window.location.href = 'mailto:rcsaquino.dev@gmail.com?Subject=[HELP]%20Chocobun%20App'"
                  >rcsaquino.dev@gmail.com</a
                >
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card class="ma-5" color="#ffebcd">
          <v-card-title>App status: {{ swStatus }}</v-card-title>
          <v-progress-linear
            color="primary"
            :indeterminate="swStatus === 'Downloading...'"
          ></v-progress-linear>
        </v-card>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import BottomNav from "@/components/BottomNav.vue";
import store from "@/store";
import InstallInstructions from "@/components/InstallInstructions.vue";
import themeSelector from "@/mixins/themeSelector";

export default {
  name: "App",
  components: {
    BottomNav,
    InstallInstructions,
  },
  mixins: [themeSelector],
  computed: {
    isInstalled() {
      const isInstalled =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone ||
        document.referrer.includes("android-app://");
      return isInstalled;
    },
    devMode() {
      return process.env.NODE_ENV !== "production";
    },
    swStatus() {
      return store.state.swStatus;
    },
    recommendedBrowser() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isWindows = navigator.platform.indexOf("Win") > -1;
      return /android/i.test(userAgent) || isWindows
        ? "Google Chrome"
        : "Safari";
    },
  },

  created() {
    // Set initial theme based on user preference
    this.$vuetify.theme.dark = JSON.parse(localStorage.getItem("dark_mode"));
    this.switchTheme(localStorage.theme || "Chocobun");

    // Hydrate store with localstorage

    // Courses
    const courses = JSON.parse(localStorage.getItem("courses"));
    courses?.reverse().forEach((course) => {
      this.$store.commit("addCourse", course);
    });

    // Lists
    const lists = JSON.parse(localStorage.getItem("lists"));
    lists?.reverse().forEach((list) => {
      this.$store.commit("addList", list);
    });

    // Update localstorage whenever there are changes to store
    store.subscribe((mutation, state) => {
      // Track changes to state.courses
      const courseMutations = ["addCourse", "updateCourse", "deleteCourse"];
      if (courseMutations.includes(mutation.type)) {
        localStorage.setItem("courses", JSON.stringify(state.courses));
      }

      // Track changes to state.lists
      const listMutations = ["addList", "deleteList"];
      if (listMutations.includes(mutation.type)) {
        localStorage.setItem("lists", JSON.stringify(state.lists));
      }
    });
  },
};
</script>

<style scoped>
.no-scroll {
  position: fixed;
  width: 100%;
  height: 100%;
}
.chocobun-bg {
  background: #ffebcd;
}
</style>
