This is a wrapper for express route to allow generating named path files for app routes. It is used på KTH node-web projects to pass urls to browser clients.

Usage:

```JavaScript
const AppRouter = require('kth-node-express-routing').Router
const getPaths = require('kth-node-express-routing').getPaths
const server = require('express')()

const systemRoute = AppRouter()
systemRoute.get('system.monitor', '/_monitor', function (req, res) { ... })
server.use('/', systemRoute.getRouter())

const appRoute = AppRouter()
appRoute.get('app.index', '/', function (req, res) { ... })
server.use('/', appRoute.getRouter())

const paths = getPaths()
/*
paths = {
  system: { 
    monitor: { 
      uri: '/_monitor',
      method: 'get
    }
  },
  app: { 
    index: { 
      uri: '/',
      method: 'get
    }
  }
}
*/
```