/* eslint-env mocha */

'use strict'

const expect = require('chai').expect

const express = require('../index')

describe('PageRouter', () => {
  it('can be created', () => {
    const router = express.PageRouter()
    expect(router).not.to.equal(undefined)
  })

  it('allows adding GET', () => {
    const router = express.PageRouter()
    router.get('test', '/test', (req, res, next) => {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding POST', () => {
    const router = express.PageRouter()
    router.post('test', '/test', (req, res, next) => {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding PUT', () => {
    const router = express.PageRouter()
    router.put('test', '/test', (req, res, next) => {})
    expect(router).not.to.equal(undefined)
  })

  it('allows adding DEL', () => {
    const router = express.PageRouter()
    router.delete('test', '/test', (req, res, next) => {})
    expect(router).not.to.equal(undefined)
  })

  it('can create paths', () => {
    const router = express.PageRouter()
    router.get('get.test', '/test', (req, res, next) => {})
    router.get('get.test2', '/test2', (req, res, next) => {})
    router.post('post.test', '/test', (req, res, next) => {})
    const paths = express.getPaths()
    expect(paths.get.test.method).to.equal('get')
    expect(paths.get.test2.uri).to.equal('/test2')
    expect(paths.post.test.method).to.equal('post')
  })

  it('can create paths by passing object as namespace argument', () => {
    const router = express.PageRouter()
    router.get(
      {
        namespace: 'get.test',
        extraOptions: {
          exists: true
        }
      },
      '/test',
      (req, res, next) => {}
    )
    const paths = express.getPaths()
    expect(paths.get.test.method).to.equal('get')
    expect(paths.get.test.uri).to.equal('/test')
    expect(paths.get.test.extraOptions.exists).to.equal(true)
  })

  it('can add paths', () => {
    express.addPaths('test', { yes: true })
    const paths = express.getPaths()
    expect(paths.test.yes).to.equal(true)
  })

  it('can create AND add paths', () => {
    const router = express.PageRouter()
    router.get('get.test', '/test', (req, res, next) => {})
    express.addPaths('test', { yes: true })
    const paths = express.getPaths()
    expect(paths.test.yes).to.equal(true)
    expect(paths.get.test.method).to.equal('get')
    expect(paths.get.test2.uri).to.equal('/test2')
    expect(paths.post.test.method).to.equal('post')
  })
})
