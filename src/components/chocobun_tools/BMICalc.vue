<template>
  <v-dialog v-model="open" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>BMI Calculator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="toolbar-items"></slot>
        </v-toolbar-items>
      </v-toolbar>

      <!-- BMI Calculator -->
      <v-card tile>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab>Adult</v-tab>
          <v-tab>Child</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <!-- Adult Tab -->
          <v-tab-item>
            <v-dialog v-model="openAdultResult">
              <v-card>
                <v-card-title>Results</v-card-title>
                <v-card-text class="px-2 pb-0">
                  <v-simple-table dense>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td>BMI</td>
                          <td>{{ adultBMI }}</td>
                        </tr>
                        <tr>
                          <td>Asia Classification</td>
                          <td>{{ adultAsia }}</td>
                        </tr>
                        <tr>
                          <td>WHO Classification</td>
                          <td>{{ adultWHO }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="secondary" @click="openAdultResult = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-card flat class="pa-5">
              <v-form ref="adultForm">
                <v-radio-group v-model="adultHtUnit" dense row class="mt-0 pt-0">
                  <v-radio value="cm" label="Centimeters" />
                  <v-radio value="ft" label="Feet, inches" />
                </v-radio-group>
                <div class="height">
                  <v-text-field
                    v-model="adultHeight"
                    outlined
                    dense
                    label="Height"
                    type="number"
                    :suffix="adultHtUnit"
                    :rules="numbersOnly"
                  ></v-text-field>
                  <v-text-field
                    v-model="adultInches"
                    outlined
                    dense
                    suffix="in"
                    type="number"
                    v-if="adultHtUnit === 'ft'"
                    :rules="numbersOnly"
                  ></v-text-field>
                </div>
                <v-radio-group v-model="adultWtUnit" dense row class="mt-0 pt-0">
                  <v-radio value="kg" label="Kilograms" />
                  <v-radio value="lbs" label="Pounds" />
                </v-radio-group>
                <v-text-field
                  v-model="adultWeight"
                  outlined
                  dense
                  label="Weight"
                  type="number"
                  :suffix="adultWtUnit"
                  :rules="numbersOnly"
                ></v-text-field>
              </v-form>
              <v-card-actions class="ma-0 pa-0">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="clearAdult">Clear</v-btn>
                <v-btn text color="primary" @click="computeAdult">Compute</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>

          <!-- Child Tab -->
          <v-tab-item>
            <v-dialog v-model="openChildResult">
              <v-card>
                <v-card-title>Results</v-card-title>
                <v-card-text class="px-2 pb-0">
                  <v-simple-table dense>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td>Age</td>
                          <td>{{ childAge }}</td>
                        </tr>
                        <tr>
                          <td>BMI</td>
                          <td>{{ childBMI }}</td>
                        </tr>
                        <tr>
                          <td>Percentile</td>
                          <td>
                            <span>{{ childPercentile.percent }}</span>
                            <sup>{{ childPercentile.suffix }}</sup>
                          </td>
                        </tr>
                        <tr>
                          <td>ZScore</td>
                          <td>{{ childZScore }}</td>
                        </tr>
                        <tr>
                          <td>Classification</td>
                          <td>{{ childClassify }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="secondary" @click="openChildResult = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-card flat class="pa-5">
              <v-form ref="childForm">
                <div class="bday-and-sex">
                  <v-select v-model="childSex" :items="sex" label="Sex" dense outlined></v-select>
                  <v-dialog
                    ref="dialog"
                    v-model="datePicker"
                    :return-value.sync="childBirthday"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="childBirthday"
                        label="Birthday"
                        prepend-inner-icon="event"
                        readonly
                        v-on="on"
                        dense
                        outlined
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="childBirthday"
                      :max="
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 2)
                        )
                          .toISOString()
                          .substr(0, 10)
                      "
                      :min="
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 20)
                        )
                          .toISOString()
                          .substr(0, 10)
                      "
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="secondary" @click="datePicker = false">Cancel</v-btn>
                      <v-btn text color="secondary" @click="$refs.dialog.save(childBirthday)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </div>
                <v-radio-group v-model="childHtUnit" dense row class="mt-0 pt-0">
                  <v-radio value="cm" label="Centimeters" />
                  <v-radio value="ft" label="Feet, inches" />
                </v-radio-group>
                <div class="height">
                  <v-text-field
                    v-model="childHeight"
                    outlined
                    dense
                    label="Height"
                    type="number"
                    :suffix="childHtUnit"
                    :rules="numbersOnly"
                  ></v-text-field>
                  <v-text-field
                    v-model="childInches"
                    outlined
                    dense
                    suffix="in"
                    type="number"
                    v-if="childHtUnit === 'ft'"
                    :rules="numbersOnly"
                  ></v-text-field>
                </div>
                <v-radio-group v-model="childWtUnit" dense row class="mt-0 pt-0">
                  <v-radio value="kg" label="Kilograms" />
                  <v-radio value="lbs" label="Pounds" />
                </v-radio-group>
                <v-text-field
                  v-model="childWeight"
                  outlined
                  dense
                  label="Weight"
                  type="number"
                  :suffix="childWtUnit"
                  :rules="numbersOnly"
                ></v-text-field>
              </v-form>
              <v-card-actions class="ma-0 pa-0">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="clearChild">Clear</v-btn>
                <v-btn text color="primary" @click="computeChild">Compute</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import dialogHelper from "@/mixins/dialogHelper";

export default {
  mixins: [dialogHelper],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    tab: 0,
    sex: [
      { text: "Male", value: 1 },
      { text: "Female", value: 2 }
    ],
    openAdultResult: false,
    openChildResult: false,
    datePicker: false,
    hashID: "BMICalc",
    watchDialogs: ["openAdultResult", "openChildResult", "datePicker"],
    adultHtUnit: "cm",
    adultWtUnit: "kg",
    adultBMI: "",
    adultAsia: "",
    adultWHO: "",
    adultHeight: "",
    adultInches: "",
    adultWeight: "",
    childHtUnit: "cm",
    childWtUnit: "kg",
    childHeight: "",
    childInches: "",
    childWeight: "",
    childSex: 1,
    childAge: "",
    childBMI: "",
    childPercentile: {},
    childZScore: "",
    childClassify: "",
    childBirthday: new Date(
      new Date().setFullYear(new Date().getFullYear() - 2)
    )
      .toISOString()
      .substr(0, 10),
    numbersOnly: [v => v && !isNaN(v)]
  }),
  methods: {
    computeBMI(wtUnit, wt, htUnit, ht, inch) {
      let m, kg;
      // Convert height to meters
      if (htUnit === "cm") {
        m = ht * 0.01;
      } else {
        m = (ht * 12 + +inch) * 0.0254;
      }
      // Convert weight to kg
      if (wtUnit === "kg") {
        kg = wt;
      } else {
        kg = wt * 0.45359237;
      }
      const bmi = (kg / m ** 2).toFixed(1);
      return bmi;
    },
    zscoreToPercentile(zscore) {
      // zscore is the number of standard deviations from the mean

      // If zscore is greater than 6.5 standard deviations from the mean,
      // The number of significant digits will be outside of a reasonable range
      if (zscore < -6.5) return 0.0;
      if (zscore > 6.5) return 1.0;

      let factK = 1;
      let sum = 0;
      let term = 1;
      let k = 0;
      const loopStop = Math.exp(-23);
      while (Math.abs(term) > loopStop) {
        term =
          (((0.3989422804 * Math.pow(-1, k) * Math.pow(zscore, k)) /
            (2 * k + 1) /
            Math.pow(2, k)) *
            Math.pow(zscore, k + 1)) /
          factK;
        sum += term;
        k++;
        factK *= k;
      }
      sum += 0.5;

      return sum;
    },
    computeAdult() {
      if (this.$refs.adultForm.validate()) {
        // Compute BMI
        this.adultBMI = this.computeBMI(
          this.adultWtUnit,
          this.adultWeight,
          this.adultHtUnit,
          this.adultHeight,
          this.adultInches
        );
        // Classify BMI
        if (this.adultBMI < 18.5) {
          this.adultAsia = "Underweight";
          this.adultWHO = "Underweight";
        } else if (this.adultBMI < 23) {
          this.adultAsia = "Normal";
          this.adultWHO = "Normal";
        } else if (this.adultBMI < 25) {
          this.adultAsia = "Overweight";
          this.adultWHO = "Normal";
        } else if (this.adultBMI < 30) {
          this.adultAsia = "Obese";
          this.adultWHO = "Overweight";
        } else if (this.adultBMI < 35) {
          this.adultAsia = "Obese";
          this.adultWHO = "Obese class I";
        } else if (this.adultBMI < 40) {
          this.adultAsia = "Obese";
          this.adultWHO = "Obese class II";
        } else {
          this.adultAsia = "Obese";
          this.adultWHO = "Obese class III";
        }
        this.openAdultResult = true;
      }
    },
    clearAdult() {
      this.$refs.adultForm.resetValidation();
      this.adultHtUnit = "cm";
      this.adultWtUnit = "kg";
      this.adultBMI = "";
      this.adultAsia = "";
      this.adultWHO = "";
      this.adultHeight = "";
      this.adultInches = "";
      this.adultWeight = "";
    },
    computeChild() {
      if (this.$refs.childForm.validate()) {
        // Compute BMI
        this.childBMI = this.computeBMI(
          this.childWtUnit,
          this.childWeight,
          this.childHtUnit,
          this.childHeight,
          this.childInches
        );

        // Determine age
        const ms = new Date() - new Date(this.childBirthday);
        const mos = Math.floor(ms / 2629746000);
        const yrs = Math.floor(mos / 12);
        let remainderMos = mos % 12;
        this.childAge = `${yrs} years & ${remainderMos} ${
          remainderMos === 1 ? "month" : "months"
        }`;

        // Calculate ZScore
        const data = require("@/assets/BMI/LMS.json");
        const lms = data.find(x => x.sex === this.childSex && x.mos === mos);
        const rawZScore =
          ((this.childBMI / lms.m) ** lms.l - 1) / (lms.l * lms.s);
        this.childZScore = rawZScore.toFixed(2);

        // Calculate Percentile
        const rawPercentile = Math.round(
          this.zscoreToPercentile(rawZScore) * 100
        );
        // Append ordinal suffix
        let ordinalSuffix;
        const digits = rawPercentile
          .toString()
          .split("")
          .reverse();
        if (digits[1] !== "1") {
          switch (digits[0]) {
            case "1":
              ordinalSuffix = "st";
              break;
            case "2":
              ordinalSuffix = "nd";
              break;
            case "3":
              ordinalSuffix = "rd";
              break;
            default:
              ordinalSuffix = "th";
          }
        } else {
          ordinalSuffix = "th";
        }
        this.childPercentile.percent = rawPercentile;
        this.childPercentile.suffix = ordinalSuffix;

        // Classify
        if (rawPercentile < 5) {
          this.childClassify = "Underweight";
        } else if (rawPercentile < 85) {
          this.childClassify = "Normal";
        } else if (rawPercentile < 95) {
          this.childClassify = "Overweight";
        } else {
          this.childClassify = "Obese";
        }
        this.openChildResult = true;
      }
    },
    clearChild() {
      this.$refs.childForm.resetValidation();
      this.childHtUnit = "cm";
      this.childWtUnit = "kg";
      this.childHeight = "";
      this.childInches = "";
      this.childWeight = "";
      this.childSex = 1;
      this.childAge = "";
      this.childBMI = "";
      this.childPercentile = {};
      this.childZScore = "";
      this.childClassify = "";
      this.childBirthday = new Date(
        new Date().setFullYear(new Date().getFullYear() - 2)
      )
        .toISOString()
        .substr(0, 10);
    }
  }
};
</script>

<style scoped>
.height {
  display: grid;
  grid-auto-flow: column;
}
.bday-and-sex {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-template-columns: 37% 58%;
  justify-content: space-between;
}
</style>
