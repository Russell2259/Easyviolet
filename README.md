<h1 align="center">Easyviolet</h1>
<p align="center">An easy way to use the proxy <a href="https://github.com/titaniumnetwork-dev/Ultraviolet">Ultraviolet</a>. Easyviolet allows you to setup and configure the proxy Ultraviolet using one line of code and still have Ultraviolet's full functionality and customizability.</p>

<h2 align="center">Installation</h2>

```bash
$ npm install github:Russell2259/Easyviolet
```

<h2 align="center">Demo</h2>

You can see more examples [here](https://github.com/Russell2259/Easyviolet/tree/main/examples).
```javascript
import Easyviolet from 'easyviolet';
import http from 'node:http';

const server = http.createServer();

new Easyviolet({
  server: server
});

server.listen(8080, () => {
  console.log(`Your easyviolet demo is running on port ${server.address().port}`);
});
```

<h2 align="center">Configuration</h2>

The configuration for easyviolet
```javascript
// All of these values are predefined except for the server object

new Easyviolet({
    uvPrefix: '/uv/', // The prefix that ultraviolet will run on
    prefix: 'service/', // The path that ultraviolet will serve proxied content to
    bare: '/bare/', // The path that the bare server will be run on
    codec: 'xor', // The codec that ultraviolet will encode the queries with
    uv: { // Allows you to change the javascript files that ultraviolet will use
        handler: 'uv.handler.js',
        client: 'uv.client.js',
        bundle: 'uv.bundle.js',
        config: 'uv.config.js',
        sw: 'uv.sw.js'
    },
    server: server // The server object provided by the node:http module
});
```

<h2 align="center">Features</h2>

Useful features that are provided by easyviolet
````javascript
const ultraviolet = new Easyviolet();

// Use an express.js server with easyviolet
const app = express();

app.use(ultraviolet.express(app)); // You need to have the app object as a parameter

// Check if easyviolet needs a path
ultraviolet.requiresRoute(req); // Requires the request object provided by the express and node:http modules

// Use a http server after easyviolet has been configured
ultraviolet.httpServer(server); // Requires the server object provided by the node:http module

// Handle a request without registering a server
ultraviolet.handleRequest(req, res, next/* Optional */);
````

<h2 align="center">Client Side API</h2>
Easyviolet also provides a client side javascript api for easy use and configuration.

Link the script
````html
<script src="/{your prefix}/ev.bundle.js"></script>

<!--The default prefix is uv-->
<script src="/uv/ev.bundle.js"></script>
````

Use the api in your code
````javascript
// Register the ultraviolet service worker (is done automatically when the script is linked)
Easyviolet.registerSW();

// Encode a url
Easyviolet.getProxiedUrl('https://example.com');

// Other parameters
Easyviolet.scriptsLoaded // Returns true|false
Easyviolet.config // The configuration passed down from the node process in json format
````

<h2 align="center">Credits</h2>

<p>The two primary libraries <a href="https://github.com/titaniumnetwork-dev/Ultraviolet">ultraviolet</a> and <a href="https://github.com/tomphttp/bare-server-node">bare server node</a> were not developed by me and easyviolet was only intended to be an easier way to use the ultraviolet proxy.</p>

<p>Thanks again to all of these amazing contributors for helping develop easyviolet</p>
<a href="https://github.com/Russell2259/Easyviolet/graphs/contributors"><img src="https://contrib.rocks/image?repo=Russell2259/Easyviolet#"/></a>