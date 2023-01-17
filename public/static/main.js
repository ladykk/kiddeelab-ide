const path = require("path");
const { BrowserWindow, app } = require("electron");

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, "logo.png"),
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Load application.
    if (app.isPackaged)
        mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
    else {
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL(`http://localhost:${process.env.PORT || 8601}`);
    }
}

if (require("electron-squirrel-startup")) app.quit();

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
