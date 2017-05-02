const express = require('express')

// TODO: use singleton of _routeDefs

function Router () {
  this._router = express.Router()
  this._routeDefs = {}
}

function _splice(arr, start, nrof) {
  var newArr = Array.prototype.slice.call(arr)
  var outp = arguments.length <= 2 ? newArr.splice(start) : newArr.splice(start, nrof)
  return outp
}

function _unshift(arr, item) {
  var newArr = Array.prototype.slice.call(arr)
  newArr.unshift(item)
  return newArr
}

Router.prototype._registerRoute = function (verb, namespace, pathExpr) {
  var namespaceTuple = namespace.split('.')
  var cursor = this._routeDefs
  for (let index in namespaceTuple) {
    const tmp = namespaceTuple[index]
    if (index < namespaceTuple.length - 1) {
      if (cursor[tmp] === undefined) {
        cursor[tmp] = {}
      }
      cursor = cursor[tmp]
    } else {
      cursor[tmp] = {
        uri: pathExpr,
        method: verb
      }
    }
  }
}

Router.prototype.verb = function (verb, namespace, pathExpr) {

  // 1 Add to _routeDefs
  
  // 2 Invoke express router
  console.log(this._router.get)
  return this._router[verb](pathExpr, middlewares)
}

Router.prototype.get = function (namespace, pathExpr) {
  this._registerRoute('get', namespace, pathExpr)
  var middlewares = _splice(arguments, 2)
  var args = _unshift(middlewares, pathExpr)
  return this._router.get.apply(this._router, args)
}
Router.prototype.post = function (namespace, pathExpr) {
  this._registerRoute('post', namespace, pathExpr)
  var middlewares = _splice(arguments, 2)
  var args = _unshift(middlewares, pathExpr)
  return this._router.get.apply(this._router, args)
}
Router.prototype.put = function (namespace, pathExpr) {
  this._registerRoute('put', namespace, pathExpr)
  var middlewares = _splice(arguments, 2)
  var args = _unshift(middlewares, pathExpr)
  return this._router.get.apply(this._router, args)
}
Router.prototype.del = function (namespace, pathExpr) {
  this._registerRoute('del', namespace, pathExpr)
  var middlewares = _splice(arguments, 2)
  var args = _unshift(middlewares, pathExpr)
  return this._router.get.apply(this._router, args)
}
Router.prototype.all = function (namespace, pathExpr) {
  this._registerRoute('all', namespace, pathExpr)
  var middlewares = _splice(arguments, 2)
  var args = _unshift(middlewares, pathExpr)
  return this._router.get.apply(this._router, args)
}
Router.prototype.use = function (namespace, pathExpr) {
  this._registerRoute('use', namespace, pathExpr)
  var middlewares = _splice(arguments, 2)
  var args = _unshift(middlewares, pathExpr)
  return this._router.get.apply(this._router, args)
}

Router.prototype.getPaths = function () {
  return this._routeDefs
}

Router.prototype.getRouter = function () {
  return this._router
}

module.exports.Router = function () {
  return new Router()
}