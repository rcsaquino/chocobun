import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

const PWA_CONFIG = {
	filename: "service-worker.js",
	includeAssets: [
		"src/assets/icons/favicon-16x16.ico",
		"src/assets/icons/favicon-32x32.ico",
		"src/assets/icons/apple-touch-icon.png",
		"src/assets/robots.txt",
	],
	workbox: {
		skipWaiting: true,
		clientsClaim: true,
		// offlineGoogleAnalytics: true,
		cleanupOutdatedCaches: true,
	},
	manifest: {
		name: "Chocobun",
		short_name: "Chocobun",
		description: "Made by Chocobun Fam",
		display: "standalone",
		theme_color: "#FFEBCD",
		background_color: "#FFEBCD",
		orientation: "portrait",

		// Icons. Last updated 09/14/21 using realfavicongenerator.net
		icons: [
			{
				src: "/icons/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icons/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	},
};

export default defineConfig({
	plugins: [preact(), VitePWA(PWA_CONFIG)],
});
