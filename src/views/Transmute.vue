<template>
  <v-card class="pa-5 animate__animated animate__fadeInDown animate__faster">
    <v-form ref="transmuteForm">
      <div class="baseSelect">
        <v-select v-model="base" :items="baseChoices" label="Base"></v-select>
      </div>
      <v-text-field
        v-model="yourScore"
        label="Your Score"
        type="number"
        :rules="numbersOnly"
        color="accent"
      />
      <v-text-field
        v-model="totalItems"
        label="Total Items"
        type="number"
        :rules="numbersOnly"
        color="accent"
      />
      <v-btn class="mt-2" color="secondary" @click="transmuteScore"
        >Transmute</v-btn
      >
    </v-form>
    <div class="mt-5">
      <p>{{ passingScore }}</p>
      <p>{{ transmutedGrade }}</p>
    </div>
  </v-card>
</template>

<script>
import appInfo from "../../package.json";
import TransmuteMixin from "@/mixins/TransmuteMixin.js";

export default {
  mixins: [TransmuteMixin],
  data: () => ({
    base: "65",
    baseChoices: ["65", "60", "50"],
    yourScore: "",
    totalItems: "",
    numbersOnly: [(v) => (v && !isNaN(v)) || "Please input numbers."],
    passingScore: window.location.href.includes("chocobunapp")
      ? "Developer Build"
      : "Chocobun App by Chocobun Fam",
    transmutedGrade: `v${appInfo.version}`,
  }),

  computed: {
    appVersion() {
      return appInfo.version;
    },
  },

  methods: {
    transmuteScore() {
      if (this.$refs.transmuteForm.validate()) {
        // Get transmuted grade
        const transmuted = this.transmute_score(
          this.yourScore,
          this.totalItems,
          this.base
        );

        let pScore, scoreStat;
        switch (this.base) {
          case "65":
            pScore = this.totalItems * 0.65;
            break;
          case "60":
            pScore = this.totalItems * 0.6;
            break;
          case "50":
            pScore = this.totalItems * 0.5;
        }

        if (this.yourScore >= pScore) {
          scoreStat = "You passed! ";
        } else {
          scoreStat = "You failed! ";
        }

        this.passingScore = scoreStat + "The passing score is: " + pScore;
        this.transmutedGrade = "Your transmuted grade is: " + transmuted;

        // Log to GA
        this.$gtag.event("transmute_score", {
          event_category: "transmute",
          event_label: "Transmute",
        });
      }
    },
  },
};
</script>

<style scoped>
.baseSelect {
  width: 55px;
}
</style>
