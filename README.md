This is a wrapper for express route to allow generating named path files for app routes. It is used på KTH node-web projects to pass urls to browser clients.


## PageRouter ##

PageRouter allows us to register page style routes that are registered in the path definition files.

Usage:

```JavaScript
const AppRouter = require('kth-node-express-routing').PageRouter
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

## ApiRouter ##

ApiRouter allows us to register api endpoints by passing api endpoint definition objects from the paths file. It will set req.scope and add the authByApiKey middleware passed to ApiRouter IF the apiDefObj passed below evaluates `apikey.scope_required == true`

Usage in your node-api app:

```JavaScript
// Middleware to protect enpoints with apiKey
const authByApiKey = passport.authenticate('apikey', { session: false })

const ApiRouter = require('kth-node-express-routing').ApiRouter
const apiRoute = ApiRouter(authByApiKey)

const apiDefObj = {
  uri: "/api/node/data/:id/api/node/v1",
  method: "GET",
  apikey: {
    scope_required: true,
    scopes: ["read"],
    type: "api_key"
  }
}

// A middleware adding the access scope requriements (req.scope) and the authByApiKey is automatically
// prepended to the middleware pipeline
apiRoute.register(apiDefObj, function (req, res) { ... })
```