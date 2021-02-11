const yup = require('yup')
const express = require('express')

function _createApiScopeHandler(apiKeyScopes) {
  return (req, res, next) => {
    req.scope = apiKeyScopes
    next()
  }
}

/**
 * This function throws an error if the given path-object has an invalid structure.
 *
 * @param {*} input
 * @throws
 */
function _ensureValidPathObject(input) {
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
    throw new Error(`Missing prop "openid" in input, which is mandatory with method "${method}"`)
  }
}

class Router {
  constructor(checkApiKeyMiddleware) {
    this._router = express.Router()
    this._checkApiKeyMiddleware = checkApiKeyMiddleware
  }

  /**
   * @returns {object}
   *    Underlying Express.js Router
   */
  getRouter() {
    return this._router
  }

  /**
   * @param {object} apiPathObj
   * @param {Function[]} routeHandlers
   * @throws
   *    e.g. in case of invalid apiPathObj
   * @returns {object}
   *    Underlying Express.js Router
   */
  register(apiPathObj, ...routeHandlers) {
    try {
      _ensureValidPathObject(apiPathObj)
    } catch ({ message }) {
      throw new Error(`register() failed - ${message} (apiPathObj: ${JSON.stringify(apiPathObj)})`)
    }

    if (apiPathObj.openid && apiPathObj.openid.scope_required) {
      const { scopes } = apiPathObj.openid

      if (scopes.api_key) {
        if (typeof this._checkApiKeyMiddleware !== 'function') {
          throw new Error(
            'Missing middleware to check api key scopes. You should instantiate your ApiRouter something like this: const apiRoute = ApiRouter(authByApiKey)'
          )
        }

        routeHandlers.unshift(_createApiScopeHandler(scopes.api_key), this._checkApiKeyMiddleware)
      }

      /**
       * If we want to implement OAuth, OpenId or similar strategy we would add it here.
       *    e.g. if (scopes.connect) { ... }
       */
    }

    const verb = apiPathObj.method.toLowerCase()
    return this._router[verb](apiPathObj.uri, ...routeHandlers)
  }
}

module.exports = {
  Router: function _getNewInstance(checkApiKeyMiddleware) {
    return new Router(checkApiKeyMiddleware)
  },
}
