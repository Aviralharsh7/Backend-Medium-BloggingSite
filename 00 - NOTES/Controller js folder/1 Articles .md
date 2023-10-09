# 1. Articles

## 1. Importing dependencies

```jsx
const Article = require('../models/Article');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
```

- ‘article model’ -
    
    ```jsx
    const mongoose = require('mongoose');
    const uniqueValidator = require('mongoose-unique-validator');
    const slugify = require('slugify');
    const User = require('./User');
    ```
    
    1. mongoose supplies the schema which tell how to model and interact with databases in our app 
    2. uniqueValidator is a package which helps validate and manage unqiue fields. no two documents in a collection can have same value for the same field. this is used for username, titles, etc. 
    3. slugify is a package which converts string into URL friendly strings which is then used for making URL readable and enchance SEO
    4. ./User - here this article model is importing another model named user - which has user schema defined.
    5. 
        
        ```jsx
        const articleSchema = new mongoose.Schema({
        slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
        }, …… so on 
        ```
        
        1. this is the schema. it is used to define the structure data of articles in database 
        2. it has various properties like type, unique, lowercase, etc - which are applied various “data components” of article 
    6. we will study more parts of “model” when we reach it. lets go back to controller files.
- ‘user model’
    1. as above 
- ‘express-async-handler’
    1. it is nodejs package which has utility function for handling async func WITHIN expressjs route handlers 
    2. it wraps our route handlers and automatically handles any errors that occurs with the aysnc func inside of route handlers 
    3. this way we dont have to explicitly do error handling 

## 2. Feed articles

1. import dependencies 
2. create async controller function 
    
    ```jsx
    let limit = 20;
    let offset = 0;
    
    if (req.query.limit) {
        limit = req.query.limit;
    }
    
    if (req.query.offset) {
        offset = req.query.offset;
    }
    ```
    
    - here limit is max number of items or records that will be returned in a single request
    - offset specifies the starting point from which the data retrieval should begin in the dataset. this comes handy in pagination
    
    ```jsx
    const userId = req.userId;
    const loginUser = await User.findById(userId).exec();
    ```
    
    - we extract the user id from request object and store it in userId variable
    - we store the whole user document in a variable named loginUser  which matches the userId we passed. Done using “user model” and static methods
    
    ```jsx
    const filteredArticles = await Article.find({author: {$in: loginUser.followingUsers}})
      .limit(Number(limit))
      .skip(Number(offset))
      .exec();
    ```
    
    - we find the filtered articles using “article model” and static method find -
    - we run query for the authors which are followed by our user
        - and then limit and skip for pagination
    - it returns all articles having the filtered authors inside them and stores it in the variables as -
        - variable is an array (not an object instance)
        - each array object contains one article
    
    ```jsx
    const articleCount = await Article.count({author: {$in: loginUser.followingUsers}});
    
    return res.status(200).json({
        articles: await Promise.all(filteredArticles.map(async article => {
            return await article.toArticleResponse(loginUser);
        })),
        articlesCount: articleCount
    });
    ```
    
    - now we count the articles using similar method to filtering articles
    - we end function with return http json response which further carries inside it
        - the array of articles which need to be formatted in response way
            - this is done by using the “map method” to iterate over the array and send each array element to a custom function for transformation.
        - the map method returns an array of promises (one for each article) because the transformation function is asynchronous.
            - to wait for all async function, we use “promise.all”
            - promise.all takes an array of promises as input and returns a single promise that resolves when all promises all resolved (aka all calls to func named “toArticleResponse”)
            - for loop is sequential, map+promise.all combo is parallel.
        - role of await
            - await inside the map method ensures each call of “toArticleResponse” is sequential.
            - await outside the map method ensures that we wait for resolution of promise.all operation.

## 3. List articles

1. import dependencies
2. create async controller function
    
    ```jsx
    let limit = 20;
    let offset = 0;
    let query = {};
    if (req.query.limit) {
        limit = req.query.limit;
    }
    
    if (req.query.offset) {
        offset = req.query.offset;
    }
    if (req.query.tag) {
        query.tagList = {$in: [req.query.tag]}
    }
    ```
    
    - extracting limit and offset for pagination
    - imp to note - the creation of js object named query. it is used to extract and store various query properties in one place to be used later on.
        - here we are storing all the tags which were send in request object so that we can use it to filter
        - similarly other field / key can be created in the query object if user has specified more parameters.
    
    ```jsx
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
    ```
    
    - here, we are handling query for a particular author from the client
        - first we check if such query exists, then with help of “user mode” and static method, we find this author in our database and create an instance object of its user document and store it in a variable.
        - if author was found was in database, then we add the _id property to our query object for future filtering wrt it.
    - here, we are handling a query where client wants to filter by favorited articles from a “particular user”
        - with help of “user model” and static method, we find the “particular user” in our database, which we were given in our request object and store its whole user document in a variable.
        - if search was successful, then we use $in operator to check if “_id”  of all the “favourited articles” of this “particular user” and add all these _id to our query object.
    
    ```jsx
    const filteredArticles = await Article.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({createdAt: 'desc'}).exec()
    
    const articleCount = await Article.count(query);
    ```
    
    - here, we finally create the object which has all filtered articles
        - we used “article model” and static method “find” and pass it our query object. it then returns all the filtered articles, probably as an array.
        - it also adds pagination limits on the response from “find” method and also sorts it in descending order wrt time of creation i.e. newer articles on top.
    - here we store the total count of articles which matched our query object, without any filter of pagination.
    
    ```jsx
    if (req.loggedin) {
      const loginUser = await User.findById(req.userId).exec();
      return res.status(200).json({
          articles: await Promise.all(filteredArticles.map(async article => {
              return await article.toArticleResponse(loginUser);
          })),
          articlesCount: articleCount
      });
    } else {
      return res.status(200).json({
          articles: await Promise.all(filteredArticles.map(async article => {
              return await article.toArticleResponse(false);
          })),
          articlesCount: articleCount
      });
    }
    ```
    
    - here, we check if user is still logged in or not
        - first, we extract the whole user document and store it in a variable by help of “user model” and static method and supplying the userId we got in request object.
        - then we end our async controller func with a return statement containing http json response and status code 200
            - before sending the array object containing all the articles, we use ‘map” to iterate over it and send each element of array object (Which is one article) to a custom function which formats the element into a response like format. this custom function takes the whole user document as input.
            - we also count of all filtered articles in our response.

## 4. getArticleWithSlug

```jsx
const getArticleWithSlug = asyncHandler(async (req, res) =>{
  const {slug} = req.params;
  const article = await Article.findOne({slug}).exec();

  if(!article){
      return res.status(401).json({
          message: "Article not found"
      });
  }

  return res.status(200).json({
      article: await article.toArticleResponse(false)
  })
})
```

- notice use of req.params as it was dynamic and defined by middleware.

## 5. Favourite article

1. we import dependencies 
2. we create async controller function 
    
    ```jsx
    const id = req.userId;
    const { slug } = req.params;
    const loginUser = await User.findById(id).exec();
    ```
    
    - first we extract userId from request object and store it in variable
    - then we use shorthand to - extract property named “slug” from the object req.params and then store it in variable named “slug”
    - then we find the user in our database which matches the ID variable. this is done by help of “User model” and then when user is found, the whole user document is stored in variable named “loginUser”
    
    ```jsx
    const article = await Article.findOne({slug}).exec();
    
      if (!article) {
          return res.status(401).json({
              message: "Article Not Found"
          });
      }
      // console.log(`article info ${article}`);
    
      await loginUser.favorite(article._id);
    ```
    
    - first we use “Article model” alongwith findOne function to make a mongoDB query. this will be an async function and requires “.exec()” to start running
        - here findOne function takes {slug} as query and finds for article collection to have property named “slug” and its value matching the value of “slug” variable, both of which were transfered to query as shorthand.
        - the collection is decided with the help of “model” specified.
        - whole article document is returned if the slug matches else null value
    - we check if article variable contains the document or null and given appropriate error
    - now we take loginUser instance object and call a custom func defined on our model’s schema called - favourite and supply it the id of article which we are going to favourite.
    
    ```jsx
      const updatedArticle = await article.updateFavoriteCount();
    
      return res.status(200).json({
          article: await updatedArticle.toArticleResponse(loginUser)
      });
    ```
    
    - now we call another function using instance of “article’’ which will update the favourite count of the article.
        - important to note that this updateFavouriteCount is a custom method defined on our model’s schema, which took this instance variable and made changes and then used article.save() to save those changed in our database also
        - here we are operating at individual document level so instance method. meanwhile static method is used for operating at collection level.
    - we end the func with a return statement which is returning response to http request and also sending json file whose property’s value are being formatted using a custom function

## 6. Create articles

this controller handles the creation of a new article within the application. kinda like submit button after all content was written down by author.
403 - forbidden, 401 - unauthorized

1. We import dependenices 
2. we define the controller function now 
    
    ```jsx
    const createArticle = asyncHandler(async (req, res) => {
    ```
    
    - we create an object “registerUser” and assign it aysnc function which takes two parameters. We wrap this async function with asyncHandler (which is imported utility func for error handling in route handler functions)
    
    ```jsx
    const id = req.userId;
    ```
    
    - we first extract userId from request object
    
    ```jsx
    const author = await User.findById(id).exec();
    ```
    
    - we then use “user model” to query over our mongoDB collection and find the id we passed as parameter here. it returns a user document and store it author variable. if not found, the variable will be null
    
    ```jsx
    const { title, description, body, tagList } = req.body.article;
    ```
    
    - this is object destructuring syntax which extracts the specific properties (title, descrip, body,taglist) and assigns them to individual variables.
    
    ```jsx
    if (!title || !description || !body) {
        res.status(400).json({message: "All fields are required"});
    }
    ```
    
    - we also perform a check if title, description,body fields must not be empty and send 400 error code if any of the field is empty.
    
    ```jsx
    const article = await Article.create({ title, description, body });
    ```
    
    - using the “article model” for schema, we create a new document “article” and these variables (title, description, body) are used to create a javascript object where theese variable names are used as keys. This object is then passed as arguement to article.create() method.
        - once the document is created, the result (an instance of Article model representing the newly created document) is stored in the article variable
        - this variable names must match the key names defined by schema so that mongoose can map them.
        - here mongoose automatically checks for data rule compliance and type coercion with other documents in that collection at the time of creation
    
    ```jsx
    article.author = id;
    ```
    
    - now we allot the userId we found in request object - to be the author of that article.
    
    ```jsx
    if (Array.isArray(tagList) && tagList.length > 0) {
        article.tagList = tagList;
    }
    ```
    
    - we work on variable named “tagList” and check
        - if it is an array `**Array.isArray(tagList)**`
        - if it is empty `**tagList.length > 0**`
        - Then, we take the object “article” and to its property named “tagList”, we pour the values of array “tagList”
            - in javascript, object is data structure having key-value pairs.
            - array is a special type of object that store multiple values in single variable. it is ordered.
    
    ```jsx
    await article.save()
    ```
    
    - the newly created object “article” is saved to the database.
    
    ```jsx
    return await res.status(200).json({
        article: await article.toArticleResponse(author)
    })
    ```
    
    - after all is successfully done, we exit the current function with return statement and return the response to HTTP request.
        - then we serialise the javascript object into json by — json ({ js object })
        - then we call method “toArticleResponse()” which will transform this article object into response friendly format

## 7. Delete article

1. we import dependencies like above. 
2. we call async controller function to handle this as http request and send it back a response 
    
    ```jsx
    const id = req.userId;
    ```
    
    - first we extract id from request object
    
    ```jsx
    const { slug } = req.params;
    ```
    
    - here we are destructuring an object by extracting the property “slug” in the object req.params and then creating a variable named slug with the extracted value.
        - this basically captures the query:string part of the URL using the object “req.params”. this object has route parameters which capture the values specified in URL.
    
    ```jsx
    const loginUser = await User.findById(id).exec();
    ```
    
    - then using the “user model” we find the user with the ID we extracted from request object.  the function returns the WHOLE user document containing that matched id, as javascript object.
        - returns null if no user id found
    
    ```jsx
    if (!loginUser) {
            return res.status(401).json({
                message: "User Not Found"
            });
        }
    ```
    
    - here we send the error msg and code 401 if userId in request object is not found in our database.
    
    ```jsx
    const article = await Article.findOne({ slug }).exec();
    ```
    
    - findOne() is static method provided by the mongoose model and its queries at collection level, not document level.
    - now, we are using the “Article model” to find an article in our database with “value” of slug variable aka the specified slug.
        - it returns the whole document as javascript object if it matches the slug object we provided
        - The shorthand syntax **`{ slug }`** is convenient and widely used when you want to create an object with a property that has the same name as the variable you're passing.
        - here we wrote slug in curlies because
            - The MongoDB query condition is created with **`{ slug }`**.
            - MongoDB interprets this as querying for documents where the "slug" field matches the value of the **`slug`** variable. Essentially, it's shorthand for **`{ slug: slug }`**.
            
            So, when you pass **`{ slug }`**, you're telling MongoDB to look for documents where the "slug" field matches the value stored in the **`slug`** variable.
            
            - **`Article.findOne(slug).exec()`**, it would be interpreted differently:
                1. MongoDB would treat **`slug`** as the entire query condition, not just a field name.
                2. It would try to match documents where the entire document matches the value of the **`slug`** variable. This is likely not what you want, as it doesn't match the field name "slug" specifically.
    
    ```jsx
    if (!article) {
            return res.status(401).json({
                message: "Article Not Found"
            });
        }
    ```
    
    - if the artilce variable is empty then it means article we trying to delete is not found and an appropriate error is thrown containing msg and status code.
    
    ```jsx
    if (article.author.toString() === loginUser._id.toString()) {
            await Article.deleteOne({slug: slug});
            res.status(200).json({
                message: "Article successfully deleted!!!"
            })
        } else {
            res.status(403).json({
                message: "Only the author can delete his article"
            })
        }
    ```
    
    - now we check if author of the article we found and is same person who is trying to delete it-  by matching [article.author](http://article.author) to userId
        - here matching is done by converting the user Id values to string - it is common practice when comparing unique identifiers like mongodb objectIds - since string comparsion is straightforward with no subtle nuances related to object comparision like
            - compare by reference aka even if 2 object have same properties and values, can have different reference memory locations
            - deep comparision have nested properties
            - define it for your custom data types
            - cant do == or === on NaN (have to use isNaN() function)
            - js object comparision does not consider order of properties which can be important to us
    - notice that we don’t use shorthand here when passing {slug}

## 8. Update article

1. import dependencies 
2. create async controller function 
    
    ```jsx
    const  userId  = req.userId;
    const { article } = req.body;
    const { slug } = req.params;
    ```
    
    - first we get out the user id
    - then we shorthandily store the article in a variable using destructuring in js
    - same for the slug
    
    ```jsx
    const loginUser = await User.findById(userId).exec();
    const target = await Article.findOne({ slug }).exec();
    ```
    
    - we store the whole user document which matches with the id we found in request object. we do by using “user model” and static method findById
    - now we store the whole article document which matches with slug we found in request object via req.params. we do this by using “article model” and a static method
        - note the shorthand we used to pass the variable as an object and then search for it in the collection as property.
    
    ```jsx
    if (article.title) {
          target.title = article.title;
    }
    if (article.description) {
        target.description = article.description;
    }
    if (article.body) {
        target.body = article.body;
    }
    if (article.tagList) {
        target.tagList = article.tagList;
    }
    ```
    
    - here we are just overwriting the stuff we got in request object to the target article we have pulled out from our database using slug
    
    ```jsx
    await target.save();
    return res.status(200).json({
        article: await target.toArticleResponse(loginUser)
    })
    ```
    
    - the changes we made while overwriting were made to the instances in memory and are not automatically persisted to the database. this is done by calling func save( )
        - memory instances are wiped when program exits or document is garbage collected.

## 9. Exporting modules

```jsx
module.exports = {
    createArticle,
    deleteArticle,
    favoriteArticle,
    unfavoriteArticle,
    getArticleWithSlug,
    updateArticle,
    feedArticles,
    listArticles
}
```

- here we are exporting an object which contains various controllers functions (as properties) that were defined in the above lines of code
- this module.exports is a special object in Node.js which defines what should be exported from a module (here, its the articleController module)
    - when another module imports this controller module, it will receives this object containing all these controller functions
- each controller function is responsible for handling specific actions or endpoints in our app
- these modules will probably be imported by route modules which use the logic in controller module to handle the http requests