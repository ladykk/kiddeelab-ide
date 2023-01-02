const { exec } = require("child_process");

exec("arduino-cli board list", (error, stdout, stderr) => {
  console.log(stdout);
});
