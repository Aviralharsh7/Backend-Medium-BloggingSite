# 1. Articles

1. we import the dependencies 

```jsx
const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const verifyJWTOptional = require('../middleware/verifyJWTOptional');
const articleController = require('../controllers/articlesController');
```

- we importing node libaries and other modules which we have defined in our app like middlware files and controller files.
- here express variable object is storing the module named “express”. so now we can use this variable to access various part of this module.
    - in next line, we use express variable to access one of its property and create an instance of it inside the variable “router”
    - router property allows us to create instances of an Express Router. define and organise routes within our express app.

```jsx
// feed endpoint must go before :slug endpoint
router.get('/feed', verifyJWT, articleController.feedArticles);

router.get('/', verifyJWTOptional, articleController.listArticles);

router.get('/:slug', articleController.getArticleWithSlug);
```

- see how we used “router” variable to handle GET requests here
- sytnax:
    - /feed - this is the URL path which this code captures
    - verifyJWT - calling middleware, which is done before handling the request
    - articlController.feedArticles - this is controller file which houses the logic relevent to handling this request
- The order of these route definitions is significant:
    - The '/feed' route should be defined before the '/:slug' route because Express.js matches routes in the order they are defined. If the '/feed' route were defined after the '/:slug' route, it would never be reached because '/:slug' would match any path segment, including 'feed'.
    - The '/' (root) route is usually defined before other routes to serve as a default route, but it's not as critical to the order in this case since it matches any request that doesn't match the other specific routes.

```jsx
router.post('/', verifyJWT, articleController.createArticle);

router.delete('/:slug', verifyJWT, articleController.deleteArticle);

router.post('/:slug/favorite', verifyJWT, articleController.favoriteArticle);

router.delete('/:slug/favorite', verifyJWT, articleController.unfavoriteArticle);

router.put('/:slug', verifyJWT, articleController.updateArticle);
```

- trivial