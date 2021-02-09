module.exports = {
  ApiRouter: require('./src/ApiRouter').Router,

  PageRouter: require('./src/PageRouter').Router,
  getPaths: require('./src/PageRouter').getPaths,
  addPaths: require('./src/PageRouter').addPaths,
}
