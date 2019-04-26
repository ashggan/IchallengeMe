const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');
const User = require('./../models/users');
const { JWT_SECERT } = require('./../configration/index');

signinToken = user => {
    return jwt.sign({
        iss: 'IchallengeMe',
        sub: user.id,
        iat: new Date().getTime(),  // current time
        exp: new Date().setDate(new Date().getDate() +1) // current time plus a day 
    },JWT_SECERT)   
}


module.exports = {
    signUP : async (req,res,next)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty())   return res.status(422).json({ errorsNmae: errors.array() });
         
        // creating user model and save it
        const { name ,email, password } = req.body;
        const newUser  = new User({ method : 'local', local : {name ,email, password} });
        await newUser.save();

        // generate the web token
        const token = signinToken(newUser);

        // response with the web token 
        res.status(201).json({token})
       
    },
    signIn : async (req,res,next)=>{
        const token = signinToken(req.user);
        res.status(200).json({token});
        // console.log('this is signIn',req.user);
    },
    facebbokeLogIn :  async (req,res,next) => {
        try {
            console.log(req.user);
        }catch (error) {
            throw error;
        }
    },
    googleLogIn : async (req, res , next) =>{
        try {
            console.log(req.user);
            const token = signinToken(req.user);
            res.json({token});
            } catch (error) {
            throw error;
        }
    },
    secert : async (req,res,next)=>{
        const resource = { 'name' : 'Ashgan is the boss !'};
        console.log('this is secert');
        res.json({resource});
    },
}