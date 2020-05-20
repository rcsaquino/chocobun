<template>
  <div>
    <v-card class="animated fadeInDown faster">
      <v-card-title>Settings</v-card-title>
      <v-card-text>
        <v-switch v-model="darkMode" label="Dark Mode" class="my-2" />
        <v-btn color="secondary" @click="confirmClearDialog = true">Clear All Data</v-btn>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>
        <p>
          Share this app:
          <a @click="shareApp">https://chocobun.web.app/</a>
        </p>
        <p>
          Send feedback:
          <a
            onclick="window.location.href = 'mailto:rcsaquino.dev@gmail.com?Subject=[FEEDBACK]%20Chocobun%20App'"
          >rcsaquino.dev@gmail.com</a>
        </p>
        <p class="mb-0">© 2018-2020</p>
      </v-card-text>
    </v-card>
    <!-- Confirm Clear Dialog Box -->
    <DialogBox
      :open="confirmClearDialog"
      title="Clear All Data?"
      proceedText="Ok"
      @cancel="confirmClearDialog = false"
      @proceed="clearData"
      snackbarText="Cleared all data."
      :snackbarTrigger="snackbarTrigger"
    >Are you sure you want to continue? This can not be undone.</DialogBox>
  </div>
</template>

<script>
import store from "@/store";
import DialogBox from "@/components/DialogBox.vue";
import dialogHelper from "@/mixins/dialogHelper";

export default {
  mixins: [dialogHelper],
  components: { DialogBox },
  data: () => ({
    confirmClearDialog: false,
    snackbarTrigger: 0,
    darkMode: false,
    hashID: "Settings",
    watchDialogs: ["confirmClearDialog"]
  }),

  created() {
    this.darkMode = JSON.parse(localStorage.getItem("dark_mode"));
  },

  watch: {
    darkMode(val) {
      this.$vuetify.theme.dark = val;
      localStorage.setItem("dark_mode", val);
      if (val) {
        document.body.style.background = "#000000";
      } else {
        document.body.style.background = "#FFFFFF";
      }
    }
  },

  methods: {
    clearData() {
      this.confirmClearDialog = false;
      store.state.courses.forEach(course => {
        this.$store.commit("deleteCourse", course);
      });
      this.snackbarTrigger++;
    },
    shareApp() {
      if (navigator.share) {
        navigator.share({
          title: "Chocobun App",
          text: "Check out chocobun app!",
          url: "https://chocobun.web.app/"
        });
      } else {
        window.open("https://chocobun.web.app/");
      }
    }
  }
};
</script>

<style scoped>
.shareButtons {
  width: 50%;
}
</style>
