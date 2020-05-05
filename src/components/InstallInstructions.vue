<template>
  <div class="pa-4 background">
    <p class="display-1 font-weight-bold mb-2">How to install</p>
    <div v-if="isAndroid">
      <AndroidInstructions />
      <v-divider class="my-4" />
      <IosInstructions />
    </div>
    <div v-else>
      <IosInstructions />
      <v-divider class="my-4" />
      <AndroidInstructions />
    </div>
  </div>
</template>

<script>
import AndroidInstructions from "./instructions/AndroidInstructions.vue";
import IosInstructions from "./instructions/IosInstructions.vue";

export default {
  components: { AndroidInstructions, IosInstructions },
  computed: {
    isAndroid() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android/i.test(userAgent);
    }
  }
};
</script>

<style scoped>
.background {
  background: #ffebcd;
}
</style>
