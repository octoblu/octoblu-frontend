var GithubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');
var User     = require('../app/models/user');

var CONFIG = {
  development: {
    clientID: "INSERT_SECERT_HERE",
    clientSecret: "INSERT_SECERT_HERE",
    callbackURL:    'http://localhost:8080/api/oauth/github/callback',
    passReqToCallback: true
  },
  production: {
    clientID: "INSERT_SECERT_HERE",
    clientSecret: "INSERT_SECERT_HERE",
    callbackURL:    'https://app.octoblu.com/api/oauth/github/callback',
    passReqToCallback: true
  },
  staging: {
    clientID: "INSERT_SECERT_HERE",
    clientSecret: "INSERT_SECERT_HERE",
    callbackURL:    'https://staging.octoblu.com/api/oauth/github/callback',
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

  query = {'github.id': profile.id};
  userParams = {
    username:    profile.username,
    displayName: profile.username,
    email:       profile.username,
    github: {
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
}

var githubStrategy = new GithubStrategy(CONFIG, function(req, accessToken, refreshToken, profile, done){
  ensureUser(req, req.user, profile, function(err, user){
    if(err){ return done(err, user); }

    var channelId = mongojs.ObjectId('532a258a50411e5802cb8053');

    User.overwriteOrAddApiByChannelId(user, channelId, {authtype: 'oauth', token: accessToken});
    User.update(user).then(function () {
      done(null, user);
    }).catch(function(error){
      done(error);
    });

  });
});

module.exports = githubStrategy;
