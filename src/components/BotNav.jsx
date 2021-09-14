import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import CollectionsBookmarkRoundedIcon from "@mui/icons-material/CollectionsBookmarkRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { route } from "preact-router";
import { useState } from "preact/hooks";

const views = [
	{ icon: <CalculateRoundedIcon />, link: "/" },
	{ icon: <CollectionsBookmarkRoundedIcon />, link: "/courses" },
	{ icon: <WidgetsRoundedIcon />, link: "/tools" },
	{ icon: <SettingsRoundedIcon />, link: "/settings" },
];

export default function BotNav() {
	const [currentPath, setCurrentPath] = useState(window.location.pathname);

	function reroute(path) {
		route(path);
		setCurrentPath(path);
	}

	// Redirect to home if navigating to invalid url
	if (!Object.values(views).includes(window.location.pathname)) {
		reroute("/");
	}

	return (
		<Box sx={styles.botNav}>
			<BottomNavigation value={currentPath}>
				{views.map((view, viewIndex) => (
					<BottomNavigationAction
						key={viewIndex}
						icon={view.icon}
						value={view.link}
						onClick={() => reroute(view.link)}
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
