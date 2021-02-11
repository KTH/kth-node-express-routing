const { getPaths, addPaths } = require('./src/paths')
const { Router: PageRouter } = require('./src/PageRouter')
const { Router: ApiRouter } = require('./src/ApiRouter')

module.exports = {
  getPaths,
  addPaths,

  PageRouter,

  ApiRouter,
}
