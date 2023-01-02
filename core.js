const os = require("os");
const path = require("path");

let CORE = "";
const OS_TYPE = os.type();
switch (OS_TYPE) {
  case "Windows_NT":
    CORE = path.join(__dirname, "bin", "windows", "arduino-cli.exe");
    break;
  case "Darwin":
    const ARCH_TYPE = os.arch();
    switch (ARCH_TYPE) {
      case "x64":
        CORE = path.join(__dirname, "bin", "macos", "intel64", "arduino-cli");
        break;
      case "arm64":
        CORE = path.join(__dirname, "bin", "macos", "arm64", "arduino-cli");
    }
    break;
  default:
    break;
}

module.exports = CORE;
