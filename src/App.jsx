import BotNav from "./components/BotNav";
import RouterView from "./router";
import {
	Toolbar,
	Typography,
	Paper,
	AppBar,
	ThemeProvider,
} from "@mui/material";
import { Theme } from "./styles/Theme.js";
import InstallInstructions from "./components/InstallInstructions";
import InstallProgress from "./components/InstallProgress";
import { useState } from "preact/hooks";
import UpdateNotifier from "./components/UpdateNotifier";

const isInstalled =
	window.matchMedia("(display-mode: standalone)").matches ||
	window.navigator.standalone ||
	document.referrer.includes("android-app://");
const devMode = process.env.NODE_ENV !== "production";

export default function App() {
	const [downloadingComplete, setDownloadingComplete] = useState(false);

	return (
		<ThemeProvider theme={Theme()}>
			<AppBar color="background" elevation={0}>
				<Toolbar sx={styles.toolbar}>
					<Typography variant="h6">Chocobun</Typography>
				</Toolbar>
			</AppBar>
			{isInstalled || devMode ? (
				<>
					<Paper sx={styles.mainContainer} elevation={0}>
						<RouterView />
					</Paper>
					<UpdateNotifier />
					<BotNav />
				</>
			) : (
				<Paper sx={styles.mainContainer} elevation={0}>
					{downloadingComplete ? (
						<InstallInstructions />
					) : (
						<InstallProgress
							completeProgress={() => setDownloadingComplete(true)}
						/>
					)}
				</Paper>
			)}
		</ThemeProvider>
	);
}

const styles = {
	mainContainer: {
		// Offset appbar
		marginTop: "56px",
		// General view padding
		padding: "16px",
	},
	toolbar: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
};
