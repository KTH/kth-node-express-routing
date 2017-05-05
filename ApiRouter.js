const express = require('express')
const { safeGet } = require('safe-utils')

function _splice (arr, start, nrof) {
  var newArr = Array.prototype.slice.call(arr)
  var outp = arguments.length <= 2 ? newArr.splice(start) : newArr.splice(start, nrof)
  return outp
}

function createApiScopeHandler (apiKeyScopes) {
  return function (req, res, next) {
    if (apiKeyScopes) {
      req.scope = apiKeyScopes // path.apikey.scopes
    }
    next()
  }
}

function Router () {
  this._router = express.Router()
}

Router.prototype.register = function (apiPathObj, middleware) {
  var routeArgs = _splice(arguments, 1)
  routeArgs.unshift(createApiScopeHandler(safeGet(() => apiPathObj.apikey.scopes)))
  routeArgs.unshift(apiPathObj.uri)
  var verb = apiPathObj.method.toLowerCase()
  return this._router[verb].apply(this._router, routeArgs)
}

Router.prototype.getRouter = function () {
  return this._router
}

module.exports.Router = function () {
  return new Router()
}