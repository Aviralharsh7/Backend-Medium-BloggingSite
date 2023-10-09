# 3. dbConnect.js

1. first we import mongoose library to use it methods like mongoose.connect 
    
    ```jsx
    const mongoose = require('mongoose');
    ```
    
2. then we define our function named “connectDB” which is async function since we are working with a database which will involve waiting for responses from server. 
    
    ```jsx
    const connectDB = async () => {
        try {
            await mongoose.connect(process.env.DATABASE_URI);
        } catch (err) {
            console.log(err);
        }
    }
    ```
    
    - inside try block, we attempt to connect to database by using method “mongoose.connect( )” and providing it the connection URI as a parameter.
        - The **`await`** keyword is used before **`mongoose.connect()`** to make sure that the connection is established before proceeding further. Since **`mongoose.connect()`** returns a promise, using **`await`** allows you to work with it in an asynchronous manner.
    - error handling is done by catching and logging it on console.
    
    ```jsx
    module.exports = connectDB;
    ```
    
    - we export this function using a special nodejs object and now it can be imported by other modules using “require()”