const CORE = require("../../core");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports.deviceFetch = async (event) => {
  try {
    const { stdout, stderror } = await exec(
      `${CORE} board list --format jsonmini`
    );
    if (stderror) return console.warn(stderror);
    return JSON.parse(stdout);
  } catch (e) {
    return console.warn(e);
  }
};
