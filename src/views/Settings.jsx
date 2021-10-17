import {
	Card,
	Switch,
	Typography,
	TextField,
	MenuItem,
	Divider,
	Button,
	Slide,
	List,
	ListSubheader,
	ListItem,
	ListItemText,
	ListItemIcon,
	Box,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Snackbar,
} from "@mui/material";
import { useStore } from "../store";
import {
	content_transmute_score,
	deep_clone,
	log_event,
} from "../functions/utilities";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import GradingRoundedIcon from "@mui/icons-material/GradingRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useState } from "preact/hooks";
import { useModalHash } from "../functions/customHooks";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { themeColors } from "../styles/Theme";
import { version } from "../../package.json";

const theme_colors = [
	{ label: "Chocobun", value: "chocobun" },
	{ label: "Turon", value: "turon" },
	{ label: "Choco Butternut", value: "chocoButternut" },
	{ label: "Rice", value: "rice" },
	{ label: "Water", value: "water" },
];

const dev =
	window.location.href.includes("chocobunapp") ||
	window.location.href.includes("localhost") ||
	process.env.NODE_ENV !== "production";

export default function Settings() {
	const [store, updateStore, setStore] = useStore();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	// Modals
	const [resetDataDialog, setResetDataDialog] = useState(false);

	// Modal Hash Helpers
	useModalHash("reset_data", resetDataDialog, () => setResetDataDialog(false));

	function changeGradingSystem(base) {
		const tempCourses = deep_clone(store.courses);
		tempCourses.forEach(course => {
			course.syllabi.forEach(content => {
				content.transmutedGrade = content_transmute_score(content.scores, base);
			});
		});

		setStore({ ...store, courses: tempCourses, gradingSystem: base });

		// Show snackbar only if no snackbar is open
		if (!snackbarOpen) {
			setSnackbarMessage("Updated course grades.");
			setSnackbarOpen(true);
		}

		// Log
		log_event("settings", "change_grading_system");
	}

	function resetData() {
		setStore({ ...store, courses: [], gradingSystem: 65, lists: [] });
		setResetDataDialog(false);

		// Show snackbar only if no snackbar is open
		if (!snackbarOpen) {
			setSnackbarMessage("App reset successful.");
			setSnackbarOpen(true);
		}

		// Log
		log_event("settings", "reset_data");
	}

	function updateThemeColor(newColor) {
		updateStore("theme", { ...store.theme, color: newColor });

		// Log
		log_event("settings", "change_theme_color");
	}

	function sendFeedback() {
		window.location.href =
			"mailto:rcsaquino.dev@gmail.com?Subject=[FEEDBACK]%20Chocobun%20App";
	}

	function shareApp() {
		if (navigator.share) {
			navigator.share({
				title: "Chocobun App",
				text: "Check out chocobun app!",
				url: "https://chocobun.web.app/",
			});
		} else {
			window.open("https://chocobun.web.app/");
		}
	}
	return (
		<>
			<Slide in={window.location.pathname === "/settings"} timeout={500}>
				<Box>
					<Card variant="outlined" sx={styles.card}>
						<List>
							<ListSubheader>THEME</ListSubheader>
							<ListItem>
								<ListItemIcon>
									<DarkModeRoundedIcon />
								</ListItemIcon>
								<ListItemText primary="Dark Mode" />
								<Switch
									edge="end"
									checked={store.theme.mode === "dark"}
									onChange={() => {
										updateStore("theme", {
											...store.theme,
											mode: store.theme.mode === "dark" ? "light" : "dark",
										});
										log_event("settings", "change_theme_mode");
									}}
								/>
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<ColorLensRoundedIcon />
								</ListItemIcon>
								<ListItemText primary="Color" />
								<TextField
									select
									value={store.theme.color}
									variant="standard"
									onChange={e => updateThemeColor(e.target.value)}
									InputProps={{ disableUnderline: true }}
								>
									{theme_colors.map((color, colorIndex) => (
										<MenuItem value={color.value} key={colorIndex}>
											{color.label}
										</MenuItem>
									))}
								</TextField>
							</ListItem>
							<ListSubheader>SYSTEM</ListSubheader>
							<ListItem>
								<ListItemIcon>
									<GradingRoundedIcon />
								</ListItemIcon>
								<ListItemText primary="Grading System" />
								<TextField
									select
									variant="standard"
									value={store.gradingSystem}
									onChange={e => changeGradingSystem(e.target.value)}
									InputProps={{ disableUnderline: true }}
								>
									<MenuItem value={65}>Base 65</MenuItem>
									<MenuItem value={60}>Base 60</MenuItem>
									<MenuItem value={50}>Base 50</MenuItem>
								</TextField>
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<RotateLeftRoundedIcon />
								</ListItemIcon>
								<ListItemText primary="Reset Data" />
								<IconButton onClick={() => setResetDataDialog(true)}>
									<ArrowForwardRoundedIcon />
								</IconButton>
							</ListItem>
						</List>
						<Divider />
						<Box sx={styles.footButtons}>
							<Button size="small" onClick={sendFeedback}>
								Send Feedback
							</Button>
							<Button size="small" onClick={shareApp}>
								Share App
							</Button>
						</Box>
						<Divider />
						<Box sx={styles.footnotes}>
							<Typography variant="caption">
								{dev
									? `DEVELOPER BUILD | VERSION ${version}`
									: "CHOCOBUN FAM | A4-MED 2021"}
							</Typography>
							<Typography variant="caption">
								© 2018-{new Date().getFullYear()}
							</Typography>
						</Box>
					</Card>
					{/* Confirm Reset App */}
					<Dialog
						fullWidth
						maxWidth="xs"
						open={resetDataDialog}
						PaperProps={{ elevation: 1 }}
					>
						<DialogTitle>Reset and clear all data?</DialogTitle>
						<DialogContent>
							<DialogContentText>
								This will reset and clear all app data except for randomization
								history.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setResetDataDialog(false)}>Cancel</Button>
							<Button onClick={resetData}>Okay</Button>
						</DialogActions>
					</Dialog>
				</Box>
			</Slide>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={1200}
				onClose={() => setSnackbarOpen(false)}
				message={snackbarMessage}
				ContentProps={{
					sx: { background: themeColors[store.theme.color].primary.main },
				}}
				action={
					<IconButton color="inherit" onClick={() => setSnackbarOpen(false)}>
						<CloseRoundedIcon />
					</IconButton>
				}
			/>
		</>
	);
}

const styles = {
	card: {
		maxHeight: "calc(72.5vh - env(safe-area-inset-bottom))",
		overflowY: "auto",
	},
	footButtons: {
		display: "flex",
		justifyContent: "space-around",
		height: "48px",
	},
	footnotes: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		paddingY: "16px",
	},
};
