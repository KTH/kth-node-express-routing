const express = require('express')

// TODO: use singleton of _routeDefs

const _routeDefs = {}

function Router () {
  this._router = express.Router()
}

function _splice (arr, start, nrof) {
  var newArr = Array.prototype.slice.call(arr)
  var outp = arguments.length <= 2 ? newArr.splice(start) : newArr.splice(start, nrof)
  return outp
}

function _unshift (arr, item) {
  var newArr = Array.prototype.slice.call(arr)
  newArr.unshift(item)
  return newArr
}

Router.prototype._registerRoute = function (verb, options, pathExpr) {
  let namespace
  let addOptions = {}
  if (typeof options === 'object') {
    namespace = options.namespace
    Object.assign(addOptions, options)
    delete addOptions.namespace
  } else {
    namespace = options
  }

  var namespaceTuple = namespace.split('.')
  var cursor = _routeDefs
  for (let index in namespaceTuple) {
    const tmp = namespaceTuple[index]
    if (index < namespaceTuple.length - 1) {
      if (cursor[tmp] === undefined) {
        cursor[tmp] = {}
      }
      cursor = cursor[tmp]
    } else {
      cursor[tmp] = Object.assign({
        uri: pathExpr,
        method: verb
      }, addOptions)
    }
  }
}

const verbs = ['get', 'post', 'put', 'delete', 'all', 'use']
verbs.forEach((verb) => {
  Router.prototype[verb] = function (namespace, pathExpr) {
    this._registerRoute(verb, namespace, pathExpr)
    var middlewares = _splice(arguments, 2)
    var args = _unshift(middlewares, pathExpr)
    return this._router[verb].apply(this._router, args)
  }
})

Router.prototype.getRouter = function () {
  return this._router
}

module.exports.Router = function () {
  return new Router()
}

module.exports.getPaths = function () {
  return _routeDefs
}

module.exports.addPaths = function (namespace, pathObj) {
  var namespaceTuple = namespace.split('.')
  var cursor = _routeDefs
  for (let index in namespaceTuple) {
    const tmp = namespaceTuple[index]
    if (index < namespaceTuple.length - 1) {
      if (cursor[tmp] === undefined) {
        cursor[tmp] = {}
      }
      cursor = cursor[tmp]
    } else {
      cursor[tmp] = pathObj
    }
  }
}
