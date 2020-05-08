<template>
  <v-card class="animated fadeInDown faster">
    <v-list>
      <v-subheader>TOOLS</v-subheader>
      <v-list-item v-for="(tool, index) in tools" :key="index" @click="openTool(tool.opener)">
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
          <v-icon>clear</v-icon>
        </v-btn>
      </template>
    </BMICalc>

    <!-- Pregnancy Calculator -->
    <PregnancyCalc :open="pregnancyCalc">
      <template v-slot:toolbar-items>
        <v-btn icon @click="pregnancyCalc = false">
          <v-icon>clear</v-icon>
        </v-btn>
      </template>
    </PregnancyCalc>

    <!-- Desired FiO2 Calculator -->
    <DesiredFiO :open="fioCalc">
      <template v-slot:toolbar-items>
        <v-btn icon @click="fioCalc = false">
          <v-icon>clear</v-icon>
        </v-btn>
      </template>
    </DesiredFiO>
  </v-card>
</template>

<script>
import BMICalc from "@/components/chocobun_tools/BMICalc.vue";
import PregnancyCalc from "@/components/chocobun_tools/PregnancyCalc.vue";
import DesiredFiO from "@/components/chocobun_tools/DesiredFiO.vue";

export default {
  components: { BMICalc, PregnancyCalc, DesiredFiO },
  data: () => ({
    tools: [
      { name: "BMI Calculator", icon: "fitness_center", opener: "bmiCalc" },
      {
        name: "Pregnancy Calculator",
        icon: "pregnant_woman",
        opener: "pregnancyCalc"
      },
      {
        name: "Desired FiO2 Calculator",
        icon: "airline_seat_individual_suite",
        opener: "fioCalc"
      }
    ],
    bmiCalc: false,
    pregnancyCalc: false,
    fioCalc: false
  }),
  methods: {
    reroute(path) {
      this.$router.push(path).catch(err => {});
    },
    openTool(opener) {
      this[opener] = true;
    }
  }
};
</script>
