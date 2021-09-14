import {
	Button,
	TextField,
	Box,
	DialogTitle,
	Dialog,
	DialogActions,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Card,
	Slide,
	Typography,
} from "@mui/material";
import { useState } from "preact/hooks";
import { transmute_score } from "../functions/utilities";
import { useValidation } from "../functions/customHooks";
import { useStore } from "../store";

export default function Transmute() {
	const [store] = useStore();
	const [passingScore, setPassingScore] = useState(0);
	const [status, setStatus] = useState("");
	const [transmuted, setTransmuted] = useState(0);
	const [resultsIsOpen, setResultsIsOpen] = useState(false);
	const [yourScore, setYourScore] = useState();
	const [totalItems, setTotalItems] = useState();

	// Form Validations
	const [violations, validation] = useValidation({
		yourScore: !yourScore || isNaN(yourScore) || yourScore < 0,
		totalItems: !totalItems || isNaN(totalItems) || totalItems <= 0,
	});

	function transmute() {
		// Validate fields
		if (!validation()) return;

		// Get passing score with 2 decimal places if necessary
		const passing =
			Math.round(totalItems * (store.gradingSystem / 100) * 100) / 100;

		// Set states accordingly
		setPassingScore(passing);
		setStatus(yourScore >= passing ? "Passed" : "Failed");
		setTransmuted(transmute_score(yourScore, totalItems, store.gradingSystem));

		// Show results
		setResultsIsOpen(true);
	}

	return (
		<>
			<Slide in={window.location.pathname === "/"} timeout={500}>
				<Card sx={styles.card} variant="outlined">
					<Box sx={styles.cardContent}>
						<Typography variant="h6" sx={styles.cardTitle}>
							Transmute
						</Typography>
						<TextField
							label="Your Score"
							type="number"
							autoComplete="off"
							value={yourScore}
							onChange={e => setYourScore(e.target.value)}
							error={violations.yourScore}
							sx={styles.textField}
						/>
						<TextField
							label="Total Score"
							type="number"
							autoComplete="off"
							value={totalItems}
							onChange={e => setTotalItems(e.target.value)}
							error={violations.totalItems}
							sx={styles.textField}
						/>
						<Box sx={styles.buttonContainer}>
							<Button onClick={transmute}>Transmute</Button>
						</Box>
					</Box>
				</Card>
			</Slide>
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
							<TableRow>
								<TableCell>Status</TableCell>
								<TableCell>{status}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Passing</TableCell>
								<TableCell>{passingScore}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Transmuted</TableCell>
								<TableCell>{transmuted}</TableCell>
							</TableRow>
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
	card: {
		paddingTop: "4px",
	},
	cardTitle: {
		marginLeft: "12px",
	},
	cardContent: {
		padding: "12px 20px",
		height: "272px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
	},
	textField: {
		width: "100%",
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "flex-end",
	},
	resultsContentContainer: {
		paddingX: "12px",
	},
};
