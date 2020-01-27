"use strict";
exports.__esModule = true;
var removeURL = function(routes, urlParts) {
  var currentLevel = routes;
  for (var c = 0; c < urlParts.length; c++) {
    var part = urlParts[c];
    currentLevel = currentLevel[part];
    if (!currentLevel) {
      return false;
    }
  }
  currentLevel.endPoint = false;
  return true;
};
exports["default"] = removeURL;
