/* eslint-env mocha */
'use strict'
const expect = require('chai').expect

const express = require('../index')

describe('Router', function () {
  it('can be created', function () {
    const router = express.Router()
    expect(router).not.to.equal(undefined)
  })

  it('allows adding GET', function () {
    const router = express.Router()
    router.get('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding POST', function () {
    const router = express.Router()
    router.post('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding PUT', function () {
    const router = express.Router()
    router.put('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding DEL', function () {
    const router = express.Router()
    router.delete('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('can create paths', function () {
    const router = express.Router()
    router.get('get.test', '/test', function (req, res, next) {})
    router.get('get.test2', '/test2', function (req, res, next) {})
    router.post('post.test', '/test', function (req, res, next) {})
    const paths = express.getPaths()
    expect(paths.get.test.method).to.equal('get')
    expect(paths.get.test2.uri).to.equal('/test2')
    expect(paths.post.test.method).to.equal('post')
  })
})
