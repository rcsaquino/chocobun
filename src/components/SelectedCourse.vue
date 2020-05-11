<template>
  <v-dialog v-model="open" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ course.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="toolbar-items"></slot>
        </v-toolbar-items>
      </v-toolbar>
      <!-- List Syllabi -->
      <v-expansion-panels accordion v-model="selectedPanel">
        <v-expansion-panel v-for="syllabus in course.syllabi" :key="syllabus.id">
          <v-expansion-panel-header>
            <v-row no-gutters>
              <v-col cols="5">{{ syllabus.name }} ({{ syllabus.weight }}%)</v-col>
              <v-col
                cols="7"
                class="text--secondary"
              >Transmuted Grade: {{ syllabus.transmutedGrade }}</v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <SelectedSyllabus :courseId="course.id" :syllabusId="syllabus.id" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-text class="px-4 pt-4" v-if="!syllabiExists">
        <i>Tap the + icon to add a new syllabus.</i>
      </v-card-text>
      <div class="px-5 pt-4" v-else>
        <v-chip class="finalGradePill" color="primary">Final Grade: {{ finalGrade }}</v-chip>
      </div>

      <v-btn fixed bottom right fab dark color="secondary" @click="openNewSyllabusDialog">
        <v-icon>add</v-icon>
      </v-btn>

      <!-- Add New Syllabus Dialog Box -->
      <DialogBox
        :open="newSyllabusDialog"
        title="New Syllabus"
        proceedText="Add"
        @proceed="addNewSyllabus"
        @cancel="closeNewSyllabusDialog"
      >
        <v-form ref="syllabusForm">
          <v-text-field
            v-model="newSyllabus.name"
            label="e.g. Quiz, Attendance"
            autofocus
            :rules="requiredField"
            color="accent"
          />
          <v-text-field
            v-model="newSyllabus.weight"
            label="Weight"
            suffix="%"
            type="number"
            class="weightFieldWidth"
            :rules="numbersOnly"
            color="accent"
          />
        </v-form>
      </DialogBox>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogBox from "./DialogBox.vue";
import SelectedSyllabus from "./SelectedSyllabus.vue";
import store from "@/store";
import dialogHelper from "@/mixins/dialogHelper";

export default {
  mixins: [dialogHelper],
  components: {
    DialogBox,
    SelectedSyllabus
  },
  props: {
    courseId: {
      type: String,
      required: true
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    selectedPanel: "",
    newSyllabusDialog: false,
    hashID: "SelectedCourse",
    watchDialogs: ["newSyllabusDialog"],
    dialogsWithClose: ["newSyllabusDialog"],
    newSyllabus: {},
    requiredField: [
      v => (v && v.toString().length > 0) || "Enter syllabus name."
    ],
    numbersOnly: [v => (v && !isNaN(v)) || "Input weight."]
  }),
  watch: {
    open(isOpen) {
      if (!isOpen) {
        this.selectedPanel = "";
      }
    }
  },
  computed: {
    course() {
      // Will return undefined if ID is not found
      const course = store.state.courses.find(
        course => course.id === this.courseId
      );
      // Return an empty object if undefined to avoid rendering errors
      return course ? course : {};
    },
    syllabiExists() {
      return this.course.syllabi?.length > 0;
    },
    finalGrade() {
      let finalGrade = 0;
      this.course.syllabi?.forEach(syllabus => {
        finalGrade += (syllabus.transmutedGrade * syllabus.weight) / 100;
      });
      finalGrade = Math.round(finalGrade * 100) / 100;
      return finalGrade;
    }
  },
  methods: {
    addNewSyllabus() {
      if (this.$refs.syllabusForm.validate()) {
        // Add props to new syllabus
        this.newSyllabus.id =
          Math.random()
            .toString(36)
            .substring(2) + Date.now().toString(36);
        this.newSyllabus.transmutedGrade = 0;
        this.newSyllabus.scores = [];

        // Update course to add new syllabus
        const updatedCourse = this.course;
        updatedCourse.syllabi.push(this.newSyllabus);

        // Commit the updated course then close the dialog
        this.$store.commit("updateCourse", updatedCourse);
        this.closeNewSyllabusDialog();
      }
    },
    openNewSyllabusDialog() {
      this.newSyllabusDialog = true;
    },
    closeNewSyllabusDialog() {
      this.newSyllabusDialog = false;
      this.newSyllabus = {};
      this.$refs.syllabusForm.resetValidation();
    }
  }
};
</script>

<style scoped>
.weightFieldWidth {
  width: 70px;
}
.finalGradePill {
  width: 100%;
  justify-content: center;
}
</style>
