# 4. Profiles

```jsx
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyJWTOptional = require('../middleware/verifyJWTOptional');
```

- importing router for its function and controllers to call its custom methods
- verifyJWTOptional asserts that client need not be a logged in user and if it is then verifyJWTOptional will verify the token and update request object with the token payload.

```jsx
router.get('/:username',verifyJWTOptional, profileController.getProfile);
router.post('/:username/follow', verifyJWT, profileController.followUser);
router.delete('/:username/follow', verifyJWT, profileController.unFollowUser);
module.exports = router;
```

- notice the router.get/post/delete here
- notice how all route are being defined into a single module named “router”