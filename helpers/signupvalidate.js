const { checkSchema   } = require('express-validator/check');
const users = require('../models/users');

module.exports = checkSchema({
    name :{
        exists:true,
        errorMessage: 'Please enter your name'
    },
    email : {
      trim: true,
      isEmail : true,
      errorMessage: 'Please enter a valid email address',
      custom :{
            options : (async val =>{
                const user = await users.findOne({email:val});
                if(user)  return false;
            }),
            errorMessage: ' email address already on use',
        }
        
    } ,
    password :{
        trim:true,
        isLength: {
            options :{min:5},
            errorMessage: 'Username must be at least 6 characters long'
        },
        
    } 
    
  });