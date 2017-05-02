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
    router.del('test', '/test', function (req, res, next) {})
    expect(router).not.to.equal(undefined)
  })

})
