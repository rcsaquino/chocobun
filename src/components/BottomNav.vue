<template>
  <v-bottom-navigation app grow v-model="selected" color="secondary">
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
    selected: "Transmute",
    links: [
      { name: "Transmute", icon: "assignment", path: "/" },
      { name: "Courses", icon: "collections_bookmark", path: "/courses" },
      { name: "Tools", icon: "widgets", path: "/tools" },
      { name: "Settings", icon: "settings", path: "/settings" }
    ]
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
