"use strict";
const path = require("path");
const { rootPath } = require("electron-root-path");
const { isPackaged } = require("electron").app;

const root = isPackaged ? rootPath.slice(0, rootPath.length - 31) : rootPath;
const binariesPath = path.join(root, "./bin");

const libariesPath = path.join(root, "./libraries");

module.exports.execPath = (binary) =>
  path.resolve(path.join(binariesPath, `${binary}.exe`));
module.exports.libariesPath = libariesPath;
