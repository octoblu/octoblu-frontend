var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var Channel = require('../app/models/channel');

var channel = Channel.syncFindByType('channel:google-drive');
var CONFIG = channel.oauth[process.env.NODE_ENV];

CONFIG.passReqToCallback = true;

var ensureUser = function(req, user, profile, callback){
  if(user){ return callback(null, user); }
  var query, userParams, upsert;

  upsert = false;

  if(req.session.testerId) {
    upsert = true;
  }

  query = {'google.id': profile.id};
  userParams = {
    username:    profile.emails[0].value,
    displayName: profile.displayName,
    email:       profile.emails[0].value,
    google: {
      id: profile.id
    }
  };

  User.findOneAndUpdate(query, {$set: userParams}, {upsert: upsert, new: upsert}).exec()
  .then(function (user) {
      if(!user){
        callback(new Error('You need a valid invitation code'));
      } else {
        callback(null, user);
      }
  }, function(err){
    callback(err);
  });
}

var googleStrategy = new GoogleStrategy(CONFIG,
  function (req, token, secret, profile, done) {
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    var channelId = new mongoose.Types.ObjectId(channel._id);

    user.overwriteOrAddApiByChannelId(channelId, {authtype: 'oauth', token: token});
    user.save(function (err) {
      done(err, user);
    });
  });
});

module.exports = googleStrategy;
