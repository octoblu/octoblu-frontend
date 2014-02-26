// load the things we need
var mongoose   = require('safe_datejs');
var mongoose   = require('mongoose');
var slug       = require('mongoose-slug');
var timestamps = require('mongoose-timestamps');
var bcrypt     = require('bcrypt-nodejs');

// define the schema for our post model
var postSchema = mongoose.Schema({
  title   : String,
  content : String
});

postSchema.plugin(slug('title'));
postSchema.plugin(timestamps);

module.exports = mongoose.model('Post', postSchema);
