const express = require('express')

const { addPaths } = require('./paths')

function _registerRoute(verb, options, pathExpr) {
  const pathData = { uri: pathExpr, method: verb }

  let namespace
  if (options != null && typeof options === 'object') {
    Object.keys(options).forEach(key => {
      if (key !== 'namespace') {
        pathData[key] = options[key]
      }
    })
    namespace = options.namespace
  } else {
    namespace = options
  }

  addPaths(namespace, pathData)
}

class Router {
  constructor() {
    this._router = express.Router()

    const GENERIC_METHODS = ['get', 'post', 'put', 'delete', 'all', 'use']
    GENERIC_METHODS.forEach(name => {
      this[name] = (namespace, pathExpr, ...middlewares) => {
        _registerRoute(name, namespace, pathExpr)
        return this._router[name](pathExpr, ...middlewares)
      }
    })
  }

  getRouter() {
    return this._router
  }
}

function getInstance() {
  return new Router()
}

module.exports = {
  Router: getInstance,
}
