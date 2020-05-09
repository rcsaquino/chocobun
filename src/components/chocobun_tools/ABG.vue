<template>
  <v-dialog v-model="open" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>ABG Analyzer</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="toolbar-items"></slot>
        </v-toolbar-items>
      </v-toolbar>

      <!-- ABG Analyzer -->
      <v-card class="mb-3">
        <v-dialog v-model="openResults">
          <v-card>
            <v-card-text class="pt-3 pb-0 px-2">
              <div>
                <div class="px-2 pb-2">
                  <h5>Arterial Blood Gas Analysis</h5>
                  <div>{{ findings }}</div>
                  <div v-for="data in interpretation" :key="data.label">
                    <div>{{ data.label }}: {{ data.value }}{{ data.suffix }}</div>
                  </div>
                </div>
                <v-divider />
              </div>
              <v-simple-table dense v-if="dataForTable.length > 0">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Value</th>
                      <th>Normal</th>
                    </tr>
                  </thead>
                  <tbody v-for="item in dataForTable" :key="item.label">
                    <tr>
                      <td>{{ item.label }}</td>
                      <td>{{ item.value }}</td>
                      <td>{{ item.nv }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-divider></v-divider>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="secondary" @click="openResults = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card-text>
          <v-text-field v-model="age" type="number" label="Age" dense outlined suffix="y/o"></v-text-field>
          <v-text-field v-model="ph" type="number" label="pH" dense outlined></v-text-field>
          <v-text-field v-model="parco" type="number" label="PaCO2" dense outlined suffix="mmHg"></v-text-field>
          <v-text-field
            v-model="cparo"
            type="number"
            label="Current PaO2"
            dense
            outlined
            suffix="mmHg"
          ></v-text-field>
          <v-text-field v-model="hco" type="number" label="HCO3" dense outlined suffix="mmol/L"></v-text-field>
          <v-text-field v-model="cfio" type="number" label="Current FiO2" dense outlined suffix="%"></v-text-field>
          <v-card-actions class="px-0 py-0 pb-2 buttons">
            <v-btn color="primary" @click="clear">Clear</v-btn>
            <v-btn color="primary" @click="analyze">Analyze</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  // ar = arterial; al = alveolar
  // c = current; d = desired
  // all "2" in "O2" is removed
  data: () => ({
    openResults: false,
    age: "",
    ph: "",
    parco: "",
    cparo: "",
    hco: "",
    cfio: "",
    analyzed: [],
    findings: ""
  }),
  computed: {
    interpretation() {
      const filtered = this.analyzed.filter(data =>
        data.label.includes("Desired")
      );
      return filtered;
    },
    dataForTable() {
      const filtered = this.analyzed.filter(
        data => !data.label.includes("Desired")
      );
      return filtered;
    }
  },
  methods: {
    analyze() {
      // Reset previous analysis and findings
      this.analyzed = [];
      this.findings = "";

      // Interpret Inputs
      if (this.ph) {
        const ph = {};
        ph.label = "pH";
        ph.value = this.ph;
        ph.nv = "7.35-7.45";
        this.analyzed.push(ph);
      }
      if (this.parco) {
        const parco = {};
        parco.label = "PaCO2";
        parco.value = this.parco;
        parco.nv = "35-45";
        this.analyzed.push(parco);
      }
      if (this.cparo) {
        const cparo = {};
        cparo.label = "PaO2";
        cparo.value = this.cparo;
        if (this.age >= 60) {
          cparo.nv = "80-100";
        } else {
          let x = Math.round(104 - this.age * 0.43);
          x < 80 && (x = 80);
          x > 100 && (x = 100);
          cparo.nv = "≥" + x;
        }
        this.analyzed.push(cparo);
      }
      if (this.hco) {
        const hco = {};
        hco.label = "HCO3";
        hco.value = this.hco;
        hco.nv = "22-26";
        this.analyzed.push(hco);
      }

      // Analyze acid base balance
      if (this.ph && this.parco && this.hco) {
        // Initialize variables
        const acidotic = this.ph < 7.4;
        const alkalotic = this.ph > 7.4;
        const acidPh = this.ph < 7.35;
        const alkPh = this.ph > 7.45;
        const acidRespi = this.parco > 45;
        const alkRespi = this.parco < 35;
        const normRespi = !acidRespi && !alkRespi;
        const acidMetab = this.hco < 22;
        const alkMetab = this.hco > 26;
        const normMetab = !acidMetab && !alkMetab;

        // Uncompensated
        if (normMetab || normRespi) {
          // Respiratory Acidosis
          if (acidPh && acidRespi) {
            this.findings = "Uncompensated Respiratory Acidosis";
          }
          // Metabolic Acidosis
          if (acidPh && acidMetab) {
            this.findings = "Uncompensated Metabolic Acidosis";
          }
          // Respiratory Alkalosis
          if (alkPh && alkRespi) {
            this.findings = "Uncompensated Respiratory Alkalosis";
          }
          // Metabolic Alkalosis
          if (alkPh && alkMetab) {
            this.findings = "Uncompensated Metabolic Alkalosis";
          }
        }

        // Partially Compensated Acidosis
        if (acidPh) {
          // Respiratory
          if (acidRespi && alkMetab) {
            this.findings = "Partially Compensated Respiratory Acidosis";
          }
          // Metabolic
          if (acidMetab && alkRespi) {
            this.findings = "Partially Compensated Metabolic Acidosis";
          }
        }

        // Partially Compensated Alkalosis
        if (alkPh) {
          // Respiratory
          if (alkRespi && acidMetab) {
            this.findings = "Partially Compensated Respiratory Alkalosis";
          }
          // Metabolic
          if (alkMetab && acidRespi) {
            this.findings = "Partially Compensated Metabolic Alkalosis";
          }
        }

        // Fully Compensated
        if (!acidPh && !alkPh) {
          // Acidosis
          if (acidotic) {
            // Respiratory
            if (acidRespi && alkMetab) {
              this.findings = "Fully Compensated Respiratory Acidosis";
            }
            // Metabolic
            if (acidMetab && alkRespi) {
              this.findings = "Fully Compensated Metabolic Acidosis";
            }
          }
          //Alkalosis
          if (alkalotic) {
            // Respiratory
            if (alkRespi && acidMetab) {
              this.findings = "Fully Compensated Respiratory Alkalosis";
            }
            // Metabolic
            if (alkMetab && acidRespi) {
              this.findings = "Fully Compensated Metabolic Alkalosis";
            }
          }
        }

        // Combined Acidosis
        if (acidotic && acidRespi && acidMetab) {
          this.findings = "Combined Respiratory & Metabolic Acidosis";
        }

        // Combined Alkalosis
        if (alkalotic && alkRespi && alkMetab) {
          this.findings = "Combined Respiratory & Metabolic Alkalosis";
        }
      }

      // Compute for Desired PaO2
      if (this.age) {
        // Set variables
        const dparo = {};
        dparo.label = "Desired PaO2";
        dparo.suffix = ` mmHg (${this.age} y/o)`;

        // Compute
        if (this.age >= 60) {
          dparo.value = 80 - (this.age - 60);
        } else {
          let x = Math.round(104 - this.age * 0.43);
          x < 80 && (x = 80);
          x > 100 && (x = 100);
          dparo.value = x;
        }
        dparo.value = dparo.value.toFixed(1);

        // Push to table
        this.analyzed.push(dparo);
      }

      // Compute for PAO2 (don't push to table)
      if (this.cfio && this.parco) {
        // Compute
        const palo = (this.cfio / 100) * 713 - this.parco / 0.8;

        // Compute for aAO2, p(A-a)O2 => (Nested in palo)
        if (this.cparo) {
          // Set variables
          const aao = {};
          aao.label = "aAO2";
          aao.nv = "0.75-0.80";
          const paao = {};
          paao.label = "p(A-a)O2";
          if (this.age >= 40) {
            const nv = Math.floor(this.age / 10) * 3 + 15;
            paao.nv = `${nv - 5}-${nv + 5}`;
          } else {
            paao.nv = "10-20";
          }

          // Compute
          aao.value = (this.cparo / palo).toFixed(2);
          paao.value = (palo - this.cparo).toFixed(1);

          //Push to table
          this.analyzed.push(aao);
          this.analyzed.push(paao);

          // Compute for Desired FiO2 => Nested in aao
          const val = this.analyzed.find(x => x.label === "Desired PaO2");
          if (val) {
            // Set Variables
            const dfio = {};
            dfio.label = "Desired FiO2";
            dfio.suffix = "%";

            // Compute
            dfio.value = (
              ((val.value / aao.value + this.parco / 0.8) / 713) *
              100
            ).toFixed(1);

            // Push to table
            this.analyzed.push(dfio);
          }
        }
      }

      // Compute for P/F
      if (this.cparo && this.cfio) {
        // Set variables
        const pf = {};
        pf.label = "P/F";
        if (this.age <= 60) {
          pf.nv = "400-500";
        } else if (this.age > 60) {
          pf.nv = "> " + (400 - (this.age - 60) * 5);
        }

        //Compute
        pf.value = (this.cparo / (this.cfio / 100)).toFixed(1);

        // Push to table
        this.analyzed.push(pf);
      }
      if (this.analyzed.length > 0) {
        this.openResults = true;
      }
    },
    clear() {
      this.age = "";
      this.ph = "";
      this.parco = "";
      this.cparo = "";
      this.hco = "";
      this.cfio = "";
      this.analyzed = [];
      this.findings = "";
    }
  }
};
</script>

<style scoped>
.buttons {
  display: grid;
  grid-template-columns: 48% 48%;
  justify-content: space-between;
}
</style>
