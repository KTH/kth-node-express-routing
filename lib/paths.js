// TODO: use singleton of _routeDefs

const _routeDefs = {}

/**
 * @returns {object}
 */
function getPaths() {
  return _routeDefs
}

/**
 * @param {string} namespace
 * @param {*} pathData
 */
function addPaths(namespace, pathData) {
  const namespaceTuple = namespace.split('.')
  let cursor = _routeDefs

  namespaceTuple.forEach((key, index) => {
    if (index < namespaceTuple.length - 1) {
      if (cursor[key] == null) {
        cursor[key] = {}
      }
      cursor = cursor[key]
    } else {
      cursor[key] = pathData
    }
  })
}

function _resetPaths() {
  Object.keys(_routeDefs).forEach(key => {
    delete _routeDefs[key]
  })
}

module.exports = {
  getPaths,
  addPaths,

  _testInternals: {
    resetPaths: _resetPaths,
  },
}
