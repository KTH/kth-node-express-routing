jest.mock('express')
const { _routerMockup: ExpressRouterMockup } = jest.requireMock('express')

const { Router: ApiRouter } = require('./ApiRouter')

const { bold, green, EXPECTS, IS_ACCESSIBLE, RETURNS, THROWS, FAILS, WORKS } = require('../test')

function _expectIsApiScopeHandler({ handler, expectedScopes }) {
  expect(handler).toBeFunction()
  expect(handler).toHaveLength(3)

  const [req, res, next] = [{}, {}, jest.fn()]
  const result = handler(req, res, next)

  expect(result).toBeUndefined()
  expect(req).toEqual({ scope: expectedScopes })
  expect(res).toEqual({})
  expect(next).toHaveBeenCalledTimes(1)
  expect(next).toHaveBeenCalledWith()
}

function runTestsAboutApiRouter() {
  describe(`Exported function ${bold('ApiRouter()')}`, () => {
    it(IS_ACCESSIBLE, () => expect(ApiRouter).toBeFunction())

    it(`${EXPECTS} one argument (checkApiKeyMiddleware)`, () => expect(ApiRouter.length).toBe(1))

    const _runBasicTestsOfApiRouter = middleware => {
      const _text = middleware
        ? `- when passing a middleware - ${RETURNS} an object that`
        : `- when used w/o arguments - ${RETURNS} an object that`

      describe(_text, () => {
        const uri = '/test'
        const method = 'GET'
        const openid = { scope_required: true, scopes: { api_key: ['read'] } }

        it(`is an instance of "Router"`, () => {
          const router = ApiRouter(middleware)
          expect(router).toBeObject()
          expect(router.constructor.name).toBe('Router')
        })

        it(`has ${bold('getRouter()')} to directly access the underlying Express.js Router`, () => {
          const router = ApiRouter(middleware)
          expect(router.getRouter()).toBe(ExpressRouterMockup)
        })

        it(`${green('allows')} adding an unsecured endpoint with ${bold('register()')}`, () => {
          const router = ApiRouter(middleware)
          const result = router.register({ uri, method }, jest.fn())
          expect(result).toBe(ExpressRouterMockup)
        })

        if (middleware) {
          it(`${green('allows')} adding a secure endpoint with ${bold('register()')}`, () => {
            const router = ApiRouter(middleware)
            const result = router.register({ uri, method, openid }, jest.fn())
            expect(result).toBe(ExpressRouterMockup)
          })
        } else {
          it(`${THROWS} an error when adding a secured endpoint with ${bold('register()')}`, () => {
            const router = ApiRouter()
            expect(() => router.register({ uri, method, openid }, jest.fn())).toThrow(
              'Missing middleware to check api key scopes'
            )
          })
        }
      })
    }

    _runBasicTestsOfApiRouter()
    _runBasicTestsOfApiRouter(jest.fn())
  })
}

function runTestsAboutRegisterOfApiRouter() {
  describe(`The function ${bold('register()')} delivered by "ApiRouter(middleware)"`, () => {
    const middleware = jest.fn()

    const uri = '/test'
    const method = 'GET'
    const openid = { scope_required: true, scopes: { api_key: ['read'] } }

    let router = null
    beforeAll(() => {
      router = ApiRouter(middleware)
    })

    it(IS_ACCESSIBLE, () => expect(router.register).toBeFunction())

    it(`${EXPECTS} one argument (apiPathObj)`, () => {
      expect(router.register).toHaveLength(1)
    })

    it(`${green('accepts')} additional arguments (...routeArgs)`, () => {
      const handlers = [jest.fn(), jest.fn(), jest.fn()]
      router.register({ uri, method, openid }, ...handlers)

      expect(ExpressRouterMockup.get).toHaveBeenCalledTimes(1)

      const [call] = ExpressRouterMockup.get.mock.calls
      expect(call[1]).toBeFunction()
      call[1] = 'scopeHandler'

      expect(call).toEqual([uri, 'scopeHandler', middleware, ...handlers])
    })

    it(`${RETURNS} the underlying Express.js Router`, () => {
      const result = router.register({ uri, method }, jest.fn())

      expect(result).toBe(ExpressRouterMockup)
    })

    it(`- when registering an unsecure GET-endpoint - ${WORKS} as expected`, () => {
      const handlers = [jest.fn(), jest.fn()]

      router.register({ uri, method: 'GET' }, ...handlers)

      const { get } = ExpressRouterMockup
      expect(get).toHaveBeenCalledTimes(1)
      expect(get).toHaveBeenCalledWith(uri, handlers[0], handlers[1])
    })

    it.each([['POST'], ['PUT'], ['DELETE']])(
      `- when registering an unsecure %s-endpoint - ${FAILS} as expected`,
      _method => {
        const callback = () => router.register({ uri, method: _method }, jest.fn())
        expect(callback).toThrow(`Missing prop "openid" in input - mandatory with method "${_method}"`)
      }
    )

    it.each([['GET'], ['POST'], ['PUT'], ['DELETE']])(
      `- when registering a secure %s-endpoint - ${WORKS} as expected`,
      _method => {
        const handlers = [jest.fn(), jest.fn()]

        router.register({ uri, method: _method, openid }, ...handlers)

        const verb = _method.toLowerCase()
        const func = ExpressRouterMockup[verb]
        expect(func).toHaveBeenCalledTimes(1)

        const [call] = func.mock.calls
        _expectIsApiScopeHandler({ handler: call[1], expectedScopes: openid.scopes.api_key })
        call[1] = 'scopeHandler'

        expect(call).toEqual([uri, 'scopeHandler', middleware, ...handlers])
      }
    )

    const testDataConfigurations = [
      {
        apiPathObj: '/test',
        errorText: 'this must be a `object` type',
      },
      {
        apiPathObj: { uri },
        errorText: 'method is a required field',
      },
      {
        apiPathObj: { method },
        errorText: 'uri is a required field',
      },
      {
        apiPathObj: { uri, method: {} },
        errorText: 'method must be a `string` type',
      },
      {
        apiPathObj: { uri, method: 'test' },
        errorText: 'method must match the following:',
      },
      {
        apiPathObj: { uri, method: 'HEAD' },
        errorText: 'method must match the following:',
      },
      {
        apiPathObj: { uri, method: 'GET' },
        errorText: null,
      },
      {
        apiPathObj: { uri, method: 'gEt' },
        errorText: null,
      },
      {
        apiPathObj: { uri, method: 'get' },
        errorText: null,
      },
      {
        apiPathObj: { uri, method, openid: 179 },
        errorText: 'openid must be a `object` type',
      },
      {
        apiPathObj: { uri, method, openid: {} },
        errorText: 'openid.scopes is a required field',
      },
      {
        apiPathObj: { uri, method, openid: { scope_required: false } },
        errorText: 'openid.scopes is a required field',
      },
      {
        apiPathObj: { uri, method, openid: { scopes: {} } },
        errorText: 'openid.scopes must contain exactly one strategy',
      },
      {
        apiPathObj: { uri, method, openid: { scopes: { api_key: {} } } },
        errorText: 'openid.scopes.api_key must be a `array` type',
      },
      {
        apiPathObj: { uri, method, openid: { scopes: { api_key: [] } } },
        errorText: 'openid.scopes.api_key field must have at least 1 item',
      },
      {
        apiPathObj: { uri, method, openid: { scopes: { api_key: [179, 'read', 'write'] } } },
        errorText: 'openid.scopes.api_key[0] must be a `string` type',
      },
      {
        apiPathObj: { uri, method, openid: { scopes: { api_key: ['read'], connect: ['write'] } } },
        errorText: 'openid.scopes field has unspecified keys: connect',
      },
      {
        apiPathObj: { uri, method, openid: { scopes: { api_key: ['read'] } } },
        errorText: 'openid.scope_required is a required field',
      },
      {
        apiPathObj: { uri, method, openid: { scope_required: {}, scopes: { api_key: ['read'] } } },
        errorText: 'openid.scope_required must be a `boolean` type',
      },
      {
        apiPathObj: { uri, method, openid: { scope_required: false, scopes: { api_key: ['read'] } } },
        errorText: 'openid.scope_required must be one of the following values: true',
      },
      {
        apiPathObj: { uri, method, openid: { scope_required: true, scopes: { connect: ['write'] } } },
        errorText: 'openid.scopes field has unspecified keys: connect',
      },
      {
        apiPathObj: { uri, method, openid: { scope_required: true, scopes: { api_key: ['read', 'write', 'remove'] } } },
        errorText: null,
      },
    ]

    const validConfigurations = testDataConfigurations.filter(item => item.errorText == null)
    it.each(validConfigurations.map(item => [JSON.stringify(item.apiPathObj), item]))(
      `- when used with valid config %s - ${WORKS} as expected`,
      (caption1, { apiPathObj }) => {
        router.register(apiPathObj, jest.fn())
      }
    )

    const invalidConfigurations = testDataConfigurations.filter(item => item.errorText != null)
    it.each(invalidConfigurations.map(item => [JSON.stringify(item.apiPathObj), item]))(
      `- when used with invalid config %s - ${FAILS} as expected`,
      (caption1, { apiPathObj, errorText }) => {
        const callback = () => router.register(apiPathObj, jest.fn())
        expect(callback).toThrow(errorText)
      }
    )
  })
}

runTestsAboutApiRouter()
runTestsAboutRegisterOfApiRouter()
