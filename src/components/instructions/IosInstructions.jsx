import { Typography } from "@mui/material";
import installi1 from "../../assets/instructions/installi1.png";
import installi2 from "../../assets/instructions/installi2.png";
import installi3 from "../../assets/instructions/installi3.png";

export default function IosInstructions() {
	return (
		<>
			<Typography variant="h6" sx={{ fontWeight: "bold" }}>
				For IOS
			</Typography>
			<Typography variant="subtitle1">
				<ol>
					<li>
						Make sure you are using
						<b> Safari</b>. Other browsers are not yet supported.
					</li>
					<li>
						Tap this icon.
						<img src={installi1} alt="Step 2" style={{ width: "92.5%" }} />
					</li>
					<li>
						Tap "Add to Home Screen".
						<img src={installi2} alt="Step 3" style={{ width: "92.5%" }} />
					</li>
					<li>
						Wait for the icon to change, then tap "Add".
						<img src={installi3} alt="Step 4" style={{ width: "92.5%" }} />
					</li>
				</ol>
			</Typography>
		</>
	);
}
