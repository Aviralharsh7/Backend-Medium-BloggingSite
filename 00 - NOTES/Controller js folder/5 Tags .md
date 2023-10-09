# 5. Tags

1. Importing dependencies 
    
    ```jsx
    const Article = require('../models/Article');
    const asyncHandler = require('express-async-handler');
    ```
    
    - trivial
2. we define the async controller function 
    
    ```jsx
    const getTags = asyncHandler( async (req, res) => {
        
      const tags = await Article.find().distinct('tagList').exec();
      return res.status(200).json({
          tags: tags
      });
    });
    ```
    
    - tags value is determined by - using “article model” to do collection level find operation for the property “tagList” (aka in each article document) and only storing distinct values of the property “tagList” in our array object named “tags”
    - we can skip use of return keyword here
3. We export the module 
    
    ```jsx
    module.exports = {
        getTags
    }
    ```
    
    - trivial