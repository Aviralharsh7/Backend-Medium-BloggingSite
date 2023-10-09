# 1. allowedOrigin.js

```jsx
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://winterrrrrff.github.io',
    'https://angular-realworld-example-app-neon.vercel.app'
];

module.exports = allowedOrigins;
```

- we create a variable “allowedOrigins” which is an array. it is a special type of object.
- we are storing a list of accepted URL for CORS
    - aka these orgins are allowed to access resources or perform some action on a server.
- [localhost](http://localhost) are just local development servers