var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User     = require('../app/models/user');
var Channel = require('../app/models/channel');
var _       = require('lodash');

var CONFIG = {
  development: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'http://localhost:8080/api/oauth/google/callback',
    tokenMethod  : 'access_token_query'
  },
  production: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'https://app.octoblu.com/api/oauth/google/callback',
    tokenMethod  : 'access_token_query'
  },
  staging: {
    clientID     : 'INSERT_SECERT_HERE',
    clientSecret : 'INSERT_SECERT_HERE',
    callbackURL  : 'https://staging.octoblu.com/api/oauth/google/callback',
    tokenMethod  : 'access_token_query'
  }
}[process.env.NODE_ENV];

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

  User.findOne(query).then(function(user){
    if (!user) {
      return;
    }
    var updatedUser = _.extend({}, user, userParams);
    return User.update(query, updatedUser, {upsert: upsert, new: upsert});
  }).then(function (user) {
      if(!user){
        callback(new Error('You need a valid invitation code'));
      } else {
        callback(null, updatedUser);
      }
  }).catch(function(error){
    callback(error);
  });
};

var googleStrategy = new GoogleStrategy(CONFIG,
  function (req, token, secret, profile, done) {
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }
    var channels = Channel.syncMatchByType('channel:google');

    channels.push(Channel.syncFindByType('channel:youtube'));
    channels.push(Channel.syncFindByType('channel:doubleclicksearch'));

    _.each(channels, function(channel){
      if(channel.enabled === false){ return; }
      User.overwriteOrAddApiByChannelId(user, channel._id, {authtype: 'oauth', token: token });
    });

    User.update(user).then(function () {
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
});

module.exports = googleStrategy;
