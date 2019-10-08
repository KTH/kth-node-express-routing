const express = require('express')
const { safeGet } = require('safe-utils')

function _splice(arr, start, nrof) {
  const newArr = Array.prototype.slice.call(arr)
  const outp = arguments.length <= 2 ? newArr.splice(start) : newArr.splice(start, nrof)
  return outp
}

function _createApiScopeHandler(apiKeyScopes) {
  return (req, res, next) => {
    if (apiKeyScopes) {
      req.scope = apiKeyScopes // path.apikey.scopes
    }
    next()
  }
}

function Router(checkApiKeyMiddleware) {
  this._router = express.Router()
  this._checkApiKeyMiddleware = checkApiKeyMiddleware
}

Router.prototype.register = function register(apiPathObj, middleware, ...args) {
  const routeArgs = _splice(args, 1)

  /**
   * api_key strategy
   */
  // Check apiPathObj to see if we should do the checkApiKeyMiddleware access control
  const scopes = safeGet(() => apiPathObj.openid.scopes.api_key)
  const scopesRequired = safeGet(() => apiPathObj.openid.scope_required)

  if (scopes && scopes.length > 0 && scopesRequired) {
    if (typeof this._checkApiKeyMiddleware !== 'function') {
      throw new Error(
        'Missing middleware to check api key scopes. You should instantiate your ApiRouter something like this: const apiRoute = ApiRouter(authByApiKey)'
      )
    }
    // Add api key scope check
    routeArgs.unshift(this._checkApiKeyMiddleware)

    // Add scope to request before scope check (unshift inserts before)
    routeArgs.unshift(_createApiScopeHandler(scopes))
  }

  /**
   * TODO: If we want to implement OAuth, OpenId or similar strategy we would
   * add it here. Look at the "api_key strategy" above /jhsware
   */

  // Insert the mount path so the apply signature is correct
  routeArgs.unshift(apiPathObj.uri)

  const verb = apiPathObj.method.toLowerCase()
  return this._router[verb].apply(this._router, routeArgs)
}

Router.prototype.getRouter = function getRouter() {
  return this._router
}

module.exports.Router = checkApiKeyMiddleware => new Router(checkApiKeyMiddleware)
