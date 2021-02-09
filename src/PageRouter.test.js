const { Router: PageRouter, getPaths, addPaths } = require('./PageRouter')

describe('PageRouter', () => {
  it('can be created', () => {
    const router = PageRouter()
    expect(router).not.toEqual(undefined)
  })

  it('allows adding GET', () => {
    const router = PageRouter()
    router.get('test', '/test', (req, res, next) => {})
    expect(router).not.toEqual(undefined)
  })

  it('allows adding POST', () => {
    const router = PageRouter()
    router.post('test', '/test', (req, res, next) => {})
    expect(router).not.toEqual(undefined)
  })

  it('allows adding PUT', () => {
    const router = PageRouter()
    router.put('test', '/test', (req, res, next) => {})
    expect(router).not.toEqual(undefined)
  })

  it('allows adding DEL', () => {
    const router = PageRouter()
    router.delete('test', '/test', (req, res, next) => {})
    expect(router).not.toEqual(undefined)
  })

  it('can create paths', () => {
    const router = PageRouter()
    router.get('get.test', '/test', (req, res, next) => {})
    router.get('get.test2', '/test2', (req, res, next) => {})
    router.post('post.test', '/test', (req, res, next) => {})
    const paths = getPaths()
    expect(paths.get.test.method).toEqual('get')
    expect(paths.get.test2.uri).toEqual('/test2')
    expect(paths.post.test.method).toEqual('post')
  })

  it('can create paths by passing object as namespace argument', () => {
    const router = PageRouter()
    router.get(
      {
        namespace: 'get.test',
        extraOptions: {
          exists: true,
        },
      },
      '/test',
      (req, res, next) => {}
    )
    const paths = getPaths()
    expect(paths.get.test.method).toEqual('get')
    expect(paths.get.test.uri).toEqual('/test')
    expect(paths.get.test.extraOptions.exists).toEqual(true)
  })

  it('can add paths', () => {
    addPaths('test', { yes: true })
    const paths = getPaths()
    expect(paths.test.yes).toEqual(true)
  })

  it('can create AND add paths', () => {
    const router = PageRouter()
    router.get('get.test', '/test', (req, res, next) => {})
    addPaths('test', { yes: true })
    const paths = getPaths()
    expect(paths.test.yes).toEqual(true)
    expect(paths.get.test.method).toEqual('get')
    expect(paths.get.test2.uri).toEqual('/test2')
    expect(paths.post.test.method).toEqual('post')
  })
})
