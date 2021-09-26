import { Typography } from "@mui/material";
import installa1 from "../../assets/instructions/installa1.png";
import installa2 from "../../assets/instructions/installa2.png";
import installa3 from "../../assets/instructions/installa3.png";
import installa4 from "../../assets/instructions/installa4.png";

export default function AndroidInstructions() {
	return (
		<>
			<Typography variant="h6" sx={{ fontWeight: "bold" }}>
				For Android
			</Typography>
			<ol>
				<li>
					Make sure you are using
					<b> Google Chrome</b>. Other browsers are not yet supported.
				</li>
				<li>
					If a banner pops up, just tap "Add Chocobun to Home screen" then
					proceed to step 5. Otherwise, skip this step and proceed to step 3.
					<img src={installa1} alt="Step 2" style={{ width: "92.5%" }} />
				</li>
				<li>
					Tap the three dots on the upper right corner of the screen.
					<img src={installa2} alt="Step 3" style={{ width: "92.5%" }} />
				</li>
				<li>
					Tap "Install App" or "Add to Home Screen".
					<img src={installa3} alt="Step 4" style={{ width: "92.5%" }} />
				</li>
				<li>
					Tap "Add". Installing might take a few seconds. After it's done, the
					app should automatically appear in your home screen.
					<img src={installa4} alt="Step 5" style={{ width: "92.5%" }} />
				</li>
			</ol>
		</>
	);
}
