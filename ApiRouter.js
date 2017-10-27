const express = require('express')
const { safeGet } = require('safe-utils')

function _splice (arr, start, nrof) {
  var newArr = Array.prototype.slice.call(arr)
  var outp = arguments.length <= 2 ? newArr.splice(start) : newArr.splice(start, nrof)
  return outp
}

function _createApiScopeHandler (apiKeyScopes) {
  return function (req, res, next) {
    if (apiKeyScopes) {
      req.scope = apiKeyScopes // path.apikey.scopes
    }
    next()
  }
}

function Router (checkApiKeyMiddleware) {
  this._router = express.Router()
  this._checkApiKeyMiddleware = checkApiKeyMiddleware
}

Router.prototype.register = function (apiPathObj, middleware) {
  var routeArgs = _splice(arguments, 1)

  /**
   * api_key strategy
   */
  // Check apiPathObj to see if we should do the checkApiKeyMiddleware access control
  if (apiPathObj.apikey &&
      apiPathObj.apikey.type === 'api_key' &&
      apiPathObj.apikey.scope_required) {
    if (typeof this._checkApiKeyMiddleware !== 'function') {
      throw new Error('Missing middleware to check api key scopes. You should instantiate your ApiRouter something like this: const apiRoute = ApiRouter(authByApiKey)')
    }
    // Add api key scope check
    routeArgs.unshift(this._checkApiKeyMiddleware)

    // Add scope to request before scope check (unshift inserts before)
    routeArgs.unshift(_createApiScopeHandler(safeGet(() => apiPathObj.apikey.scopes)))
  }

  /**
   * TODO: If we want to implement OAuth, OpenId or similar strategy we would
   * add it here. Look at the "api_key strategy" above /jhsware
   */

  // Insert the mount path so the apply signature is correct
  routeArgs.unshift(apiPathObj.uri)

  var verb = apiPathObj.method.toLowerCase()
  return this._router[verb].apply(this._router, routeArgs)
}

Router.prototype.getRouter = function () {
  return this._router
}

module.exports.Router = function (checkApiKeyMiddleware) {
  return new Router(checkApiKeyMiddleware)
}
