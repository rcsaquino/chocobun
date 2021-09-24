import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import CollectionsBookmarkRoundedIcon from "@mui/icons-material/CollectionsBookmarkRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { route } from "preact-router";
import { useStore } from "../store";

const views = [
	{ icon: <CalculateRoundedIcon />, link: "/" },
	{ icon: <CollectionsBookmarkRoundedIcon />, link: "/courses" },
	{ icon: <WidgetsRoundedIcon />, link: "/tools" },
	{ icon: <SettingsRoundedIcon />, link: "/settings" },
];

export default function BotNav() {
	const [store] = useStore();

	// Redirect to home if navigating to invalid url
	if (!views.some(view => view.link === store.currentPath)) {
		route("/");
	}

	return (
		<Box sx={styles.botNav}>
			<BottomNavigation value={store.currentPath}>
				{views.map((view, viewIndex) => (
					<BottomNavigationAction
						key={viewIndex}
						icon={view.icon}
						value={view.link}
						// Add true argument to prevent back in android for base url
						onClick={() => route(view.link, true)}
					/>
				))}
			</BottomNavigation>
		</Box>
	);
}

const styles = {
	botNav: {
		position: "fixed",
		bottom: 0,
		left: 0,
		right: 0,
	},
};
