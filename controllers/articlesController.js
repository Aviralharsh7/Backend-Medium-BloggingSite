const Article = require('../models/Article');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const feedArticles = asyncHandler(async (req, res) =>{
    let limit = 20;
    let offset = 0;
    
    if(req.query.limit){
        limit = req.query.limit;
    }
    if(req.query.offset){
        offset = req.query.offset;
    }

    const userId = req.userId;
    const loginUser = await User.findOne(userId).exec();

    const filteredArticles = await Article.find({author: {$in: loginUser.followingUsers}})
        .limit(Number(limit))
        .skip(Number(offset))
        .exec();

    const articleCount = await Article.count({author : {$in: loginUser.followingUsers}});

    return res.status(200).json({
        articles: await Promise.all(filteredArticles.map( async article => {
            return await article.toArticleResponse(loginUser);
        })),
        articlesCount: articleCount
    });
});

const listArticles = asyncHandler(async (req, res) => {
    let limit = 20;
    let offset = 0;

    let query = {};

    if (req.query.limit) {
        limit = req.query.limit;
    }
    if (req.query.offset) {
        offset = req.query.offset;
    }

    if (req.query.author) {
        const author = await User.findOne({username: req.query.author}).exec();
        if (author) {
            query.author = author._id;
        }
    }
    if (req.query.favorited) {
        const favoriter = await User.findOne({username: req.query.favorited}).exec();
        if (favoriter) {
            query._id = {$in: favoriter.favouriteArticles}
        }
    }

    const filteredArticles = await Article.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createAt: 'desc'})
        .exec();

    const articleCount = await Article.count(query);

    if(req.loggedin) {
        const loginUser = await User.findById(req.userId).exec();
        return res.status(200).json({
            articles: await Promise.all(filteredArticles.map(async articles =>{
                return await articles.toArticleResponse(loginUser);
            })),
            articlesCount : articleCount
        });
    } else {
        return res.status(200).json({
            articles: await Promise.all(filteredArticles.map( async article =>{
                return await article.toArticleResponse(false);
            })),
            articlesCount: articleCount
        });
    }
});

const getArticleWithSlug = asyncHandler(async (req, res) =>{
    const {slug} = req.params;
    const article = await Article.findOne({slug}).exec();

    if(!article){
        return res.status(401).json({
            message: "Article not found"
        });
    }

    return await res.status(200).json({
        article: await article.toArticleResponse(false)
    })
})

const createArticle = asyncHandler(async (req, res)=>{
    const id = req.userId;
    const author = await User.findById(id).exec();
    const {title, description, body, tagList} = req.body.article;

    if (!title || !description || !body) {
        res.status(400).json({message: "All fields are required"});
    }

    const article = await Article.create({title, description, body});
    article.author = id;

    if (Array.isArray(tagList) && tagList.length > 0) {
        article.tagList = tagList;
    }

    await article.save();
    return res.status(200).json({
        article: await article.toArticleResponse(author)
    });
});

const deleteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;
    const loginUser = await User.findById(id).exec();

    if(!loginUser){
        return res.status(401).json({
            message: "User not found"
        });
    }
    
    const {slug} = req.params;
    const article = await Article.findOne({slug}).exec();
    if(!article){
        return res.status(401).json({
            message: "Article not found"
        });
    }

    if (article.author.toString() === loginUser._id.toString()){
        await Article.deleteOne({slug});
        res.status(200).json({
            message: "Article successfully deleted!"
        });
    } else {
        res.status(403).json({
            message: "Only author can delete this article"
        });
    } 
});

const favouriteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;
    const loginUser = await User.findById(id).exec();
    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const { slug } = req.params;
    const article = await Article.findOne({slug}).exec();
    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }


    await loginUser.favourite(article._id);
    const updatedArticle = await article.updateFavouriteCount();

    return res.status(200).json({
        article: await updatedArticle.toArticleResponse(loginUser)
    });
});

const unfavoriteArticle = asyncHandler(async (req, res) => {

    const id = req.userId;
    const loginUser = await User.findById(id).exec();
    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const { slug } = req.params;
    const article = await Article.findOne({slug}).exec();
    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    await loginUser.unfavorite(article._id);
    await article.updateFavoriteCount();

    return res.status(200).json({
        article: await article.toArticleResponse(loginUser)
    });
});


const updateArticle = asyncHandler(async (req, res) =>{
    const id = req.userId();
    const {article} = req.body;
    const {slug} = req.params;

    const loginUser = await User.findById(id).exec();
    const target = await Article.findOne( {slug}).exec();

    if(article.author.toString() !== loginUser._id.toString()){
        res.status(403).json({
            message: "Only the author can edit this article"
        })
    }

    if(article.title){
        target.title = article.title;
    }
    if(article.description){
        target.description = article.description;
    }
    if (article.body) {
        target.body = article.body;
    }
    if (article.tagList) {
        target.tagList = article.tagList;
    }

    await target.save();
    return res.status(200).json({
        article: await target.toArticleResponse(loginUser)
    });
});




module.exports = {
    feedArticles,
    listArticles,
    getArticleWithSlug,
    createArticle,
    deleteArticle,
    favouriteArticle,
    unfavoriteArticle,
    updateArticle
}
