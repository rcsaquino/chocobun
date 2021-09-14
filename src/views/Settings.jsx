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
} from "@mui/material";
import { useStore } from "../store";
import { content_transmute_score, deep_clone } from "../functions/utilities";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import ColorLensRoundedIcon from "@mui/icons-material/ColorLensRounded";
import GradingRoundedIcon from "@mui/icons-material/GradingRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/RotateLeftRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useState } from "preact/hooks";

const themeColors = [
	{ label: "Chocobun", value: "chocobun" },
	{ label: "Turon", value: "turon" },
	{ label: "Choco Butternut", value: "chocoButternut" },
	{ label: "Rice", value: "rice" },
	{ label: "Water", value: "water" },
];

export default function Settings() {
	const [store, updateStore, setStore] = useStore();
	const [resetDataDialog, setResetDataDialog] = useState(false);

	function changeGradingSystem(base) {
		const tempCourses = deep_clone(store.courses);
		tempCourses.forEach(course => {
			course.syllabi.forEach(content => {
				content.transmutedGrade = content_transmute_score(content.scores, base);
			});
		});

		setStore({ ...store, courses: tempCourses, gradingSystem: base });
	}

	function resetData() {
		setStore({ ...store, courses: [], gradingSystem: 65, lists: [] });
		setResetDataDialog(false);
	}

	function updateThemeColor(newColor) {
		updateStore("theme", { ...store.theme, color: newColor });
	}
	return (
		<Slide in={window.location.pathname === "/settings"} timeout={500}>
			<Box>
				<Card variant="outlined">
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
								onChange={() =>
									updateStore("theme", {
										...store.theme,
										mode: store.theme.mode === "dark" ? "light" : "dark",
									})
								}
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
								{themeColors.map((color, colorIndex) => (
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
						<Button size="small">Send Feedback</Button>
						<Button size="small">Share App</Button>
					</Box>
					<Divider />
					<Box sx={styles.footnotes}>
						<Typography variant="caption">
							CHOCOBUN FAM | A4-MED 2021
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
	);
}

const styles = {
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
