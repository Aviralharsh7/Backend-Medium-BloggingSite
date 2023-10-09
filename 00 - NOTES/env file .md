# .env file

Status: medium clone - functionality

1. first we create .env file in root folder 
2. we add this .env to .gitignore 
3. we ensure dotenv exists in package json file and is also installed 
4. we then import dotenv and also config it inside our entry point file like server.js  or app.js or index.js 
5. now, we can start calling these .env variables 

- we run the server by only `**node server.js`** (aka this becomes the entry point of our web app)
    - using dotenv and .env helps us avoid writing this code
        
        ```jsx
        PORT=8626 NODE_ENV=development node server.js
        ```
        
- various environment variable defined
    - development and port setting
        
        ```jsx
        NODE_ENV = development
        PORT = 3000
        ```
        
    - database URI
        
        ```jsx
        DATABASE_URI = mongodb://localhost/mydatabase;
        ```