export default {
  methods: {
    switchTheme(theme) {
      const colors = ["primary", "secondary", "accent"];
      switch (theme) {
        case "Turon":
          colors.forEach((color) => {
            this.$vuetify.theme.themes.light[color] = "#F9A825";
            this.$vuetify.theme.themes.dark[color] = "#F9A825";
          });
          this.$vuetify.theme.themes.light.textColor = "#212121";
          this.$vuetify.theme.themes.dark.textColor = "#212121";
          break;
        case "Choco Butternut":
          colors.forEach((color) => {
            this.$vuetify.theme.themes.light[color] = "#E65100";
            this.$vuetify.theme.themes.dark[color] = "#E65100";
          });
          this.$vuetify.theme.themes.light.textColor = "#FFFFFF";
          this.$vuetify.theme.themes.dark.textColor = "#FFFFFF";
          break;
        default:
          colors.forEach((color) => {
            this.$vuetify.theme.themes.light[color] = "#795548";
            this.$vuetify.theme.themes.dark[color] = "#795548";
          });
          this.$vuetify.theme.themes.light.textColor = "#FFFFFF";
          this.$vuetify.theme.themes.dark.textColor = "#FFFFFF";
      }
    },
  },
};
