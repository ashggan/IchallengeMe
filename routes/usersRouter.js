const express = require('express');
const router =  require('express-promise-router')();
const userController = require('../controllers/usersController');
const signupvalid = require('../helpers/signupvalidate');
// const signinvalid = require('../helpers/signinvalidate');
const passport = require('passport');
const passportConfig = require('./../passport');

const passportJWT = passport.authenticate('jwt', { session: false }); 
const passportLocal = passport.authenticate('local', { session: false });
const passportGoogleOauth = passport.authenticate('googleAuth', { session: false });
const passportFacebookOauth = passport.authenticate('facebook', { session : false });

router.route('/signup').post(signupvalid,userController.signUP);

router.route('/signin').post(passportLocal , userController.signIn);

router.route('/googleOauth').post(passportGoogleOauth,userController.googleLogIn);

router.route('/facebookOauth').post(passportFacebookOauth , userController.facebbokeLogIn );

router.route('/secert').get(passportJWT, userController.secert);

module.exports = router;

