<template>
  <v-dialog
    v-model="open"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar color="primary" class="textColor--text">
        <v-toolbar-title>Randomizer</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="toolbar-items"></slot>
        </v-toolbar-items>
      </v-toolbar>

      <!-- Randomizer -->
      <v-expansion-panels accordion v-model="selectedPanel">
        <v-expansion-panel v-for="list in lists" :key="list.id">
          <v-expansion-panel-header>{{ list.label }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card class="list-container">
              <v-card-text>
                <ol>
                  <li v-for="(item, index) in list.items" :key="index">
                    {{ item }}
                  </li>
                </ol>
              </v-card-text>
            </v-card>
            <v-btn
              color="primary"
              outlined
              class="list-btn mt-4"
              @click="randomize(list)"
              >Randomize</v-btn
            >
            <v-btn
              color="primary"
              x-small
              outlined
              class="list-btn"
              @click="openConfirmDeleteDialog(list)"
              >Delete List</v-btn
            >
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-text class="px-4 pt-4">
        <i>Tap the + icon to add a new list.</i>
      </v-card-text>
      <v-btn
        fixed
        bottom
        right
        fab
        color="secondary"
        @click="newListDialog = true"
      >
        <v-icon class="textColor--text">add</v-icon>
      </v-btn>

      <!-- Results -->
      <v-dialog v-model="openResults">
        <v-card>
          <!-- Tabs -->
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab>Results</v-tab>
            <v-tab>History</v-tab>
          </v-tabs>
          <v-divider></v-divider>
          <div class="px-3">
            <div class="subtitle-2 pt-2">List: {{ result.label }}</div>
            <div class="subtitle-2 pb-2">Timestamp: {{ result.time }}</div>
            <v-divider></v-divider>
            <div class="results-content">
              <v-tabs-items v-model="tab">
                <!-- Result Tab -->
                <v-tab-item>
                  <v-card flat>
                    <div class="py-2">
                      <div
                        class="body-2"
                        v-for="(item, index) in result.items"
                        :key="index"
                      >
                        {{ index + 1 }}. {{ item }}
                      </div>
                    </div>
                    <v-divider></v-divider>
                    <div class="body-2 pt-2">
                      <i>
                        Randomized with
                        <span class="primary--text"
                          >https://chocobun.web.app/</span
                        >
                      </i>
                    </div>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <!-- History Tab -->
                  <v-card flat>
                    <v-card-text class="pt-1 px-0 pb-0 ma-0">
                      Recent randomizations:
                      <div v-for="(history, index) in history" :key="index">
                        [{{ history.time }}]: {{ history.label }}
                      </div>
                      <v-divider class="my-1"></v-divider>
                      <i>
                        Tip: Use this tab to prove authenticity of
                        randomization.
                      </i>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="secondary" @click="openResults = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-dialog>

      <!-- Add New List Dialog Box -->
      <DialogBox
        :open="newListDialog"
        title="New List"
        proceedText="Add"
        @proceed="addNewList"
        @cancel="closeNewListDialog"
      >
        <v-form ref="listForm">
          <v-text-field
            v-model="newList.label"
            dense
            autofocus
            outlined
            class="mt-4"
            label="Label"
            :rules="requiredField"
          ></v-text-field>
          <v-textarea
            v-model="newList.items"
            dense
            outlined
            label="Items"
            rows="5"
            :rules="requiredField"
          ></v-textarea>
        </v-form>
        <i>Separate the items with line breaks or "enter".</i>
      </DialogBox>

      <!-- Confirm Delete Dialog -->
      <DialogBox
        :open="confirmDeleteDialog"
        :title="`Delete ${selectedList.label}?`"
        proceedText="Ok"
        @cancel="deleteList(false)"
        @proceed="deleteList(true)"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import DialogBox from "@/components/DialogBox.vue";
import dialogHelper from "@/mixins/dialogHelper.js";

export default {
  components: { DialogBox },
  mixins: [dialogHelper],
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    // Hydrate history
    const lsHistory = JSON.parse(localStorage.getItem("history"));
    if (lsHistory) {
      this.history = lsHistory;
    } else {
      // Add "Initialized Randomizer" if no history record found
      const newHistory = {
        label: "Initialized Randomizer",
        time: new Date().toString().substring(4, 24),
      };
      this.history.push(newHistory);
    }
  },
  data: () => ({
    newList: {},
    tab: 0,
    selectedList: {},
    newListDialog: false,
    confirmDeleteDialog: false,
    openResults: false,
    result: {},
    history: [],
    selectedPanel: "",
    hashID: "Randomizer",
    watchDialogs: ["newListDialog", "confirmDeleteDialog", "openResults"],
    dialogsWithClose: ["newListDialog"],
    requiredField: [
      (v) => (!!v && v.toString().length > 0) || "Required field.",
    ],
  }),
  computed: {
    lists() {
      return this.$store.state.lists;
    },
  },
  watch: {
    history(newHistory) {
      localStorage.setItem("history", JSON.stringify(newHistory));
    },
  },
  methods: {
    addNewList() {
      if (this.$refs.listForm.validate()) {
        // Add ID
        this.newList.id =
          Math.random().toString(36).substring(2) + Date.now().toString(36);
        // Split the string on line breaks
        this.newList.items = this.newList.items.split(/\r?\n/);
        // Remove blanks
        this.newList.items = this.newList.items.filter((item) => item !== "");
        // Commit and close dialog
        this.$store.commit("addList", this.newList);
        this.closeNewListDialog();
      }
    },
    deleteList(answer) {
      this.confirmDeleteDialog = false;
      answer && this.$store.commit("deleteList", this.selectedList);
    },
    closeNewListDialog() {
      this.newListDialog = false;
      this.newList = {};
      this.$refs.listForm.resetValidation();
    },
    randomize(list) {
      // Clone list to this.result
      this.result.label = list.label;
      this.result.items = [...list.items];
      // Randomize array order
      for (let i = this.result.items.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [this.result.items[i], this.result.items[j]] = [
          this.result.items[j],
          this.result.items[i],
        ];
      }
      // Add timestamp
      this.result.time = new Date().toString().substring(4, 24);

      // Add randomization to history
      this.history.unshift({
        label: this.result.label,
        time: this.result.time,
      });
      // Limit history to 8 most recent
      while (this.history.length > 8) {
        this.history.pop();
      }
      this.openResults = true;
    },
    openConfirmDeleteDialog(list) {
      this.selectedList = list;
      this.confirmDeleteDialog = true;
    },
  },
};
</script>

<style>
.list-btn {
  width: 100%;
  margin: auto;
}
.list-container {
  max-height: 8.5rem;
  overflow-y: auto;
}
.results-content {
  position: relative;
  overflow-y: auto;
  max-height: 23.7rem;
}
@media only screen and (min-width: 768px) and (orientation: portrait) {
  .results-content {
    max-height: 50rem;
  }
}
</style>
