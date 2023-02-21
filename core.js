const os = require("os");
const path = require("path");
const { app } = require("electron");

let CORE = "";
const OS_TYPE = os.type();
switch (OS_TYPE) {
  case "Windows_NT":
    if (app.isPackaged)
      CORE = path.join(
        app.getPath("exe"),
        "resources",
        "app",
        "bin",
        "windows",
        "arduino-cli.exe"
      );
    else
      CORE = path.join(app.getAppPath(), "bin", "windows", "arduino-cli.exe");
    break;
  case "Darwin":
    const ARCH_TYPE = os.arch();
    switch (ARCH_TYPE) {
      case "x64":
        CORE = path.join(
          app.getAppPath(),
          "bin",
          "macos",
          "intel64",
          "arduino-cli"
        );
        break;
      case "arm64":
        CORE = path.join(
          app.getAppPath(),
          "bin",
          "macos",
          "arm64",
          "arduino-cli"
        );
    }
    break;
  default:
    break;
}

CORE = "arduino-cli";

module.exports = CORE;
