import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	TextField,
	Card,
	Slide,
	Collapse,
	Box,
	Typography,
} from "@mui/material";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useState } from "preact/hooks";
import Course from "./Course";
import {
	useAutoFocus,
	useModalHash,
	useValidation,
} from "../../functions/customHooks";
import { useStore } from "../../store";
import { TransitionGroup } from "react-transition-group";
import { deep_clone, log_event } from "../../functions/utilities";

export default function Courses() {
	const [store, updateStore] = useStore();
	const [newCourseName, setNewCourseName] = useState("");
	const [courseIndex, setCourseIndex] = useState(-1);

	// Modals
	const [courseIsOpen, setCourseIsOpen] = useState(false);
	const [newCourseDialog, setNewCourseDialog] = useState(false);

	// Modal Hash Helpers
	useModalHash("open_course", courseIsOpen, () => setCourseIsOpen(false));
	useModalHash("new_course", newCourseDialog, closeNewCourseDialog);

	// Form validations
	const [violations, validation, resetValidation] = useValidation({
		newCourseName: !newCourseName,
	});

	// Autofocus chrome fix
	useAutoFocus(newCourseDialog, "new-course-field");

	function createNewCourse() {
		// Validate fields
		if (!validation()) return;

		const tempCourses = deep_clone(store.courses);
		tempCourses.push({ name: newCourseName, syllabi: [] });

		updateStore("courses", tempCourses);
		closeNewCourseDialog();

		log_event("course", "create_new_course");
	}

	function closeNewCourseDialog() {
		setNewCourseDialog(false);
		setNewCourseName("");
		resetValidation();
	}

	function openCourse(index) {
		setCourseIndex(index);
		setCourseIsOpen(true);
	}

	return (
		<>
			<Slide in={window.location.pathname === "/courses"} timeout={500}>
				<Card variant="outlined">
					{/* Main View */}
					<List>
						<Box sx={styles.courseListCard}>
							<ListSubheader sx={styles.subheader}>
								COURSES
								<IconButton onClick={() => setNewCourseDialog(true)}>
									<AddRoundedIcon />
								</IconButton>
							</ListSubheader>
							<TransitionGroup>
								{store.courses.map((course, index) => (
									<Collapse in={true} key={index}>
										<ListItemButton
											onClick={() => {
												openCourse(index);
												log_event("course", "open_course");
											}}
										>
											<ListItemIcon>
												<BookRoundedIcon />
											</ListItemIcon>
											<ListItemText>{course.name}</ListItemText>
										</ListItemButton>
									</Collapse>
								))}
							</TransitionGroup>
						</Box>
					</List>
				</Card>
			</Slide>
			{/* Add Hint */}
			<Slide
				in={window.location.pathname === "/courses"}
				timeout={500}
				direction="right"
			>
				<Box sx={styles.addHintContainer}>
					<Typography variant="caption">
						<i>Tap the + icon to add a new entry</i>
					</Typography>
				</Box>
			</Slide>
			{/* New Course */}
			<Dialog
				fullWidth
				maxWidth="xs"
				open={newCourseDialog}
				PaperProps={{
					elevation: 1,
				}}
			>
				<DialogTitle>New Course</DialogTitle>
				<TextField
					id="new-course-field"
					label="e.g. Anatomy, Patho"
					size="small"
					// autoFocus // iOS error
					autoComplete="off"
					error={violations.newCourseName}
					helperText={violations.newCourseName ? "Please enter a name." : ""}
					value={newCourseName}
					onChange={e => setNewCourseName(e.target.value)}
					sx={styles.newCourseText}
				/>
				<DialogActions>
					<Button onClick={closeNewCourseDialog}>Cancel</Button>
					<Button onClick={createNewCourse}>Add</Button>
				</DialogActions>
			</Dialog>
			{/* Course View */}
			<Dialog
				fullScreen
				open={courseIsOpen}
				TransitionComponent={Slide}
				TransitionProps={{ direction: "up", in: courseIsOpen }}
				PaperProps={{
					elevation: 0,
				}}
			>
				<Course
					courseIndex={courseIndex}
					closeCourse={() => setCourseIsOpen(false)}
				/>
			</Dialog>
		</>
	);
}

const styles = {
	courseListCard: {
		maxHeight: "calc(65vh - env(safe-area-inset-bottom))",
		overflowY: "auto",
	},
	subheader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	addHintContainer: {
		padding: "4px 16px",
	},
	newCourseText: {
		margin: "4px 24px 12px",
	},
};
