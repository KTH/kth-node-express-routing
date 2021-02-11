jest.mock('express')
const { _routerMockup: ExpressRouterMockup } = jest.requireMock('express')

const { Router: PageRouter, getPaths, addPaths } = require('./PageRouter')
const { resetPaths } = require('./PageRouter')._testInternals

const { bold, EXPECTS, FAILS, green, IS_ACCESSIBLE, red, RETURNS, WORKS } = require('../test')

// eslint-disable-next-line no-use-before-define
runTestsAboutGetPaths()
// eslint-disable-next-line no-use-before-define
runTestsAboutAddPaths()
// eslint-disable-next-line no-use-before-define
runTestsAboutPageRouter()
// eslint-disable-next-line no-use-before-define
runTestsAboutEndpointMethodOfPageRouter('get')
// eslint-disable-next-line no-use-before-define
runTestsAboutEndpointMethodOfPageRouter('post')
// eslint-disable-next-line no-use-before-define
runTestsAboutCallingMethodsOfPageRouterSeveralTimes()
// eslint-disable-next-line no-use-before-define
runTestsAboutPageRouterTogetherWithAddPaths()

function runTestsAboutGetPaths() {
  describe(`Exported function ${bold('getPaths()')}`, () => {
    beforeEach(resetPaths)

    it(IS_ACCESSIBLE, () => expect(getPaths).toBeFunction())

    it(`${EXPECTS} no arguments`, () => expect(getPaths).toHaveLength(0))

    it(`- when used w/o arguments - ${RETURNS} an object`, () => {
      resetPaths()
      const result = getPaths()
      expect(result).toEqual({})
    })

    it(`- when called after ${bold('addPaths()')} - ${RETURNS} information about collected paths`, () => {
      addPaths('testNamespace1', { prop1: 'test1', prop2: 'test2' })
      addPaths('testNamespace2', { prop2: 'test2', prop3: 'test3' })

      const result = getPaths()
      expect(result).toEqual({
        testNamespace1: { prop1: 'test1', prop2: 'test2' },
        testNamespace2: { prop2: 'test2', prop3: 'test3' },
      })
    })
  })
}

function runTestsAboutAddPaths() {
  describe(`Exported function ${bold('addPaths()')}`, () => {
    beforeEach(resetPaths)

    const namespace = 'testNamespace'
    const pathObj = { prop1: 'test1', prop2: 'test2' }

    it(IS_ACCESSIBLE, () => expect(addPaths).toBeFunction())

    it(`${EXPECTS} two arguments (namespace, pathObj)`, () => expect(addPaths).toHaveLength(2))

    it(`- when called w/o arguments - ${FAILS} as expected`, () => {
      expect(addPaths).toThrow('Cannot read property')
    })

    it(`- when called w/o argument "namespace" - ${FAILS} as expected`, () => {
      expect(() => addPaths(undefined, pathObj)).toThrow('Cannot read property')
    })

    it(`- when called w/o argument "pathObj" - ${green('adds')} a path with empty data`, () => {
      addPaths(namespace, undefined)

      const paths = getPaths()
      expect(paths).toContainAllKeys([namespace])
      expect(paths[namespace]).toBeUndefined()
    })

    it(`- when called with "namespace" and "pathObj" - ${RETURNS} nothing`, () => {
      const result = addPaths(namespace, pathObj)
      expect(result).toBeUndefined()
    })

    it(`- when called with "namespace" and "pathObj" - ${WORKS} as expected`, () => {
      addPaths(namespace, pathObj)

      expect(getPaths()).toEqual({
        [namespace]: pathObj,
      })
    })

    it(`- when "namespace" contains a sub-domain - ${WORKS} as expected`, () => {
      addPaths(namespace + '.sub', pathObj)

      expect(getPaths()).toEqual({
        [namespace]: {
          sub: pathObj,
        },
      })
    })

    it(`- when "namespace" contains several sub-domains - ${WORKS} as expected`, () => {
      addPaths(namespace + '.sub1.sub2.sub3', pathObj)

      expect(getPaths()).toEqual({
        [namespace]: {
          sub1: {
            sub2: {
              sub3: pathObj,
            },
          },
        },
      })
    })

    it(`- when "namespace" is given as an object - ${FAILS} as expected`, () => {
      expect(() => addPaths({ namespace }, pathObj)).toThrow('split is not a function')
    })

    describe(`  - if called several times`, () => {
      it(`with different namespaces and different data-objects - ${WORKS} as expected`, () => {
        addPaths('testNamespace1', { prop1: 'test1' })
        addPaths('testNamespace2', { prop2: 'test2' })
        addPaths('testNamespace3', { prop3: 'test3' })

        expect(getPaths()).toEqual({
          testNamespace1: { prop1: 'test1' },
          testNamespace2: { prop2: 'test2' },
          testNamespace3: { prop3: 'test3' },
        })
      })

      it(`with same namespace, but different data-objects - ${red('OVERWRITES')} path-information`, () => {
        addPaths(namespace, { prop1: 'test1' })
        addPaths(namespace, { prop2: 'test2' })
        addPaths(namespace, { prop3: 'test3' })

        expect(getPaths()).toEqual({
          [namespace]: { prop3: 'test3' },
        })
      })

      it(`with different namespaces, but same data-object - ${WORKS} as expected`, () => {
        addPaths('testNamespace1', pathObj)
        addPaths('testNamespace2', pathObj)
        addPaths('testNamespace3', pathObj)

        expect(getPaths()).toEqual({
          testNamespace1: pathObj,
          testNamespace2: pathObj,
          testNamespace3: pathObj,
        })
      })

      it(`with same namespace and same data-object - ${green('stores')} information only once`, () => {
        addPaths(namespace, pathObj)
        addPaths(namespace, pathObj)
        addPaths(namespace, pathObj)

        expect(getPaths()).toEqual({
          [namespace]: pathObj,
        })
      })
    })
  })
}

function runTestsAboutPageRouter() {
  describe(`Exported function ${bold('PageRouter()')}`, () => {
    it(IS_ACCESSIBLE, () => expect(PageRouter).toBeFunction())

    it(`${EXPECTS} no argument`, () => expect(PageRouter).toHaveLength(0))

    describe(`- when used w/o arguments - ${RETURNS} an object that`, () => {
      const namespace = 'test'
      const uri = '/test'
      const handler = jest.fn()

      let router = null
      beforeAll(() => {
        router = PageRouter()
      })

      it(`is an instance of "Router"`, () => {
        expect(router).toBeObject()
        expect(router.constructor.name).toBe('Router')
      })

      const methods = [
        ['get', 'a GET-endpoint'],
        ['post', 'a POST-endpoint'],
        ['put', 'a PUT-endpoint'],
        ['delete', 'a DELETE-endpoint'],
        ['all', 'a generic endpoint'],
        ['use', 'middleware'],
      ]
      it.each(methods)(`has ${bold(`%s()`)} for adding %s`, name => {
        router[name](namespace, uri, handler)
      })

      it(`has ${bold('getRouter()')} to directly access the underlying Express.js Router`, () => {
        expect(router.getRouter()).toBe(ExpressRouterMockup)
      })
    })
  })
}

function runTestsAboutEndpointMethodOfPageRouter(method) {
  describe(`The function ${bold(`${method}()`)} delivered by "PageRouter()"`, () => {
    let router = null
    let func = null
    beforeAll(() => {
      router = PageRouter()
      func = router[method].bind(router)
    })

    beforeEach(resetPaths)

    const namespace = 'testNamespace'
    const uri = '/test-uri'
    const handler = jest.fn()

    it(IS_ACCESSIBLE, () => expect(func).toBeFunction())

    it(`${EXPECTS} two arguments (namespace, uri)`, () => expect(func).toHaveLength(2))

    it(`${green('accepts')} additional arguments (...handlers)`, () => {
      const handlers = [jest.fn(), jest.fn(), jest.fn()]
      func(namespace, uri, ...handlers)

      expect(ExpressRouterMockup[method]).toHaveBeenCalledTimes(1)
      expect(ExpressRouterMockup[method]).toHaveBeenCalledWith(uri, ...handlers)
    })

    it(`${RETURNS} the underlying Express.js Router`, () => {
      const result = func(namespace, uri, jest.fn())

      expect(result).toBe(ExpressRouterMockup)
    })

    it(`- when used w/o arguments - ${FAILS} as expected`, () => {
      expect(func).toThrow('Cannot read property')
    })

    it(`- when used w/o argument "namespace" - ${FAILS} as expected`, () => {
      expect(() => func(undefined, uri, handler)).toThrow('Cannot read property')
    })

    it(`- when used w/o argument "uri" - ${WORKS} as expected`, () => {
      func(namespace, undefined, handler)

      expect(getPaths()).toEqual({
        [namespace]: { method, uri: undefined },
      })
    })

    it(`- when used with "namespace" and "uri" - ${WORKS} as expected`, () => {
      func(namespace, uri, handler)

      expect(getPaths()).toEqual({
        [namespace]: { method, uri },
      })
    })

    it(`- when "namespace" contains a sub-domain - ${WORKS} as expected`, () => {
      func(namespace + '.sub', uri, handler)

      expect(getPaths()).toEqual({
        [namespace]: {
          sub: { method, uri },
        },
      })
    })

    it(`- when "namespace" contains several sub-domains - ${WORKS} as expected`, () => {
      func(namespace + '.sub1.sub2.sub3', uri, handler)

      expect(getPaths()).toEqual({
        [namespace]: {
          sub1: {
            sub2: {
              sub3: { method, uri },
            },
          },
        },
      })
    })

    it(`- when "namespace" is given as object - ${WORKS} as expected`, () => {
      func({ namespace }, uri, handler)

      expect(getPaths()).toEqual({
        [namespace]: { method, uri },
      })
    })

    it(`- when object "namespace" contains additional data - ${WORKS} as expected`, () => {
      func({ namespace, extra1: 'test1', extra2: 'test2', extra3: 'test3' }, uri, handler)

      expect(getPaths()).toEqual({
        [namespace]: { method, uri, extra1: 'test1', extra2: 'test2', extra3: 'test3' },
      })
    })

    it(`- when "namespace" is an empty object - ${FAILS} as expected`, () => {
      expect(() => func({}, uri, handler)).toThrow('Cannot read property')
    })
  })
}

function runTestsAboutCallingMethodsOfPageRouterSeveralTimes() {
  describe(
    `If the functions ${bold(`get()`)} and ${bold(`post()`)} delivered by "PageRouter()" ` +
      `${bold('are called several times')}`,
    () => {
      let router = null
      beforeAll(() => {
        router = PageRouter()
      })

      beforeEach(resetPaths)

      const namespace = 'testNamespace'
      const uri = '/test-uri'
      const handlers = [jest.fn(), jest.fn(), jest.fn(), jest.fn()]

      it(
        `- with different namespaces and different URIs - ` +
          `they ${green('register')} endpoints and ${green('store')} path-information`,
        () => {
          router.get('testNamespace1', '/test-uri1', handlers[0])
          router.post('testNamespace2', '/test-uri2', handlers[1])
          router.post('testNamespace3', '/test-uri3', handlers[2])
          router.get('testNamespace4', '/test-uri4', handlers[3])

          expect(ExpressRouterMockup.get).toHaveBeenCalledTimes(2)
          expect(ExpressRouterMockup.post).toHaveBeenCalledTimes(2)

          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(1, '/test-uri1', handlers[0])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(1, '/test-uri2', handlers[1])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(2, '/test-uri3', handlers[2])
          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(2, '/test-uri4', handlers[3])

          expect(getPaths()).toEqual({
            testNamespace1: { method: 'get', uri: '/test-uri1' },
            testNamespace2: { method: 'post', uri: '/test-uri2' },
            testNamespace3: { method: 'post', uri: '/test-uri3' },
            testNamespace4: { method: 'get', uri: '/test-uri4' },
          })
        }
      )

      it(
        `- with same namespace and different URIs - ` +
          `they ${green('register')} endpoints, but ${red('overwrite')} path-information`,
        () => {
          router.get(namespace, '/test-uri1', handlers[0])
          router.post(namespace, '/test-uri2', handlers[1])
          router.post(namespace, '/test-uri3', handlers[2])
          router.get(namespace, '/test-uri4', handlers[3])

          expect(ExpressRouterMockup.get).toHaveBeenCalledTimes(2)
          expect(ExpressRouterMockup.post).toHaveBeenCalledTimes(2)

          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(1, '/test-uri1', handlers[0])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(1, '/test-uri2', handlers[1])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(2, '/test-uri3', handlers[2])
          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(2, '/test-uri4', handlers[3])

          expect(getPaths()).toEqual({
            [namespace]: { method: 'get', uri: '/test-uri4' },
          })
        }
      )

      it(
        `- with different namespaces and same URI - ` +
          `they ${red('register different handlers')} for same endpoints and ${green('store')} path-information`,
        () => {
          router.get('testNamespace1', uri, handlers[0])
          router.post('testNamespace2', uri, handlers[1])
          router.post('testNamespace3', uri, handlers[2])
          router.get('testNamespace4', uri, handlers[3])

          expect(ExpressRouterMockup.get).toHaveBeenCalledTimes(2)
          expect(ExpressRouterMockup.post).toHaveBeenCalledTimes(2)

          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(1, uri, handlers[0])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(1, uri, handlers[1])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(2, uri, handlers[2])
          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(2, uri, handlers[3])

          expect(getPaths()).toEqual({
            testNamespace1: { method: 'get', uri },
            testNamespace2: { method: 'post', uri },
            testNamespace3: { method: 'post', uri },
            testNamespace4: { method: 'get', uri },
          })
        }
      )

      it(
        `- with same namespace and same URI - ` +
          `they ${green('register')} handlers for same endpoints, but ${red('overwrite')} path-information`,
        () => {
          router.get(namespace, uri, handlers[0])
          router.post(namespace, uri, handlers[1])
          router.post(namespace, uri, handlers[2])
          router.get(namespace, uri, handlers[3])

          expect(ExpressRouterMockup.get).toHaveBeenCalledTimes(2)
          expect(ExpressRouterMockup.post).toHaveBeenCalledTimes(2)

          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(1, uri, handlers[0])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(1, uri, handlers[1])
          expect(ExpressRouterMockup.post).toHaveBeenNthCalledWith(2, uri, handlers[2])
          expect(ExpressRouterMockup.get).toHaveBeenNthCalledWith(2, uri, handlers[3])

          expect(getPaths()).toEqual({
            [namespace]: { method: 'get', uri },
          })
        }
      )
    }
  )
}

function runTestsAboutPageRouterTogetherWithAddPaths() {
  describe(`If ${bold('addPaths()')} and the methods of ${bold('PageRouter()')} are used together`, () => {
    beforeEach(resetPaths)

    it(`it ${WORKS} as expected`, () => {
      const router = PageRouter()

      addPaths('testNamespace1', { uri: '/test-uri1' })
      router.get('testNamespace2', '/test-uri2', jest.fn())
      router.post('testNamespace3', '/test-uri3', jest.fn())

      expect(getPaths()).toEqual({
        testNamespace1: { uri: '/test-uri1' },
        testNamespace2: { method: 'get', uri: '/test-uri2' },
        testNamespace3: { method: 'post', uri: '/test-uri3' },
      })
    })
  })
}
