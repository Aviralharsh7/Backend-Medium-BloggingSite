# 3. User

## 1. Import dependencies

```jsx
const user = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
```

- we import “user model” which will help interacting with our database as our controller logic does CRUD operations on the database.
- ‘express-async-handler’ is nodejs package which has utility function for handling async func WITHIN expressjs route handlers
    - it wraps our route handlers and automatically handles any errors that occurs with the aysnc func inside of route handlers
    - **`express-async-handler`** will automatically catch an error and pass it to the error handling middleware. You don't need to write explicit try-catch blocks for this error handling.
        - it does not define how to handle the error but it replaces the job of defining try catch block by developer
- bycrpt library is used for securely hashing and comparing passwords
    - this hashing is one way process and cannot be reversed from hash string to our original password
    - bycrpt provides a slow and intensive hashing algo against brute force attacks or dictionart attacks
    - bycrpt also generates the management and handling of salts. salts together with original password, generate the hash.
        - salting helps keep hash different for same passwords of two users.
        - adds another layers against rainbow attacks
    - during login, input password is turned into hash and then compared to hash in our database. hence verify if password is correct.

## 1.1. API documentation

```jsx
// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
```

- 

## 2. userLogin

```jsx
const userLogin = asyncHandler( async (req,res) =>{
  const {user} = req.body;

  if(!user || !user.email || !user.password){
      return res.status(400).json({message: "All fields are required"});
  }

  const loginUser = await User.findOne({email: user.email}).exec();
	if (!loginUser){
      return res.status(404).json({message: "User not found"});
  }
}
```

- we create a const object named “userLogin” whose values is defined by an async function which takes two parameters and is wrapped by asyncHandler function for error handling stuff
- here, we are destructuring and storing whole user object in const object named “user”
- we check for empty values in user object and if found, we close this function with a return statement which is setting properties of the response object.
- now with the help of “User model” and static mongoose method “findOne” we pass a key value pair from the “user object” as a query to this static method
    - here we can desturcture by passing {email} as query to the findOne method.
    - if user not found in database, we return http response object with relevent properties which handle errors.

```jsx
const match = await bycrpt.compare(user.password, loginUser.password);
  if(!match){
      return res.status(401).json({message: "Unauthorized: Wrong password"});
  }

  res.status(200).json({
      user: loginUser.toUserResponse()
```

- here we are verifying input password with help of [bycrpt.compare](http://bycrpt.compare) function
    - bycpt converts input password into hash
    - it extracts the stored hash password from the object named “loginUser” which is an instance of the whole user document of the current user.
    - it then compares the two hashs and returns a boolean value to const object named “match”
- we use await here because [bycprt.compare](http://bycprt.compare) is an async operation as it involves hash computing
    - using await also gives us the option to add try catch block for explicit error handling
- we await NOT because loginUser is an instance object from database
    - instance is already fetched from the database
- atlast, we set properties of response object
    - json message are formatted using custom function “toUserResponse()” for response friendly styling.
    - this custom function is defined inside the “User model”

## 3. registerUser

```jsx
const registerUser = aysncHandler( async (req, res) =>{
    const {user} = req.body;
    if(!user || !user.email || !user.username || !user.password){
        return res.status(400).json({message: "All fields are required"});
    }
    
});
```

- INPORTANT - the **`request`** object is automatically available within your route handlers as an argument. You don't need to import it explicitly in each file. For example:
- we create an object “registerUser” and assign it aysnc function which takes two parameters. We wrap this async function with asyncHandler (which is imported utility func for error handling in route handler functions)
- we are destructuring here. The value of property named “user” in the object “req.body” is being extracted and assigned to a variable named “user”.
- we check if all fields are filled or not
    - if not, we close the function with return statement which is setting properties to the response object.

```jsx
const hashedPwd = await bcrypt.hash(user.password, 10);
```

- Next, we hash the text input using bcrpyt.hash( ) method
    - “10” represents the number of hashing rounds. higher is safer but also compute intensive.
    - this hashing method is async so we write “await”
- user.password is stored in the memory when code is run as it is javascript variable.
    - once the block of code is executed then it is send to garbage.
    - memory management is done by runtime environment (nodejs here)

```jsx
const userObject = {
    "username": user.username,
    "password": hashedPwd,
    "email": user.email
}

const createdUser = await User.create(userObject);
```

- IMP - the userObject should adhere to schema object fields name and “required” ones.
- having hashed the password, we create a const object named “userObject” to store all the information which we will push to our database.
- it insert a new user document into your database. also, instance of this created object in our database is then stored in a new object named “createdUser”
    - with help of “user model” and static method “create” we pass the object containing user information as query.  an instance of this created object in our database is then stored in a new object named “createdUser”

```jsx
if(createdUser){
    res.status(201).json({
        user: createdUser.toUserResponse()
    })
} else {
    res.status(422).json({
        errors:{
            body: "Unable to register a user"
        }
    });
}
```

- 201 - successful request + created
- 422 - client error + unprocessable entity

## 4. getCurrentUser

```jsx
const getCurrentUser = asyncHandler(async (req,res) => {
  // email property was set in request object after successful authentication
  const email = req.userEmail;
  const user = await User.findOne( {email}).exec();
  if(!user){
      return res.status(404).json({message: "User not found"});
  }
  res.status(200).json({
      user: user.toUserResponse()
  });
});
```

- we create an async function which takes two parameters and wrap it inside asyncHandler function for error handler. this function is stored in const object named “getCurrentUser”
- we extract user email from request object. jwtVerify middleware added this email to request object after successful authentication of token.
- using email as query and “user model” , we extract whole user document and store it in a const object named “user”
    - if object is empty, we throw error 404
- if user object found, we return to response object after properly formatting it with a custom function
- 404 - client error + not found

## 5. updateUser

```jsx
const updateUser = asyncHandler(async (req, res) => {
  const { user } = req.body;

  // confirm data
  if (!user) {
      return res.status(400).json({message: "Required a User object"});
  }
```

- async function, destructuring
- 400 - client error + bad request

```jsx
const email = req.userEmail;
const target = await User.findOne({email}).exec();

if (user.email){
    target.email = user.email;
}
if(user.username){
    target.username = user.username;
}
```

- verify.jwt set req.userEmail property
- using email, we extract whole user document and store it in const object name “target”
- we update values in our target object using values in our request body object which were stored in object named “user”

```jsx
if (user.password){
    const hashedPwd = await bcrypt.hash(user.password, 10);
    target.password = hashedPwd;
}
if (typeof user.image !== 'undefined'){
    target.image = user.image;
}
if (typeof user.bio !== 'undefined'){
    target.bio = user.bio;
}
```

- for updating password, we use bcrypt.hash( ) method
    - it converts input password into a hash using 10 hashing rounds
    - we add this hashed password to our user document instance named “target”
- for updating image, we use typeOf operator which checks the type of value stored in “user.image” property.
    - if undefined, bye bye
- similarly for bio, if undefined type bye bye.

```jsx
await target.save();

return res.status(200).json({
    user: target.toUserResponse()
});
```

- we now save this object instance named “target” into our database.
- atlast, response object is formatted with relevent properties and the function comes to close! ty.