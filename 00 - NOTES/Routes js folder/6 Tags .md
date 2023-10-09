# 6. Tags

1. We import dependencies 
    
    ```jsx
    const express = require('express');
    const router = express.Router();
    const tagsController = require('../controllers/tagsController');
    ```
    
    - trivial
2. we define routes 
    
    ```jsx
    router.get('/', tagsController.getTags)
    ```
    
    - trivial
3. we export the module 
    
    ```jsx
    module.exports = router;
    ```
    
    - trivial