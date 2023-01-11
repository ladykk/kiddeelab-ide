const fs = require("fs");
const os = require("os");
const { dialog } = require("electron");

module.exports.fileOpen = (mainWindow) => async (event, path) => {
  if (typeof path !== "string") {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: "Open project",
      defaultPath: `${os.homedir()}/Desktop`,
      buttonLabel: "Open",
      filters: [{ name: "KiddeeLab IDE Project", extensions: ["kdle"] }],
      properties: ["openFile"],
    });
    if (canceled || !filePaths)
      return {
        status: "canceled",
      };
    path = filePaths[0];
  }

  const raw = fs.readFileSync(path);
  const data = JSON.parse(raw);
  return {
    status: "success",
    path: path,
    data: data,
  };
};

module.exports.fileSave = (mainWindow) => async (event, project, path) => {
  if (typeof path !== "string") {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Save project",
      defaultPath: `${os.homedir()}/Desktop`,
      buttonLabel: "Save",
      filters: [{ name: "KiddeeLab IDE Project", extensions: ["kdle"] }],
      properties: ["createDirectory"],
    });
    if (canceled || !filePath)
      return {
        status: "canceled",
      };

    path = filePath;
  }
  fs.writeFileSync(path, JSON.stringify(project));
  return {
    status: "success",
    path: path,
  };
};
