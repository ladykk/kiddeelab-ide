const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("file", {
  openFile: (path) => ipcRenderer.invoke("file/open", path),
  saveFile: (project, path) => ipcRenderer.invoke("file/save", project, path),
});

contextBridge.exposeInMainWorld("build", {
  verify: (fqbn, code) => ipcRenderer.invoke("build/verify", fqbn, code),
  upload: (port, fqbn, code) =>
    ipcRenderer.invoke("build/upload", port, fqbn, code),
});

contextBridge.exposeInMainWorld("device", {
  fetchDevice: () => ipcRenderer.invoke("device/fetch"),
});

contextBridge.exposeInMainWorld("core", {
  isInstalled: () => ipcRenderer.invoke("core/isInstalled"),
  updateIndex: () => ipcRenderer.invoke("core/updateIndex"),
  installList: () => ipcRenderer.invoke("core/installList"),
  installCore: (platform) => ipcRenderer.invoke("core/installCore", platform),
});

contextBridge.exposeInMainWorld("serial", {
  isOpen: () => ipcRenderer.invoke("serial/isOpen"),
  open: (port, baudRate) => ipcRenderer.invoke("serial/open", port, baudRate),
  close: () => ipcRenderer.invoke("serial/close"),
  write: (message) => ipcRenderer.invoke("serial/write", message),
  onSerialData: (callback) => ipcRenderer.on("serial/data", callback),
  onSerialChange: (callback) => ipcRenderer.on("serial/change", callback),
});
