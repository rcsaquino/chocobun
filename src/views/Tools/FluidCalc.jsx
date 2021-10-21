import {
	Card,
	Tabs,
	Tab,
	Box,
	TextField,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button,
	InputAdornment,
	Dialog,
	DialogTitle,
	Table,
	TableBody,
	TableRow,
	TableCell,
	DialogActions,
} from "@mui/material";
import { useState } from "preact/hooks";
import SwipeableViews from "react-swipeable-views";
import { useModalHash, useValidation } from "../../functions/customHooks";

function getHolliday(weight) {
	// Setup holliday variables
	const dailyVolume = { label: "Daily Volume", value: "" };
	const infusionRate = { label: "Infusion Rate", value: "" };

	if (weight >= 20) {
		dailyVolume.value = (weight - 20) * 20 + 1500;
	} else if (weight >= 11) {
		dailyVolume.value = (weight - 10) * 50 + 1000;
	} else if (weight >= 3.5) {
		dailyVolume.value = weight * 100;
	} else {
		dailyVolume.value = 0;
	}

	infusionRate.value = Math.round((dailyVolume.value / 24) * 100) / 100;

	// Round off dailyVolume.value
	dailyVolume.value = Math.round(dailyVolume.value * 100) / 100;

	// Affix units
	dailyVolume.value += " mL";
	infusionRate.value += " mL/hr";

	// return variables
	return [dailyVolume, infusionRate];
}

function getParkland(weight, burnedArea) {
	// Setup parkland variables
	const total24h = { label: "Total (24 Hours)", value: "" };
	const first8h = { label: "First 8 Hours", value: "" };
	const next16h = { label: "Next 16 Hours", value: "" };

	// Compute
	total24h.value = 4 * weight * burnedArea;
	first8h.value = Math.round((total24h.value / 16) * 100) / 100;
	next16h.value = Math.round((total24h.value / 32) * 100) / 100;

	// Round off total24h
	total24h.value = Math.round(total24h.value * 100) / 100;

	// Affix units
	total24h.value += " mL";
	first8h.value += " mL/hr";
	next16h.value += " mL/hr";

	return [total24h, first8h, next16h];
}

export default function FluidCalc() {
	const [selectedTab, setSelectedTab] = useState(0);
	const [weight, setWeight] = useState("");
	const [weightUnit, setWeightUnit] = useState("kg");
	const [burnedArea, setBurnedArea] = useState("");
	const [tableData, setTableData] = useState([]);

	// Modals
	const [resultsIsOpen, setResultsIsOpen] = useState(false);

	// Modal Hash Helpers
	useModalHash("fluid_result", resultsIsOpen, () => setResultsIsOpen(false));

	const [violations, validation, resetValidation] = useValidation();

	function changeTab(newValue) {
		setSelectedTab(newValue);
		clearTab("all");
	}

	function clearTab(arg) {
		setWeight("");
		setBurnedArea("");
		resetValidation();

		if (arg === "all") {
			setWeightUnit("kg");
		}
	}

	function compute() {
		// Form validation
		const forValidation = {
			weight: !weight || isNaN(weight),
			burnedArea: selectedTab === 1 ? !burnedArea || isNaN(burnedArea) : false,
		};

		// Validate
		if (!validation(forValidation)) return;

		// Convert weight to kg
		const wt = weightUnit === "kg" ? weight : weight / 2.2046226218;

		if (selectedTab === 0) {
			setTableData(getHolliday(wt));
		}
		if (selectedTab === 1) {
			setTableData(getParkland(wt, burnedArea));
		}

		// Open results
		setResultsIsOpen(true);
	}

	return (
		<>
			<Card variant="outlined">
				<Tabs
					variant="fullWidth"
					value={selectedTab}
					onChange={(_, newValue) => changeTab(newValue)}
				>
					<Tab label="Holliday/Segar" value={0} />
					<Tab label="Parkland" value={1} />
				</Tabs>
				<SwipeableViews
					index={selectedTab}
					onChangeIndex={index => changeTab(index)}
				>
					{[...Array(2)].map((_, i) => (
						<Box index={i} sx={styles.tabPanel} key={i}>
							<RadioGroup
								row
								value={weightUnit}
								onChange={e => setWeightUnit(e.target.value)}
							>
								<FormControlLabel
									control={<Radio />}
									value="kg"
									label="Kilogram"
								/>
								<FormControlLabel
									control={<Radio />}
									value="lbs"
									label="Pounds"
								/>
							</RadioGroup>
							<TextField
								fullWidth
								label="Weight"
								type="number"
								size="small"
								autoComplete="off"
								value={weight}
								onChange={e => setWeight(e.target.value)}
								error={violations.weight}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">{weightUnit}</InputAdornment>
									),
								}}
								sx={styles.weightField}
							/>
							{selectedTab === 1 && (
								<TextField
									fullWidth
									label="Burned Area"
									type="number"
									size="small"
									autoComplete="off"
									value={burnedArea}
									onChange={e => setBurnedArea(e.target.value)}
									error={violations.burnedArea}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">%</InputAdornment>
										),
									}}
									sx={styles.burnedAreaField}
								/>
							)}

							<Box sx={styles.actionsContainer}>
								<Button onClick={clearTab}>Clear</Button>
								<Button onClick={compute}>Compute</Button>
							</Box>
						</Box>
					))}
				</SwipeableViews>
			</Card>
			{/* Results Dialog */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={resultsIsOpen}
				PaperProps={{ elevation: 1 }}
			>
				<DialogTitle>Results</DialogTitle>
				<Box sx={styles.resultsContentContainer}>
					<Table size="small" dense>
						<TableBody>
							{tableData.map((data, dataIndex) => (
								<TableRow key={dataIndex}>
									<TableCell>{data.label}</TableCell>
									<TableCell>{data.value}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
				<DialogActions>
					<Button onClick={() => setResultsIsOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

const styles = {
	tabPanel: {
		padding: "16px",
	},
	weightField: {
		marginTop: "8px",
	},
	burnedAreaField: {
		marginTop: "16px",
	},
	actionsContainer: {
		marginTop: "16px",
		display: "flex",
		justifyContent: "flex-end",
	},
	resultsContentContainer: {
		paddingX: "12px",
	},
};
