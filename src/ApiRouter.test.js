const { Router: ApiRouter } = require('./ApiRouter')

const apiDef = {
  uri: '/api/node/v1/data/:id',
  method: 'GET',
  openid: { scope_required: true, scopes: { api_key: ['read'] } },
}

const apiDefNoSecurity = {
  uri: '/api/node/v1/data/:id',
  method: 'GET',
}

describe('ApiRouter', () => {
  it('can be created', () => {
    const router = ApiRouter()
    expect(router).not.toEqual(undefined)
  })

  it('throws error if registering route with scope_required but not passing middleware', () => {
    const router = ApiRouter()
    try {
      router.register(apiDef, (req, res) => {})
      expect('MegaFail').toEqual(undefined)
    } catch (err) {
      expect(err).not.toEqual(undefined)
      expect(err.actual).not.toEqual('MegaFail')
    }
  })

  it('can register route with security', () => {
    const router = ApiRouter((req, res) => {})
    router.register(apiDef, (req, res) => {})
    expect(router).not.toEqual(undefined)
  })

  it('can register route WITHOUT security', () => {
    const router = ApiRouter()
    router.register(apiDefNoSecurity, (req, res) => {})
    expect(router).not.toEqual(undefined)
  })
})
