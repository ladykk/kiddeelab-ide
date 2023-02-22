const { SerialPort, ReadyParser, DelimiterParser } = require("serialport");

let serial = null;

module.exports.serialIsOpen = async (event) => {
  if (serial === null) return false;
  else return true;
};

module.exports.serialOpen = (mainWindow) => async (event, port, baudRate) => {
  try {
    serial = new SerialPort({ path: port, baudRate: baudRate });
    const parser = serial.pipe(new DelimiterParser({ delimiter: "\r" }));
    serial.on("open", (err) => {
      if (err) mainWindow.webContents.send("serial/change", false);
      else mainWindow.webContents.send("serial/change", true);
    });
    parser.on("data", (data) => {
      mainWindow.webContents.send("serial/data", {
        timestamp: new Date(),
        message: data,
      });
    });
    serial.on("close", () => {
      mainWindow.webContents.send("serial/change", false);
    });
    serial.cl;
    return true;
  } catch (error) {
    return false;
  }
};

module.exports.serialClose = async (event) => {
  try {
    if (serial !== null) {
      await serial.close((err) => {});
      serial = null;
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports.serialWrite = async (event, message) => {
  try {
    if (serial) {
      serial.write(message);
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
};
