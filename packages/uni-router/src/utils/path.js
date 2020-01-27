"use strict";
exports.__esModule = true;
var cleanUp = function(path) {
  path = path.replace(/^\/|\/$/g, "");
  path = path.replace(/^\/\//, "/");
  return path;
};
exports.cleanUp = cleanUp;
