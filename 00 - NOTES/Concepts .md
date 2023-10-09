# Concepts

# HTTP error codes

![https://serpwatch.io/wp-content/uploads/2022/02/HTTP-Status-Codes-Cheat-Sheet.png](https://serpwatch.io/wp-content/uploads/2022/02/HTTP-Status-Codes-Cheat-Sheet.png)

# Flow of mongoose schema

1. First we custom define mongoose schema object which is named “articleSchema” using Schema constructor 
    - also inside schema object, we define “methods” object which houses the custom instances of methods which will be working on the documents of , say, current article.
    
    ```jsx
    const articleSchema = new mongoose.Schema({
        slug: {
            type: String,
    ```
    
2. then we create “Article” model using mongoose based on our custom defined mongoose schema object “articleSchema”
    - we use mongoose.model ( ) method to create a model named “Article” based on “articleSchema” object we defined before.
    - we essentially associate the schema with the model, allowing us to perform database operations on articles using this model.
    
    ```jsx
    module.exports = mongoose.model('Article', articleSchema);
    ```
    
3. then we create an instance of this “Article” model 
    - the “article” represents a single document from our collection (selected w help of slug query here)
    - this single document also houses the “_id” property
    
    ```jsx
    const article = await Article.findOne({slug}).exec();
    ```
    
4. Now we call the custom defined instance method on the “article” instance of the “Article” model
    - therefore why, “this” inside the method refers to the specific instance of that single document stored in “article” object.
    
    ```jsx
    const updatedArticle = await article.updateFavoriteCount();
    ```
    

# Models on mongoose

1. In mongoose, the “model” is a representation of one mongoDB collection. Via this model, we define the structure (various fields) and behaviour (what key value do these field take and how they interact with other model fields) of documents within THAT collection.
2. this model is essentially an interface bw our nodejs app and our mongodb database and gives us the functionality to perform CRUD operations on our database.
3. Various roles of the model - 
    - structure definition of documents - like what fields (attributes) each document has and what is data type of these fields.
    - validation - we enforces validation rules like what are required fields, what datatypes are accepted or any other custom logic on the value of that field to make it consistent and valid for our needs.
    - custom methods - we also define custom instances of method on top of our models.
        - what happens here is - we call this custom method on top of an instance of the model. this model in turns houses the schema object and this schema object houses these custom methods.
    - crud operations - these are basically inbuilt methods.
4. Some important roles
    - connection management - handles connection to our mongoDB database.
        - each model is associated with a specific database connection, allowing us to connect to multiple databases or clusters within our one nodejs app.
        - when using mongoose.model( ) , by default it is bounded to a “single” mongoDB collection.
            
            ```jsx
            const mongoose = require('mongoose');
            
            // Define a schema for a specific model
            const userSchema = new mongoose.Schema({
              username: String,
              email: String,
            });
            
            // Create a model and associate it with a specific database connection
            const User = mongoose.model('User', userSchema, 'users'); // 'users' is the collection name
            
            // Create a connection to a MongoDB database
            mongoose.connect('mongodb://localhost/myapp', {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            ```
            
        - we can dynamically swithc bw collections also by defining the mongoose.model () again and this time specifying a different collection.
        - this is useful when we want to use single schema for multiple collections.
        - The operation will be run on the collection associated with the last model definition for "User001.”
            
            ```jsx
            const User002 = mongoose.model('User001', userSchema, 'users'); 
            const User003 = mongoose.model('User001', userSchema, 'anotherCollection'); 
            
            const ans = await User001.findById(commentId).exec();
            ```
            
    - Middleware management - we can define middleware function inside our mongoose model too.
        - middleware is essentially code that is executed before or after specific model operations (which are probably crud or custom methods that is)
        - it is handy for tasks like data transformation, validation, logging
            
            ```jsx
            const mongoose = require('mongoose');
            
            // Define a schema for a "Product" model
            const productSchema = new mongoose.Schema({
              name: String,
              price: Number,
            });
            
            // Create a model for "Product"
            const Product = mongoose.model('Product', productSchema);
            ```
            
            - here we setup mongoose - import mongoose package > define a schema object using schema constructor > create a model using .model () method and the schema object defined before
            
            ```jsx
            
            // Define a "pre" middleware function to run before saving a document
            
            productSchema.pre('save', function (next) {
              // Some logic before saving, e.g., data transformation
              this.name = this.name.toUpperCase();
              next(); // Call the next middleware or save the document
            });
            ```
            
            - here we use the “pre” method of mongoose schema to define a middleware function
            - “save” is an event listener basically which was triggered by .save( ) function
            - function( next) is the actual middleware function. the optional parameter it takes is “next function” which is used inside the body of this function
                - specifying next() in parameter is optional and is only used when we want to control the flow customily.
            
            ```jsx
            // Create and save a new product and notice how middleware must have executed before the save function
            
            const newProduct = new Product({
              name: 'widget',
              price: 19.99,
            });
            
            newProduct.save((error, savedProduct) => {
              if (error) {
                console.error(error);
              } else {
                console.log('Product saved:', savedProduct);
              }
            });
            ```
            
            - trivial

# Role of gitIgnore

```bash
node_modules
.env
```

- it means that these two files which were part of our app in our computer, wont be tracked or included in our git repo
    - this is done security reasons of sensitive information.
- therefore, when cloning, we need to redefine these files using our head.

# CORS - why and how

1. why ?? 
    - to prevent malicious websites from making unauthorized requests to other websites on your behalf. For example, a malicious site shouldn't be able to send requests to your online banking site and steal your financial data.
    - An "origin" in the context of web security is defined by the combination of the protocol (http or https), domain ([example.com](http://example.com/)), and port (if specified).
2. How?? 
    - When a web page on one origin (e.g., **`https://example.com`**) makes an XMLHttpRequest or fetch request to a different origin (e.g., **`https://api.anotherdomain.com`**), the browser sends a preflight OPTIONS request to the target server to check if the cross-origin request is allowed.
        - [this specifies to return 200 code to client for successful preflight (options) requests. ](Config%20js%20folder%20d3232297c49a4af1b650f43ac1676892/Config%20js%207d0c03ffd536423abe1fa09a47744a5b/2%20corsOptions%20js%20e475df957d624b20b0b1708382ba5cab.md) (implemented here)
    - The server responds with CORS headers, including **`Access-Control-Allow-Origin`**, which specifies the allowed origins. If the requesting origin is in the list of allowed origins, the browser allows the actual request to proceed.

# indexOf searching in Array

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

# Role of route handler

1. What is route handler? 
    - Router handler define how a web application should respond to a specific http request.
    - this peice of code is executed when a particular route or URL is accessed by a client.
    - this handler will process the incoming request and give appropriate response back to client.
    - various steps are as follows -
        - request parsing
        - route matching
        - authentication, authorization
        - executes business logic
        - generater response
        - send the response to client

# query v params

1. In summary:
    - Use **`req.query`** for extracting data from query parameters in the URL when you want to pass optional or filtering parameters to an API.
    - Use **`req.params`** for extracting data from named route parameters in the URL when you need to extract dynamic values from the URL path.
1. Query 
    - **`req.query`** is used to extract data from the query parameters of a URL, typically from the URL's query string.
    - Query parameters are usually included in the URL after a question mark (**`?`**) and are separated by ampersands (**`&`**). For example: **`http://example.com/resource?param1=value1&param2=value2`**.
    - You access query parameters using **`req.query.paramName`**, where **`paramName`** is the name of the parameter you want to retrieve.
    - Common use cases for **`req.query`** include filtering and sorting data, passing optional parameters to control the behavior of an API endpoint, or performing searches based on user input.
    - example
        
        ```jsx
        // URL: http://example.com/resource?name=John&age=30
        console.log(req.query.name); // Outputs: "John"
        console.log(req.query.age);  // Outputs: "30"
        ```
        
2. Params 
    - **`req.params`** is used to extract data from the named route parameters in the URL.
    - Route parameters are defined in the route pattern and are denoted by colons (**`:`**). For example, in the route pattern **`/users/:userId`**, **`userId`** is a route parameter.
    - You access route parameters using **`req.params.paramName`**, where **`paramName`** is the name of the parameter defined in the route pattern.
    - Common use cases for **`req.params`** include extracting dynamic values from URLs, such as user IDs, product IDs, or any other variable part of a URL.
        
        ```jsx
        // Route pattern: /users/:userId
        // URL: http://example.com/users/123
        console.log(req.params.userId); // Outputs: "123"
        ```