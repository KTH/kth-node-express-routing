/* eslint-env mocha */
'use strict'
const expect = require('chai').expect

const express = require('../index')

const apiDef = JSON.parse('{"uri":"/api/node/data/:id/api/node/v1","method":"GET","apikey":{"scope_required":true,"scopes":["read"],"type":"api_key"}}')

const apiDefNoSecurity = JSON.parse('{"uri":"/api/node/data/:id/api/node/v1","method":"GET","apikey":{"scope_required":false}}')

describe('ApiRouter', function () {
  it('can be created', function () {
    const router = express.ApiRouter()
    expect(router).not.to.equal(undefined)
  })

  it('throws error if registering route with scope_required but not passing middleware', function () {
    const router = express.ApiRouter()
    try {
      router.register(apiDef, function (req, res) { return })
      // We should never reach this, because the above code should throw an error
      expect('MegaFail').to.equal(undefined)
    } catch (err) {
      expect(err).not.to.equal(undefined)
      // Make sure it wasn't the expect check that failed:
      expect(err.actual).not.to.equal('MegaFail')
    }
  })

  it('can register route with security', function () {
    const router = express.ApiRouter(function (req, res) {})
    router.register(apiDef, function (req, res) { return })
    expect(router).not.to.equal(undefined)
  })

  it('can register route WITHOUT security', function () {
    const router = express.ApiRouter()
    router.register(apiDefNoSecurity, function (req, res) { return })
    expect(router).not.to.equal(undefined)
  })
})
