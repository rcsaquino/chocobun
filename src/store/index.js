import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    courses: [],
    swStatus: "Loading..."
  },
  mutations: {
    addCourse(state, newCourse) {
      state.courses.push(newCourse);
    },
    updateCourse(state, updatedCourse) {
      const index = state.courses.findIndex(
        course => course.id === updatedCourse.id
      );
      state.courses.splice(index, 1, updatedCourse);
    },
    deleteCourse(state, courseToDelete) {
      state.courses = state.courses.filter(
        course => course.id !== courseToDelete.id
      );
    },
    serviceWorker(state, val) {
      state.swStatus = val;
    }
  }
});
