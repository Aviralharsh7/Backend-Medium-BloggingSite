# 2. Users

1. we import dependencies 
    
    ```jsx
    const express = require('express');
    const router = express.Router();
    const userController = require('../controllers/userControllers');
    const verifyJWT = require('../middleware/verifyJWT')
    ```
    
2. we start defining route for respect path and “type of http requests”
    
    ```jsx
    // Authentication 
    router.post('/users/login', userController.userLogin);
    
    // Registration 
    router.post('/users'. userController.registerUser);
    
    // Get current user 
    router.get('/user', verifyJWT, userController.getCurrentUser);
    
    // Update user 
    router.put('/user', verifyJWT, userController.updateUser);
    
    module.exports = router;
    ```
    
    - simple