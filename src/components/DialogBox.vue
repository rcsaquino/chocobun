<template>
  <div>
    <v-dialog v-model="open" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>

        <v-card-text>
          <slot></slot>
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn text @click="$emit('cancel')" color="secondary">Cancel</v-btn>

          <v-btn text @click="$emit('proceed')" color="secondary">{{ proceedText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="primary" v-model="snackbar" :timeout="800">
      <span class="textColor--text">{{ snackbarText }}</span>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: "title"
    },
    proceedText: {
      type: String,
      default: "Ok"
    },
    snackbarText: {
      type: String
    },
    snackbarTrigger: {
      type: Number
    }
  },
  data: () => ({ snackbar: false }),
  watch: {
    snackbarTrigger() {
      this.snackbar = true;
    }
  }
};
</script>
