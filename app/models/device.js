var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var deviceSchema = mongoose.Schema({

    name             : String,
    plugin           : String,
    logo             : String,
    description      : String,
    enabled          : Boolean,

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Device', deviceSchema);
