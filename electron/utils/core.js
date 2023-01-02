const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports.coreIsInstalled = async (event) => {
  try {
    const { stdout, stderr } = await exec("arduino-cli version");
    if (stderr) return stdout.includes("arduino-cli");
    else return true;
  } catch (e) {
    return false;
  }
};

module.exports.coreUpdateIndex = async (event) => {
  try {
    const { stdout, stderr } = await exec("arduino-cli core update-index");
    if (stderr) return false;
    else return true;
  } catch (e) {
    return false;
  }
};

module.exports.coreInstallList = async (event) => {
  try {
    const { stdout, stderr } = await exec(
      "arduino-cli core list --format jsonmini"
    );
    if (stderr) return;
    else return JSON.parse(stdout).map((core) => core.id);
  } catch (e) {
    return;
  }
};

module.exports.coreInstallCore = async (event, platform) => {
  try {
    const { stdout, stderr } = await exec(
      `arduino-cli core install ${platform}`
    );
    if (stderr) return false;
    else return true;
  } catch (e) {
    return false;
  }
};
