const _routerMockup = function router() {}

_routerMockup.get = jest.fn(() => _routerMockup)
_routerMockup.post = jest.fn(() => _routerMockup)
_routerMockup.put = jest.fn(() => _routerMockup)
_routerMockup.patch = jest.fn(() => _routerMockup)
_routerMockup.delete = jest.fn(() => _routerMockup)
_routerMockup.all = jest.fn(() => _routerMockup)
_routerMockup.use = jest.fn(() => _routerMockup)

const Router = jest.fn(() => _routerMockup)

module.exports = {
  Router,
  _routerMockup,
}
