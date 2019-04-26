const passport =  require('passport');
const jwtstratedgy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookStrategy = require('passport-facebook-token');

const { JWT_SECERT } = require('./configration/index');
const users = require('./models/users');

passport.use('facebook',new FacebookStrategy({
    clientID : '342631476610621',
    clientSecret : 'e59843f9a57f70a6e083da18e6ffcfc2',
}, async(accessToken, refreshToken, profile, done) => {

        const userExist = await users.findOne({'facebook.id':profile.id});
            
            if(userExist)  return done(null,false);

            const newUser = new users({
                method: 'facebook',
                google : {
                    id : profile.id ,
                    email : profile.emails[0].value
                }
            });
            await newUser.save();
            return done(null,newUser);
}))
 
passport.use('googleAuth',new GooglePlusTokenStrategy({
        clientID : '713641926270-pne8nj87csoh4ngfgqf6eip47ib0p829.apps.googleusercontent.com',
        clientSecret : 'A69-2Rb-rIbbODg_6FfWyHMa'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile.emails[0].value) ;
            let userExist = await users.findOne({'google.id':profile.id});
            
            if(userExist)  return done(null,false);

            let userHaveLocalEmail  = await users.findOne({'local.email':profile.emails[0].value});
            if(userHaveLocalEmail) {
                userHaveLocalEmail.google = {
                    id : profile.id ,
                    email : profile.emails[0].value
                }
                await userHaveLocalEmail.save();
                return done(null, userHaveLocalEmail);
            }

            const userHaveFacebook  = await users.findOne({'facebook.email':profile.emails[0].values});
            if(userHaveFacebook) {
                let newUser = new users({
                    method: 'google',
                    google : {
                        id : profile.id ,
                        email : profile.emails[0].value
                    }
                });
                await newUser.save();
                return done(null, newUser);
            }

            let newUser = new users({
                method: 'google',
                google : {
                    id : profile.id ,
                    email : profile.emails[0].value
                }
            });
            await newUser.save();
            return done(null,newUser);
            
        } catch (error) {
            throw error;
        }
        
    })
)

passport.use( new jwtstratedgy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : JWT_SECERT
    },async (payload,done) => {
        try {
            // find the user spicifed in token 
            const user = await users.findById(payload.sub);
            if(!user) return done(null,false);
            console.log('authenticating ... ',user);
            
            done(null,user);

        } catch (error) {
        done(error,false)
    }
}));

passport.use( new LocalStrategy({
    usernameField:'email'
    }, 
    async (email,password,done) => {
        try {
            // find the user 
            const user = await users.findOne({'local.email': email});

            if(!user) return done(null,false);
            // verify the password

            const verify = await user.verifyPassword(password);

            if(!verify) return done(null,false);

            done(null,user);    
        } catch (error) {
            done(error,false)
        }     
    })
)

// {

//     "access_token" :"ya29.GlvzBvN9ojVICKmBWU-tQzNxu363kF2H5TuMOKSCC8sx8124H3ZEjV3uq3J9-8QjCprQkpxrejIeJAcVfJ3vBk1hGxaizw64kwEzdk2Xg5TA2LcTvUlqezpGneed"
//    }