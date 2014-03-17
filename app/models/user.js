// load the things we need
var mongoose = require('safe_datejs');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var _        = require('lodash-node');

// define the schema for our user model
var userSchema = mongoose.Schema({
    name             : String,
    username         : String,

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
    api              : [{ name: String, authtype: String, key: String, token: String, secret: String,
                            verifier: String, updated: { type: Date, default: Date.now }, custom_tokens: [{name: String, value: String}] }]

});

// find api connection by name
userSchema.methods.findApiByName = function(name) {
    if(this.api==null && this.api==nil) {this.api = [];}

    for(var l = 0; l < this.api.length; l++) {
        if(this.api[l].name === name) {
            return this.api[l];
        }
    }
    return null;
};

userSchema.methods.addOrUpdateApiByName = function(name, type, key, token, secret, verifier, custom_tokens) {
    if(this.api==null && this.api==nil) {this.api = [];}
    var today = new Date();
    var jsToday = today.AsDateJs();
    
    for(var l = 0; l < this.api.length; l++) {
        if(this.api[l].name === name) {
            console.log('updating existing');
            this.api[l].key = key;
            this.api[l].authtype = type;
            this.api[l].token = token;
            this.api[l].secret = secret;
            this.api[l].verifier = verifier;
            this.api[l].updated = jsToday;
            this.api[l].custom_tokens = custom_tokens;
            return;
        }
    }

    // at this point the match wasn't found, so add it..
    item = {name: name, authtype:type, key: key, token: token, secret: secret, 
        verifier: verifier, custom_tokens: custom_tokens, updated: jsToday};
    
    console.log('adding');
    console.log(item);
    this.api.push(item);
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
