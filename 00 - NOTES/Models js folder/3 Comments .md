# 3. Comments

## 1. Importing dependencies

```jsx
const mongoose = require('mongoose');
const User = require("./User");
```

- mongoose will help with defining schema object, create custom methods on this object and give few static methods like create, findById, findOne, etc.

## 2. Defining schema object

```jsx
const commentSchema = new mongoose.Schema({
  body: {
      type: String,
      required: true
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
  }
},
  {
      timestamps: true
  });
```

- trivial

## 3. Defining custom methods

### 1. toCommentResponse

```jsx
commentSchema.methods.toCommentResponse = async function(user){
  const authorObj = await User.findById(this.author).exec();
  return {
      id: this._id,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatesAt,
      author: authorObj.toProfileJSON(user)
  }
};
```

- notice that “user” parameter is a user document and it is the same instance as that of “comment.author” user document
    - this creates a nuance when toProfileJSON is called - as it check if author is following himself only which is false !?

## 4. Exporting modules

```jsx
module.exports = mongoose.model('Comment', commentSchema);
```

- trivial