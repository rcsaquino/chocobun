<template>
  <div>
    <v-card class="animate__animated animate__fadeInDown animate__faster">
      <v-list>
        <v-subheader>COURSES</v-subheader>
        <div class="listScroll">
          <transition-group enter-active-class="animate__animated animate__fadeIn animate__fast">
            <v-list-item
              v-for="course in courses"
              :key="course.id"
              @click="openSelectedCourseDialog(course)"
            >
              <v-list-item-icon>
                <v-icon>book</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ course.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </transition-group>
        </div>
      </v-list>
    </v-card>
    <v-card-text class="animate__animated animate__fadeInLeft animate__faster">
      <i>Tap the + icon to add a new course.</i>
    </v-card-text>
    <v-btn
      fixed
      fab
      color="secondary"
      class="fab animate__animated animate__slideInUp animate__faster"
      @click="openNewCourseDialog"
    >
      <v-icon class="textColor--text">add</v-icon>
    </v-btn>

    <!-- Add New Course Dialog Box -->
    <DialogBox
      :open="newCourseDialog"
      title="New Course"
      proceedText="Add"
      @cancel="closeNewCourseDialog"
      @proceed="addNewCourse"
    >
      <v-form ref="courseForm">
        <v-text-field
          v-model="newCourse.name"
          label="e.g. Anatomy, Patho"
          :rules="requiredField"
          autofocus
          color="accent"
        />
      </v-form>
    </DialogBox>

    <!-- Check if a course is selected before rendering to avoid errors -->
    <div v-if="courseIsSelected">
      <!-- Open Selected Course -->
      <SelectedCourse :open="selectedCourseDialog" :courseId="selectedCourse.id">
        <template v-slot:toolbar-items>
          <v-icon class="mr-2 textColor--text" @click="confirmDeleteDialog = true">delete</v-icon>
          <v-btn text class="textColor--text" @click="closeSelectedCourseDialog">Done</v-btn>
        </template>
      </SelectedCourse>

      <!-- Confirm Delete Dialog -->
      <DialogBox
        :open="confirmDeleteDialog"
        :title="'Delete ' + selectedCourse.name + '?'"
        proceedText="Ok"
        @cancel="deleteCourse(false)"
        @proceed="deleteCourse(true)"
      />
    </div>
  </div>
</template>

<script>
import DialogBox from "@/components/DialogBox.vue";
import store from "@/store";
import SelectedCourse from "@/components/SelectedCourse.vue";
import dialogHelper from "@/mixins/dialogHelper";

export default {
  mixins: [dialogHelper],
  components: { DialogBox, SelectedCourse },
  data: () => ({
    newCourse: {},
    newCourseDialog: false,
    selectedCourse: {},
    selectedCourseDialog: false,
    requiredField: [
      v => (!!v && v.toString().length > 0) || "Enter course name."
    ],
    confirmDeleteDialog: false,
    hashID: "Courses",
    watchDialogs: [
      "newCourseDialog",
      "selectedCourseDialog",
      "confirmDeleteDialog"
    ],
    dialogsWithClose: ["newCourseDialog"]
  }),
  computed: {
    courses() {
      return store.state.courses;
    },
    courseIsSelected() {
      return Object.keys(this.selectedCourse).length > 0;
    }
  },
  methods: {
    openNewCourseDialog() {
      this.newCourseDialog = true;
    },
    closeNewCourseDialog() {
      this.newCourseDialog = false;
      this.newCourse = {};
      this.$refs.courseForm.resetValidation();
    },
    addNewCourse() {
      if (this.$refs.courseForm.validate()) {
        this.newCourse.id =
          Math.random()
            .toString(36)
            .substring(2) + Date.now().toString(36);
        this.newCourse.syllabi = [];
        this.$store.commit("addCourse", this.newCourse);
        this.closeNewCourseDialog();
      }
    },
    deleteCourse(answer) {
      if (answer) {
        this.confirmDeleteDialog = false;
        this.closeSelectedCourseDialog();
        this.$store.commit("deleteCourse", this.selectedCourse);
      } else {
        this.confirmDeleteDialog = false;
      }
    },
    openSelectedCourseDialog(course) {
      this.selectedCourse = course;
      this.selectedCourseDialog = true;

      // Log to GA
      this.$gtag.event("open_course", {
        event_category: "courses",
        event_label: "Open Course"
      });
    },
    closeSelectedCourseDialog() {
      this.selectedCourseDialog = false;
    }
  }
};
</script>

<style scoped>
.fab {
  bottom: 75px;
  right: 20px;
}
.listScroll {
  max-height: 58vh;
  overflow-y: auto;
}
</style>
