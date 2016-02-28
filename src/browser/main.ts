const app = require("app");
const browserWindow = require("browser-window");

require("crash-reporter").start();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  let win = new browserWindow({width: 800, height: 600});
  win.loadUrl("file://" + __dirname + "/../views/index.html");
  win.on("closed", () => {
    win = undefined;
  });
});
