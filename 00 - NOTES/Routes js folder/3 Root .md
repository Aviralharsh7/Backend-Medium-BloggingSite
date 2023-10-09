# 3. Root

1. We import dependencies 
    
    ```jsx
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    ```
    
    - we import express and use it to call express.Router() function which creates an instance of the express router and stores it in const variable named “router”
        - this instance object called router will now allow us to use various functions like
            - .use()  for middleware
            - .get (or post, delete, put) to define routes on the router instance. this helps in organising our route handling logic.
    - we also import ‘path’ which makes path operating system independent and also help with serving paths of public files at the time of mounting them on app using express.static()
2. Now we define the route for “get” request on path “ xxx “ on this router 
    
    ```jsx
    router.get('^/$|/index(.html)?', (req, res) =>{
        res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    });
    
    module.exports = router;
    ```
    
    - we use the function router.get( ) for this
    - to define URL to match with, we have used a regular expression - which essentially match for two types of URL paths
        1. Paths that are exactly **`/`**.
        2. Paths that contain "`**/index**`" followed by an optional "`**.html**`" extension.
            - ^ - this asserts that pattern should match from beginning of the input
            - /$ - this matches a single forward slash - this slash represents the root path of website.
            - | - this vertical is an OR operator
            - /index(.html) - it matches for string “/index” . hence it is looking for a URL path which has this string as a substring.
                - the string can optionally have “.html” at back of it
    - an arrow function is used for defining this route handler. it takes two parameter objects
        - res.sendFile( ) is a inbuild method of expressjs which will send the specified file in the response object as response.
        - path.join( ) is used to construct the absolute file path to the file which we will send here.
            - they are separated by commas but they translate to `**<directory_of_current_script>/../views/index.html**`
    - module.exports is a special object which will now allow this whole module to be imported by other modules using “require()”