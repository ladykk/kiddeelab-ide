const mainWindow = require("../../main");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports.deviceFetch = async (event) => {
  try {
    const { stdout, stderror } = await exec(
      "arduino-cli board list --format jsonmini"
    );
    if (stderror) return console.warn(stderror);
    return JSON.parse(stdout);
  } catch (e) {
    return console.warn(e);
  }
};
