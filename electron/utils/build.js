const util = require("util");
const exec = util.promisify(require("child_process").exec);
const writeFile = util.promisify(require("fs").writeFile);
const os = require("os");
const CORE = require("../../core");

module.exports.buildVerify = async (event, fqbn, code) => {
  try {
    // Create Sketch
    const newSketch = await exec(`${CORE} sketch new KiddeeIDE`);
    if (newSketch.stderr)
      return {
        status: "error",
        reason: "Cannot create a sketch.",
        error: newSketch.stderr,
      };

    // Setup Path
    let file_path = "";
    let path_tree;
    const path = newSketch.stdout.slice(19).replace(/[\r\n]/gm, "");
    if (os.type() === "Windows_NT") {
      path_tree = path.split(`\\`);
      file_path = path + "\\" + path_tree[path_tree.length - 1] + ".ino";
    } else {
      path_tree = path.split("/");
      file_path = path + "/" + path_tree[path_tree.length - 1] + ".ino";
    }

    // Add Code
    await writeFile(file_path, code);

    // Compile
    const compile = await exec(`${CORE} compile --fqbn ${fqbn} KiddeeIDE`);
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
