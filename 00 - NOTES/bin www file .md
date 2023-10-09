# bin/.www file

Status: medium clone - functionality

# 0. Context

> This file is abstracting out the setup work which was found in  T-index.js file. so our app.js file is little simpler because a part of setup work is taken care in our .www file
> 
> 1. this change began in package file where our code is like 
> 
> ```jsx
> "scripts": {
>     "start": "node ./bin/www",
>     "devstart": "nodemon ./bin/www",
>     "serverstart": "DEBUG=express-locarllibrary-tutorial:* npm run devstart",
>     "test": "echo \"Error: no test specified\" && exit 1"
>   },
> ```
> 
> instead of like this - 
> 
> ```jsx
> "scripts": {
>   "start": "node server",
>   "dev": "nodemon server",
>   "test": "echo \"Error: no test specified\" && exit 1"
> },
> ```
> 

# 1. Importing dependencies

```
var app = require('../app');
var debug = require('debug')('myapp:server');
var http = require('http');
```

- The **`app`** module is instance of Express.js application that defines the application's routes, middleware, and configuration.
- idk bro
- this line imports the built-in **`http`** module, which provides functionality for creating HTTP servers and handling HTTP requests and responses.

# 2. Setting port

```jsx
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
```

- app.set is inbuilt method of express.js for configuring various settings
    - .set('port', port) - here first parameter is name of the option, second parameter is a variable.
    - **`app.get('port')`** retrieves the port value you previously set with **`app.set('port', port)`**
- normalise function is a utility function for validating the port number and ensuring they are in usable format.
    - parseInt(val, 10) - converts input in an integer value with base 10.
        - if parsed value comes out to be NaN, then it reverses parse conversion
        - else if parse integer is ≥10, we done porting.
        - else if parse integer is negative, then normalise function returns false and we set default value to our variable “PORT”

# 3. Creating server

```jsx
var server = http.createServer(app);
server.listen(port);

// server.on('error', onError);
// server.on('listening', onListening);
```

- IMP - we have not set HOST NAME
- first, we create a server on our express application instance named “app” . this will be responsible for handling incoming HTTP requests and providing responses.
- When you call **`server.listen(port)`**, the server will start listening on the specified port, and it will be ready to accept incoming HTTP requests.
- If an error occurs while starting the server (e.g., if the specified port is already in use or if there's another issue), the **`onError`** function will be called, allowing you to handle the error gracefully. The **`onError`** function typically logs the error and may perform additional error handling or cleanup.
- The **`'listening'`** event is emitted when the server has successfully started and is actively listening on the specified port.
    - The **`onListening`** function is called when the server starts successfully, and you can use it to perform actions like logging that the server is up and running.