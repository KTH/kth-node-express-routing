const { getPaths, addPaths } = require('./paths')
const { Router: PageRouter } = require('./PageRouter')
const { Router: ApiRouter } = require('./ApiRouter')

module.exports = {
  getPaths,
  addPaths,

  PageRouter,

  ApiRouter,
}
