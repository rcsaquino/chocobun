<template>
  <v-bottom-navigation app grow v-model="bottomNav" color="accent">
    <v-btn value="transmute" class="fill" @click="reroute('/')">
      <span>Transmute</span>
      <v-icon>assignment</v-icon>
    </v-btn>

    <v-btn value="courses" class="fill" @click="reroute('/courses')">
      <span>Courses</span>
      <v-icon>class</v-icon>
    </v-btn>
    <v-btn value="settings" class="fill" @click="reroute('/settings')">
      <span>Settings</span>
      <v-icon>settings</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data: () => ({
    bottomNav: "transmute"
  }),
  methods: {
    reroute(path) {
      this.$router.push(path).catch(err => {});
    }
  }
};
</script>

<style scoped>
.fill {
  min-height: 100%;
}
</style>
