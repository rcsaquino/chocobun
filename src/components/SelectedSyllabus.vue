<template>
  <div>
    <v-card>
      <v-simple-table>
        <tbody>
          <tr v-for="(score, index) in syllabus.scores" :key="score.id">
            <td>
              <v-row no-gutters>
                <v-col cols="5">{{ syllabus.name }} {{ index + 1 }}</v-col>
                <v-col cols="6">{{ score.yourScore }}/{{ score.totalItems }}</v-col>
                <v-col cols="1" @click="deleteScore(score.id)">&#10005;</v-col>
              </v-row>
            </td>
          </tr>
          <tr>
            <td>
              <v-row no-gutters class="pt-7">
                <v-col>
                  <v-select
                    v-model="baseSelection"
                    :items="baseSelections"
                    label="Grading System"
                    outlined
                  />
                </v-col>
                <v-col align="end">
                  <v-btn
                    color="scoresBtn"
                    @click="openNewScoreDialog"
                    class="baseWidth"
                    outlined
                  >Add</v-btn>
                  <v-btn
                    color="scoresBtn"
                    x-small
                    class="baseWidth"
                    outlined
                    @click="confirmClearDialog = true"
                  >Clear</v-btn>
                </v-col>
              </v-row>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
    <v-row justify="center" class="mt-4 py-1">
      <v-btn text color="accent" @click="confirmDeleteDialog = true">Delete Syllabus</v-btn>
    </v-row>
    <DialogBox
      :open="newScoreDialog"
      :title="'New ' + syllabus.name"
      proceedText="Add"
      @cancel="closeNewScoreDialog"
      @proceed="addNewScore"
    >
      <v-form ref="scoreForm">
        <v-text-field
          v-model="newScore.yourScore"
          type="number"
          label="Your Score"
          :rules="numbersOnly"
          autofocus
          color="accent"
        />
        <v-text-field
          v-model="newScore.totalItems"
          type="number"
          label="Total Items"
          :rules="numbersOnly"
          color="accent"
        />
      </v-form>
    </DialogBox>

    <!-- Confirm Delete Dialog -->
    <DialogBox
      :open="confirmDeleteDialog"
      :title="'Delete ' + syllabus.name + '?'"
      proceedText="Ok"
      @cancel="deleteSyllabus(false)"
      @proceed="deleteSyllabus(true)"
    />

    <!-- Confirm Clear Dialog -->
    <DialogBox
      :open="confirmClearDialog"
      title="Clear Scores?"
      proceedText="Ok"
      @cancel="clearScores(false)"
      @proceed="clearScores(true)"
    >This will clear all {{ syllabus.name }} scores.</DialogBox>
  </div>
</template>

<script>
import DialogBox from "./DialogBox.vue";
import Vue from "vue";
import store from "@/store";
import TransmuteMixin from "@/mixins/TransmuteMixin.js";
import dialogHelper from "@/mixins/dialogHelper";

export default {
  props: {
    courseId: {
      type: String,
      required: true
    },
    syllabusId: {
      type: String,
      required: true
    }
  },
  components: {
    DialogBox
  },
  mixins: [TransmuteMixin, dialogHelper],
  data: () => ({
    newScoreDialog: false,
    baseSelection: 65,
    baseSelections: [
      { text: "Base 65", value: 65 },
      { text: "Base 60", value: 60 },
      { text: "Base 50", value: 50 }
    ],
    newScore: {},
    numbersOnly: [v => (v && !isNaN(v)) || "Please input numbers."],
    confirmDeleteDialog: false,
    confirmClearDialog: false,
    hashID: "SelectedSyllabus",
    watchDialogs: [
      "newScoreDialog",
      "confirmDeleteDialog",
      "confirmClearDialog"
    ],
    dialogsWithClose: ["newScoreDialog"]
  }),
  computed: {
    course() {
      return store.state.courses.find(course => course.id === this.courseId);
    },
    syllabus() {
      return this.course.syllabi.find(
        syllabus => syllabus.id === this.syllabusId
      );
    }
  },
  watch: {
    baseSelection(base) {
      // Retransmute syllabus
      let updatedSyllabus = this.syllabus;
      updatedSyllabus = this.transmute_syllabus(updatedSyllabus, base);
      // Update and commit course
      this.updateCourse(updatedSyllabus);
    }
  },
  methods: {
    openNewScoreDialog() {
      this.newScoreDialog = true;
    },
    closeNewScoreDialog() {
      this.newScoreDialog = false;
      this.newScore = {};
      this.$refs.scoreForm.resetValidation();
    },
    addNewScore() {
      if (this.$refs.scoreForm.validate()) {
        // Add a key to new score
        this.newScore.id =
          Math.random()
            .toString(36)
            .substring(2) + Date.now().toString(36);

        // Update syllabus to add new score
        let updatedSyllabus = this.syllabus;
        updatedSyllabus.scores.push(this.newScore);

        // Transmute syllabus
        updatedSyllabus = this.transmute_syllabus(
          updatedSyllabus,
          this.baseSelection
        );

        // // Update and commit course, and close dialod
        this.updateCourse(updatedSyllabus);
        this.closeNewScoreDialog();
      }
    },
    deleteSyllabus(answer) {
      if (answer) {
        this.confirmDeleteDialog = false;
        const updatedCourse = this.course;
        updatedCourse.syllabi = updatedCourse.syllabi.filter(
          oldSyllabus => oldSyllabus.id !== this.syllabus.id
        );
        this.$store.commit("updateCourse", updatedCourse);
      } else {
        this.confirmDeleteDialog = false;
      }
    },
    clearScores(answer) {
      if (answer) {
        this.confirmClearDialog = false;
        // Update syllabus with cleared scores
        const updatedSyllabus = this.syllabus;
        updatedSyllabus.scores = [];
        updatedSyllabus.transmutedGrade = 0;

        // Update and commit course
        this.updateCourse(updatedSyllabus);
      } else {
        this.confirmClearDialog = false;
      }
    },
    deleteScore(scoreKey) {
      // Delete score and update syllabus
      let updatedSyllabus = this.syllabus;
      updatedSyllabus.scores = updatedSyllabus.scores.filter(
        score => score.id !== scoreKey
      );

      // Transmute syllabus
      updatedSyllabus = this.transmute_syllabus(
        updatedSyllabus,
        this.baseSelection
      );

      // Update and commit course
      this.updateCourse(updatedSyllabus);
    },
    updateCourse(updatedSyllabus) {
      // Update course with updated syllabus
      const updatedCourse = this.course;
      const index = updatedCourse.syllabi.findIndex(
        syllabus => syllabus.id === updatedSyllabus.id
      );
      updatedCourse.syllabi.splice(index, 1, updatedSyllabus);

      // Commit updated course
      this.$store.commit("updateCourse", updatedCourse);
    }
  }
};
</script>

<style scoped>
.baseWidth {
  width: 90%;
}
</style>
