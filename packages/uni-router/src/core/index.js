"use strict";
exports.__esModule = true;
var path_1 = require("../utils/path");
var matchURL_1 = require("../utils/matchURL");
var removeURL_1 = require("../utils/removeURL");
/**
 * Main class for router
 */
var UniRouter = /** @class */ (function() {
  function UniRouter(routes) {
    var _this = this;
    this.addRoute = function(path, handler, action) {
      var url = path_1.cleanUp(path);
      var parts = url.split("/");
      var currentLevel = _this.routes;
      var regExp = new RegExp("^:([^:]*)");
      parts.map(function(part, index) {
        var match = part.match(regExp);
        var parameterized = false;
        if (match) {
          parameterized = true;
        }
        if (part) {
          if (!(part in currentLevel)) {
            currentLevel[part] = {};
          }
          if (parameterized) {
            if (!currentLevel.params) {
              currentLevel.params = [];
            }
            var params = currentLevel.params;
            params.indexOf(part) == -1 && params.push(part);
            currentLevel.params = params;
          }
          currentLevel = currentLevel[part];
        }
        if (!part || index == parts.length - 1) {
          if (currentLevel.endPoint) {
            throw new Error("Conflicting route: " + path);
          }
          currentLevel.action = action;
          currentLevel.endPoint = true;
          currentLevel.handler = handler;
        }
      });
      return true;
    };
    this.removeRoute = function(path) {
      var url = path_1.cleanUp(path);
      var parts = url.split("/");
      var currentLevel = _this.routes;
      return removeURL_1["default"](currentLevel, parts);
    };
    this.match = function(path) {
      var url = path_1.cleanUp(path);
      var parts = url.split("/");
      var currentLevel = _this.routes;
      var result = matchURL_1["default"](currentLevel, parts);
      var matchResult = {
        matched: result.matched,
        url: (result.matched && "/" + result.url.join("/")) || "",
        handler: result.handler,
        action: result.action,
        params: result.params
      };
      if (!matchResult.handler && _this.handler) {
        matchResult.handler = _this.handler;
      }
      return matchResult;
    };
    this.routeConfig = routes;
    this.routes = {};
    if (routes && routes.length) {
      routes.map(function(route) {
        _this.addRoute(route.url, route.handler);
      });
    }
  }
  return UniRouter;
})();
exports["default"] = UniRouter;
