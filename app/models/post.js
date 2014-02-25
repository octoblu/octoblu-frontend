// load the things we need
var mongoose = require('safe_datejs');
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our post model
var postSchema = mongoose.Schema({
  title   : String,
  content : String
});

module.exports = mongoose.model('Post', postSchema);
