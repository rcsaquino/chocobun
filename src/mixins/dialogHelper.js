// For Android "Back"

// How to use:
// Import mixin
// Add hashID "str" to component
// Add watchDialogs [arr] to component
// **optional** Add dialogsWithClose [arr] to component if with close function and if so...
// format as "close" + {{ watchDialogs }}

export default {
  data: () => ({
    watchFunctions: {},
    hashJustChanged: false,
  }),
  created() {
    this.watchDialogs.forEach((dialog) => {
      // Create a watch function for each dialog
      this.$watch(dialog, function(opened) {
        // Check if specific dialog is opened
        if (opened) {
          // Ask permission to change hash
          this.$store.commit("requestChangeHash", true);

          // Change hash
          const currentHash = this.$route.hash;
          this.$router
            .push(`${currentHash}#/${this.hashID}/${dialog}`)
            .catch((err) => console.log(err));

          // If dialog is closed, check if hashJustChanged
        } else if (!this.hashJustChanged) {
          // If not, go back and reroute
          this.$router.go(-1);
        } else {
          // If hash just changed, dont reroute. Set it to false
          this.hashJustChanged = false;
        }
      });
    });
  },
  watch: {
    $route(to, from) {
      // If hash becomes shorter, it means the user either went back or closed the dialog
      if (from.hash.length > to.hash.length) {
        // Split the hash link. Last value will be the target dialog followed by the target component
        const hashSubstrings = from.hash.split("/");
        const targetDialog = hashSubstrings.pop();
        const targetComponent = hashSubstrings.pop();

        // Since many components use this mixin, check if component is the target component
        // Also check if dialog is still open (user used back button)
        if (this.hashID === targetComponent && this[targetDialog]) {
          // Set hashJustChanged to true to prevent "double back"
          this.hashJustChanged = true;
          // Check if target dialog has own close function
          if (this.dialogsWithClose?.includes(targetDialog)) {
            // Hacky way of calling target dialog's function :)
            const closeFunction =
              "close" +
              targetDialog.charAt(0).toUpperCase() +
              targetDialog.slice(1);
            this[closeFunction]();
            // If it dosen't have its own close function, close it forcefully
          } else {
            this[targetDialog] = false;
          }
        }
      }
    },
  },
};
