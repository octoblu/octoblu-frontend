var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var apiSchema = mongoose.Schema({

    name             : String,
    owner            : String,
    description      : String,
    enabled          : Boolean,
    logo             : String,
    auth_strategy    : String, // options: oauth, simple (user enters token), custom (use custom tokens), none (requires no authorization)
    custom_tokens    : [{name: String}],
    // endpoints        : [{}],
    key             : String,
    secret          : String,
    documentation    : String,
    base_url         : String
    // methods          : [ {path: String, action: String, params: [{name: String, type: String, required: Boolean}] ]

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Api', apiSchema);