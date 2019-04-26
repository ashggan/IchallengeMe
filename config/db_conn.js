const monogoose = require('mongoose');

// mongoose.Promise = global.Promise ;

monogoose.connect('mongodb://ashgan:ashgan99@ds036178.mlab.com:36178/i-challenge-me')
    .then(console.log('database is running ...'))
    .catch(err=> console.error(err));
