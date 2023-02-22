const path = require("path");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { fileOpen, fileSave } = require("./electron/utils/file");
const { buildVerify, buildUpload } = require("./electron/utils/build");
const { deviceFetch } = require("./electron/utils/device");
const {
  coreIsInstalled,
  coreInstallList,
  coreUpdateIndex,
  coreInstallCore,
} = require("./electron/utils/core");
const {
  serialIsOpen,
  serialOpen,
  serialClose,
  serialWrite,
} = require("./electron/utils/serial");
const serve = require("electron-serve");

const loadUrl = serve({ directory: "out" });

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "src", "assets", "icon", "icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "electron", "preload.js"),
    },
    autoHideMenuBar: app.isPackaged,
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

  ipcMain.handle("serial/isOpen", serialIsOpen);
  ipcMain.handle("serial/open", serialOpen(mainWindow));
  ipcMain.handle("serial/close", serialClose);
  ipcMain.handle("serial/write", serialWrite);

  if (app.isPackaged) await loadUrl(mainWindow);
  else {
    mainWindow.loadURL("http://127.0.0.1:5173/");
  }

  mainWindow.on("close", (e) => {
    e.preventDefault();
    dialog
      .showMessageBox({
        type: "info",
        buttons: ["Cancel", "Exit"],
        cancelId: 1,
        defaultId: 0,
        title: "Close KiddeeLab IDE",
        detail: "Make sure you save all file before exit.",
      })
      .then(({ response, checkboxChecked }) => {
        if (response) {
          mainWindow.destroy();
        }
      });
  });

  return mainWindow;
};

app.on("window-all-closed", () => {
  app.quit();
});

app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
  });
});
