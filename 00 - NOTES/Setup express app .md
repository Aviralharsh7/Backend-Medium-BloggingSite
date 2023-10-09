# Setup express app

Status: medium clone - implement

# Setting up basic environment

1. open terminal and run `**npm install express-generator -g**`
2. create an express app via `**express myapp**`
3. create package json file via `**npm init**`
4. install the dependencies after editing package file via `**npm install**`
5. a few optional steps 
    - auto update server when files changes
        
        `**npm install --save-dev nodemon`** and `**npm install -g nodemon**`
        
    - add dev mode and simplify stuff
        
        ```json
          "scripts": {
            "start": "node ./bin/www",
            "devstart": "nodemon ./bin/www",
            "serverstart": "DEBUG=express-locallibrary-tutorial:* npm run devstart"
          },
        ```
        
    - see the entry point is ./bin/www and not app.js but this file itself contains the code
        
        ```bash
        #!/usr/bin/env node
        /**
         * Module dependencies.
         */
        const app = require("../app");
        ```
        
6. Done 
    - lets go to app.js which is an express application object named “app” by convention.

# Modifying environment

1. we edit the package json file. ensuring all dependencies are mentioned in it. 
2. we install all new dependencies via `**npm install**`
3. now we go to entry point of app > app.js