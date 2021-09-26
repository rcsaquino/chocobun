import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Card,
	Slide,
	Dialog,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Box,
} from "@mui/material";
import { useState } from "preact/hooks";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import BMICalc from "./BMICalc";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

import PregnancyCalc from "./PregnancyCalc";
import PregnantWomanRoundedIcon from "@mui/icons-material/PregnantWomanRounded";

import ABG from "./ABG";
import AirlineSeatIndividualSuiteRoundedIcon from "@mui/icons-material/AirlineSeatIndividualSuiteRounded";

import FluidCalc from "./FluidCalc";
import LocalDrinkRoundedIcon from "@mui/icons-material/LocalDrinkRounded";

import Randomizer from "./Randomizer";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import { useModalHash } from "../../functions/customHooks";
import { log_event } from "../../functions/utilities";

const tools = [
	{
		name: "ABG Analyzer",
		shortName: "ABG",
		icon: <AirlineSeatIndividualSuiteRoundedIcon />,
		component: <ABG />,
	},
	{
		name: "BMI Calculator",
		shortName: "BMICalc",
		icon: <FitnessCenterRoundedIcon />,
		component: <BMICalc />,
	},
	{
		name: "Fluid Calculator",
		shortName: "FluidCalc",
		icon: <LocalDrinkRoundedIcon />,
		component: <FluidCalc />,
	},
	{
		name: "Pregnancy Calculator",
		shortName: "PregnancyCalc",
		icon: <PregnantWomanRoundedIcon />,
		component: <PregnancyCalc />,
	},
	{
		name: "Randomizer",
		shortName: "Randomizer",
		icon: <CasinoRoundedIcon />,
		component: <Randomizer />,
	},
];

const initialToolsState = {};
tools.forEach(tool => {
	initialToolsState[tool.shortName] = false;
});

export default function Tools() {

	// Modals
	const [isOpen, setIsOpen] = useState(initialToolsState);

	// Modal Hash Helpers
	tools.forEach(tool => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useModalHash(tool.shortName, isOpen[tool.shortName], () =>
			setIsOpen({ ...isOpen, [tool.shortName]: false })
		);
	});

	return (
		<Slide in={window.location.pathname === "/tools"} timeout={500}>
			<Card variant="outlined">
				<List>
					<ListSubheader sx={styles.subheader}>TOOLS</ListSubheader>
					{tools.map((tool, toolIndex) => (
						<div key={toolIndex}>
							<ListItemButton
								onClick={() => {
									setIsOpen({ ...isOpen, [tool.shortName]: true });
									log_event("tools", `open_${tool.shortName}`);
								}}
							>
								<ListItemIcon>{tool.icon}</ListItemIcon>
								<ListItemText>{tool.name}</ListItemText>
							</ListItemButton>
							<Dialog
								fullScreen
								open={isOpen[tool.shortName]}
								TransitionComponent={Slide}
								TransitionProps={{
									direction: "up",
									in: isOpen[tool.shortName],
								}}
								PaperProps={{
									elevation: 0,
								}}
							>
								<AppBar color="background" elevation={0}>
									<Toolbar>
										<IconButton
											edge="start"
											onClick={() =>
												setIsOpen({ ...isOpen, [tool.shortName]: false })
											}
										>
											<ArrowBackIosNewRoundedIcon />
										</IconButton>
										<Typography variant="h6" sx={styles.toolTitle}>
											{tool.name}
										</Typography>
									</Toolbar>
								</AppBar>
								<Toolbar />
								<Box sx={styles.toolContainer}>{tool.component}</Box>
							</Dialog>
						</div>
					))}
				</List>
			</Card>
		</Slide>
	);
}

const styles = {
	subheader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	toolTitle: {
		position: "absolute",
		left: "50%",
		transform: " translateX(-50%)",
		whiteSpace: "nowrap",
	},
	toolContainer: {
		padding: "16px",
	},
};
