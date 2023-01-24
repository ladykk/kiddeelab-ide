const util = require("util");
const exec = util.promisify(require("child_process").exec);
const CORE = require("../../core");

const ADDITIONAL_URLS = [
  "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json",
];

const LIBS = ["DHT sensor library", "ESPAsyncWebSrv", "Servo"];

const ADDITIONAL_URLS_STRING =
  ADDITIONAL_URLS.length > 0 ? `${ADDITIONAL_URLS.join(" ")}` : "";

const LIBS_STRING =
  LIBS.length > 0 ? LIBS.map((lib) => `"${lib}"`).join(" ") : "";

module.exports.coreIsInstalled = async (event) => {
  try {
    const { stdout, stderr } = await exec(`${CORE} version`);
    if (stderr) return stdout.includes("arduino-cli");
    else return true;
  } catch (e) {
    return false;
  }
};

module.exports.coreUpdateIndex = async (event) => {
  try {
    const initConfig = await exec(`${CORE} core init`);
    if (initConfig.stderr) return false;

    if (ADDITIONAL_URLS.length > 0) {
      const addBoardList = await exec(
        `${CORE} config set board_manager.additional_urls ${ADDITIONAL_URLS_STRING}`
      );
      if (addBoardList.stderr) return false;
    }

    const updateIndex = await exec(`${CORE} core update-index`);
    if (updateIndex.stderr) return false;

    if (LIBS_STRING.length > 0) {
      const { stdout, stderr } = await exec(
        `${CORE} lib install ${LIBS_STRING}`
      );
      if (stderr) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

module.exports.coreInstallList = async (event) => {
  try {
    const { stdout, stderr } = await exec(
      `${CORE} core list --format jsonmini`
    );
    if (stderr) return [];
    else return JSON.parse(stdout).map((core) => core.id) ?? [];
  } catch (e) {
    return [];
  }
};

module.exports.coreInstallCore = async (event, platform) => {
  try {
    const { stdout, stderr } = await exec(`${CORE} core install ${platform}`);
    if (stderr) return false;
    else return true;
  } catch (e) {
    return false;
  }
};
