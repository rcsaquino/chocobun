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

export default function App() {
	return (
		<ThemeProvider theme={Theme()}>
			<AppBar color="background" elevation={0}>
				<Toolbar sx={styles.toolbar}>
					<Typography variant="h6">Chocobun</Typography>
				</Toolbar>
			</AppBar>
			<Paper sx={styles.mainContainer} elevation={0}>
				<RouterView />
			</Paper>
			<BotNav />
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
