import {
	Button,
	Card,
	Typography,
	Divider,
	Box,
	IconButton,
	Dialog,
	DialogTitle,
	TextField,
	DialogActions,
	DialogContent,
	DialogContentText,
	Collapse,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "preact/hooks";
import {
	useValidation,
	useAutoFocus,
	useModalHash,
} from "../../../../functions/customHooks";
import { useStore } from "../../../../store";
import {
	content_transmute_score,
	deep_clone,
	log_event,
} from "../../../../functions/utilities";
import { TransitionGroup } from "react-transition-group";

export default function Content({ courseIndex, contentIndex, closeExpansion }) {
	const [store, updateStore] = useStore();
	const [yourScore, setYourScore] = useState();
	const [totalItems, setTotalItems] = useState();
	const content = store.courses[courseIndex]?.syllabi[contentIndex];

	// Modals
	const [newScoreDialog, setNewScoreDialog] = useState(false);
	const [deleteContentDialog, setDeleteContentDialog] = useState(false);

	// Modal Hash Helpers
	useModalHash("new_score", newScoreDialog, closeNewScoreDialog);
	useModalHash("delete_content", deleteContentDialog, () =>
		setDeleteContentDialog(false)
	);

	// Autofocus chrome fix
	useAutoFocus(newScoreDialog, "your-score-field");

	// Form Validations
	const [violations, validation, resetValidation] = useValidation({
		yourScore: !yourScore || isNaN(yourScore) || yourScore < 0,
		totalItems: !totalItems || isNaN(totalItems) || totalItems <= 0,
	});

	function closeNewScoreDialog() {
		setNewScoreDialog(false);
		setYourScore("");
		setTotalItems("");
		resetValidation();
	}

	function modifyScore(method, payload) {
		const tempCourses = deep_clone(store.courses);
		const ct = tempCourses[courseIndex].syllabi[contentIndex];

		// Perform method
		switch (method) {
			case "add":
				ct.scores.push(payload);
				log_event("course", "course_add_new_score");
				break;
			case "remove":
				ct.scores.splice(payload, 1);
				log_event("course", "course_remove_score");
				break;
			default:
				console.log("Error! Invalid method!");
		}

		// Update transmutedGrade
		ct.transmutedGrade = content_transmute_score(
			ct.scores,
			store.gradingSystem
		);
		// Set to 0 if error
		ct.transmutedGrade || (ct.transmutedGrade = 0);
		updateStore("courses", tempCourses);
	}

	function addNewScore() {
		if (!validation()) return;
		modifyScore("add", { yourScore, totalItems });
		closeNewScoreDialog();
	}

	function deleteContent() {
		const tempCourses = deep_clone(store.courses);
		tempCourses[courseIndex].syllabi.splice(contentIndex, 1);
		updateStore("courses", tempCourses);
		closeExpansion();
		setDeleteContentDialog(false);

		log_event("course", "course_delete_content");
	}

	return (
		<>
			<Card variant="outlined">
				{/* Scores */}
				<TransitionGroup>
					{content?.scores.map((score, index) => (
						<Collapse in={true} key={index}>
							<Box>
								<Box sx={styles.scoreContainer}>
									<Typography sx={styles.scoreTitle} variant="subtitle2">
										{`${content?.name} ${index + 1}`}
									</Typography>
									<Typography sx={styles.score} variant="subtitle2">
										{`${score.yourScore} / ${score.totalItems}`}
									</Typography>
									<IconButton
										edge="end"
										size="small"
										onClick={() => modifyScore("remove", index)}
									>
										<CloseRoundedIcon fontSize="small" />
									</IconButton>
								</Box>
								<Divider />
							</Box>
						</Collapse>
					))}
				</TransitionGroup>

				{/* Actions */}
				<Box sx={styles.actionsContainer}>
					<Button size="small" onClick={() => setDeleteContentDialog(true)}>
						Delete
					</Button>
					<Button size="small" onClick={() => setNewScoreDialog(true)}>
						Add
					</Button>
				</Box>
			</Card>
			{/* New Score Dialog */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={newScoreDialog}
				PaperProps={{ elevation: 1 }}
			>
				<DialogTitle>New {content?.name}</DialogTitle>
				<TextField
					id="your-score-field"
					label="Your Score"
					type="number"
					autoFocus
					autoComplete="off"
					size="small"
					value={yourScore}
					error={violations.yourScore}
					helperText={violations.yourScore ? "Please input a number." : ""}
					onChange={e => setYourScore(e.target.value)}
					sx={styles.textField}
				/>
				<TextField
					label="Total Score"
					type="number"
					autoComplete="off"
					size="small"
					value={totalItems}
					error={violations.totalItems}
					helperText={violations.totalItems ? "Please input a number." : ""}
					onChange={e => setTotalItems(e.target.value)}
					sx={styles.textField}
				/>
				<DialogActions>
					<Button onClick={closeNewScoreDialog}>Cancel</Button>
					<Button onClick={addNewScore}>Add</Button>
				</DialogActions>
			</Dialog>

			{/* Confirm Delete Course Content */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={deleteContentDialog}
				PaperProps={{ elevation: 1 }}
			>
				<DialogTitle>Delete {content?.name}?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This action cannot be undone. Are you sure?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteContentDialog(false)}>Cancel</Button>
					<Button onClick={deleteContent}>Okay</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

const styles = {
	scoreContainer: {
		display: "flex",
		padding: "8px 16px",
		alignItems: "center",
	},
	scoreTitle: {
		width: "50%",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	score: {
		flexGrow: 1,
	},
	actionsContainer: {
		display: "flex",
		justifyContent: "space-around",
		paddingY: "4px",
	},
	textField: {
		margin: "4px 24px 12px",
	},
};
