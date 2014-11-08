var TwitterStrategy = require('passport-twitter').Strategy;
var User     = require('../app/models/user');
var mongojs = require('mongojs');

var CONFIG = {
  development: {
    consumerKey : "jJtghQn41kzvaIdyjPA7by2W5",
    consumerSecret : "jt4tMJOFXazArxYu3efsv9WJ5aO2eWiQdtC0t05XzHAllqvuSW",
    callbackURL:    'http://localhost:8080/api/oauth/twitter/callback',
    passReqToCallback: true
  },
  production: {
    consumerKey : "di4CBlZkwJp7rJoaqP6fBA0yC",
    consumerSecret : "2Ndg7hDyGR0Roe3P2AQ5ttL7yG6lRmU1UQ9mjFn40HtBc5C073",
    callbackURL:    'https://app.octoblu.com/api/oauth/twitter/callback',
    passReqToCallback: true
  },
  staging: {
    consumerKey : "97w9x63DUmWcuYoKy4p8epWFu",
    consumerSecret : "n0b5smHWGP1cNpBT02sGqlg6JRQ2LZOrRtfM6X2I4DbegYuiLy",
    callbackURL:    'https://staging.octoblu.com/api/oauth/twitter/callback',
    passReqToCallback: true
  }
}[process.env.NODE_ENV];

var ensureUser = function(req, user, profile, callback){
  if(user){ return callback(null, user); }
  var query, userParams, upsert;

  upsert = false;

  if(req.session.testerId) {
    upsert = true;
  }

  query = {'twitter.id': profile.id};
  userParams = {
    username:    profile.username,
    displayName: profile.username,
    email:       profile.username,
    twitter: {
      id: profile.id
    }
  };

  User.findOne(query).then(function(user){
    if (!user) {
      return;
    }
    var updatedUser = _.extend({}, user, userParams);
    return User.update(query, updatedUser, {upsert: upsert});
  }).then(function (user) {
      if(!user){
        callback(new Error('You need a valid invitation code'));
      } else {
        callback(null, updatedUser);
      }
  }).catch(function(error){
    callback(error);
  });
}

var twitterStrategy = new TwitterStrategy(CONFIG,
  function (req, token, secret, profile, done) {
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    var channelId = mongojs.ObjectId('5409f79403f1d8b163401370');

    User.overwriteOrAddApiByChannelId(user, channelId, {authtype: 'oauth', token: token, secret: secret});
    User.update(user).then(function () {
      done(null, user);
    }).catch(function(error){
      done(error);
    });
  });
});

module.exports = twitterStrategy;
