<template>
	<div>
		<v-card class="animate__animated animate__fadeInDown animate__faster">
			<v-card-title>Settings</v-card-title>
			<v-card-text class="py-0">
				<v-switch v-model="darkMode" label="Dark Mode" class="my-1" />
				<v-select
					v-model="selectedTheme"
					:items="themes"
					label="Theme"
					outlined
					dense
					class="themeSelector"
				></v-select>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text>
				<p>
					Share this app:
					<a @click="shareApp">https://chocobun.web.app/</a>
				</p>
				<p>
					Send feedback:
					<a
						onclick="window.location.href = 'mailto:rcsaquino.dev@gmail.com?Subject=[FEEDBACK]%20Chocobun%20App'"
					>
						rcsaquino.dev@gmail.com
					</a>
				</p>
				<p class="mb-0">© 2018-{{ new Date().getFullYear() }}</p>
			</v-card-text>
		</v-card>
		<div class="clearDataContainer mt-4">
			<v-btn
				text
				color="secondary"
				class="animate__animated animate__fadeInDown animate__faster"
				@click="confirmClearDialog = true"
			>
				Clear All Data
			</v-btn>
		</div>
		<!-- Confirm Clear Dialog Box -->
		<DialogBox
			:open="confirmClearDialog"
			title="Clear All Data?"
			proceedText="Ok"
			@cancel="confirmClearDialog = false"
			@proceed="clearData"
			snackbarText="Cleared all data."
			:snackbarTrigger="snackbarTrigger"
		>
			This will clear all data except for randomization history.
		</DialogBox>
	</div>
</template>

<script>
import store from "@/store";
import DialogBox from "@/components/DialogBox.vue";
import dialogHelper from "@/mixins/dialogHelper";
import themeSelector from "@/mixins/themeSelector";

export default {
	mixins: [dialogHelper, themeSelector],
	components: { DialogBox },
	data: () => ({
		selectedTheme: "Chocobun",
		confirmClearDialog: false,
		snackbarTrigger: 0,
		darkMode: false,
		themes: ["Chocobun", "Turon", "Choco Butternut"],
		hashID: "Settings",
		watchDialogs: ["confirmClearDialog"],
	}),

	created() {
		this.darkMode = JSON.parse(localStorage.getItem("dark_mode"));
		this.selectedTheme = localStorage.getItem("theme") || "Chocobun";
	},

	watch: {
		darkMode(val) {
			this.$vuetify.theme.dark = val;
			localStorage.setItem("dark_mode", val);
			if (val) {
				document.body.style.background = "#000000";
			} else {
				document.body.style.background = "#FFFFFF";
			}
		},
		selectedTheme(theme) {
			this.switchTheme(theme);
			localStorage.setItem("theme", theme);
		},
	},

	methods: {
		clearData() {
			this.confirmClearDialog = false;
			store.state.courses.forEach(course => {
				this.$store.commit("deleteCourse", course);
			});
			store.state.lists.forEach(list => {
				this.$store.commit("deleteList", list);
			});
			this.snackbarTrigger++;
		},
		shareApp() {
			if (navigator.share) {
				navigator.share({
					title: "Chocobun App",
					text: "Check out chocobun app!",
					url: "https://chocobun.web.app/",
				});
			} else {
				window.open("https://chocobun.web.app/");
			}
		},
	},
};
</script>

<style scoped>
.shareButtons {
	width: 50%;
}
.themeSelector {
	width: 50%;
}
.clearDataContainer {
	display: flex;
	justify-content: center;
}
</style>
