import {
	Card,
	TextField,
	InputAdornment,
	Button,
	Box,
	Dialog,
	DialogActions,
	Divider,
	Typography,
} from "@mui/material";
import { useState } from "preact/hooks";

export default function ABG() {
	const [age, setAge] = useState("");
	const [phValue, setPhValue] = useState("");
	const [paco2Value, setPaco2Value] = useState("");
	const [pao2Value, setPao2Value] = useState("");
	const [hco3Value, setHco3Value] = useState("");
	const [fio2Value, setFio2Value] = useState("");

	const [resultsIsOpen, setResultsIsOpen] = useState(false);
	const [findings, setFindings] = useState("");
	const [tableData, setTableData] = useState([]);
	const [preTableData, setPreTableData] = useState([]);

	function clearAll() {
		setAge("");
		setPhValue("");
		setPaco2Value("");
		setPao2Value("");
		setHco3Value("");
		setFio2Value("");
	}

	function analyze() {
		const dataForTable = [];
		const dataForPreTable = [];

		// Interpret Inputs
		if (phValue) {
			const ph = {};
			ph.label = "pH";
			ph.value = phValue;
			ph.normal = "7.35-7.45";
			dataForTable.push(ph);
		}
		if (paco2Value) {
			const paco2 = {};
			paco2.label = "PaCO2";
			paco2.value = paco2Value;
			paco2.normal = "35-45";
			dataForTable.push(paco2);
		}
		if (pao2Value) {
			const pao2 = {};
			pao2.label = "PaO2";
			pao2.value = pao2Value;
			if (age) {
				if (age >= 60) {
					pao2.normal = "80-100";
				} else {
					let x = Math.round(104 - age * 0.43);
					x < 80 && (x = 80);
					x > 100 ? (pao2.normal = "100") : (pao2.normal = `≥${x}`);
				}
			}
			dataForTable.push(pao2);
		}
		if (hco3Value) {
			const hco3 = {};
			hco3.label = "HCO3";
			hco3.value = hco3Value;
			hco3.normal = "22-26";
			dataForTable.push(hco3);
		}

		// Analyze acid base balance
		if (phValue && paco2Value && hco3Value) {
			// Initialize variables
			const acidotic = phValue < 7.4;
			const alkalotic = phValue > 7.4;
			const acidPh = phValue < 7.35;
			const alkPh = phValue > 7.45;
			const acidRespi = paco2Value > 45;
			const alkRespi = paco2Value < 35;
			const normRespi = !acidRespi && !alkRespi;
			const acidMetab = hco3Value < 22;
			const alkMetab = hco3Value > 26;
			const normMetab = !acidMetab && !alkMetab;

			// Uncompensated
			if (normMetab || normRespi) {
				// Respiratory Acidosis
				if (acidPh && acidRespi) {
					setFindings("Uncompensated Respiratory Acidosis");
				}
				// Metabolic Acidosis
				if (acidPh && acidMetab) {
					setFindings("Uncompensated Metabolic Acidosis");
				}
				// Respiratory Alkalosis
				if (alkPh && alkRespi) {
					setFindings("Uncompensated Respiratory Alkalosis");
				}
				// Metabolic Alkalosis
				if (alkPh && alkMetab) {
					setFindings("Uncompensated Metabolic Alkalosis");
				}
			}

			// Partially Compensated Acidosis
			if (acidPh) {
				// Respiratory
				if (acidRespi && alkMetab) {
					setFindings("Partially Compensated Respiratory Acidosis");
				}
				// Metabolic
				if (acidMetab && alkRespi) {
					setFindings("Partially Compensated Metabolic Acidosis");
				}
			}

			// Partially Compensated Alkalosis
			if (alkPh) {
				// Respiratory
				if (alkRespi && acidMetab) {
					setFindings("Partially Compensated Respiratory Alkalosis");
				}
				// Metabolic
				if (alkMetab && acidRespi) {
					setFindings("Partially Compensated Metabolic Alkalosis");
				}
			}

			// Fully Compensated
			if (!acidPh && !alkPh) {
				// Acidosis
				if (acidotic) {
					// Respiratory
					if (acidRespi && alkMetab) {
						setFindings("Fully Compensated Respiratory Acidosis");
					}
					// Metabolic
					if (acidMetab && alkRespi) {
						setFindings("Fully Compensated Metabolic Acidosis");
					}
				}
				//Alkalosis
				if (alkalotic) {
					// Respiratory
					if (alkRespi && acidMetab) {
						setFindings("Fully Compensated Respiratory Alkalosis");
					}
					// Metabolic
					if (alkMetab && acidRespi) {
						setFindings("Fully Compensated Metabolic Alkalosis");
					}
				}
			}

			// Combined Acidosis
			if (acidotic && acidRespi && acidMetab) {
				setFindings("Combined Respiratory & Metabolic Acidosis");
			}

			// Combined Alkalosis
			if (alkalotic && alkRespi && alkMetab) {
				setFindings("Combined Respiratory & Metabolic Alkalosis");
			}
		} else {
			setFindings("");
		}

		// Compute for Desired PaO2
		if (age) {
			// Set variables
			const desiredPao2 = {};
			desiredPao2.label = "Desired PaO2";
			desiredPao2.suffix = ` mmHg (${age} y/o)`;

			// Compute
			if (age >= 60) {
				desiredPao2.value = 80 - (age - 60);
			} else {
				let x = Math.round(104 - age * 0.43);
				x < 80 && (x = 80);
				x > 100 && (x = 100);
				desiredPao2.value = x;
			}
			desiredPao2.value = desiredPao2.value.toFixed(1);

			// Push to pre table data
			dataForPreTable.push(desiredPao2);
		}

		// Compute for pAO2 (don't push to table)
		if (fio2Value && paco2Value) {
			// Compute
			const palo2 = (fio2Value / 100) * 713 - paco2Value / 0.8;

			// Compute for aAO2, p(A-a)O2 => Dependent on palo2
			if (pao2Value) {
				// Set variables
				const aao2 = {};
				aao2.label = "aAO2";
				aao2.normal = "0.75-0.80";
				const paao2 = {};
				paao2.label = "p(A-a)O2";
				if (age >= 40) {
					const normal = Math.floor(age / 10) * 3 + 15;
					paao2.normal = `${normal - 5}-${normal + 5}`;
				} else {
					paao2.normal = "10-20";
				}

				// Compute
				aao2.value = (pao2Value / palo2).toFixed(2);
				paao2.value = (palo2 - pao2Value).toFixed(1);

				//Push to table
				dataForTable.push(aao2);
				dataForTable.push(paao2);

				// Compute for Desired FiO2 => Dependent on aao2
				const val = dataForPreTable.find(x => x.label === "Desired PaO2");
				if (val) {
					// Set Variables
					const desiredFio2 = {};
					desiredFio2.label = "Desired FiO2";
					desiredFio2.suffix = "%";

					// Compute
					desiredFio2.value = (
						((val.value / aao2.value + paco2Value / 0.8) / 713) *
						100
					).toFixed(1);

					// Push to pre table data
					dataForPreTable.push(desiredFio2);
				}
			}
		}

		// Compute for P/F
		if (pao2Value && fio2Value) {
			// Set variables
			const pf = {};
			pf.label = "P/F";
			if (age <= 60) {
				pf.normal = "400-500";
			} else if (age > 60) {
				pf.normal = `> ${400 - (age - 60) * 5}`;
			}

			//Compute
			pf.value = (pao2Value / (fio2Value / 100)).toFixed(1);

			// Push to table
			dataForTable.push(pf);
		}

		// Set data
		setTableData(dataForTable);
		setPreTableData(dataForPreTable);

		// Open results if data is available
		if (dataForTable.length > 0 || dataForPreTable.length > 0)
			setResultsIsOpen(true);
	}

	return (
		<>
			<Card sx={styles.card} variant="outlined">
				<TextField
					fullWidth
					size="small"
					label="Age"
					type="number"
					autoComplete="off"
					value={age}
					onChange={e => setAge(e.target.value)}
					InputProps={{
						endAdornment: <InputAdornment position="end">y/o</InputAdornment>,
					}}
				/>
				<TextField
					fullWidth
					size="small"
					label="pH"
					type="number"
					autoComplete="off"
					value={phValue}
					onChange={e => setPhValue(e.target.value)}
				/>
				<TextField
					fullWidth
					size="small"
					label="PaCO2"
					type="number"
					autoComplete="off"
					value={paco2Value}
					onChange={e => setPaco2Value(e.target.value)}
					InputProps={{
						endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
					}}
				/>
				<TextField
					fullWidth
					size="small"
					label="Current PaO2"
					type="number"
					autoComplete="off"
					value={pao2Value}
					onChange={e => setPao2Value(e.target.value)}
					InputProps={{
						endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
					}}
				/>
				<TextField
					fullWidth
					size="small"
					label="HCO3"
					type="number"
					autoComplete="off"
					value={hco3Value}
					onChange={e => setHco3Value(e.target.value)}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">mmol/L</InputAdornment>
						),
					}}
				/>
				<TextField
					fullWidth
					size="small"
					label="Current FiO2"
					type="number"
					autoComplete="off"
					value={fio2Value}
					onChange={e => setFio2Value(e.target.value)}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}
				/>
				<Box sx={styles.actionsContainer}>
					<Button variant="outlined" sx={styles.button} onClick={clearAll}>
						Clear
					</Button>
					<Button variant="outlined" sx={styles.button} onClick={analyze}>
						Analyze
					</Button>
				</Box>
			</Card>
			{/* Results Dialog */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={resultsIsOpen}
				PaperProps={{ elevation: 1 }}
			>
				<Box sx={styles.resultsContentContainer}>
					<Typography sx={styles.resultsTitle} variant="caption">
						Arterial Blood Gas Analysis
					</Typography>
					<Typography sx={styles.preTableData} variant="body2">
						{findings}
					</Typography>
					{preTableData.map((data, dataIndex) => (
						<Typography
							sx={styles.preTableData}
							variant="body2"
							key={dataIndex}
						>
							{`${data.label}: ${data.value + data.suffix}`}
						</Typography>
					))}
					{tableData.length > 0 && (
						<>
							<Divider sx={{ marginTop: "8px" }} />
							<Box sx={styles.tableRow}>
								<Typography sx={styles.headerCell} variant="caption">
									Label
								</Typography>
								<Typography sx={styles.headerCell} variant="caption">
									Value
								</Typography>
								<Typography sx={styles.headerCell} variant="caption">
									Normal
								</Typography>
							</Box>
							<Divider />
							{tableData.map((data, dataIndex) => (
								<Box sx={styles.tableRow} key={dataIndex}>
									<Typography sx={styles.bodyCell} variant="subtitle2">
										{data.label}
									</Typography>
									<Typography sx={styles.bodyCell} variant="subtitle2">
										{data.value}
									</Typography>
									<Typography sx={styles.bodyCell} variant="subtitle2">
										{data.normal}
									</Typography>
								</Box>
							))}
							<Divider />
						</>
					)}
				</Box>
				<DialogActions>
					<Button onClick={() => setResultsIsOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

const styles = {
	card: {
		padding: "24px",
		height: "460px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
	},
	actionsContainer: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: "8px",
	},
	button: {
		width: "47.5%",
	},
	resultsTitle: {
		fontWeight: "bold",
		paddingLeft: "8px",
	},
	resultsContentContainer: {
		padding: "12px 12px 0",
	},
	preTableData: {
		paddingLeft: "8px",
	},
	tableRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		paddingX: "8px",
	},
	headerCell: {
		width: "33%",
		fontWeight: "bold",
	},
	bodyCell: {
		width: "33%",
	},
};
