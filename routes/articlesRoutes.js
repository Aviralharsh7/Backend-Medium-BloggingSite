const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const verifyJWTOptional = require('../middleware/verifyJWTOptional');

const articleController = require('../controllers/articlesController');

router.get('/feed', verifyJWT, articleController.feedArticles);

router.get('/', verifyJWTOptional, articleController.listArticles);

router.get('/:slug', articleController.getArticleWithSlug);

router.post('/', verifyJWT, articleController.createArticle);

router.delete('/:slug', verifyJWT, articleController.deleteArticle);

router.post('/:slug/favourite', verifyJWT, articleController.favouriteArticle);

router.delete('/:slug/favourite', verifyJWT, articleController.unfavouriteArticle);

router.put('/:slug', verifyJWT, articleController.updateArticle);

module.exports = router; 