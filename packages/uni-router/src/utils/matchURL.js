"use strict";
exports.__esModule = true;
var paramRegExp = new RegExp("^:([^:]*)");
var checkParams = function(currentLevel, urlParts) {
  var handler;
  var action;
  var matched = false;
  var matchedParts = [];
  var matchedParams = {};
  if (urlParts.length) {
    var part = urlParts[0];
    if (currentLevel.params && currentLevel.params.length) {
      for (var c = 0; c < currentLevel.params.length; c++) {
        var param = currentLevel.params[c];
        var paramKey = param.match(paramRegExp)[1];
        if (
          urlParts.length == 1 &&
          currentLevel[param] &&
          currentLevel[param].endPoint
        ) {
          matched = true;
          handler = currentLevel[param].handler;
          matchedParts.push(param);
          action = currentLevel[param].action;
          matchedParams[paramKey] = part;
          break;
        } else {
          var paramResult = matchURL(
            currentLevel[param],
            urlParts.slice(1, urlParts.length)
          );
          if (paramResult.matched) {
            matched = true;
            action = paramResult.action;
            handler = paramResult.handler;
            matchedParts.push(param);
            matchedParts = matchedParts.concat(paramResult.url);
            matchedParams = Object.assign({}, paramResult.params);
            matchedParams[paramKey] = part;
            break;
          } else {
            matched = false;
          }
        }
      }
    } else {
      matched = false;
    }
  }
  return {
    matched: matched,
    url: matchedParts,
    params: matchedParams,
    handler: handler,
    action: action
  };
};
var matchURL = function(currentLevel, urlParts) {
  var parentLevel = currentLevel;
  var result = {
    matched: false,
    url: [],
    params: {}
  };
  var handler;
  var action;
  var matched = false;
  var matchedParts = [];
  var matchedParams = {};
  if (urlParts.length) {
    var part = urlParts[0];
    if (part) {
      if (part in currentLevel) {
        matchedParts.push(part);
        currentLevel = currentLevel[part];
        if (urlParts.length == 1 && currentLevel.endPoint) {
          matched = true;
          handler = currentLevel.handler;
          action = currentLevel.action;
        } else {
          var paramResult = matchURL(
            currentLevel,
            urlParts.slice(1, urlParts.length)
          );
          if (!paramResult.matched) {
            matchedParts.pop();
            currentLevel = parentLevel;
            paramResult = checkParams(currentLevel, urlParts);
          }
          matched = paramResult.matched;
          handler = paramResult.handler;
          action = paramResult.action;
          matchedParts = matchedParts.concat(paramResult.url);
          matchedParams = Object.assign({}, paramResult.params);
        }
      } else {
        var paramResult = checkParams(currentLevel, urlParts);
        matched = paramResult.matched;
        handler = paramResult.handler;
        action = paramResult.action;
        matchedParts = paramResult.url;
        matchedParams = paramResult.params;
      }
    } else if (urlParts.length == 1 && currentLevel.endPoint) {
      matched = true;
      handler = currentLevel.handler;
      action = currentLevel.action;
    }
    if (!matched && "*" in currentLevel) {
      currentLevel = currentLevel["*"];
      matched = true;
      handler = currentLevel.handler;
      action = currentLevel.action;
      matchedParts.push("*");
    }
  }
  result.url = matchedParts;
  result.params = matchedParams;
  result.handler = handler;
  result.action = action;
  result.matched = matched;
  return result;
};
exports["default"] = matchURL;
