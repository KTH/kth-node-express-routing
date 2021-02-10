const yup = require('yup')
const express = require('express')

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

/**
 * This function throws an error
 * if the given path-object has an invalid structure.
 *
 * @param {*} input
 * @throws
 */
function ensureValidPathObject(input) {
  const _objectContainsExactlyOneStrategy = {
    name: 'scopes contains exactly one strategy',
    // eslint-disable-next-line no-template-curly-in-string
    message: '${path} must contain exactly one strategy',
    test: object => Object.keys(object).length === 1,
  }

  const pathObjectSchema = yup
    .object({
      uri: yup.string().required(),
      method: yup
        .string()
        .required()
        .matches(/^(GET|POST|PUT|DELETE)$/i),
      openid: yup
        .object({
          scope_required: yup.boolean().required().oneOf([true]),
          scopes: yup
            .object({
              api_key: yup.array(yup.string().required()).min(1),
              // connect: yup.array(yup.string().required()).min(1),
            })
            .required()
            .noUnknown()
            .test(_objectContainsExactlyOneStrategy),
        })
        .notRequired()
        .noUnknown(),
    })
    .required()
    .noUnknown()

  pathObjectSchema.validateSync(input, { strict: true })

  const { method, openid } = input

  if (method.toUpperCase() !== 'GET' && openid == null) {
    throw new Error(`Missing prop "openid" in input - mandatory with method "${method}"`)
  }
}

Router.prototype.register = function register(apiPathObj, ...routeArgs) {
  try {
    ensureValidPathObject(apiPathObj)
  } catch (error) {
    error.message = `register() failed - ${error.message}`
    throw error
  }

  if (apiPathObj.openid && apiPathObj.openid.scope_required) {
    const { scopes } = apiPathObj.openid

    if (scopes.api_key) {
      if (typeof this._checkApiKeyMiddleware !== 'function') {
        throw new Error(
          'Missing middleware to check api key scopes. You should instantiate your ApiRouter something like this: const apiRoute = ApiRouter(authByApiKey)'
        )
      }

      routeArgs.unshift(_createApiScopeHandler(scopes.api_key), this._checkApiKeyMiddleware)
    }

    /**
     * If we want to implement OAuth, OpenId or similar strategy we would add it here.
     *    e.g. if (scopes.connect) { ... }
     */
  }

  const verb = apiPathObj.method.toLowerCase()
  return this._router[verb](apiPathObj.uri, ...routeArgs)
}

Router.prototype.getRouter = function getRouter() {
  return this._router
}

module.exports.Router = checkApiKeyMiddleware => new Router(checkApiKeyMiddleware)
