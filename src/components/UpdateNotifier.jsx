import { IconButton, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "preact/hooks";
import { useStore } from "../store";
import { themeColors } from "../styles/Theme";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { version } from "../../package.json";

let recentlyUpdated = false;
if (localStorage.recentlyUpdated && localStorage.recentlyUpdated === "1") {
	localStorage.recentlyUpdated = 0;
	recentlyUpdated = true;
	console.log("recently updated");
}

export default function UpdateNotifier() {
	const [store] = useStore();
	const [updateFoundInfo, setUpdateFoundInfo] = useState(false);
	const [newUpdateReadyInfo, setNewUpdateReadyInfo] = useState(false);
	const [appUpdated, setAppUpdated] = useState(recentlyUpdated);
	const newUpdateFound = useRef(false);

	useEffect(() => {
		switch (store.workerStatus) {
			case "installing":
				newUpdateFound.current = true;
				setUpdateFoundInfo(true);
				break;
			case "activated":
				if (newUpdateFound.current) {
					newUpdateFound.current = false;
					if (updateFoundInfo) setUpdateFoundInfo(false);
					setNewUpdateReadyInfo(true);
				}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.workerStatus]);

	return (
		<>
			<Snackbar
				open={updateFoundInfo}
				autoHideDuration={2500}
				onClose={() => setUpdateFoundInfo(false)}
				message="Update found! Downloading..."
				ContentProps={{
					sx: { background: themeColors[store.theme.color].primary.main },
				}}
				action={
					<IconButton color="inherit" onClick={() => setUpdateFoundInfo(false)}>
						<CloseRoundedIcon />
					</IconButton>
				}
			/>
			<Snackbar
				open={newUpdateReadyInfo}
				autoHideDuration={5000}
				onClose={() => setNewUpdateReadyInfo(false)}
				message="Update downloaded! Tap to install."
				ContentProps={{
					sx: { background: themeColors[store.theme.color].primary.main },
				}}
				action={
					<IconButton
						color="inherit"
						size="small"
						onClick={e => {
							e.stopPropagation();
							setNewUpdateReadyInfo(false);
						}}
					>
						<CloseRoundedIcon fontSize="small" />
					</IconButton>
				}
				onClick={() => {
					localStorage.recentlyUpdated = 1;
					location.reload();
				}}
			/>
			<Snackbar
				open={appUpdated}
				autoHideDuration={2500}
				onClose={() => setAppUpdated(false)}
				message={`Updated to version ${version}`}
				ContentProps={{
					sx: { background: themeColors[store.theme.color].primary.main },
				}}
				action={
					<IconButton color="inherit" onClick={() => setAppUpdated(false)}>
						<CloseRoundedIcon />
					</IconButton>
				}
			/>
		</>
	);
}
