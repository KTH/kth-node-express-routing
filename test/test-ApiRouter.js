/* eslint-env mocha */

'use strict'

const expect = require('chai').expect

const express = require('../index')

const apiDef = JSON.parse(
  '{"uri":"/api/node/data/:id/api/node/v1","method":"GET","openid":{"scope_required":true,"scopes":{"api_key":["read"]},"type":"0"}}'
)

const apiDefNoSecurity = JSON.parse(
  '{"uri":"/api/node/data/:id/api/node/v1","method":"GET","openid":{"scope_required":false}}'
)

describe('ApiRouter', () => {
  it('can be created', () => {
    const router = express.ApiRouter()
    expect(router).not.to.equal(undefined)
  })

  it('throws error if registering route with scope_required but not passing middleware', () => {
    const router = express.ApiRouter()
    try {
      router.register(apiDef, (req, res) => {
        return
      })
      // We should never reach this, because the above code should throw an error
      expect('MegaFail').to.equal(undefined)
    } catch (err) {
      expect(err).not.to.equal(undefined)
      // Make sure it wasn't the expect check that failed:
      expect(err.actual).not.to.equal('MegaFail')
    }
  })

  it('can register route with security', () => {
    const router = express.ApiRouter((req, res) => {})
    router.register(apiDef, (req, res) => {
      return
    })
    expect(router).not.to.equal(undefined)
  })

  it('can register route WITHOUT security', () => {
    const router = express.ApiRouter()
    router.register(apiDefNoSecurity, (req, res) => {
      return
    })
    expect(router).not.to.equal(undefined)
  })
})
