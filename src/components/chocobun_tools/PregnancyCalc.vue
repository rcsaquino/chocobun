<template>
  <v-dialog
    v-model="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary" class="textColor--text">
        <v-toolbar-title>Pregnancy Calculator</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="toolbar-items"></slot>
        </v-toolbar-items>
      </v-toolbar>

      <!-- Prgnancy Calculator -->
      <div class="pa-3">
        <v-card class="px-2 pt-3 mb-3">
          <v-card-text class="pt-2 pb-4">
            <div><strong>Age of Gestation:</strong> {{ aog }}</div>
            <div><strong>Estimated Date of Delivery:</strong></div>
            <ul>
              <li><strong>Naegele's Rule:</strong> {{ edd.naegele }}</li>
              <li><strong>280 Days Rule:</strong> {{ edd.days }}</li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card class="px-5 pt-8">
          <v-dialog
            ref="dialog"
            v-model="datePicker"
            :return-value.sync="lmp"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="lmp"
                label="First Day of LMP"
                prepend-inner-icon="event"
                readonly
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="lmp"
              :max="new Date().toISOString().substr(0, 10)"
            >
              <v-spacer></v-spacer>
              <v-btn text color="secondary" @click="datePicker = false"
                >Cancel</v-btn
              >
              <v-btn text color="secondary" @click="$refs.dialog.save(lmp)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-dialog>
        </v-card>
      </div>
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
      default: false,
    },
  },
  data: () => ({
    lmp: new Date().toISOString().substr(0, 10),
    datePicker: false,
    hashID: "PregnancyCalc",
    watchDialogs: ["datePicker"],
  }),
  computed: {
    // Age of Gestation
    aog() {
      let ms = Date.now() - new Date(this.lmp).getTime();
      const days = Math.floor(ms / 86400000);
      const weeks = Math.floor(days / 7);
      const remainderDays = days % 7;
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} & ${remainderDays} ${
        remainderDays === 1 ? "day" : "days"
      }`;
    },
    // Estimated Date of Delivery
    edd() {
      let date = new Date(this.lmp);
      const results = {};
      // Naegele's Rule
      results.naegele = new Date(date.setDate(date.getDate() + 7));
      results.naegele = new Date(date.setMonth(date.getMonth() + 9))
        .toISOString()
        .substr(0, 10);
      // 280 Days Rule
      date = new Date(this.lmp);
      results.days = new Date(date.setDate(date.getDate() + 280))
        .toISOString()
        .substr(0, 10);
      return results;
    },
  },
};
</script>
