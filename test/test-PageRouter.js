/* eslint-env mocha */
'use strict'
const expect = require('chai').expect

const express = require('../index')

describe('PageRouter', function () {
  it('can be created', function () {
    const router = express.PageRouter()
    expect(router).not.to.equal(undefined)
  })

  it('allows adding GET', function () {
    const router = express.PageRouter()
    router.get('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding POST', function () {
    const router = express.PageRouter()
    router.post('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding PUT', function () {
    const router = express.PageRouter()
    router.put('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding DEL', function () {
    const router = express.PageRouter()
    router.delete('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

  it('can create paths', function () {
    const router = express.PageRouter()
    router.get('get.test', '/test', function (req, res, next) {})
    router.get('get.test2', '/test2', function (req, res, next) {})
    router.post('post.test', '/test', function (req, res, next) {})
    const paths = express.getPaths()
    expect(paths.get.test.method).to.equal('get')
    expect(paths.get.test2.uri).to.equal('/test2')
    expect(paths.post.test.method).to.equal('post')
  })

  it('can create paths by passing object as namespace argument', function () {
    const router = express.PageRouter()
    router.get({
      namespace: 'get.test',
      extraOptions: {
        exists: true
      }
    }, '/test', function (req, res, next) {})
    const paths = express.getPaths()
    expect(paths.get.test.method).to.equal('get')
    expect(paths.get.test.uri).to.equal('/test')
    expect(paths.get.test.extraOptions.exists).to.equal(true)
  })

  it('can add paths', function () {
    express.addPaths('test', { yes: true })
    const paths = express.getPaths()
    expect(paths.test.yes).to.equal(true)
  })

  it('can create AND add paths', function () {
    const router = express.PageRouter()
    router.get('get.test', '/test', function (req, res, next) {})
    express.addPaths('test', { yes: true })
    const paths = express.getPaths()
    expect(paths.test.yes).to.equal(true)
    expect(paths.get.test.method).to.equal('get')
    expect(paths.get.test2.uri).to.equal('/test2')
    expect(paths.post.test.method).to.equal('post')
  })
})
