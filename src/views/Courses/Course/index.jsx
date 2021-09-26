import {
	Card,
	Toolbar,
	Typography,
	Dialog,
	IconButton,
	AppBar,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Fab,
	DialogTitle,
	DialogActions,
	TextField,
	Button,
	InputAdornment,
	Box,
	Chip,
	DialogContent,
	DialogContentText,
	Collapse,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useState, useEffect } from "preact/hooks";
import {
	useAutoFocus,
	useModalHash,
	useValidation,
} from "../../../functions/customHooks";
import Scores from "./Scores";
import { useStore } from "../../../store";
import { TransitionGroup } from "react-transition-group";
import { deep_clone, log_event } from "../../../functions/utilities";

export default function Course({ courseIndex, closeCourse }) {
	const [store, updateStore] = useStore();
	const [newContentName, setNewContentName] = useState("");
	const [newContentWeight, setNewContentWeight] = useState();
	const [expanded, setExpanded] = useState("");
	const [finalGrade, setFinalGrade] = useState(0);

	const course = store.courses[courseIndex];

	// Modals
	const [newContentDialog, setNewContentDialog] = useState(false);
	const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);

	// Modal Hash Helpers
	useModalHash("new_content", newContentDialog, closeNewContentDialog);
	useModalHash("delete_course", deleteCourseDialog, () =>
		setDeleteCourseDialog(false)
	);

	useEffect(() => {
		let final = 0;
		course?.syllabi.forEach(content => {
			final += content.transmutedGrade * (content.weight / 100);
		});
		final = Math.round(final * 100) / 100;
		setFinalGrade(final);
	}, [course?.syllabi]);

	// Autofocus chrome fix
	useAutoFocus(newContentDialog, "content-name-field");

	// Form validations
	const [violations, validation, resetValidation] = useValidation({
		newContentName: !newContentName,
		newContentWeight: !newContentWeight || isNaN(newContentWeight),
	});

	function closeNewContentDialog() {
		setNewContentDialog(false);
		setNewContentName("");
		setNewContentWeight("");
		resetValidation();
	}
	function createNewContent() {
		if (!validation()) return;
		const tempCourses = deep_clone(store.courses);
		tempCourses[courseIndex].syllabi.push({
			name: newContentName,
			weight: newContentWeight,
			transmutedGrade: 0,
			scores: [],
		});
		updateStore("courses", tempCourses);
		setExpanded(tempCourses[courseIndex].syllabi.length - 1);
		closeNewContentDialog();

		log_event("course", "course_create_new_content");
	}

	function deleteCourse() {
		const tempCourses = deep_clone(store.courses);
		tempCourses.splice(courseIndex, 1);
		updateStore("courses", tempCourses);
		setDeleteCourseDialog(false);
		closeCourse();

		log_event("course", "delete_course");
	}

	return (
		<Box sx={styles.mainContainer}>
			<AppBar color="background" elevation={0}>
				<Toolbar sx={styles.toolbar}>
					<IconButton edge="start" onClick={closeCourse}>
						<ArrowBackIosNewRoundedIcon />
					</IconButton>
					<Typography variant="h6">{course?.name}</Typography>
					<IconButton edge="end" onClick={() => setDeleteCourseDialog(true)}>
						<DeleteOutlineRoundedIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Toolbar />
			<Card variant="outlined">
				<TransitionGroup>
					{course?.syllabi?.map((content, index) => (
						<Collapse in={true} key={index}>
							<Accordion
								disableGutters
								elevation={0}
								expanded={expanded === index}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreRoundedIcon />}
									onClick={() =>
										expanded !== index ? setExpanded(index) : setExpanded("")
									}
								>
									<Box sx={styles.primaryText}>
										<Typography variant="subtitle2" sx={styles.ellipsis}>
											{content.name}
										</Typography>
										<Typography variant="subtitle2">
											&nbsp;{`(${content.weight}%)`}
										</Typography>
									</Box>
									<Typography sx={styles.secondaryText} variant="subtitle2">
										{`Transmuted: ${content.transmutedGrade}`}
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Scores
										courseIndex={courseIndex}
										contentIndex={index}
										closeExpansion={() => setExpanded("")}
									/>
								</AccordionDetails>
							</Accordion>
						</Collapse>
					))}
				</TransitionGroup>
			</Card>
			{course?.syllabi.length < 1 ? (
				<Box sx={styles.hintContainer}>
					<Typography variant="caption">
						<i>Tap the + icon to add a new entry</i>
					</Typography>
				</Box>
			) : (
				<Box sx={styles.finalGradeContainer}>
					<Chip
						color="primary"
						variant="outlined"
						label={`Final Grade: ${finalGrade}`}
						sx={styles.finalGrade}
					/>
				</Box>
			)}
			<Fab
				color="primary"
				sx={styles.fab}
				onClick={() => setNewContentDialog(true)}
			>
				<AddRoundedIcon />
			</Fab>

			{/* New Content Dialog */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={newContentDialog}
				PaperProps={{ elevation: 1 }}
			>
				<DialogTitle>New Course Content</DialogTitle>
				<TextField
					id="content-name-field"
					label="e.g. Quiz, Attendance"
					size="small"
					autoFocus
					autoComplete="off"
					error={violations.newContentName}
					helperText={violations.newContentName ? "Please enter a name." : ""}
					value={newContentName}
					onChange={e => setNewContentName(e.target.value)}
					sx={styles.newContentName}
				/>
				<TextField
					label="Weight"
					type="number"
					size="small"
					autoComplete="off"
					error={violations.newContentWeight}
					value={newContentWeight}
					onChange={e => setNewContentWeight(e.target.value)}
					InputProps={{
						endAdornment: <InputAdornment position="end">%</InputAdornment>,
					}}
					sx={styles.newContentWeight}
				/>
				<DialogActions>
					<Button onClick={closeNewContentDialog}>Cancel</Button>
					<Button onClick={createNewContent}>Add</Button>
				</DialogActions>
			</Dialog>

			{/* Confirm Delete Course */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={deleteCourseDialog}
				PaperProps={{ elevation: 1 }}
			>
				<DialogTitle>Delete {course?.name}?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This action cannot be undone. Are you sure?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteCourseDialog(false)}>Cancel</Button>
					<Button onClick={deleteCourse}>Okay</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

const styles = {
	mainContainer: {
		margin: "16px",
		overflowY: "auto",
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
	},
	primaryText: {
		padding: "0 8px",
		width: "40%",
		display: "flex",
	},
	ellipsis: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	secondaryText: {
		color: "text.secondary",
	},
	hintContainer: {
		padding: "4px 16px",
	},
	finalGradeContainer: {
		display: "flex",
		justifyContent: "center",
	},
	finalGrade: {
		margin: "16px 32px",
		width: "100%",
	},
	newContentName: {
		margin: "4px 24px 12px",
	},
	newContentWeight: {
		margin: "4px 24px 12px",
		width: "100px",
	},
	fab: {
		position: "fixed",
		bottom: "16px",
		right: "16px",
	},
};
