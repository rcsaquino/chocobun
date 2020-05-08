<template>
  <v-dialog v-model="open" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Desired FiO2 Calculator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="toolbar-items"></slot>
        </v-toolbar-items>
      </v-toolbar>

      <!-- Desired FiO2 Calculator -->
      <div class="pa-3">
        <v-card class="mb-3 resultCard">
          <div>
            <v-card-title>
              Desired FiO
              <sub>2</sub>
              : {{ desired }}%
            </v-card-title>
          </div>
        </v-card>
        <v-card class="px-4 pt-2">
          <v-card-text>
            <v-form ref="desiredFioForm">
              <v-text-field
                v-model="age"
                label="Age"
                dense
                outlined
                suffix="y/o"
                :rules="requiredField"
              ></v-text-field>
              <v-text-field
                v-model="paco"
                label="PaCO2"
                dense
                outlined
                suffix="mmHg"
                :rules="requiredField"
              ></v-text-field>
              <v-text-field
                v-model="fio"
                label="Actual FiO2"
                dense
                outlined
                suffix="%"
                :rules="requiredField"
              ></v-text-field>
              <v-text-field
                v-model="pao"
                label="PaO2"
                dense
                outlined
                suffix="mmHg"
                :rules="requiredField"
              ></v-text-field>
            </v-form>
            <v-card-actions class="px-0 py-0 pb-2 buttons">
              <v-btn color="primary" @click="clear">Clear</v-btn>
              <v-btn color="primary" @click="compute">Compute</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </div>
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
  data: () => ({
    desired: 0,
    age: "",
    paco: "",
    fio: "",
    pao: "",
    requiredField: [v => !!v && v.toString().length > 0]
  }),
  methods: {
    compute() {
      if (this.$refs.desiredFioForm.validate()) {
        const a = 105 - this.age / 2;
        const b = this.paco / 0.8;
        const c = this.pao / (713 * this.fio - b);
        this.desired = Math.round((a / c + b) / 713);
      }
    },
    clear() {
      this.$refs.desiredFioForm.resetValidation();
      this.desired = 0;
      this.age = "";
      this.paco = "";
      this.fio = "";
      this.pao = "";
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
.resultCard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}
</style>