# 3. Verify JWT optional

```jsx
const jwt = require('jsonwebtoken');
```

- here we are importing the library to work with json web tokens. it provides
    - `**jwt.verify(token, secretOrPublicKey, [options, callback])`**
    - `**jwt.sign(token, secretOrPublicKey, [options, callback])`** 
    used it in models.js > custom method
    - `**jwt.decode (token)**`
    - error handling with appropriate http responses

```jsx
const verifyJWTOptional = (req, res, next) => {
```

- here we define a middleware function
- next is a callback which passes control to next middleware or route handler

```jsx
const authHeader = req.headers.authorization || req.headers.Authorization;
if (!authHeader || !authHeader.startsWith('Token ') || !authHeader.split(' ')[1].length) {
  req.loggedin = false;
  return next();
}
```

- it extracts the authorization value present in request object and store it in a variable.
- it updates value to false and passes control to next when it finds —
    - if variable is empty
    - if value does not start with “Token   ” , probably a syntax thing 
    **`Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`**
    (other types of token exist like - federated token, which have diff syntax)
    - if the actual token value is present or not after the keyword “Token”
- imp to note that - possibly, the “loggedin” property inside the req object is being created here.

```jsx
const token = authHeader.split(' ')[1];
```

- we are extracting and storing the “actual token” in a variable
- here “split” function splits the string “authHeader” into an array of sub strings whose delimiter is space. then we use [1] to go to the second element of array which is residing at index 1

```jsx
jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      ~~req.loggedin = true;
      req.userId = decoded.user.id;
      req.userEmail = decoded.user.email;
      req.userHashedPwd = decoded.user.password;
      next();~~
    }
)
```

- this jwt.verify function verifies the input token for tampering, token issuer, token audience or just expiry check.
    - takes three arguements - token itself, the secret key, callback func for error handling
    - it is aysnc function
- the secret key here is stored inside an environment variable
    - this key signs the webtoken and is required whenever we generate a webtoken or in this case, accessing a token to verify it.
- error handling is explicitly done to provide a custom response “forbidden” in http response.
    - it also helps with logging the errors.
    - Depending on how the custom error handling callback is implemented, you can decide whether to continue processing the request by invoking **`next()`** or to terminate the middleware chain by sending a response. This decision is often based on the severity and nature of the error.
- 403 - client error - forbidden

```jsx
req.loggedin = true;
req.userId = decoded.user.id;
req.userEmail = decoded.user.email;
req.userHashedPwd = decoded.user.password;
next();
```

- **`decoded`** is an object that contains the payload of the JSON Web Token (JWT) after it has been successfully decoded and verified by the jwt.verify function.
    - The payload of a JWT typically contains various pieces of information, often referred to as "claims," which were included when the JWT was originally created.
- now coming the decoding step, which is only done after successful jwt verification
    - the token has payload which has properties containing values in it. it is this payload which gets decoded and is added to “decoded” object by jwt.verify func
    - these values present in the decoded object are assigned to request object, hence making them accessible to subsequent middleware function or route handlers
    - these properties should match the claims which were included when we signed the jwt (created the token) - like this,
        
        `**const token = jwt.sign({ user: { id: 123, email: 'user@example.com', password: 'hashedpwd' } }, 'yourSecretKey');**`
        

```jsx
module.exports = verifyJWTOptional;
```

- we extract the middleware functions using a special nodejs object called “module.exports”
- now this middleware function is availabe to be imported by other modules also.