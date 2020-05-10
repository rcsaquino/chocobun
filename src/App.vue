<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Chocobun</v-toolbar-title>
    </v-app-bar>
    <div v-if="isInstalled || devMode">
      <BottomNav />
      <v-content class="no-scroll">
        <router-view />
      </v-content>
    </div>
    <v-content v-else>
      <InstallInstructions v-show="swStatus === 'ready'" />
      <div
        v-show="swStatus !== 'ready'"
        class="download-circle-container no-scroll"
      >
        <v-progress-circular
          class="download-circle"
          :indeterminate="swStatus === 'Downloading...'"
          color="primary"
          size="200"
          width="5"
          >{{ swStatus }}</v-progress-circular
        >
      </div>
    </v-content>
  </v-app>
</template>

<script>
import BottomNav from "@/components/BottomNav.vue";
import store from "@/store";
import InstallInstructions from "@/components/InstallInstructions.vue";

export default {
  name: "App",

  components: {
    BottomNav,
    InstallInstructions,
  },

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
  },

  created() {
    // Set initial theme based on user preference
    this.$vuetify.theme.dark = JSON.parse(localStorage.getItem("dark_mode"));

    // Hydrate store with localstorage
    const courses = JSON.parse(localStorage.getItem("courses"));
    courses?.forEach((course) => {
      this.$store.commit("addCourse", course);
    });

    // Update localstorage whenever there are changes to store
    store.subscribe((mutation, state) => {
      // Track changes to state.courses
      const courseMutations = ["addCourse", "updateCourse", "deleteCourse"];
      if (courseMutations.includes(mutation.type)) {
        localStorage.setItem("courses", JSON.stringify(state.courses));
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
.download-circle-container {
  background: #ffebcd;
}
.download-circle {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
