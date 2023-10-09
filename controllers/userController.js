const user = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const userLogin = asyncHandler( async (req,res) =>{
    const {user} = req.body;

    if(!user || !user.email || !user.password){
        return res.status(400).json({message: "All fields are required"});
    }

    const loginUser = await User.findOne({email: user.email}).exec();
    if (!loginUser){
        return res.status(404).json({message: "User not found"});
    }

    const match = await bycrpt.compare(user.password, loginUser.password);
    if(!match){
        return res.status(401).json({message: "Unauthorized: Wrong password"});
    }

    res.status(200).json({
        user: loginUser.toUserResponse()
    });
});


const registerUser = asyncHandler( async (req, res) =>{
    const {user} = req.body;
    if(!user || !user.email || !user.username || !user.password){
        return res.status(400).json({message: "All fields are required"});
    }

    const hashedPwd = await bcrypt.hash(user.password, 10);
    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    }

    // hashing input password
    const createdUser = await User.create(userObject);

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
});

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

const updateUser = asyncHandler(async (req,res) =>{

    const {user} = req.body;
    if(!user){
        return res.status(400).json({ message: "Required a user object"});
    }

    // courtesy to verifyJWT middleware 
    const email = req.userEmail;
    const target = await User.findOne({email}).exec();

    if (user.email){
        target.email = user.email;
    }
    if(user.username){
        target.username = user.username;
    }
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
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse()
    });

});

module.exports = {
    userLogin,
    registerUser,
    getCurrentUser,
    updateUser
};