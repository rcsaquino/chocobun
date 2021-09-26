import { Card, LinearProgress, Typography } from "@mui/material";
import { useStore } from "../store";
import { useEffect, useState } from "preact/hooks";

let interval;

export default function InstallProgress({ completeProgress }) {
	const [store] = useStore();
	const [progressHint, setProgressHint] = useState("");
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (interval) clearInterval(interval);
		interval = setInterval(() => {
			setProgress(prev => prev + 1);
		}, 800);
		switch (store.workerStatus) {
			case "loading":
				setProgressHint("Loading...");
				break;
			case "installing":
				setProgressHint("Downloading...");
				break;
			case "activating":
				setProgressHint("Preparing for install...");
				break;
			case "activated":
				clearInterval(interval);
				setProgress(100);
				setProgressHint("Ready for install.");
				completeProgress();
				break;
			default:
				setProgressHint("Error: Refresh the page.");
		}
	}, [completeProgress, store.workerStatus]);

	const recommendedBrowser = /android/i.test(
		navigator.userAgent || navigator.vendor || window.opera
	)
		? "Google Chrome"
		: "Safari";

	return (
		<>
			<Card variant="outlined" sx={styles.installNotes}>
				<Typography variant="subtitle2">
					Notes:
					<li>Please wait while the app loads.</li>
					<li>
						Make sure you are using
						<b> {recommendedBrowser}</b>.
					</li>
					<li>Other browsers are not yet supported.</li>
					<li>Need Help? Email: rcsaquino.dev@gmail.com</li>
				</Typography>
			</Card>
			<Card variant="outlined" sx={styles.installProgress}>
				<Typography variant="h6">{progressHint}</Typography>
				<LinearProgress variant="determinate" value={progress} />
			</Card>
		</>
	);
}

const styles = {
	installNotes: {
		padding: "16px 20px",
	},
	installProgress: {
		textAlign: "center",
		padding: "16px 20px",
		marginTop: "8px",
	},
};
