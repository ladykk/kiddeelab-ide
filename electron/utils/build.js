const util = require("util");
const exec = util.promisify(require("child_process").exec);
const writeFile = util.promisify(require("fs").writeFile);
const os = require("os");
<<<<<<< HEAD
const CORE = require("../binaries").execPath("arduino-cli");
const libariesPath = require("../binaries").libariesPath;
=======
const CORE = require("../../core");
const { app } = require("electron");
<<<<<<< HEAD
>>>>>>> 78264e6 (bugfixs)
=======
>>>>>>> 78264e618b5f40543412d028a4a40946405e1a58

module.exports.buildVerify = async (event, fqbn, code) => {
  try {
    // Setup Path
    let file_path = app.getAppPath() + "\\KiddeeIDE\\KiddeeIDE.ino";

    // Add Code
    await writeFile(file_path, code);

    // Compile
    const compile = await exec(
      `${CORE} compile --fqbn ${fqbn} KiddeeIDE --libraries "${libariesPath}"`
    );
    if (compile.stderr)
      return {
        status: "error",
        reason: "Compiled failed.",
        error: compile.stderr,
      };

    return {
      status: "success",
      reason: "Successfully compiled.",
      output: compile.stdout,
    };
  } catch (e) {
    return {
      status: "error",
      reason: "Compiled failed.",
      error: e,
    };
  }
};

module.exports.buildUpload = async (event, port, fqbn) => {
  try {
    console.log(`${CORE} upload -p ${port} --fqbn ${fqbn} KiddeeIDE`);
    const { stdout, stderr } = await exec(
      `${CORE} upload -p ${port} --fqbn ${fqbn} KiddeeIDE`
    );

    if (stderr)
      return {
        status: "error",
        reason: "Upload failed.",
        error: stderr,
      };

    return {
      status: "success",
      reason: "Successfully uploaded.",
      output: stdout,
    };
  } catch (e) {
    return {
      status: "error",
      reason: "Upload failed.",
      error: e,
    };
  }
};
