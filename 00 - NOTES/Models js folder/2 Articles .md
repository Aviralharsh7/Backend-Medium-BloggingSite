# 2. Articles

## 1. Importing dependencies

```jsx
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const User = require('./User');
```

- mongoose is nodejs library which helps with data modeling and defining schema and perform operations with mongodb databases
- unique-validator is a plugin for mongoose that adds validation for unique fields in mongodb documents.
    - this plugin ensures that in a collection, no two such documents exists which have same value for same field (email, username)
- slugify is npm module which creates slugs from strings, making them more readible and seo friendly.
    - A slug is a URL-friendly version of a string, typically generated from a title or a name.
- we import user module containing schema of for user database.

## 2. Defining schema object

```jsx
const articleSchema = new mongoose.Schema({
  slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
  }, 
		.... so on
}
```

- essentially we are defining a mongoose schema here for “an article” in mongodb database.
    - A schema in Mongoose defines the structure of documents (data records) that will be stored in a MongoDB collection. It specifies the fields or attributes that an article document can have, along with their data types and validation rules.
- articleSchema is object that represents this schema.
    - remember this template as reference for what variouus rules and other properties can be defined inside a schema for a document in mongoDB (required, unique, ref, type, index)
- When you create an index on a field, MongoDB creates a sorted data structure for that field, which allows for faster searching and sorting based on that field.

```jsx
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  favouritesCount: {
      type: Number,
      default: 0
  },
  comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
  }]
```

- The **`ref`** option is used in Mongoose schemas when defining a field that is a reference to another Mongoose model. It establishes a relationship between two models by specifying the target model to which the field refers. This is typically used for creating relationships between documents in different collections.
    - **`ref: 'User'`** specifies that the **`author`** field is a reference to the 'User' model.
- **`mongoose.Schema.Types.ObjectId`**: This is a data type provided by Mongoose to represent MongoDB ObjectId values. ObjectId is a special 12-byte identifier that MongoDB assigns to each document when it's inserted into a collection. ObjectId values are unique within a collection and are used to identify documents.

```jsx
, {
  timestamps: true
});
```

- here we configure our schema to add automatic timestamps using this field
    - it essentially tells mongoose to automatically create two fields - createdAt and updatedAt
    - these timestamps are populated/updated using methods like .save();
    - time format is 2023-10-05T12:00:00Z. this is ISO 8061. z stands for UTC and “Z” is replaced by “+05:30” if we want IST.

## 3. Applying plugins

```jsx
articleSchema.plugin(uniqueValidator);
```

- this code is applying “mongoose-unique-validator” plugin to our schema object named “articleSchema”
    - we imported this plugin into a const object named “uniqueValidator” - for modularity, readibility, maintenance and consistency reasons.
    - A plugin in Mongoose is a reusable piece of functionality that can be added to one or more schemas. It can add new methods, statics, virtuals, or hooks to your schema
    - this plugin extends the schema with custom validation logic for fields having “unique” property

## 4. Applying pre

```jsx
articleSchema.pre('save', function(next){
    this.slug = slugify(this.title, { lower: true, replacement: '-'});
    next();
});
```

- this is pre-save middleware function for our schema object. here, the pre( ) method allows us to specify code that will run before the event mentioned in this method. in this case, the event is “save”
- inside the pre( ) method, first we specify the event, then we define the actual middleware function which takes a parameter “next” (next is itself a callback function which in mongoose indicates that middleware has completed its tasks and gives control to next middleware or runs save operation)
- inside the middleware function -
    - this.slug refers to the slug of current document which is being saved.
    - slugify generates a slug for the document (article model) which is being saved.
        - the slug is based on articles “title” field and is added to artilces “slug” field
        - the slug is basically a URL friendly version of article’s title.
    - slugify does a few operations like toLowerCase and replace spaces with hyphens to create the slug.
- next( ) gives control to next middleware or save operation.

## 5. Defining custom methods

### 1. updateFavouriteCount

```jsx
articleSchema.methods.updateFavoriteCount = async function () {
}
```

- IMP - we use this custom method instead of just doing +1 to our previous count because this whole “favourite an article” function is async and can cause false values
- articleSchema is custom defined instance of mongoose schema object - which is using “method” object - to create and define a custom instance method “updateFavouriteCount”
    - articleSchema is defined earlier in your code using the mongoose.Schema constructor.
        
        ```jsx
        const articleSchema = new mongoose.Schema({
            slug: {
                type: String,
        				...
        ```
        
        - It represents the schema for articles in your MongoDB database.
    - **`articleSchema.methods`** is an object that is used to define instance methods for documents created using this articleSchema. These instance methods are callable on individual document instances of the schema.
    - **`updateFavoriteCount`** is an custom instance method being defined here. This method can be called on instances of articles created based on this schema. (aka created with help of model)

```jsx
~~articleSchema.methods.updateFavoriteCount = async function(){~~
	const favoriteCount = await User.count({
      favouriteArticles: {$in: [this._id]}
  });
  this.favouritesCount = favoriteCount;
  return this.save();
}
```

- this custom method instance we are defining is an async function and inside, it contains a variable whose value is again being decided using an async function
    - we use “user model” and static method “count” to count the number of users in our databasese who have “field named - favouriteArticles” (which is an array containing article ids) and the field’s value contains the “_id” of the current article
        - The **`$in`** operator is used to check if the **`_id`** of the article exists in the **`favouriteArticles`** array of any user.
    - after the async func is done running, we pass the count value to the current articles’s property named “favourtiesCount”
    - finally we save the “current article instance” back to our database.
        - The **`save`** method is asynchronous and returns a Promise, which is why the method itself is marked as **`async`**, and a **`return`** statement is used to return that Promise.
- Why this._id refers to id of current article [Flow of mongoose schema ](../../Concepts%2061113291a37c411d88fd705c9effd6aa.md)

### 2. toArticleResponse

```jsx
// user is the logged-in user
articleSchema.methods.toArticleResponse = async function (user) {
    
}
```

- this function essentially formats the article recieved into response friendly style.
- we define “toArticleResponse”, a custom method using “articleSchema.methods” which is based on mongoose schema object named “articleSchema”. This schema object was created earlier in the code using mongoose schema constructor “new mongoose.Schema ( )”
- this custom instance method is an async function which takes user as a parameter. this user is probably whole user document of logged in user.

```jsx
const authorObj = await User.findById(this.author).exec();
```

- first we need to get user document of the author of this article. See how we used “this.author” to see
    - we use “user model” and findById static method to do a collection level search and pass it “this.author”
    - important to note that AUTHOR of article is different from logged in USER.
- use of exec()
    - here it is functional same to use it or not since “await” is written
    - cases when exec helps are 0
        - it makes the chaining of query methods more evident.
        - we can exercise promise control
            
            ```jsx
            const query = User.findById(this.author).exec();
            // ... some other code ...
            const authorObj = await query;
            ```
            

```jsx
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? user.isFavourite(this._id) : false,
        favoritesCount: this.favouritesCount,
        author:  authorObj.toProfileJSON(user)
    }
```

- now we define a nicely formatted the http response
    - to populate article info - we used “this” property only
    - to populate user specific properties - we used user variable which we recieved as a parameter
    
    ```jsx
    favorited: user ? user.isFavourite(this._id) : false,
    favoritesCount: this.favouritesCount,
    ```
    
    - to populate author details - we use the author object we just extracted out
        
        ```jsx
        author:  authorObj.toProfileJSON(user)
        ```
        
        - we use another custom function for nicely formatting the user information wrt response friendly style.
        - we pass it loggedin user document to find out if the user follows the author or not

### 3. add, remove Comment

```jsx
articleSchema.methods.addComment = function (commentId) {
    if(this.comments.indexOf(commentId) === -1){
        this.comments.push(commentId);
    }
    return this.save();
};

articleSchema.methods.removeComment = function (commentId) {
    if(this.comments.indexOf(commentId) !== -1){
        this.comments.remove(commentId);
    }
    return this.save();
};
```

- we define custom instance method on our articleSchema object and name it soemthing. this function is not async and it takes “commentId” as parameter which it used to add or remove comments
- it searches for the comment inside the “whole article document” which we get courstesy of how this function is called upon a variable which should be storing a single individual instance of the document from “article database”

- here, this.comments refer to a field inside the article document. this field is storing value in form of array object and we find our array element by matching the “commentId”. this matching is down like this -
    
    ```jsx
        if(this.comments.indexOf(commentId) === -1){
            ~~this.comments.push(commentId);~~
        }
    ```
    
    - indexOf method is called on the array property named “comments”
    - we search for first occurence of “commentId” value inside the array.
    - indexOf does sequential search of each element in array. so the drawback here is if each element has many properties then indexOf will go through lots of irrelevent key value pairs inside each element instead of just locking onto a particular keyvalue pair of each element.
        - **`this.comments.some(...)`** this method solves this problem by iterating over the comment array and having the custom condition defined which filters for that particular keyvalue pair like this —
            
            `**if (!this.comments.some(comment => comment.commentId === commentId)) {**`
            
        - this is using Array.prototype.some( ) method to iterate through the array and check for specified condition matches.
        - **`this.comments.commentId`** is not a valid way to access the "commentId" property of each object in the array. It suggests that you are trying to access a property named "commentId" directly on the **`this.comments`** array, which is not how you access individual object properties within an array.

## 6. Exporting module

```jsx
module.exports = mongoose.model('Article', articleSchema);
```

- here we are doing two things
    - first, we create a model named “Article” which is based on mongoose schema object named “articleSchema”
    - then we exporting this “Article” model and making it available for other modules, routes or controllers to import it.
    - this model will help other code to work with our mongoDB database.