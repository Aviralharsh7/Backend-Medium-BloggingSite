# 4. Profile

## 1. Import dependencies

```jsx
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
```

- we import user model, which is essentially an instance of our schema object named “user schema”. This model will enable us to do CRUD on individual instances of a document. This document is part of collection over which our schema object has been defined.
- it wraps our route handler function and handles error by delegating them to middleware which takes care of errors. it does not itself define logic for handling error.

## 1.1 API documentation

```jsx
blah blah - need no documentation. brain big. 
```

## 2. getProfile

```jsx
const getProfile = asyncHandler(async (req, res) => {
  const {username} = req.params;
  const loggedin = req.loggedin;
```

- we create an object named “getProfile” and define it values by an async function which takes two parameters and is wrapped in express-async-handler’s utility function.
- we destructure from request object which is provided by default
    - this object holds route parameters extracted from the URL
    - route parameters are values embedded in URL patterns like query: string pairs, probably slug.
- we extract loggedin info which was set here by our middleware “verifyJWTOptional”

```jsx
const user = await User.findOne({username}).exec();
if (!user){
    return res.status(404).json({
        message: "User not found"
    });
}if (!loggedin){
        return res.status(200).json({
            profile: user.toProfileJSON(false)
        });
    } else { 
        const loginUser = await User.findOne({email: req.userEmail });
        return res.status(200).json({
            profile: user.toProfileJSON(loginUser)
        })
    }
```

- now using the username we got in slug, we extract the whole user document from our database with help from “user model”
    - the user we fetch is from slug - aka not the logged in user.
- if user is not found in database, then we close the operation with return statement which contains logic to update response object appropriately.

```jsx
if (!loggedin){
    return res.status(200).json({
        profile: user.toProfileJSON(false)
    });
} else { 
    const loginUser = await User.findOne({email: req.userEmail });
    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    })
}
```

- if user is not loggedin then we end function with return statement which updates response object with info of user we found in slug
- if user is loggedin then we update the request object with the same user info but at the time of formatting the json, we call the custom function and pass it “logUser” document instead of false value
    - so probably the json response is slightly different here.

## 3. followUser

```jsx
const followUser = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const loginUser = await User.findOne({email: req.userEmail}).exec();
    const user = await User.findOne({username}).exec();

    if (!user || !loginUser){
        return res.status(404).json({
            message: "User not found"
        })
    }
    await loginUser.follow(user._id);

    return res.status(200).json({
        profile: user.toProfileJSON(loginUser)
    });
});
```

- another controller object defined here using async function
- we destructure to extract values here
    - for loginUser, we are not destructuring becoz that req.userEmail is custom property set by our middleware so writing {email} will probably not give us any value for lack of this field being defined.
- we extract both loginUser and slug user “user document” and store it in an object. we created an instance object here using the “user model”
- if either of these user docu are empty then we send 404 error
- else we update the loginUser document using the “follow” method from our “user model” and we pass user id of our “slug user” “user._id”
- atlast, we update our response object values with updated user document of our “login User” ( not the slug user)

## 4. unfollowUser

```jsx
const unFollowUser = asyncHandler( async (req, res) =>{
  const {username} = req.params;
  const loginUser = await User.findOne({ email: req.userEmail}).exec();
  const user = await User.findOne({username}).exec();

  if(!user || !loginUser){
      return res.status(404).json({
          message: "User not found"
      })
  }

  await loginUser.unfollow(user._id);
  return res.status(200).json({
      profile: user.toProfileJSON(loginUser)
  });
});
```

- trivial