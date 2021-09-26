import { render } from "preact";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { StoreProvider } from "./store";
import ServiceWorker from "./ServiceWorker";
import { version } from "../package.json";
import ReactGA from "react-ga4";

import "./styles/main.css";

document.title = `Chocobun v${version}`;

const dev =
	window.location.href.includes("chocobunapp") ||
	window.location.href.includes("localhost") ||
	process.env.NODE_ENV !== "production";

// Analytics
ReactGA.initialize(dev ? "G-2TJY53QMQC" : "G-M5NGJ7WDGB");

render(
	<StoreProvider>
		<CssBaseline />
		<ServiceWorker />
		<App />
	</StoreProvider>,
	document.getElementById("app")
);
