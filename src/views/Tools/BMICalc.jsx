import {
	Box,
	Card,
	Tabs,
	Tab,
	RadioGroup,
	Radio,
	FormControlLabel,
	TextField,
	InputAdornment,
	Button,
	MenuItem,
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
import BMI_LMS from "../../assets/BMI_LMS.json";
import { useValidation } from "../../functions/customHooks";

function computeBMI(ht, inches, htUnit, wt, wtUnit) {
	let m, kg;

	// Convert height to meters
	m = htUnit === "cm" ? ht * 0.01 : (ht * 12 + +inches) * 0.0254;
	// Convert weight to kg
	kg = wtUnit === "kg" ? wt : wt * 0.45359237;

	// Set BMI
	const bodyMassIndex = (kg / m ** 2).toFixed(1);

	return bodyMassIndex;
}

function classifyBMI(bodyMassIndex) {
	if (bodyMassIndex < 18.5) return { asia: "Underweight", who: "Underweight" };
	if (bodyMassIndex < 23) return { asia: "Normal", who: "Normal" };
	if (bodyMassIndex < 25) return { asia: "Overweight", who: "Normal" };
	if (bodyMassIndex < 30) return { asia: "Obese", who: "Overweight" };
	if (bodyMassIndex < 35) return { asia: "Obese", who: "Obese class I" };
	if (bodyMassIndex < 40) return { asia: "Obese", who: "Obese class II" };

	return { asia: "Obese", who: "Obese class III" };
}

function computeZScore(bodyMassIndex, ageYrs, ageMos, sex) {
	// Convert age to mos
	const ageInMos = Math.round(ageYrs * 12 + +ageMos);
	// Convert sex to number
	const sexNum = sex === "Male" ? 1 : 2;
	const lms = BMI_LMS.find(x => x.sex === sexNum && x.mos === ageInMos);
	const rawZScore = ((bodyMassIndex / lms.m) ** lms.l - 1) / (lms.l * lms.s);

	return rawZScore;
}

function computePercentile(rawZScore) {
	// zscore is the number of standard deviations from the mean

	// If zscore is greater than 6.5 standard deviations from the mean,
	// The number of significant digits will be outside of a reasonable range
	if (rawZScore < -6.5) return 0.0;
	if (rawZScore > 6.5) return 1.0;

	let factK = 1;
	let sum = 0;
	let term = 1;
	let k = 0;
	const loopStop = Math.exp(-23);
	while (Math.abs(term) > loopStop) {
		term =
			(((0.3989422804 * Math.pow(-1, k) * Math.pow(rawZScore, k)) /
				(2 * k + 1) /
				Math.pow(2, k)) *
				Math.pow(rawZScore, k + 1)) /
			factK;
		sum += term;
		k++;
		factK *= k;
	}
	sum += 0.5;

	const rawPercentile = Math.round(sum * 100);

	// Append ordinal suffix
	let ordinalSuffix;
	const placeValue = rawPercentile.toString().split("").reverse();
	if (placeValue[1] !== "1") {
		switch (placeValue[0]) {
			case "1":
				ordinalSuffix = "st";
				break;
			case "2":
				ordinalSuffix = "nd";
				break;
			case "3":
				ordinalSuffix = "rd";
				break;
			default:
				ordinalSuffix = "th";
		}
	} else {
		ordinalSuffix = "th";
	}

	return { rawPercentile, ordinalSuffix };
}

function classifyPercentile(rawPercentile) {
	if (rawPercentile < 5) return { child: "Underweight" };
	if (rawPercentile < 85) return { child: "Normal" };
	if (rawPercentile < 95) return { child: "Overweight" };

	return { child: "Obese" };
}

export default function BMICalc() {
	const [selectedTab, setSelectedTab] = useState(0);

	const [heightUnit, setHeightUnit] = useState("cm");
	const [height, setHeight] = useState("");
	const [inches, setInches] = useState("");
	const [weightUnit, setWeightUnit] = useState("kg");
	const [weight, setWeight] = useState("");
	const [sex, setSex] = useState("Male");
	const [age, setAge] = useState({ years: "", months: "" });
	const [resultsIsOpen, setResultsIsOpen] = useState(false);

	// Results variables
	const [BMI, setBMI] = useState("");
	const [percentile, setPercentile] = useState("");
	const [zScore, setZScore] = useState("");
	const [classification, setClassification] = useState({
		asia: "",
		who: "",
		child: "",
	});

	// Form validations
	const [violations, validation, resetValidation] = useValidation();

	function changeTab(value) {
		clearTab("all");
		setSelectedTab(value);
	}

	function getResults() {
		const forValidation = {
			height: !height || isNaN(height),
			weight: !weight || isNaN(weight),
		};
		if (heightUnit === "ft") {
			forValidation.inches = !inches || isNaN(inches);
		}
		if (selectedTab === 1) {
			const ageInMos = Math.round(age.years * 12 + +age.months);
			forValidation.age = ageInMos < 24 || ageInMos > 240;
		}

		if (!validation(forValidation)) return;

		// Compute BMI
		const bodyMassIndex = computeBMI(
			height,
			inches,
			heightUnit,
			weight,
			weightUnit
		);
		setBMI(bodyMassIndex);

		// Determine if adult or child tab is selected
		if (selectedTab === 0) {
			// Adult

			// Classify BMI
			setClassification(classifyBMI(bodyMassIndex));
		} else {
			// Child

			// Compute ZScore
			const rawZScore = computeZScore(
				bodyMassIndex,
				age.years,
				age.months,
				sex
			);
			setZScore(rawZScore.toFixed(2));

			// Compute Percentile
			const { rawPercentile, ordinalSuffix } = computePercentile(rawZScore);
			setPercentile(rawPercentile + ordinalSuffix);

			// Classify Percentile
			setClassification(classifyPercentile(rawPercentile));
		}
		setResultsIsOpen(true);
	}

	function clearTab(arg) {
		setHeight("");
		setInches("");
		setWeight("");
		setAge({ years: "", months: "" });
		setBMI("");
		setPercentile("");
		setZScore("");
		setClassification({
			asia: "",
			who: "",
			child: "",
		});
		resetValidation();

		if (arg === "all") {
			setHeightUnit("cm");
			setWeightUnit("kg");
			setSex("Male");
		}
	}

	return (
		<>
			<Card variant="outlined">
				<Tabs
					variant="fullWidth"
					value={selectedTab}
					onChange={(_, newValue) => changeTab(newValue)}
				>
					<Tab label="Adult" value={0} />
					<Tab label="Child" value={1} />
				</Tabs>
				<SwipeableViews
					index={selectedTab}
					onChangeIndex={index => changeTab(index)}
				>
					{[...Array(2)].map((_, i) => (
						<Box index={i} sx={styles.tabPanel} key={i}>
							{/* Child Extras */}
							{selectedTab === 1 && (
								<Box sx={styles.childExtrasContainer}>
									{/* Sex */}
									<TextField
										select
										size="small"
										label="Sex"
										value={sex}
										onChange={e => setSex(e.target.value)}
										sx={{ width: "30%" }}
									>
										<MenuItem value="Male">Male</MenuItem>
										<MenuItem value="Female">Female</MenuItem>
									</TextField>
									{/* Age */}
									<Box sx={styles.ageContainer}>
										<TextField
											size="small"
											label="Age"
											type="number"
											value={age.years}
											onChange={e => setAge({ ...age, years: e.target.value })}
											error={violations.age}
											helperText={violations.age && "2-20 y/o"}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">yrs</InputAdornment>
												),
											}}
											sx={{ width: "50%" }}
										/>
										<TextField
											size="small"
											type="number"
											value={age.months}
											onChange={e => setAge({ ...age, months: e.target.value })}
											error={violations.age}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">mos</InputAdornment>
												),
											}}
											sx={{ width: "50%" }}
										/>
									</Box>
								</Box>
							)}
							{/* Height */}
							<Box sx={styles.heightContainer}>
								<RadioGroup
									row
									value={heightUnit}
									onChange={e => setHeightUnit(e.target.value)}
								>
									<FormControlLabel
										control={<Radio />}
										value="cm"
										label="Centimeters"
									/>
									<FormControlLabel
										control={<Radio />}
										value="ft"
										label="Feet, inches"
									/>
								</RadioGroup>
								<Box sx={styles.heightFieldContainer}>
									<TextField
										fullWidth
										label="Height"
										type="number"
										size="small"
										autoComplete="off"
										value={height}
										onChange={e => setHeight(e.target.value)}
										error={violations.height}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													{heightUnit}
												</InputAdornment>
											),
										}}
									/>
									{heightUnit === "ft" && (
										<TextField
											fullWidth
											type="number"
											size="small"
											autoComplete="off"
											value={inches}
											onChange={e => setInches(e.target.value)}
											error={violations.inches}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">in</InputAdornment>
												),
											}}
										/>
									)}
								</Box>
							</Box>

							{/* Weight */}
							<Box sx={styles.weightContainer}>
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
											<InputAdornment position="end">
												{weightUnit}
											</InputAdornment>
										),
									}}
									sx={styles.weightField}
								/>
							</Box>

							{/* Action Buttons */}
							<Box sx={styles.actionsContainer}>
								<Button onClick={clearTab}>Clear</Button>
								<Button onClick={getResults}>Compute</Button>
							</Box>
						</Box>
					))}
				</SwipeableViews>
			</Card>
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
							<TableRow>
								<TableCell>BMI</TableCell>
								<TableCell>{BMI}</TableCell>
							</TableRow>
							{selectedTab === 0 ? (
								<>
									<TableRow>
										<TableCell>Asia Classif.</TableCell>
										<TableCell>{classification.asia}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>WHO Classif.</TableCell>
										<TableCell>{classification.who}</TableCell>
									</TableRow>
								</>
							) : (
								<>
									<TableRow>
										<TableCell>Percentile</TableCell>
										<TableCell>{percentile}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>ZScore</TableCell>
										<TableCell>{zScore}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Classification</TableCell>
										<TableCell>{classification.child}</TableCell>
									</TableRow>
								</>
							)}
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
	childExtrasContainer: {
		display: "flex",
		justifyContent: "space-between",
		padding: "8px 0 12px",
	},
	weightField: {
		marginTop: "8px",
	},
	ageContainer: {
		width: "65%",
	},
	heightContainer: {
		paddingBottom: "16px",
	},
	heightFieldContainer: {
		display: "flex",
		marginTop: "8px",
	},
	weightContainer: {
		paddingBottom: "16px",
	},
	actionsContainer: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: "8px",
	},
	resultsContentContainer: {
		paddingX: "12px",
	},
};
