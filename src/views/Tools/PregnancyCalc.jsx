import {
	Card,
	TextField,
	MenuItem,
	Box,
	Button,
	Typography,
	Divider,
	Dialog,
	DialogActions,
	DialogTitle,
} from "@mui/material";
import { useState } from "preact/hooks";
import { useModalHash } from "../../functions/customHooks";

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const currentDate = new Date();

function getNumberOfDays(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

function getAOG(lmp) {
	let ms = Date.now() - new Date(lmp).getTime();
	const days = Math.floor(ms / 86400000);
	const weeks = Math.floor(days / 7);
	const remainderDays = days % 7;
	return `${weeks} ${weeks === 1 ? "week" : "weeks"} & ${remainderDays} ${
		remainderDays === 1 ? "day" : "days"
	}`;
}

function getEDD(lmp) {
	let date = new Date(lmp);
	const results = {};

	// Naegele's Rule
	date.setDate(date.getDate() + 7 + 1); // +1 because of the way getDate() works
	date = new Date(date.setMonth(date.getMonth() + 9))
		.toISOString()
		.substr(0, 10);

	// Date array is year, month, day [0, 1, ,2]
	date = date.split("-");
	results.naegele = `${monthNames[date[1] - 1].substring(0, 3)} ${date[2]}, ${
		date[0]
	}`;

	// 280 Days Rule
	date = new Date(lmp);
	date = new Date(date.setDate(date.getDate() + 280))
		.toISOString()
		.substr(0, 10);

	// Date array is year, month, day [0, 1, 2]
	date = date.split("-");
	results.days = `${monthNames[date[1] - 1].substring(0, 3)} ${date[2]}, ${
		date[0]
	}`;

	return results;
}

export default function PregnancyCalc() {
	const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
	const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
	const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
	const [AOG, setAOG] = useState("");
	const [EDD, setEDD] = useState({ naegele: "", days: "" });

	// Modals
	const [resultsIsOpen, setResultsIsOpen] = useState(false);

	// Modal Hash Helpers
	useModalHash("pregnancy_result", resultsIsOpen, () =>
		setResultsIsOpen(false)
	);

	const numberOfDays = getNumberOfDays(selectedYear, selectedMonth);

	function compute() {
		const lmp = new Date(selectedYear, selectedMonth, selectedDay);
		setAOG(getAOG(lmp));
		setEDD(getEDD(lmp));
		setResultsIsOpen(true);
	}

	return (
		<>
			<Card sx={styles.card} variant="outlined">
				<Box sx={styles.dateFieldLabel}>
					<Typography variant="h6">First Day of LMP</Typography>
				</Box>
				<Box sx={styles.dateFieldContainer}>
					<TextField
						select
						size="small"
						label="Month"
						value={selectedMonth}
						onChange={e => setSelectedMonth(e.target.value)}
					>
						{monthNames.map((month, monthIndex) => (
							<MenuItem value={monthNames.indexOf(month)} key={monthIndex}>
								{month}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						size="small"
						label="Day"
						value={selectedDay}
						onChange={e => setSelectedDay(e.target.value)}
					>
						{[...Array(numberOfDays)].map((_, i) => (
							<MenuItem value={i + 1} key={i}>
								{i + 1}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						size="small"
						label="Year"
						value={selectedYear}
						onChange={e => setSelectedYear(e.target.value)}
					>
						{[...Array(10)].map((_, i) => (
							<MenuItem value={currentDate.getFullYear() - i} key={i}>
								{currentDate.getFullYear() - i}
							</MenuItem>
						))}
					</TextField>
				</Box>
				<Divider sx={styles.bottomDivider} />
				<Box sx={styles.actionsContainer}>
					<Button fullWidth variant="outlined" onClick={compute}>
						Calculate
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
				<DialogTitle>Results</DialogTitle>
				<Box sx={styles.resultsContentContainer}>
					<Box sx={styles.resultRow}>
						<Typography variant="subtitle2">Age of Gestation</Typography>
						<Typography variant="subtitle2">{AOG}</Typography>
					</Box>
					<Divider />
					<Box sx={styles.resultRow}>
						<Typography variant="subtitle2">Naegele's EDD</Typography>
						<Typography variant="subtitle2">{EDD.naegele}</Typography>
					</Box>
					<Divider />
					<Box sx={styles.resultRow}>
						<Typography variant="subtitle2">280 Days EDD</Typography>
						<Typography variant="subtitle2">{EDD.days}</Typography>
					</Box>
					<Divider />
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
		padding: "16px 16px 20px",
	},
	dateFieldLabel: {
		marginLeft: "12px",
	},
	dateFieldContainer: {
		display: "grid",
		gridTemplateColumns: "1.5fr 0.8fr 1fr",
		gridGap: "8px",
		marginTop: "24px",
	},
	bottomDivider: {
		marginY: "20px",
	},
	actionsContainer: {
		display: "flex",
		justifyContent: "center",
	},
	resultsContentContainer: {
		paddingX: "16px",
	},
	resultRow: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gridGap: "8px",
		padding: "4px 8px",
	},
};
