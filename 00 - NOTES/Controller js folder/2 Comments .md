# 2. Comments

## 1. Importing dependencies

```jsx
const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');
```

- we import articlemodel for querying over articles stored in our database
- we import user model for querying over users stored in our database
- we import comment model for querying over the comments we have stored in our database
- we also import the “express-aysnc-handler” to delegate the error handling work -
    - more - [‘express-async-handler’ ](1%20Articles%202d0dbbe0cae34eff8e22be90aad20625.md)

## 1. addCommentsToArticle

this controllers handles the logic for adding comments to one article 

```jsx
const id = req.userId;
const commenter = await User.findById(id).exec();

if (!commenter) {
    return res.status(401).json({
        message: "User Not Found"
    });
}
const { slug } = req.params;
```

- we extract and store the userId from request object into a variable
- we then use this id to extract the whole user document and store it in variable “commentater”
    - we throw erorr if user was not found in our database
- here we are destructuring the object “req.params” and extracting the property “slug” and storing it in a variable also named “slug”. shorthand is used here.

```jsx
const article = await Article.findOne({slug}).exec();

if (!article) {
    return res.status(401).json({
        message: "Article Not Found"
    });
}

const { body } = req.body.comment;
```

- now we query the “slug” variable using the “article model” and static method to find the article here and store it in a variable named “article”
    - throw error if slug match was not found in our database
- we also extract the “comment” from request object and store it in “body” variable. destructuring is used here.
- 401 - client error + unauthorized

```jsx
const newComment = await Comment.create({
    body: body,
    author: commenter._id,
    article: article._id
});

await article.addComment(newComment._id);

return res.status(200).json({
    comment: await newComment.toCommentResponse(commenter)
})
```

- using the “comment model” and static method “create”, we are creating a new document in the comment collection and pass it suitable variable which we created (using extraction from request body) in previous lines of code = an instance of this new document object is stored in a variable which we use later on.
    - we get body value from  - request.body.comment
    - we get author id from - variable containing whole user document of the commentator which we extracted using “user id” as  query
    - we get article id from - variable containing whole article document which we extracted using “slug” as query
- now we pass this created document variable “newComment._id” to a custom function.
    - this custom function is called using “article” (it is an instance) because we are now operating at the specific document which we extracted earlier using the “article model” and static method having “slug”

## 2. getCommentsFromArticle

this async controller should load all the comments that were written on an article 

1. first we import dependencies like user model, article model, comment model. we also import a nodejs package to delegate error handling of these async functions 
2. now we come to our main async controller function 
    
    ```jsx
    const { slug } = req.params;
    
    const article = await Article.findOne({slug}).exec();
    
    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }
    ```
    
    - we destructure and extra property named slug from the object req.params and store it in a variable named slug
    - we store the whole article document in a variable. we find it using article model and findOne static method which queries our database using the slug variable we defined in previous line of code.
        - if article not found, we return a response containing error 401
    
    ```jsx
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
                // console.log(commentObj);
                const temp =  await commentObj.toCommentResponse(false);
                // console.log(temp);
                return temp;
            }))
        })
    }
    ```
    
    - we extract the jwt verification value in this variable
        - Reference - [3. Verify JWT optional](../../Middleware%20js%20folder%20fe0fc60e2ab847a0ae432353cda9a0ed/Middleware%20js%20f40c87629e3143e89088d9cc596dbf6e/3%20Verify%20JWT%20optional%20205285212a6c43c09dcce8569f5d56e0.md)
    - now we extract the whole user document and store it in a variable. this is done by “user model” and static method findbyId and passing it the userId from request object.
    - now we return the http response - which contains comments
        - we first iterate over all the comments object present inside the article object and access the commentId and send this id to another async func where -
            - we extract the comment object using “comment model” and static method by supplied it the comment id
            - then we call a custom func over the comment object and supply it the whole user document. this func formats the object to response style.
    - but if jwt verification had failed then
        - return a response which includes following things
            - we retreive the comments from the article we had and format it
                
                The comments are retrieved and formatted using the **`Promise.all`** method and the **`map`** function. It iterates over the **`article.comments`** array, which likely contains IDs of comments associated with the article.
                
            - only change is that while calling the custom function to format our comment object, we send “false” instead of whole user document. this will make changes in the way formatting is done but nonetheless it will return the formatted comments

## 3. Delete comment

1. We import dependencies like user, article, comment models and aynsc handler package for error handling 
2. now we define the async controller function 
    
    ```jsx
    const userId = req.userId;
    const commenter = await User.findById(userId).exec();
    if (!commenter) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }
    
    const { slug, id } = req.params;
    const article = await Article.findOne({slug}).exec();
    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }
    ```
    
    - we extract id from request object. we use this id to extract the whole user document and store it in a variable “commentator”.
        - if user is not found in database, error handling is done and function is closed with return statement
    - we extract slug and id from req.params object by destructuring method.
        - we use slug to extract the whole article document and store it in a variable holding a javascript object.
        - if article was not found in database then func is closed with return statement with an error handling response.
    - sneakily, we have used destructuring to extra the id also from the request object.
        - here the id of comment actually and is found inside the req.params object.
    
    ```jsx
    const comment = await Comment.findById(id).exec();
    
    // console.log(`comment author id: ${comment.author}`);
    // console.log(`commenter id: ${commenter._id}`)
    ```
    
    - we use the comment id to extract the comment and store the whole document of which comment id is a part of,  in a variable.
    
    ```jsx
    if (comment.author.toString() === commenter._id.toString()) {
      await article.removeComment(comment._id);
      await Comment.deleteOne({ _id: comment._id });
      return res.status(200).json({
          message: "comment has been successfully deleted!!!"
      });
    } else {
      return res.status(403).json({
          error: "only the author of the comment can delete the comment"
      })
    }
    ```
    
    - now we need to check if client who is deleting is the comment is also the author of that comment
        - we do this by matching the id of author and client (we convert id to strings for matching reasons)
    - if matches,
        - on our variable “article” which is object instance, we call a custom function and pass comment id to it. this custom function is defined in models. it searches for comment id and removes it and saves the changes to database.
            - hence comment is removed from article.comment which probably all comment ids
        - we also use the “comment model” to delete the actual comment having this id in our database.
        - then we finally return a json response of 200 code and success msg.
    - if not matches, it returns response with appropriate http error code and msg

## 4. Exporting modules

```jsx
module.exports = {
    addCommentsToArticle,
    getCommentsFromArticle,
    deleteComment
}
```

- using special nodejs object, we export all the function in this controller file as an object.
- now this object can be imported in other modules