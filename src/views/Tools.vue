<template>
  <v-card class="animate__animated animate__fadeInDown animate__faster">
    <v-list>
      <v-subheader>TOOLS</v-subheader>
      <v-list-item
        v-for="(tool, index) in tools"
        :key="index"
        @click="openTool(tool.opener, tool.name)"
      >
        <v-list-item-icon>
          <v-icon v-text="tool.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="tool.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- BMI Calculator -->
    <BMICalc :open="bmiCalc">
      <template v-slot:toolbar-items>
        <v-btn icon @click="bmiCalc = false">
          <v-icon class="textColor--text">clear</v-icon>
        </v-btn>
      </template>
    </BMICalc>

    <!-- Pregnancy Calculator -->
    <PregnancyCalc :open="pregnancyCalc">
      <template v-slot:toolbar-items>
        <v-btn icon @click="pregnancyCalc = false">
          <v-icon class="textColor--text">clear</v-icon>
        </v-btn>
      </template>
    </PregnancyCalc>

    <!-- ABG Analyzer -->
    <ABG :open="abgAnalyzer">
      <template v-slot:toolbar-items>
        <v-btn icon @click="abgAnalyzer = false">
          <v-icon class="textColor--text">clear</v-icon>
        </v-btn>
      </template>
    </ABG>

    <!-- Randomizer -->
    <Randomizer :open="randomizer">
      <template v-slot:toolbar-items>
        <v-btn icon @click="randomizer = false">
          <v-icon class="textColor--text">clear</v-icon>
        </v-btn>
      </template>
    </Randomizer>
  </v-card>
</template>

<script>
import BMICalc from "@/components/chocobun_tools/BMICalc.vue";
import PregnancyCalc from "@/components/chocobun_tools/PregnancyCalc.vue";
import ABG from "@/components/chocobun_tools/ABG.vue";
import Randomizer from "@/components/chocobun_tools/Randomizer.vue";
import dialogHelper from "@/mixins/dialogHelper";

export default {
  mixins: [dialogHelper],
  components: { BMICalc, PregnancyCalc, ABG, Randomizer },
  data: () => ({
    tools: [
      { name: "BMI Calculator", icon: "fitness_center", opener: "bmiCalc" },
      {
        name: "Pregnancy Calculator",
        icon: "pregnant_woman",
        opener: "pregnancyCalc"
      },
      {
        name: "ABG Analyzer",
        icon: "airline_seat_individual_suite",
        opener: "abgAnalyzer"
      },
      {
        name: "Randomizer",
        icon: "casino",
        opener: "randomizer"
      }
    ],
    bmiCalc: false,
    pregnancyCalc: false,
    abgAnalyzer: false,
    randomizer: false,
    hashID: "Tools",
    watchDialogs: ["bmiCalc", "pregnancyCalc", "abgAnalyzer", "randomizer"]
  }),
  methods: {
    reroute(path) {
      this.$router.push(path).catch(err => {});
    },
    openTool(opener, name) {
      this[opener] = true;

      // Log to GA
      this.$gtag.event("open_tool", {
        event_category: "tools",
        event_label: name
      });
    }
  }
};
</script>
