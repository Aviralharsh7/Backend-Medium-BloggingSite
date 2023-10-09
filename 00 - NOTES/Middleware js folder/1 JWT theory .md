# 1. JWT theory

- “jsonwebtoken” is a nodejs library used for working with json web tokens
- this JSON web token consists of three parts - header, payload, signature
    - header and payload are JSON objects which are concatenated together with ‘.’ to form JWT
- we create a jwt by
    
    ```jsx
    const token = jwt.sign({ userId: 123 }, 'yourSecretKey');
    ```
    
    - here **`{ userId: 123 }`** is the payload, and **`'yourSecretKey'`** is a secret key used to sign the token.
- jwt is often used in middleware to authenticate and authorize users. the middleware is used to verify jwt or protect certain routes.
- good properties to have for your JWT
    - secret key is stored in environment variables to keep it safe. or we can use config management system for it.
    - jwt should have an expiration time to improve security
    - proper error handling of token validation and expiration with accurate http responses (401, etc)