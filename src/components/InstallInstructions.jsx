import { Divider, Typography } from "@mui/material";
import AndroidInstructions from "./instructions/AndroidInstructions";
import IosInstructions from "./instructions/IosInstructions";

export default function InstallInstructions() {
	const isAndroid = /android/i.test(
		navigator.userAgent || navigator.vendor || window.opera
	);
	return (
		<>
			<Typography variant="h5" sx={{ fontWeight: "bold" }}>
				How To Install
			</Typography>
			<Typography variant="subtitle1" sx={{ marginY: "8px" }}>
				TL;DR: Add this page to your homescreen.
			</Typography>
			{isAndroid ? (
				<>
					<AndroidInstructions />
					<IosInstructions />
				</>
			) : (
				<>
					<IosInstructions />
					<AndroidInstructions />
				</>
			)}
			<Divider sx={{ marginBottom: "8px" }} />
			<Typography variant="caption">
				Need Help? Email: rcsaquino.dev@gmail.com
			</Typography>
		</>
	);
}
