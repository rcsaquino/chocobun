import { createTheme } from "@mui/material";
import { useStore } from "../store";

const themeColors = {
	chocobun: {
		primary: {
			main: "#795548",
		},
		secondary: {
			main: "#795548",
		},
	},
	turon: {
		primary: {
			main: "#F9A825",
		},
		secondary: {
			main: "#F9A825",
		},
	},
	chocoButternut: {
		primary: {
			main: "#E65100",
		},
		secondary: {
			main: "#E65100",
		},
	},
	rice: {
		primary: {
			main: "#FAFAFA",
		},
		secondary: {
			main: "#FAFAFA",
		},
	},
	water: {
		primary: {
			main: "#4285F4",
		},
		secondary: {
			main: "#4285F4",
		},
	},
};

function Theme() {
	const [store] = useStore();
	return createTheme({
		palette: {
			mode: store.theme.mode,
			...themeColors[store.theme.color],
		},
		shape: {
			borderRadius: 20,
		},
	});
}

export { Theme, themeColors };
