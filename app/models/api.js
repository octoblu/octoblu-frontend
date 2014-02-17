var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var apiSchema = mongoose.Schema({

    name             : String,
    description      : String,
    enabled          : Boolean,
    logo             : String,
    auth_strategy    : String, // options: oauth, simple (user enters token), none (requires no authorization)
    // endpoints        : [{}],
    key             : String,
    secret          : String,
    documentation    : String,
    base_url         : String
    // methods          : [ {path: String, action: String, params: [{name: String, type: String, required: Boolean}] ]

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Api', apiSchema);