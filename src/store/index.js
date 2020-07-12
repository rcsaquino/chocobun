import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    courses: [],
    lists: [],
    swStatus: "Loading...",
    canChangeHash: true,
  },
  mutations: {
    // Courses
    addCourse(state, newCourse) {
      // Add new course at the beginning of the array
      state.courses.unshift(newCourse);
    },
    updateCourse(state, updatedCourse) {
      const index = state.courses.findIndex(
        (course) => course.id === updatedCourse.id
      );
      state.courses.splice(index, 1, updatedCourse);
    },
    deleteCourse(state, courseToDelete) {
      state.courses = state.courses.filter(
        (course) => course.id !== courseToDelete.id
      );
    },

    // Lists
    addList(state, newList) {
      // Add new list at the beginning of the array
      state.lists.unshift(newList);
    },
    deleteList(state, listToDelete) {
      state.lists = state.lists.filter((list) => list.id !== listToDelete.id);
    },

    // App
    serviceWorker(state, val) {
      state.swStatus = val;
    },
    requestChangeHash(state, response) {
      state.canChangeHash = response;
    },
  },
});
