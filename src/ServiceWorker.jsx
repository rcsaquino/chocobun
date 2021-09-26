import { useEffect } from "preact/hooks";
import { registerSW } from "virtual:pwa-register";
import { useStore } from "./store";

export default function ServiceWorker() {
	const [, updateStore] = useStore();
	useEffect(() => {
		registerSW({
			// Register success
			onRegistered(r) {
				console.log("Service Worker Registered", r);

				// Update worker status to active.state if possible
				if (r.active) updateStore("workerStatus", r.active.state);

				// Update found, install
				r.onupdatefound = () => {
					const installingWorker = r.installing;
					console.log("Update found, installing");
					updateStore("workerStatus", "installing");

					// Handle state changes (installing, installed, activating, activated, error, ...)
					installingWorker.onstatechange = () => {
						updateStore("workerStatus", installingWorker.state);
						console.log("Service Worker:", installingWorker.state);
					};

					// Handle install error
					installingWorker.onerror = e => {
						updateStore("workerStatus", "error");
						console.log("Error installing service worker:", e);
					};
				};
			},

			// Register Error
			onRegisterError(e) {
				console.log("Service Worker Register Error", e);
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
