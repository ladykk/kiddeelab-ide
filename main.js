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
const serve = require("electron-serve");

require("update-electron-app")();

const loadUrl = serve({ directory: "dist" });

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "src", "assets", "icon", "icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "electron", "preload.js"),
    },
    autoHideMenuBar: true,
  });

  ipcMain.handle("file/open", fileOpen(mainWindow));
  ipcMain.handle("file/save", fileSave(mainWindow));

  ipcMain.handle("build/verify", buildVerify);
  ipcMain.handle("build/upload", buildUpload);

  ipcMain.handle("device/fetch", deviceFetch);

  ipcMain.handle("core/isInstalled", coreIsInstalled);
  ipcMain.handle("core/updateIndex", coreUpdateIndex);
  ipcMain.handle("core/installList", coreInstallList);
  ipcMain.handle("core/installCore", coreInstallCore);

  if (app.isPackaged) await loadUrl(mainWindow);
  else {
    mainWindow.loadURL("http://localhost:5173/");
  }

  return mainWindow;
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

if (require("electron-squirrel-startup")) app.quit();

app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
  });
});
