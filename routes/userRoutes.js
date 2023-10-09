const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT')

// Authentication 
router.post('/users/login', userController.userLogin);

// Registration 
router.post('/users', userController.registerUser);

// Get current user 
router.get('/user', verifyJWT, userController.getCurrentUser);

// Update user 
router.put('/user', verifyJWT, userController.updateUser);

module.exports = router; 