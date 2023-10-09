const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');

const addCommentsToArticle = asyncHandler( async( req, res) =>{
    const id = req.userId;
    const commenter = await User.findById(id).exec();
    if(!commenter){
        return res.status(401).json({
            message: "User not found"
        });
    }

    const {slug} = req.params;
    const article = await Article.findOne({slug}).exec();
    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    const {body} = req.body.comment;
    const newCommnent = await Comment.create({
        body: body,
        author: commentor._id,
        article: article._id
    })

    await article.addComment(newComment._id);
    return res.status(200).json({
        comment: await newComment.toCommentResponse(commenter)
    });

});

const getCommentsFromArticle = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const article = await Article.findOne({slug}).exec();
    if (!article) {
        return res.status(404).json({
            message: "Article Not Found"
        });
    }

    const loggedin = req.loggedin;

    if (loggedin) {
        const loginUser = await User.findById(req.userId).exec();
        return await res.status(200).json({
            comments: await Promise.all(article.comments.map(async commentId => {
                const commentObj = await Comment.findById(commentId).exec();
                return await commentObj.toCommentResponse(loginUser);
            }))
        })
    } else {
        return await res.status(200).json({
            comments: await Promise.all(article.comments.map(async (commentId) => {
                const commentObj = await Comment.findById(commentId).exec();
                const temp =  await commentObj.toCommentResponse(false);
                return temp;
            }))
        })
    }
});

const deleteComment = asyncHandler(async (req, res) =>{
    const userId = req.userId;
    const commenter = await User.findById(userId).exec();
    if(!commenter){
        return res.status(404).json({
            message: "User not found"
        });
    }
    const {slug, id} = req.params;
    const article = await Article.findOne({slug}).exec();
    if(!article){
        return res.status(404).json({
            message: "Article not found"
        });
    }

    const comment = await Comment.findById(id).exec();
    if(comment.author.toString() === commentor._id.toString()){
        await article.removeComment(comment._id);
        await Comment.deleteOne({_id: comment._id});
        return res.status(200).json({
            message: "Comment deleted"
        });
    } else {
        return res.status(403).json({
            error: "only author can delete their comment"
        });
    }
});

module.exports = {
    addCommentsToArticle,
    getCommentsFromArticle,
    deleteComment
}
