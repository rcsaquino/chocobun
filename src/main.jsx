import { render } from "preact";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { StoreProvider } from "./store";

import "./styles/main.css";

import { registerSW } from "virtual:pwa-register";

registerSW();

// const updateSW = registerSW({
// 	onNeedRefresh() {},
// 	onOfflineReady() {},
// });

render(
	<StoreProvider>
		<CssBaseline />
		<App />
	</StoreProvider>,
	document.getElementById("app")
);
