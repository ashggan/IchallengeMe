const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
 
// create schema
const UserSechmae = new Schema({
    method :{
        type:String,
        required:true,
        enum :['local','google','facebook']
    },
    local :{
        name:{
            type: String,
        },
        email:{
            type: String,
            lowercase:true
        },
        password:{
            type: String,
        }    
    },
    google :{
        id:{
            type: String ,
        },
        email :{
            type:String,
            lowercase:true
        }
    },
    facebook :{
        id:{
            type: String ,
        },
        email :{
            type:String,
            lowercase:true
        }
    }
    
});

UserSechmae.pre('save', async function(next){
    try {
        if(this.method != 'local') next();
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(this.local.password,salt);  
        this.local.password = hashed;
        next();
    } catch (error) {
        next(error);
    }
    
});

UserSechmae.methods.verifyPassword = async function (passwd) {
    try {
        return await bcrypt.compare(passwd,this.local.password);
    } catch (error) {
        throw error;
    }
}

// create the model 
const User = mongoose.model('UserSechmae',UserSechmae);

// export the model
module.exports = User;