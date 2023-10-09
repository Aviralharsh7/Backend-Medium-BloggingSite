# 7. Test

1. we import dependencies 
    
    ```jsx
    const express = require('express');
    const router = express.Router();
    ```
    
2. we define the route for GET request on the path “/” 
    
    ```jsx
    router.get('/', (req, res) =>{
        console.log("successful!");
        res.status(200);
        res.json({message: "successful"})
    });
    
    module.exports = router;
    ```
    
    - here the URL path is only “/” but this route handler was mounted on “/test” using app.use() in our app.js file. So this “/” is on top of the file path at which the route handler was mounted on !!
    - the route is defined with an arrow function which has two parameters.
    - inside the function, we console.log a message and also change or set the properties in the response object as defined here.
    - at last, we add this module to a special object called “module.exports” which enables it to get imported by other modules using “require()”