# 5. Comments

1. Importing dependencies

```jsx
const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const verifyJWTOptional = require('../middleware/verifyJWTOptional');
const commentController = require('../controllers/commentController');
```

- trivial

2. Defining routes

```jsx
router.post('/:slug/comments', verifyJWT, commentController.addCommentsToArticle);

router.get('/:slug/comments', verifyJWTOptional, commentController.getCommentsFromArticle);

router.delete('/:slug/comments/:id', verifyJWT, commentController.deleteComment)
```

- sd
1. Exporting module 
    
    ```jsx
    module.exports = router;
    ```
    
    - trivial