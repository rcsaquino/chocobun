// Define file system
const fs = require("fs");

// Define paths
const gaPath = "analytics/ga.html";
const buildPath = "dist/index.html";

// Get ga.html
fs.readFile(gaPath, function(err, ga) {
  if (err) throw err;
  // Convert ga to string and minify
  ga = ga
    .toString()
    .replace(/(\s)/g, "")
    .replace("scriptasyncsrc", "script async src")
    .replace("functiongtag", "function gtag")
    .replace("newDate", "new Date");

  // Get index.html from build folder
  fs.readFile(buildPath, function(err, data) {
    if (err) throw err;

    // Determine position to insert GA
    data = data.toString();
    insertPos = data.search("<head>") + 6;

    // Insert GA at determined position
    data = data.substring(0, insertPos) + ga + data.substring(insertPos);
    fs.writeFile(buildPath, data, function(err) {
      if (err) throw err;
      console.log(
        "\x1b[30m\x1b[44m",
        "ANALYTICS " + "\x1b[0m",
        "Successfully inserted" + "\x1b[36m",
        gaPath + "\x1b[0m",
        "to" + "\x1b[36m",
        buildPath + "\x1b[0m"
      );
    });
  });
});
