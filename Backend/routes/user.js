const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('../middleware/auth');

//signup
router.post('/signup', async(req,res) => {
     
    try{
       
        const {username, email, password} = req.body;

        if(username.length < 4){return res.status(400).json({message : "length should be greater than 4"});}

        //check username already exist
        const existusername = await User.findOne({username : username});
        if(existusername){return res.status(400).json({message : "username already exist"});}

        //check for email exist
        const existemail = await User.findOne({email : email});
        if(existemail){return res.status(400).json({message : "email already exist"});}

        //check for password length
        if(password.length<=5){return res.status(400).json({message : "increase length of password"});}

        const hashedPassword = await bcrypt.hash(password, 15);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        await newUser.save();
        return res.status(200).json({message:"SignUP Successfully"});
    }
    catch(err){
         res.status(500).json({message : "Internal server error"});
    }
});

router.post('/signin', async(req,res) => {
   try{
    const {email, password} = req.body;
    const existUser = await User.findOne({email});

    if(!existUser) {return res.status(400).json({message:"Invalid Credentials"})};

    await bcrypt.compare(password, existUser.password, (err, data) => {
        if(data){

            const authClaims = [{id: existUser._id,},{name:existUser.username},{email:existUser.email}];

            const token = jwt.sign({authClaims}, process.env.SECRET_KEY, {expiresIn : '30d'});

            return res.status(200).json({id:existUser._id, username:existUser.username, email:existUser.email, token:token});
        }
        else{
            return res.status(400).json({message:"Invalid Credentials"});
        }
    })

   }
   catch(err){
    return res.status(400).json({message:"OOPs! some error please check"});
   }

});

router.get('/test', authenticateToken,(req, res) => {
  return res.status(500).json({message: "Middleware work successfully (>_o)"});
});




module.exports = router;
