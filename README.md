# Zoo central 
A Social Media Blogging platform *using Express.js and MongoDB*

## Functionalities

- Implemented the Model-View-Controller (MVC) architecture.
- Personalised feed for each user, alongwith pagination.

<br> 

- Favourite articles.
- Follow author of articles.
- Comments on each article.
- Unique and multiple tags across articles.

<br>

- Implemented custom CORS to secure server 
- Implemented Bcrypt for hashing user password at login and signup both. 
- Implemented Slugify for CRUD operations on articles as event listener “save”
- Implemented authentication service using JSON Web Token (JWT) for secure access to user data and for CRUD operations on article data.
- Integrated Optional JWT for accessing article.    




## Project Tree

``` bash
├── app.js
├── bin
│   └── www
├── config
│   ├── allowedOrigins.js
│   ├── corsOptions.js
│   └── dbConnect.js
├── controllers
│   ├── articlesController.js
│   ├── commentController.js
│   ├── profileController.js
│   ├── tagsController.js
│   └── userController.js
├── middleware
│   ├── verifyJWT.js
│   └── verifyJWTOptional.js
├── models
│   ├── Article.js
│   ├── Comment.js
│   ├── Tags.js
│   └── User.js
├── package-lock.json
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── articlesRoutes.js
│   ├── commentRoutes.js
│   ├── profileRoutes.js
│   ├── root.js
│   ├── tagRoutes.js
│   ├── testRoutes.js
│   └── userRoutes.js
├── test
└── views
    ├── error.jade
    ├── index.html
    ├── index.jade
    └── layout.jade
```

## Project Setup

- clone the repository
- check if `npm` is installed via `npm -v`
- run `npm install` on root directory to install dependencies
- create a `.env` file in root directory and add the following variable
- run `npm run start`

## Environment variables

```jsx
# .env

NODE_ENV = development
PORT = 4200
DATABASE_URI = mongodb://localhost/mydatabase;
ACCESS_TOKEN_SECRET = couldHaveRickRolledYouHere;
```

## DB Design

- Articles Schema
- User Schema
- Comments Schema
- Tags Schema

## DB Tables

- User - username, password, email, bio, image, favouriteArticles, followingUsers, timestamps
- Article - slug, title, description, body, tagList, author._id, favouritesCount, comments._id, timestamps
- Tags - tagName, articles._id
- Comment - body, author, article._id, timestamps

## DB Choices and Tradeoffs

- Scaling limitation
    - Article model - contains an array structure for storing list of `comment._id`  of comments made on each Article.
    - Article model - contains an array structure for storing list of `tags`  added to each Article.
    - User model - contains an array structure for storing list of `article_.id`  favourited article by each User.
- Indexing done on -
    - Article model - `slug`
    - User model - `email`
- Unique validation  -
    - Article model - `slug`
    - User model - `username` , `email`
    - Tags model - `tagName`
- Required field are
    - Article model - `title`  , `description` , `body`
    - User model -  `username` , `email` , `password`
    - Tags model - `tagName`
    - Comment model - `body`
- Only one `access_token_secret` is used for all the accounts registration and login. Drawback: data can be forged if this secret is leaked
