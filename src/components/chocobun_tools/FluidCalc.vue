<template>
	<v-dialog
		v-model="open"
		fullscreen
		hide-overlay
		transition="dialog-bottom-transition"
	>
		<v-card>
			<v-toolbar color="primary" class="textColor--text">
				<v-toolbar-title>Fluid Calculator</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<slot name="toolbar-items"></slot>
				</v-toolbar-items>
			</v-toolbar>

			<!-- Fluid Calculator -->
			<v-card tile>
				<v-tabs v-model="tab" fixed-tabs>
					<v-tab>Holliday/Segar</v-tab>
					<v-tab>Parkland</v-tab>
				</v-tabs>

				<v-tabs-items v-model="tab">
					<!-- Holliday/Segar -->
					<v-tab-item>
						<v-dialog v-model="openHollidayResult">
							<v-card>
								<v-card-title>Result</v-card-title>
								<v-card-text class="px-2 pb-0">
									<v-simple-table dense>
										<template v-slot:default>
											<tbody>
												<tr>
													<td>Daily Volume</td>
													<td>{{ hollidayDaily }} mL</td>
												</tr>
												<tr>
													<td>Infusion Rate</td>
													<td>{{ hollidayMLHR }} mL/hr</td>
												</tr>
											</tbody>
										</template>
									</v-simple-table>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										text
										color="secondary"
										@click="openHollidayResult = false"
									>
										Close
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-card flat class="px-5 pt-8 pb-4">
							<v-form ref="hollidayForm">
								<v-radio-group
									v-model="hollidayWtUnit"
									dense
									row
									class="mt-0 pt-0"
								>
									<v-radio value="kg" label="Kilograms" />
									<v-radio value="lbs" label="Pounds" />
								</v-radio-group>
								<v-text-field
									v-model="hollidayWeight"
									outlined
									dense
									label="Weight"
									type="number"
									:suffix="hollidayWtUnit"
									:rules="numbersOnly"
								></v-text-field>
							</v-form>
							<v-card-actions class="ma-0 pa-0">
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="clearHolliday">Clear</v-btn>
								<v-btn text color="primary" @click="computeHolliday">
									Compute
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-tab-item>

					<!-- Parkland Tab -->
					<v-tab-item>
						<v-dialog v-model="openParklandResult">
							<v-card>
								<v-card-title>Infusion Rate</v-card-title>
								<v-card-text class="px-2 pb-0">
									<v-simple-table dense>
										<template v-slot:default>
											<tbody>
												<tr>
													<td>Total (24 Hours)</td>
													<td>{{ parklandTotal }} mL</td>
												</tr>
												<tr>
													<td>First 8 Hours</td>
													<td>{{ parklandFirst }} mL/hr</td>
												</tr>
												<tr>
													<td>Next 16 Hours</td>
													<td>{{ parklandNext }} mL/hr</td>
												</tr>
											</tbody>
										</template>
									</v-simple-table>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										text
										color="secondary"
										@click="openParklandResult = false"
									>
										Close
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-card flat class="px-5 pt-8 pb-4">
							<v-form ref="parklandForm">
								<v-radio-group
									v-model="parklandWtUnit"
									dense
									row
									class="mt-0 pt-0"
								>
									<v-radio value="kg" label="Kilograms" />
									<v-radio value="lbs" label="Pounds" />
								</v-radio-group>
								<v-text-field
									v-model="parklandWeight"
									outlined
									dense
									label="Weight"
									type="number"
									:suffix="parklandWtUnit"
									:rules="numbersOnly"
								></v-text-field>
								<v-text-field
									v-model="parklandBurn"
									outlined
									dense
									label="Burned Area"
									type="number"
									suffix="%"
									:rules="numbersOnly"
								></v-text-field>
							</v-form>
							<v-card-actions class="ma-0 pa-0">
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="clearParkland">Clear</v-btn>
								<v-btn text color="primary" @click="computeParkland">
									Compute
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-tab-item>
				</v-tabs-items>
			</v-card>
		</v-card>
	</v-dialog>
</template>

<script>
import dialogHelper from "@/mixins/dialogHelper";

export default {
	mixins: [dialogHelper],
	props: {
		open: {
			type: Boolean,
			default: false,
		},
	},
	data: () => ({
		tab: 0,
		numbersOnly: [v => v && !isNaN(v)],
		// dialogHelper
		hashID: "FluidCalc",
		watchDialogs: ["openHollidayResult", "openParklandResult"],
		// Holliday
		openHollidayResult: false,
		hollidayWtUnit: "kg",
		hollidayWeight: "",
		hollidayDaily: 0,
		hollidayMLHR: 0,
		// Parkland
		openParklandResult: false,
		parklandWtUnit: "kg",
		parklandWeight: "",
		parklandBurn: "",
		parklandTotal: 0,
		parklandFirst: 0,
		parklandNext: 0,
	}),
	methods: {
		// Holliday
		clearHolliday() {
			this.hollidayWtUnit = "kg";
			this.hollidayWeight = "";
			this.hollidayDaily = 0;
			this.hollidayMLHR = 0;
			this.$refs.hollidayForm.resetValidation();
		},
		computeHolliday() {
			if (!this.$refs.hollidayForm.validate()) return;
			// Convert weight to kg
			const weight =
				this.hollidayWtUnit === "kg"
					? this.hollidayWeight
					: this.hollidayWeight / 2.2046226218;

			if (weight >= 20) {
				this.hollidayDaily = (weight - 20) * 20 + 1500;
			} else if (weight >= 11) {
				this.hollidayDaily = (weight - 10) * 50 + 1000;
			} else if (weight >= 3.5) {
				this.hollidayDaily = weight * 100;
			} else {
				this.hollidayDaily = 0;
			}
			this.hollidayMLHR = Math.round((this.hollidayDaily / 24) * 100) / 100;
			// Round off hollidayDaily
			this.hollidayDaily = Math.round(this.hollidayDaily * 100) / 100;

			this.openHollidayResult = true;
		},
		// Parkland
		clearParkland() {
			this.parklandWtUnit = "kg";
			this.parklandWeight = "";
			this.parklandBurn = "";
			this.parklandTotal = 0;
			this.parklandFirst = 0;
			this.parklandNext = 0;
			this.$refs.parklandForm.resetValidation();
		},
		computeParkland() {
			if (!this.$refs.parklandForm.validate()) return;
			// Convert weight to kg
			const weight =
				this.parklandWtUnit === "kg"
					? this.parklandWeight
					: this.parklandWeight / 2.2046226218;

			this.parklandTotal = 4 * weight * this.parklandBurn;
			this.parklandFirst = Math.round((this.parklandTotal / 16) * 100) / 100;
			this.parklandNext = Math.round((this.parklandTotal / 32) * 100) / 100;

			// Round off parklandTotal
			this.parklandTotal = Math.round(this.parklandTotal * 100) / 100;

			this.openParklandResult = true;
		},
	},
};
</script>
