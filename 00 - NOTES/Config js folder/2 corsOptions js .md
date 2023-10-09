# 2. corsOptions.js

```jsx
const allowedOrigins = require('./allowedOrigins')
```

- we imported the list of origin URL which are tucked away in separate JS file

```jsx
const corsOptions = {
  origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
      } else {
          callback(new Error('Not allowed by CORS'))
      }
  },
  ~~credentials: true,
  optionsSuccessStatus: 200~~
}
```

- we create an variable object “corsOptions” which we later on pass as arugment to cors( ) at the time of mounting it in the app (basically configure the CORS behaviour)
- origin is an object property and its value is determined by a function. this property determines whether a specific origin is allowed to access the server’s resources or not.
    - it takes two parameters
        - origin - this is a string representing the origin of the incoming http request
        - callback - this function is used for indicating the result of our function (i.e. where origin is allowed or not)
- inside the function we check two things
    - first, if the origin string is present in our “allowedOrigin” array object using the method indexOf method. if it does not find it gives -1.
    - second case could be - there is no origin provided in request headers - this happens during same-origin requests, so we pass them.
- when the conditions are true, call back function is called. with two parameters
    - null indicates there is no error
    - true indicates that request is allowed
- if conditions are false, then we give error and we also explicitly define the error here.
    - we can also throw errors in other ways -axios, mongoose, joi validation errors, expressjs errors (related to http request and routing errors).

```bash
  credentials: true,
  optionsSuccessStatus: 200
}
```

- credentials set to true means - server allows credentials like cookies or http authentication to be sent with the cross origin request.
    - this is done probably because backend and frontend are hosted on different domains.
    - include value should also cross origin requests
    - other values it can take are same-origin, omit.
- this specifies to return 200 code to client for successful preflight (options) requests.
    - preflight are parts of CORS middleware and is sent to check if server would allow the actual request (get, post, etc)