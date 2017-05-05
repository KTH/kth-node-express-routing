/* eslint-env mocha */
'use strict'
const expect = require('chai').expect

const express = require('../index').ApiRouter

const apiDef = JSON.parse('{"uri":"/api/node/data/:id/api/node/v1","method":"GET","apikey":{"scope_required":true,"scopes":["read"],"type":"api_key"}}')

describe('ApiRouter', function () {
  it('can be created', function () {
    const router = express.Router()
    expect(router).not.to.equal(undefined)
  })

  it('can register route', function () {
    const router = express.Router()
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