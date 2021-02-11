const { getPaths, addPaths } = require('./paths')
const { resetPaths } = require('./paths')._testInternals

const { bold, EXPECTS, FAILS, green, IS_ACCESSIBLE, red, RETURNS, WORKS } = require('../test')

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
    const pathData = { prop1: 'test1', prop2: 'test2' }

    it(IS_ACCESSIBLE, () => expect(addPaths).toBeFunction())

    it(`${EXPECTS} two arguments (namespace, pathData)`, () => expect(addPaths).toHaveLength(2))

    it(`- when called w/o arguments - ${FAILS} as expected`, () => {
      expect(addPaths).toThrow('Cannot read property')
    })

    it(`- when called w/o argument "namespace" - ${FAILS} as expected`, () => {
      expect(() => addPaths(undefined, pathData)).toThrow('Cannot read property')
    })

    it(`- when called w/o argument "pathData" - ${green('adds')} a path with empty data`, () => {
      addPaths(namespace, undefined)

      const paths = getPaths()
      expect(paths).toContainAllKeys([namespace])
      expect(paths[namespace]).toBeUndefined()
    })

    it(`- when called with "namespace" and "pathData" - ${RETURNS} nothing`, () => {
      const result = addPaths(namespace, pathData)
      expect(result).toBeUndefined()
    })

    it(`- when called with "namespace" and "pathData" - ${WORKS} as expected`, () => {
      addPaths(namespace, pathData)

      expect(getPaths()).toEqual({
        [namespace]: pathData,
      })
    })

    it(`- when "namespace" contains a sub-domain - ${WORKS} as expected`, () => {
      addPaths(namespace + '.sub', pathData)

      expect(getPaths()).toEqual({
        [namespace]: {
          sub: pathData,
        },
      })
    })

    it(`- when "namespace" contains several sub-domains - ${WORKS} as expected`, () => {
      addPaths(namespace + '.sub1.sub2.sub3', pathData)

      expect(getPaths()).toEqual({
        [namespace]: {
          sub1: {
            sub2: {
              sub3: pathData,
            },
          },
        },
      })
    })

    it(`- when "namespace" is given as an object - ${FAILS} as expected`, () => {
      expect(() => addPaths({ namespace }, pathData)).toThrow('split is not a function')
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
        addPaths('testNamespace1', pathData)
        addPaths('testNamespace2', pathData)
        addPaths('testNamespace3', pathData)

        expect(getPaths()).toEqual({
          testNamespace1: pathData,
          testNamespace2: pathData,
          testNamespace3: pathData,
        })
      })

      it(`with same namespace and same data-object - ${green('stores')} information only once`, () => {
        addPaths(namespace, pathData)
        addPaths(namespace, pathData)
        addPaths(namespace, pathData)

        expect(getPaths()).toEqual({
          [namespace]: pathData,
        })
      })
    })
  })
}

runTestsAboutGetPaths()
runTestsAboutAddPaths()
