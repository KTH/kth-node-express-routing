/* eslint-env mocha */
'use strict'
const expect = require('chai').expect

const express = require('../index')

const apiDef = JSON.parse('{"uri":"/api/node/data/:id/api/node/v1","method":"GET","apikey":{"scope_required":true,"scopes":["read"],"type":"api_key"}}')

describe('ApiRouter', function () {
  it('can be created', function () {
    const router = express.ApiRouter()
    expect(router).not.to.equal(undefined)
  })

  it('can register route', function () {
    const router = express.ApiRouter()
    router.register(apiDef, function (req, res) { return })
    expect(router).not.to.equal(undefined)
  })

  // TODO: Do we need to respect "scope_required": true
  /*
  function addScopeToRequest (path, verb) {
    if (path.apikey && path.apikey.scopes) {
      server[ verb ](path.uri, function (req, res, next) {
        req.scope = path.apikey.scopes
        next()
      })
    }
  }
  */
})
