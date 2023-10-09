# 1. Users

## 1. Import dependencies

```jsx
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require("jsonwebtoken");
```

- mongoose is nodejs library which helps with data modeling and defining schema and perform operations with mongodb databases
- unique-validator is a plugin for mongoose that adds validation for unique fields in mongodb documents.
    - this plugin ensures that in a collection, no two such documents exists which have same value for same field (email, username)
- jsonwebtoken is a library that provides utility functions like -
    - `**jwt.verify(token, secretOrPublicKey, [options, callback])**`
    - `**jwt.decode (token)**`
    - error handling with appropriate http responses

## 2. Defining schema object

```jsx
// only important fields are mentioned here
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
```

- lowercase: true means that convert email to lowercase before storing in database.
- index: true means that mongoose will create an index on the “email” field in mongoDB collection.
    - indexes are usually B-tree data structures which reduce the need for full collection scan and improve query speeds.
    - For each indexed field, the index stores a unique key for each value in that field. This key acts as a pointer to the document that contains that value.
    - The database engine sorts and stores these keys in the B-tree data structure. The keys are stored in a sorted order, making it efficient for the database to search, insert, update, or delete records. (so sorting operation is done even more easily)
    - indexes can be single, compound, text, geospatial (based on geographic location) indexes.
    - mongoose automatically updates these indexes when document is modified
    - trade offs are - write overhead, storage space of these indexes.
- regex expresssion here -
    - ^ - asserts the string must start at beginning of line
    - \S+ - asserts that email does not start with whitespaces (space, tabs, newline, etc) . \S is shorthand character class that matches any charater but whitespaces. + means one or more whitespaces
    - @ - there must be @ immediately after the username.
    - \S+ - again asserts for non whitespace characters. (domain name)
    - \. - there must be “.” (dot) immediately after the domain
    - \S+ - again asserts for non whitespace characters (TLD (top level domain) part)

```jsx
,{
  timestamps: true
});
```

- here we configure our schema to add automatic timestamps using this field
    - it essentially tells mongoose to automatically create two fields - createdAt and updatedAt
    - these timestamps are populated/updated using methods like .save();
    - time format is 2023-10-05T12:00:00Z. this is ISO 8061. z stands for UTC and “Z” is replaced by “+05:30” if we want IST.

## 3. Applying plugins

```jsx
userSchema.plugin(uniqueValidator);
```

- this code is applying “mongoose-unique-validator” plugin to our schema object named “userSchema”
    - we imported this plugin into a const object named “uniqueValidator” - for modularity, readibility, maintenance and consistency reasons.
    - A plugin in Mongoose is a reusable piece of functionality that can be added to one or more schemas. It can add new methods, statics, virtuals, or hooks to your schema
    - this plugin extends the schema with custom validation logic for fields having “unique” property

## 4. Defining custom methods

### generate access token for a user

```jsx
// @desc generate access token for a user
// @required valid email and password
userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({
            "user": {
                "id": this._id,
                "email": this.email,
                "password": this.password
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d"}
    );
    return accessToken;
}
```

- custom instance method named “generateAccessToken” is defined on schema object named “userSchema”.
    - these instances methods in mongoose are called on “individual” user model instances.
- a jwt token is created using jwt.sign( ) method and stored in const object named “accessToken”
- the payload of token (aka the parameter passed to jwt.sign( ) method) is defined as an object and its properties are being defined - like -
    - user information property -
        - the value is set using “this”
        - “this” refers to individual user over which this model instance was called on. whole method is called in the context of a individual user instance.
    - also takes an environment variable which is storing the “access token secret key” named “ACCESS_TOKEN_SECRET”
        - this key will sign the jwt
    - lastly, we define an “option” which specifies the expires time of this token
        - it essentially means that user has to login again after expiry time has reached.
- we return the token which was generated using the jwt.sign( ) method
    - syntax is 
    `**jwt.sign(payload, secretOrPrivateKey, options, [callback])`**

### toProfileJSON

```jsx
userSchema.methods.toProfileJSON = function (user){
  return{
      username: this.username,
      bio: this.bio,
      image: this.image,
      following: user ? user.isFollowing(this._id) : false
  }
}
```

- so we define this custom method on our schema object named “userSchema” using the method “userSchema.methods( )”
- this custom methods take one parameter which ideally should an object of user document
- the main logic of this method is to return nicely formatted json response whose values are picked from the parameter object
    - this refers to the user instance document which was used to called this custom method (its path is not here on this functions definition)
    - the parameter “user” values are not being used here with “this”
- parameter is used to carry out the ternary operator which calculates the value of field “following”
    - here user is the condition and can either have “user document object” or false value in it -
        - if condition false then false is result of this operator
        - if condition true then we use another custom function and alot a boolean value to this property based on its result.

### isFollowing

```jsx
userSchema.methods.isFollowing = function (id){
  const idStr = id.toString();
  for(const followingUser of this.followingUsers){
      if (followingUser.toString() == idStr){
          return true;
      }
  }
  return false;
};
```

- first read toProfileJSON method as it is a continuation of it.
- here id parameter is id of the slug user.
- this method is called using the loginUser, so this.followingUsers refers to property in logged in user document
    - we run a loop over all the id values present in “followingUsers” field of our “loginUser”
    - and try to match it with the id value of our “slug user”
    - matches voila. else bye bye

### follow + unfollow

```jsx
userSchema.methods.follow = function (id){
    if(this.followingUsers.indexOf(id) === -1){
        this.followingUsers.push(id);
    }
    return this.save();
}

userSchema.methods.unfollow = function (id){
    if(this.followingUsers.indexOf(id) !== -1){
        this.followingUsers.remove(id);
    }
    return this.save();
}
```

- notice how we use indexOf to iterate instead of for loop and if its value is -1 then not found and hence push it.

### isFavourite + favourite + unfavourite

```jsx
userSchema.methods.isFavourite = function(id){
  const idStr = id.toString();
  for(const article of this.favouriteArticles){
      if(article.toString() === idStr){
          return true;
      }
  }
  return false;
}

userSchema.methods.favourite = function(id){
  if(this.favourtieArticles.indexOf(id) === -1){
      this.favouriteArticles.push(id);
  }
  return this.save();
}

userSchema.methods.unfavourite = function(id){
  if(this.favouriteArticles.indexOf(id) !== -1){
      this.favouriteArticles.remove(id);
  }
  return this.save();
}
```

- to check if favourite or not, we need to do a comparision for which id must be in strings only
    - else if string conversion was not required then indexOf method could have been used.

## 5. Exporting module

```jsx
module.exports = mongoose.model('User', articleSchema);
```

- trivial