<template>
  <v-bottom-navigation v-model="currentView" app grow color="secondary">
    <v-btn
      class="fill"
      v-for="(link, index) in links"
      :key="index"
      :value="link.name"
      @click="reroute(link.path)"
    >
      <span>{{ link.name }}</span>
      <v-icon>{{ link.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data: () => ({
    currentView: "",
    links: [
      { name: "Transmute", icon: "assignment", path: "/" },
      { name: "Courses", icon: "collections_bookmark", path: "/courses" },
      { name: "Tools", icon: "widgets", path: "/tools" },
      { name: "Settings", icon: "settings", path: "/settings" }
    ]
  }),
  methods: {
    reroute(path) {
      this.$store.commit("requestChangeHash", true);
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
