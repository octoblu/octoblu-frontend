// load the things we need
var mongoose   = require('safe_datejs');
var mongoose   = require('mongoose');
var slug       = require('mongoose-slug');
var timestamps = require('mongoose-timestamps');
var bcrypt     = require('bcrypt-nodejs');
var marked     = require('marked');

// define the schema for our post model
var postSchema = mongoose.Schema({
  title           : String,
  markdownContent : String,
  content         : String,
  author          : {
    name    : String,
    user_id : String
  }
});

postSchema.plugin(timestamps);
postSchema.plugin(slug(['title', 'created_at']));

postSchema.pre('save', function (next) {
  this.content = marked(this.markdownContent);
  next();
});

module.exports = mongoose.model('Post', postSchema);
