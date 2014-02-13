// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        skynetuuid   : String,
        skynettoken  : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        skynetuuid   : String,
        skynettoken  : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String,
        skynetuuid   : String,
        skynettoken  : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        skynetuuid   : String,
        skynettoken  : String
    },
    api              : [{ name: String, token: String, verifier: String, updated: { type: Date, default: Date.now } }]

});

// find api connection by name
userSchema.methods.findApiByName = function(name) {
    if(!api) return null;
    for(var l = 0; l < api.length; l++) {
        if(api[l].name === name) {
            return api[l];
        }
    }
    return null;
};

userSchema.methods.addOrUpdateApiByName = function(name, token, verifier) {
    
    if(api) {
        for(var l = 0; l < api.length; l++) {
            if(api[l].name === name) {
                api[l].token = token;
                api[l].verifier = verifier;
                api[l].updated = Date.now;
                return;
            }
        }
    }

    // at this point the match wasn't found, so add it..
    api = {name: name, token: token, verifier: verifier, updated: Date.now};
    api.push(api);

};

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
