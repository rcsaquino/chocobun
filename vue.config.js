module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    // Generate manifest.json
    name: "Chocobun App",
    themeColor: "#000000",
    manifestOptions: {
      short_name: "Chocobun",
      start_url: "index.html",
      display: "standalone",
      background_color: "#FFEBCD",
      orientation: "portrait",
      icons: [
        {
          src: "img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    msTileColor: "#da532c",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    assetsVersion: "2",

    // Icons. Last updated 04/11/20 using realfavicongenerator.net
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon.png",
      maskIcon: "img/icons/safari-pinned-tab.svg",
      msTileImage: "img/icons/mstile-150x150.png",
    },

    // Configure workbox plugin
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: "index.html",
      offlineGoogleAnalytics: true,
      cleanupOutdatedCaches: true,
    },
  },
};
