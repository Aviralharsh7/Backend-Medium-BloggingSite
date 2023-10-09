const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyJWTOptional = require('../middleware/verifyJWTOptional');

// Get profile (optional authentication)
router.get('/:username', verifyJWTOptional, profileController.getProfile);

// Follow user 
router.post('/:username/follow', verifyJWT, profileController.followUser);

// Unfollow user 
router.delete('/:username/follow', verifyJWT, profileController.unFollowUser);

module.exports = router;