const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { fileOpen, fileSave } = require("./electron/utils/file");
const { buildVerify, buildUpload } = require("./electron/utils/build");
const { deviceFetch } = require("./electron/utils/device");
const {
  coreIsInstalled,
  coreInstallList,
  coreUpdateIndex,
  coreInstallCore,
} = require("./electron/utils/core");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "electron", "preload.js"),
    },
  });

  if (app.isPackaged)
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  else {
    mainWindow.loadURL("http://localhost:5173/");
  }
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("file/open", fileOpen(mainWindow));
  ipcMain.handle("file/save", fileSave(mainWindow));

  ipcMain.handle("build/verify", buildVerify);
  ipcMain.handle("build/upload", buildUpload);

  ipcMain.handle("device/fetch", deviceFetch);

  ipcMain.handle("core/isInstalled", coreIsInstalled);
  ipcMain.handle("core/updateIndex", coreUpdateIndex);
  ipcMain.handle("core/installList", coreInstallList);
  ipcMain.handle("core/installCore", coreInstallCore);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
